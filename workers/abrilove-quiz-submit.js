/**
 * Cloudflare Worker - Abrilove Quiz Submit (VERSION SÉCURISÉE)
 */

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only POST allowed
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    try {
      // Parse request body
      const data = await request.json();
      const { email, profile, scores, answers, timestamp } = data;

      // === VALIDATION EMAIL ===
      if (!email || typeof email !== 'string') {
        return new Response(JSON.stringify({ error: 'Email requis' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(JSON.stringify({ error: 'Format email invalide' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // === VALIDATION PROFIL ===
      const validProfiles = ['accro', 'cerebrale', 'louve', 'reveuse'];
      if (!profile || !validProfiles.includes(profile)) {
        return new Response(JSON.stringify({ error: 'Profil invalide' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // === RATE LIMITING (3 soumissions/IP/heure) ===
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const rateLimitKey = `ratelimit:${ip}`;
      
      if (env.QUIZ_RATE_LIMIT) {
        try {
          const count = await env.QUIZ_RATE_LIMIT.get(rateLimitKey);
          const currentCount = count ? parseInt(count) : 0;
          
          if (currentCount >= 3) {
            return new Response(JSON.stringify({ 
              error: 'Trop de soumissions. Réessaye dans 1 heure.' 
            }), {
              status: 429,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
          
          // Incrémenter (expire après 1h)
          await env.QUIZ_RATE_LIMIT.put(
            rateLimitKey, 
            (currentCount + 1).toString(), 
            { expirationTtl: 3600 }
          );
        } catch (kvError) {
          console.error('KV Error (non-bloquant):', kvError);
          // Continue même si KV plante
        }
      }

      // === ENVOI À BREVO ===
      const brevoData = {
        email: email,
        attributes: {
          PROFIL_ATTACHEMENT: profile,
          QUIZ_DATE: new Date().toISOString().split('T')[0],
          QUIZ_SCORES: scores ? JSON.stringify(scores) : ''
        },
        listIds: [16],
        updateEnabled: true
      };

      const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': env.BREVO_API_KEY
        },
        body: JSON.stringify(brevoData)
      });

      const brevoStatus = brevoResponse.status;
      let brevoResult;
      
      try {
        brevoResult = await brevoResponse.json();
      } catch (e) {
        brevoResult = { error: 'Parse error' };
      }

      // Log pour debug
      console.log(`Brevo ${brevoStatus}:`, JSON.stringify(brevoResult));

      // Vérifier succès Brevo (200, 201, ou 204)
      if (brevoStatus < 200 || brevoStatus >= 300) {
        console.error('Brevo error:', brevoResult);
        // Ne pas bloquer l'utilisateur si Brevo plante
      }

      // === EMAIL NOTIFICATION ===
      const profileNames = {
        accro: 'Amoureuse Accro',
        cerebrale: 'Cérébrale',
        louve: 'Louve Solitaire',
        reveuse: 'Rêveuse en Attente'
      };

      const notificationEmail = {
        sender: { 
          email: 'noreply@abrilove.fr', 
          name: 'Quiz Abrilove' 
        },
        to: [{ email: 'bonjour@abrilove.fr' }],
        subject: `✅ Quiz complété - ${profileNames[profile]}`,
        htmlContent: `
          <h2>Nouvelle soumission quiz Abrilove</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Profil:</strong> ${profileNames[profile]}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
          ${scores ? `
          <hr>
          <p><strong>Scores:</strong></p>
          <ul>
            <li>Amoureuse Accro: ${scores.accro || 0} pts</li>
            <li>Cérébrale: ${scores.cerebrale || 0} pts</li>
            <li>Louve: ${scores.louve || 0} pts</li>
            <li>Rêveuse: ${scores.reveuse || 0} pts</li>
          </ul>
          ` : ''}
          <hr>
          <p>Statut Brevo: ${brevoStatus}</p>
        `
      };

      // Envoyer notification (async, ne pas attendre)
      ctx.waitUntil(
        fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'api-key': env.BREVO_API_KEY
          },
          body: JSON.stringify(notificationEmail)
        }).catch(err => console.error('Email notification error:', err))
      );

      // === RÉPONSE SUCCÈS ===
      return new Response(JSON.stringify({
        success: true,
        profile: profile,
        message: 'Quiz soumis avec succès'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Erreur Worker:', error.message);
      console.error('Stack:', error.stack);
      
      return new Response(JSON.stringify({ 
        error: 'Erreur serveur',
        details: error.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
