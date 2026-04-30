// ============================================================
// ABRILOVE WORKER V7
// Changement majeur : clé KV unifiée "user:{email}" remplace
// prenom, paid, memory, paywall, notif_sent, clic_payer_popup,
// clic_payer_sidebar stockés séparément.
// Routes:
//   POST /send-code           → envoie code 6 chiffres par email (Brevo)
//   POST /verify-code         → vérifie code, crée session token, stocke prénom KV
//   POST /check-session       → vérifie token de session
//   POST /check-paid          → vérifie accès payant
//   POST /                    → proxy Claude (chat)
//   POST /brevo               → ajout contact liste 35
//   POST /stripe              → webhook Stripe
//   POST /brevo-tag           → écrit PROBLEME_CHAT dans Brevo
//   POST /track-paywall       → track popup paywall et clics
//   GET  /memory              → résumé mémoire user
//   GET  /conversations       → liste conversations D1
//   POST /conversations       → crée conversation D1
//   GET  /conversations/:id   → charge conversation D1
//   POST /conversations/:id/title → met à jour titre
//   DELETE /conversations/:id → supprime conversation
//   GET  /search              → recherche dans conversations
//   GET  /admin-data          → données admin (protégé par ADMIN_TOKEN)
//   GET  /admin-conversations → conversations complètes d'un email (admin)
//   POST /admin-update-prenom → met à jour prénom (admin)
//   POST /admin-generate-email → génère email de relance (admin)
//   DELETE /admin-user        → supprime toutes les données d'un email (admin)
//   GET  /admin-migrate       → migration one-shot anciennes clés → user:email
// ============================================================

const SESSION_TTL_SECONDS = 86400 * 30;

const ALLOWED_ORIGINS = [
  'https://abrilove.fr',
  'https://www.abrilove.fr',
  'https://ia.abrilove.fr',
];

function getCorsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function jsonResponse(data, status = 200, origin = '') {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...getCorsHeaders(origin) },
  });
}

function adminJsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

function getToken(request) {
  const auth = request.headers.get('Authorization') || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : '';
}

// ============================================================
// HELPER : lire/écrire le profil unifié user:email
// ============================================================
async function getUser(env, email) {
  const raw = await env.ABRILOVE_PAID.get(`user:${email}`);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

async function saveUser(env, email, updates) {
  const current = await getUser(env, email);
  const merged = { ...current, ...updates };
  await env.ABRILOVE_PAID.put(`user:${email}`, JSON.stringify(merged));
  return merged;
}

// ============================================================
// JWT
// ============================================================
async function createJWT(env, email, ttlSeconds) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payload = btoa(JSON.stringify({ email, exp: Math.floor(Date.now() / 1000) + ttlSeconds, iat: Math.floor(Date.now() / 1000) })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const data = `${header}.${payload}`;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.JWT_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${data}.${sigB64}`;
}

async function verifyJWT(env, token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const data = `${parts[0]}.${parts[1]}`;
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.JWT_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    const sig = Uint8Array.from(atob(parts[2].replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(data));
    if (!valid) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch { return null; }
}

async function verifySession(env, email, token) {
  if (!email || !token) return false;
  const payload = await verifyJWT(env, token);
  if (payload && payload.email === email) return true;
  try {
    const session = await env.DB.prepare(
      'SELECT email FROM sessions WHERE token = ? AND email = ? AND expires_at > ?'
    ).bind(token, email, Date.now()).first();
    if (session) return true;
  } catch {}
  const raw = await env.ABRILOVE_PAID.get(`session:${email}:${token}`);
  return !!raw;
}

async function checkRateLimit(env, email, maxHour = 30, maxDay = 100) {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const dateStr = `${now.getUTCFullYear()}${pad(now.getUTCMonth()+1)}${pad(now.getUTCDate())}`;
  const hourStr = `${dateStr}${pad(now.getUTCHours())}`;
  const keyHour = `rl_hour:${email}:${hourStr}`;
  const keyDay  = `rl_day:${email}:${dateStr}`;
  const [hourRaw, dayRaw] = await Promise.all([
    env.ABRILOVE_PAID.get(keyHour),
    env.ABRILOVE_PAID.get(keyDay),
  ]);
  const hourCount = parseInt(hourRaw || '0');
  const dayCount  = parseInt(dayRaw  || '0');
  if (hourCount >= maxHour) return { allowed: false, reason: 'hour' };
  if (dayCount  >= maxDay)  return { allowed: false, reason: 'day' };
  await Promise.all([
    env.ABRILOVE_PAID.put(keyHour, String(hourCount + 1), { expirationTtl: 7200 }),
    env.ABRILOVE_PAID.put(keyDay,  String(dayCount  + 1), { expirationTtl: 90000 }),
  ]);
  return { allowed: true };
}

async function isPaidUser(env, email) {
  try {
    const sub = await env.DB.prepare(
      'SELECT status, current_period_end FROM subscriptions WHERE email = ?'
    ).bind(email).first();
    if (sub) {
      if (sub.status !== 'active') return false;
      if (sub.current_period_end && Date.now() / 1000 > sub.current_period_end) return false;
      return true;
    }
  } catch {}
  const user = await getUser(env, email);
  if (!user.paid) return false;
  if (user.paid.status !== 'active') return false;
  if (user.paid.currentPeriodEnd && Date.now() / 1000 > user.paid.currentPeriodEnd) return false;
  return true;
}

async function saveMemory(env, email, messages, currentMemory) {
  const recentExchanges = messages.slice(-6).map(m => {
    if (typeof m.content === 'string') return `${m.role}: ${m.content}`;
    if (Array.isArray(m.content)) {
      const text   = m.content.filter(p => p.type === 'text').map(p => p.text).join(' ');
      const hasImg = m.content.some(p => p.type === 'image');
      return `${m.role}: ${hasImg ? '[image analysée] ' : ''}${text}`;
    }
    return '';
  }).join('\n');

  const prompt = `Tu analyses la situation amoureuse d'une utilisatrice. Génère UNIQUEMENT un objet JSON valide (sans markdown, sans backticks) avec ces champs :
{
  "prenom": "son prénom si mentionné, sinon null",
  "profil": "Accro / Cérébrale / Rêveuse / Louve / inconnu",
  "situation": "sa situation amoureuse EN CE MOMENT en 1 phrase — mets à jour si elle a changé",
  "personnes": ["liste des personnes citées avec leur rôle ex: Thomas (ex)"],
  "themes": ["3-5 thèmes récurrents ex: peur abandon, jalousie"],
  "avancees": "ce qui a progressé ou été conseillé, en 1 phrase",
  "a_retenir": "1 info clé psychologique à ne jamais oublier — mets à jour si le contexte a changé"
}

RÈGLE IMPORTANTE : Les nouveaux échanges priment TOUJOURS sur la mémoire existante. Si l'utilisatrice mentionne un changement de situation (retour de voyage, rupture, nouvelle rencontre…), mets à jour immédiatement tous les champs concernés. Ne conserve jamais une info dépassée.

Mémoire existante (JSON ou texte) :
${currentMemory || 'Aucune'}

Nouveaux échanges :
${recentExchanges}

Réponds UNIQUEMENT avec le JSON, rien d'autre.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 400, messages: [{ role: 'user', content: prompt }] }),
  });
  const data = await res.json();
  const raw = data.content?.[0]?.text?.trim() || '';
  if (!raw) return;

  let parsed;
  try { parsed = JSON.parse(raw); } catch {
    await env.ABRILOVE_PAID.put(`error:memory:${email}`, `JSON parse failed: ${raw.slice(0,100)}`, { expirationTtl: 86400 }).catch(() => {});
    return;
  }

  await saveUser(env, email, { memory: parsed });

  const readable = `Profil: ${parsed.profil || '?'} | Situation: ${parsed.situation || '?'} | Thèmes: ${(parsed.themes || []).join(', ')}`;
  fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'api-key': env.BREVO_API_KEY },
    body: JSON.stringify({ attributes: { SITUATION_AMOUREUSE: readable }, updateEnabled: true }),
  }).catch(() => {});
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const url    = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: { ...getCorsHeaders(origin), 'Access-Control-Allow-Origin': '*' } });
    }

    const isAdminRoute = ['/admin-data', '/admin-conversations', '/admin-user', '/admin-generate-email', '/admin-update-prenom', '/admin-migrate'].includes(url.pathname);

    if (url.pathname !== '/stripe' && url.pathname !== '/auth' && !isAdminRoute && request.method === 'POST' && !ALLOWED_ORIGINS.includes(origin)) {
      return jsonResponse({ error: 'Origine non autorisée' }, 403, origin);
    }

    // ============================================================
    // GET /admin-migrate
    // ============================================================
    if (request.method === 'GET' && url.pathname === '/admin-migrate') {
      const adminToken = getToken(request);
      if (!adminToken || adminToken !== env.ADMIN_TOKEN) return adminJsonResponse({ error: 'Non autorisé' }, 403);

      const email = url.searchParams.get('email');
      if (!email) return adminJsonResponse({ error: 'email requis' }, 400);

      try {
        const existing = await getUser(env, email);
        if (existing._migrated) return adminJsonResponse({ ok: true, skipped: true, email });

        const [prenomRaw, paidRaw, memoryRaw, paywallRaw, notifRaw, clicPopupRaw, clicSidebarRaw, freeCountRaw] = await Promise.all([
          env.ABRILOVE_PAID.get(`prenom:${email}`),
          env.ABRILOVE_PAID.get(`paid:${email}`),
          env.ABRILOVE_PAID.get(`memory:${email}`),
          env.ABRILOVE_PAID.get(`paywall:${email}`),
          env.ABRILOVE_PAID.get(`notif_sent:${email}`),
          env.ABRILOVE_PAID.get(`clic_payer_popup:${email}`),
          env.ABRILOVE_PAID.get(`clic_payer_sidebar:${email}`),
          env.ABRILOVE_PAID.get(`free_count:${email}`),
        ]);

        let paidData = null;
        if (paidRaw) { try { paidData = JSON.parse(paidRaw); } catch {} }
        let memoryData = null;
        if (memoryRaw) { try { memoryData = JSON.parse(memoryRaw); } catch { memoryData = memoryRaw; } }

        const userData = {
          prenom: prenomRaw || existing.prenom || '',
          paid: paidData || existing.paid || null,
          memory: memoryData || existing.memory || null,
          paywallAt: paywallRaw ? parseInt(paywallRaw) : (existing.paywallAt || null),
          notifSent: !!(notifRaw || existing.notifSent),
          clicPayerPopup: !!(clicPopupRaw || existing.clicPayerPopup),
          clicPayerSidebar: !!(clicSidebarRaw || existing.clicPayerSidebar),
          freeCount: parseInt(freeCountRaw || '0') || existing.freeCount || 0,
          _migrated: true,
        };

        await env.ABRILOVE_PAID.put(`user:${email}`, JSON.stringify(userData));

        await Promise.all([
          prenomRaw ? env.ABRILOVE_PAID.delete(`prenom:${email}`) : Promise.resolve(),
          paidRaw ? env.ABRILOVE_PAID.delete(`paid:${email}`) : Promise.resolve(),
          memoryRaw ? env.ABRILOVE_PAID.delete(`memory:${email}`) : Promise.resolve(),
          paywallRaw ? env.ABRILOVE_PAID.delete(`paywall:${email}`) : Promise.resolve(),
          notifRaw ? env.ABRILOVE_PAID.delete(`notif_sent:${email}`) : Promise.resolve(),
          clicPopupRaw ? env.ABRILOVE_PAID.delete(`clic_payer_popup:${email}`) : Promise.resolve(),
          clicSidebarRaw ? env.ABRILOVE_PAID.delete(`clic_payer_sidebar:${email}`) : Promise.resolve(),
        ]);

        return adminJsonResponse({ ok: true, migrated: email });
      } catch (e) {
        return adminJsonResponse({ error: 'Erreur migration: ' + e.message }, 500);
      }
    }

    // ============================================================
    // GET /admin-data — CORRIGÉ : requêtes groupées, pas de boucle
    // ============================================================
    if (request.method === 'GET' && url.pathname === '/admin-data') {
      const adminToken = getToken(request);
      if (!adminToken || adminToken !== env.ADMIN_TOKEN) return adminJsonResponse({ error: 'Non autorisé' }, 403);

      const from = url.searchParams.get('from') ? parseInt(url.searchParams.get('from')) : 0;
      const to = url.searchParams.get('to') ? parseInt(url.searchParams.get('to')) : Date.now();
      const hasFilter = from > 0;

      try {
        // Requête 1 : toutes les utilisatrices avec leurs stats de conversations
        const usersResult = hasFilter
  ? await env.DB.prepare(`
      SELECT
        c.email,
        COUNT(DISTINCT c.id) as nb_conversations,
        MIN(c.created_at) as first_seen,
        MAX(c.updated_at) as last_active
      FROM conversations c
      WHERE c.created_at >= ? AND c.created_at <= ?
      GROUP BY c.email
      ORDER BY last_active DESC
    `).bind(from, to).all()
  : await env.DB.prepare(`
      SELECT
        c.email,
        COUNT(DISTINCT c.id) as nb_conversations,
        MIN(c.created_at) as first_seen,
        MAX(c.updated_at) as last_active
      FROM conversations c
      GROUP BY c.email
      ORDER BY last_active DESC
    `).all();

        // Requête 2 : comptage messages groupé par email
        const msgCountsResult = hasFilter
  ? await env.DB.prepare(
      'SELECT c.email, COUNT(*) as total FROM messages m JOIN conversations c ON c.id = m.conversation_id WHERE m.created_at >= ? AND m.created_at <= ? GROUP BY c.email'
    ).bind(from, to).all()
  : await env.DB.prepare(
      'SELECT c.email, COUNT(*) as total FROM messages m JOIN conversations c ON c.id = m.conversation_id GROUP BY c.email'
    ).all();
        const msgCounts = {};
        for (const r of msgCountsResult.results) msgCounts[r.email] = r.total;

        // Requête 3 : toutes les conversations récentes
        const recentConvsResult = await env.DB.prepare(
          'SELECT id, email, title, created_at, updated_at FROM conversations ORDER BY updated_at DESC'
        ).all();
        const convsByEmail = {};
        for (const c of recentConvsResult.results) {
          if (!convsByEmail[c.email]) convsByEmail[c.email] = [];
          if (convsByEmail[c.email].length < 10) convsByEmail[c.email].push(c);
        }

        const users = [];
        for (const row of usersResult.results) {
          const email = row.email;
          const userData = await getUser(env, email);

          const isPaid = (() => {
            if (!userData.paid) return false;
            if (userData.paid.status !== 'active') return false;
            if (userData.paid.currentPeriodEnd && Date.now() / 1000 > userData.paid.currentPeriodEnd) return false;
            return true;
          })();

          const memoryStr = userData.memory
            ? (typeof userData.memory === 'string' ? userData.memory : JSON.stringify(userData.memory))
            : '';

          users.push({
            email,
            prenom: userData.prenom || '',
            isPaid,
            paidStatus: userData.paid?.status || 'gratuit',
            subscriptionId: userData.paid?.subscriptionId || null,
            currentPeriodEnd: userData.paid?.currentPeriodEnd || null,
            firstSeen: row.first_seen,
            lastActive: row.last_active,
            nbConversations: row.nb_conversations,
            nbMessages: msgCounts[email] || 0,
            paywallVu: !!(userData.paywallAt || userData.notifSent),
            paywallAtteint: !!userData.paywallAt,
            clicPayerPopup: !!userData.clicPayerPopup,
            clicPayerSidebar: !!userData.clicPayerSidebar,
            memory: memoryStr,
            conversations: convsByEmail[email] || [],
          });
        }

        const totalUsers = users.length;
        const totalPaid = users.filter(u => u.isPaid).length;
        const totalMessages = users.reduce((sum, u) => sum + (u.nbMessages || 0), 0);
        const paywallCount = users.filter(u => u.paywallVu).length;

        return adminJsonResponse({ stats: { totalUsers, totalPaid, totalMessages, paywallCount }, users });
      } catch (e) {
        return adminJsonResponse({ error: 'Erreur serveur: ' + e.message }, 500);
      }
    }

    // ============================================================
    // GET /admin-conversations
    // ============================================================
    if (request.method === 'GET' && url.pathname === '/admin-conversations') {
      const adminToken = getToken(request);
      if (!adminToken || adminToken !== env.ADMIN_TOKEN) return adminJsonResponse({ error: 'Non autorisé' }, 403);
      const email = url.searchParams.get('email');
      if (!email) return adminJsonResponse({ error: 'email requis' }, 400);

      try {
        const convsResult = await env.DB.prepare(
          'SELECT id, title, created_at, updated_at FROM conversations WHERE email = ? ORDER BY updated_at DESC'
        ).bind(email).all();

        const conversations = [];
        for (const conv of convsResult.results) {
          const messagesResult = await env.DB.prepare(
            'SELECT role, content, created_at FROM messages WHERE conversation_id = ? ORDER BY created_at ASC'
          ).bind(conv.id).all();

          const messages = messagesResult.results.map(m => {
            let content = m.content;
            try { content = JSON.parse(m.content); } catch {}
            return { role: m.role, content, created_at: m.created_at };
          });

          conversations.push({ ...conv, messages });
        }

        return adminJsonResponse({ conversations });
      } catch (e) {
        return adminJsonResponse({ error: 'Erreur serveur: ' + e.message }, 500);
      }
    }

    // ============================================================
    // POST /admin-update-prenom
    // ============================================================
    if (request.method === 'POST' && url.pathname === '/admin-update-prenom') {
      const adminToken = getToken(request);
      if (!adminToken || adminToken !== env.ADMIN_TOKEN) return adminJsonResponse({ error: 'Non autorisé' }, 403);
      const { email, prenom } = await request.json().catch(() => ({}));
      if (!email) return adminJsonResponse({ error: 'email requis' }, 400);
      await saveUser(env, email, { prenom: prenom || '' });
      fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'api-key': env.BREVO_API_KEY },
        body: JSON.stringify({ attributes: { PRENOM: prenom || '' } }),
      }).catch(() => {});
      return adminJsonResponse({ ok: true });
    }

    // ============================================================
    // POST /admin-generate-email
    // ============================================================
    if (request.method === 'POST' && url.pathname === '/admin-generate-email') {
      const adminToken = getToken(request);
      if (!adminToken || adminToken !== env.ADMIN_TOKEN) return adminJsonResponse({ error: 'Non autorisé' }, 403);

      const { prenom, situation } = await request.json().catch(() => ({}));

      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
          body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 400,
            messages: [{
              role: 'user',
              content: `Tu es Sofi & Oli, coaches amoureuses françaises bienveillantes et directes.
Rédige un email de relance court et naturel (5-8 lignes max) pour une utilisatrice qui a utilisé nos 7 messages gratuits mais n'a pas encore payé.

Prénom : ${prenom || 'pas connu'}
Sa situation : ${situation || 'pas de résumé disponible'}

L'email doit :
- Commencer par "Coucou ${prenom || 'toi'},"
- Montrer qu'on a retenu sa situation de façon naturelle (pas robotique)
- Être chaleureux, pas commercial
- Terminer par une invitation douce à revenir
- Se terminer par "Sofi & Oli 🩷"
- Ne PAS inclure de sujet, juste le corps de l'email
- Tutoyer
- Ne PAS mentionner de lien

Réponds UNIQUEMENT avec le corps de l'email, rien d'autre.`
            }]
          })
        });
        const data = await res.json();
        const emailBody = data.content?.[0]?.text || '';
        return adminJsonResponse({ ok: true, emailBody });
      } catch (e) {
        return adminJsonResponse({ error: 'Erreur Claude: ' + e.message }, 500);
      }
    }

    // ============================================================
    // DELETE /admin-user
    // ============================================================
    if (request.method === 'DELETE' && url.pathname === '/admin-user') {
      const adminToken = getToken(request);
      if (!adminToken || adminToken !== env.ADMIN_TOKEN) return adminJsonResponse({ error: 'Non autorisé' }, 403);

      const email = url.searchParams.get('email');
      if (!email) return adminJsonResponse({ error: 'email requis' }, 400);

      try {
        const convsResult = await env.DB.prepare('SELECT id FROM conversations WHERE email = ?').bind(email).all();
        for (const conv of convsResult.results) {
          await env.DB.prepare('DELETE FROM messages WHERE conversation_id = ?').bind(conv.id).run();
        }
        await env.DB.prepare('DELETE FROM conversations WHERE email = ?').bind(email).run();
        await env.DB.prepare('DELETE FROM sessions WHERE email = ?').bind(email).run();

        const keysToDelete = [`user:${email}`, `code:${email}`];
        const sessionKeys = await env.ABRILOVE_PAID.list({ prefix: `session:${email}:` });
        for (const key of sessionKeys.keys) keysToDelete.push(key.name);
        await Promise.all(keysToDelete.map(k => env.ABRILOVE_PAID.delete(k).catch(() => {})));

        return adminJsonResponse({ ok: true, deleted: email });
      } catch (e) {
        return adminJsonResponse({ error: 'Erreur serveur: ' + e.message }, 500);
      }
    }

    // ============================================================
    // POST /track-paywall
    // ============================================================
    if (request.method === 'POST' && url.pathname === '/track-paywall') {
      const { email, action } = await request.json().catch(() => ({}));
      if (email) {
        const userData = await getUser(env, email);
        if ((userData.freeCount || 0) < 7) return jsonResponse({ ok: true }, 200, origin);
        const updates = {};
        if (action === 'popup_7msgs') updates.clicPayerPopup = true;
        else if (action === 'sidebar') updates.clicPayerSidebar = true;
        if (Object.keys(updates).length > 0) await saveUser(env, email, updates).catch(() => {});
      }
      return jsonResponse({ ok: true }, 200, origin);
    }

    // ============================================================
    // GET /auth
    // ============================================================
    if (request.method === 'GET' && url.pathname === '/auth') {
      const magicToken = url.searchParams.get('token');
      const email = url.searchParams.get('email');
      if (!magicToken || !email) {
        return new Response(`<html><body style="font-family:sans-serif;text-align:center;padding:60px;"><p style="color:#C0392B;">Lien invalide ou expiré.</p><a href="https://ia.abrilove.fr">Retourner sur Abr(IA)</a></body></html>`, { status: 400, headers: { 'Content-Type': 'text/html' } });
      }
      const stored = await env.ABRILOVE_PAID.get(`magic:${email}`);
      if (!stored || stored !== magicToken) {
        return new Response(`<html><body style="font-family:sans-serif;text-align:center;padding:60px;color:#1E120A;"><p style="color:#C0392B;font-size:18px;">Ce lien a déjà été utilisé ou a expiré.</p><br><a href="https://ia.abrilove.fr" style="color:#660A43;">Retourner sur Abr(IA)</a></body></html>`, { status: 400, headers: { 'Content-Type': 'text/html' } });
      }
      await env.ABRILOVE_PAID.delete(`magic:${email}`);
      await env.ABRILOVE_PAID.delete(`code:${email}`);
      const sessionToken = await createJWT(env, email, SESSION_TTL_SECONDS);
      const paid = await isPaidUser(env, email);
      const userData = await getUser(env, email);
      const redirectUrl = `https://ia.abrilove.fr/abri#magic=${encodeURIComponent(JSON.stringify({ email, token: sessionToken, paid, prenom: userData.prenom || '' }))}`;
      return Response.redirect(redirectUrl, 302);
    }

    // ============================================================
    // POST /send-code
    // ============================================================
    if (request.method === 'POST' && url.pathname === '/send-code') {
      const sendCodeEmail = (await request.clone().json().catch(() => ({}))).email || '';
      const rlKey = `rl_sendcode:${sendCodeEmail}`;
      const rlRaw = await env.ABRILOVE_PAID.get(rlKey);
      const rlCount = parseInt(rlRaw || '0');
      if (rlCount >= 5) return jsonResponse({ error: 'Trop de tentatives. Réessaie dans une heure.' }, 429, origin);
      await env.ABRILOVE_PAID.put(rlKey, String(rlCount + 1), { expirationTtl: 3600 });
      const { email, prenom } = await request.json();
      if (!email) return jsonResponse({ error: 'email requis' }, 400, origin);
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailValid) return jsonResponse({ error: 'email invalide' }, 400, origin);

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await env.ABRILOVE_PAID.put(`code:${email}`, code, { expirationTtl: 600 });

      const magicToken = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, '');
      await env.ABRILOVE_PAID.put(`magic:${email}`, magicToken, { expirationTtl: 600 });
      const magicLink = `https://abrilove-chat.sofiane-daboussi.workers.dev/auth?email=${encodeURIComponent(email)}&token=${magicToken}`;

      if (prenom) {
        const userData = await getUser(env, email);
        if (!userData.prenom) await saveUser(env, email, { prenom });
      }

      const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': env.BREVO_API_KEY },
        body: JSON.stringify({
          sender: { name: 'Sofi & Oli — Abrilove', email: 'bonjour@abrilove.fr' },
          to: [{ email }],
          subject: `Ton accès à L'Abr(IA)`,
          htmlContent: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#1E120A;">
            <p style="font-size:15px;line-height:1.7;margin-bottom:20px;">Coucou ${prenom || 'toi'} 🩷</p>
            <p style="font-size:15px;line-height:1.7;margin-bottom:28px;">Tu viens de demander à te connecter à L'Abr(IA). Clique ci-dessous pour accéder directement à ta conversation :</p>
            <div style="text-align:center;margin-bottom:28px;">
              <a href="${magicLink}" style="display:inline-block;background:#660A43;color:white;text-decoration:none;padding:14px 28px;border-radius:12px;font-size:15px;font-weight:600;">Me connecter →</a>
            </div>
            <p style="font-size:13px;color:#888;line-height:1.6;margin-bottom:8px;">Si le bouton ne fonctionne pas, entre ce code sur la page :</p>
            <p style="font-size:32px;font-weight:700;letter-spacing:10px;color:#660A43;margin-bottom:28px;">${code}</p>
            <p style="font-size:13px;color:#AAA;">Le lien et le code expirent dans 10 minutes.</p>
            <br>
            <p style="font-size:14px;line-height:1.7;">À tout de suite,<br><strong>Sofi & Oli</strong></p>
          </div>`
        }),
      });
      if (!emailRes.ok) return jsonResponse({ error: 'Erreur envoi email' }, 500, origin);

      fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': env.BREVO_API_KEY },
        body: JSON.stringify({ email, attributes: { PRENOM: prenom || '' }, listIds: [35], updateEnabled: true }),
      }).catch(() => {});

      const userData = await getUser(env, email);
      if (!userData.notifSent) {
        await saveUser(env, email, { notifSent: true });
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'api-key': env.BREVO_API_KEY },
          body: JSON.stringify({
            sender: { name: 'Abrilove', email: 'bonjour@abrilove.fr' },
            to: [{ email: 'sofiane.daboussi@gmail.com' }],
            subject: '🔔 Nouveau prospect Abr(IA)',
            htmlContent: '<p><strong>' + (prenom || 'Sans prénom') + '</strong> vient de s\'inscrire sur L\'Abr(IA).<br/>Email : ' + email + '</p>',
          }),
        }).catch(() => {});
      }

      return jsonResponse({ ok: true }, 200, origin);
    }

    // ============================================================
    // POST /verify-code
    // ============================================================
    if (request.method === 'POST' && url.pathname === '/verify-code') {
      const { email, code } = await request.json();
      if (!email || !code) return jsonResponse({ error: 'paramètres manquants' }, 400, origin);
      const stored = await env.ABRILOVE_PAID.get(`code:${email}`);
      if (!stored || stored !== code.trim()) return jsonResponse({ error: 'Code incorrect ou expiré.' }, 400, origin);
      await env.ABRILOVE_PAID.delete(`code:${email}`);
      const token = await createJWT(env, email, SESSION_TTL_SECONDS);
      const paid = await isPaidUser(env, email);
      return jsonResponse({ token, paid }, 200, origin);
    }

    // ============================================================
    // POST /check-session
    // ============================================================
    if (request.method === 'POST' && url.pathname === '/check-session') {
      const { email, token } = await request.json();
      if (!email || !token) return jsonResponse({ valid: false }, 200, origin);
      const valid = await verifySession(env, email, token);
      if (!valid) return jsonResponse({ valid: false }, 200, origin);
      const paid = await isPaidUser(env, email);
      const userData = await getUser(env, email);
      return jsonResponse({ valid: true, paid, freeCount: userData.freeCount || 0 }, 200, origin);
    }

    // ============================================================
    // POST /check-paid
    // ============================================================
    if (request.method === 'POST' && url.pathname === '/check-paid') {
      const { email } = await request.json();
      if (!email) return jsonResponse({ paid: false }, 200, origin);
      const paid = await isPaidUser(env, email);
      return jsonResponse({ paid }, 200, origin);
    }

    // ============================================================
    // GET /memory
    // ============================================================
    if (request.method === 'GET' && url.pathname === '/memory') {
      const email = url.searchParams.get('email');
      const token = getToken(request);
      if (!email || !await verifySession(env, email, token)) return jsonResponse({ error: 'non autorisé' }, 401, origin);
      const userData = await getUser(env, email);
      const memory = userData.memory ? JSON.stringify(userData.memory) : null;
      return jsonResponse({ memory }, 200, origin);
    }

    // ============================================================
    // POST /brevo
    // ============================================================
    if (request.method === 'POST' && url.pathname === '/brevo') {
      const { email, prenom } = await request.json();
      if (!email) return jsonResponse({ error: 'email requis' }, 400, origin);
      const res = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': env.BREVO_API_KEY },
        body: JSON.stringify({ email, attributes: { PRENOM: prenom || '' }, listIds: [35], updateEnabled: true }),
      });
      return jsonResponse({ ok: res.ok }, res.ok ? 200 : 500, origin);
    }

    // ============================================================
    // POST /brevo-tag
    // ============================================================
    if (request.method === 'POST' && url.pathname === '/brevo-tag') {
      const { email, messages } = await request.json();
      if (!email || !messages) return jsonResponse({ error: 'données manquantes' }, 400, origin);
      const tagPrompt = `Résume en 3-5 mots clés (séparés par des virgules) le problème principal de cette utilisatrice. Réponds UNIQUEMENT avec les mots clés.\n\n${messages.slice(-10).map(m => typeof m.content === 'string' ? `${m.role}: ${m.content}` : `${m.role}: ${(m.content||[]).filter(p=>p.type==='text').map(p=>p.text).join(' ')}`).join('\n')}`;
      const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 50, messages: [{ role: 'user', content: tagPrompt }] }),
      });
      const claudeData = await claudeRes.json();
      const tag = claudeData.content?.[0]?.text?.trim() || '';
      if (tag) {
        await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'api-key': env.BREVO_API_KEY },
          body: JSON.stringify({ attributes: { PROBLEME_CHAT: tag, PAYWALL_ATTEINT: 'oui' } }),
        });
      }
      return jsonResponse({ ok: true, tag }, 200, origin);
    }

    // ============================================================
    // GET /conversations
    // ============================================================
    if (request.method === 'GET' && url.pathname === '/conversations') {
      const email = url.searchParams.get('email');
      const token = getToken(request);
      if (!email || !await verifySession(env, email, token)) return jsonResponse({ error: 'non autorisé' }, 401, origin);
      const result = await env.DB.prepare(
        'SELECT id, title, created_at, updated_at FROM conversations WHERE email = ? ORDER BY updated_at DESC LIMIT 20 OFFSET ?'
      ).bind(email, parseInt(url.searchParams.get('offset') || '0')).all();
      return jsonResponse({ conversations: result.results }, 200, origin);
    }

    // ============================================================
    // POST /conversations
    // ============================================================
    if (request.method === 'POST' && url.pathname === '/conversations') {
      const { email, title } = await request.json();
      const token = getToken(request);
      if (!email || !await verifySession(env, email, token)) return jsonResponse({ error: 'non autorisé' }, 401, origin);
      // Les gratuites peuvent créer une seule conversation (gérée côté frontend)
      const id  = crypto.randomUUID();
      const now = Date.now();
      await env.DB.prepare(
        'INSERT INTO conversations (id, email, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
      ).bind(id, email, title || 'Nouvelle conversation', now, now).run();
      return jsonResponse({ id, title: title || 'Nouvelle conversation', created_at: now, updated_at: now }, 200, origin);
    }

    // ============================================================
    // GET /conversations/:id
    // ============================================================
    if (request.method === 'GET' && url.pathname.startsWith('/conversations/') && url.pathname.split('/').length === 3) {
      const convId = url.pathname.split('/')[2];
      const email  = url.searchParams.get('email');
      const token  = getToken(request);
      if (!email || !await verifySession(env, email, token)) return jsonResponse({ error: 'non autorisé' }, 401, origin);
      const conv = await env.DB.prepare('SELECT * FROM conversations WHERE id = ? AND email = ?').bind(convId, email).first();
      if (!conv) return jsonResponse({ error: 'conversation introuvable' }, 404, origin);
      const messages = await env.DB.prepare('SELECT role, content FROM messages WHERE conversation_id = ? ORDER BY created_at ASC').bind(convId).all();
      return jsonResponse({ conversation: conv, messages: messages.results }, 200, origin);
    }

    // ============================================================
    // POST /conversations/:id/title
    // ============================================================
    if (request.method === 'POST' && url.pathname.match(/^\/conversations\/[^/]+\/title$/)) {
      const convId = url.pathname.split('/')[2];
      const { email, title } = await request.json();
      const token = getToken(request);
      if (!email || !await verifySession(env, email, token)) return jsonResponse({ error: 'non autorisé' }, 401, origin);
      const now = Date.now();
      await env.DB.prepare('UPDATE conversations SET title = ?, updated_at = ? WHERE id = ? AND email = ?')
        .bind(title, now, convId, email).run();
      return jsonResponse({ ok: true }, 200, origin);
    }

    // ============================================================
    // DELETE /conversations/:id
    // ============================================================
    if (request.method === 'DELETE' && url.pathname.startsWith('/conversations/') && url.pathname !== '/conversations/') {
      const parts = url.pathname.split('/');
      if (parts.length === 3) {
        const convId = parts[2];
        const { email } = await request.json();
        const token = getToken(request);
        if (!email || !await verifySession(env, email, token)) return jsonResponse({ error: 'non autorisé' }, 401, origin);
        await env.DB.prepare('DELETE FROM messages WHERE conversation_id = ?').bind(convId).run();
        await env.DB.prepare('DELETE FROM conversations WHERE id = ? AND email = ?').bind(convId, email).run();
        return jsonResponse({ ok: true }, 200, origin);
      }
    }

    // ============================================================
    // GET /search
    // ============================================================
    if (request.method === 'GET' && url.pathname === '/search') {
      const email = url.searchParams.get('email');
      const q = url.searchParams.get('q');
      const token = getToken(request);
      if (!email || !await verifySession(env, email, token)) return jsonResponse({ error: 'non autorisé' }, 401, origin);
      if (!q || q.length < 2) return jsonResponse({ results: [] }, 200, origin);
      const result = await env.DB.prepare(
        `SELECT c.id, c.title, c.updated_at, m.content as snippet
         FROM messages m
         JOIN conversations c ON c.id = m.conversation_id
         WHERE c.email = ? AND m.content LIKE ?
         ORDER BY c.updated_at DESC LIMIT 20`
      ).bind(email, `%${q}%`).all();
      return jsonResponse({ results: result.results }, 200, origin);
    }

    // ============================================================
    // POST /upload-image
    // ============================================================
    if (request.method === 'POST' && url.pathname === '/upload-image') {
      const email = url.searchParams.get('email');
      const token = getToken(request);
      if (!email || !await verifySession(env, email, token)) return jsonResponse({ error: 'non autorisé' }, 401, origin);
      try {
        const arrayBuffer = await request.arrayBuffer();
        const contentType = request.headers.get('Content-Type') || 'image/jpeg';
        const ext = contentType.includes('png') ? 'png' : 'jpg';
        const key = `images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        await env.IMAGES.put(key, arrayBuffer, { httpMetadata: { contentType } });
        const imageUrl = `https://abrilove-chat.sofiane-daboussi.workers.dev/image/${key}`;
        return jsonResponse({ ok: true, url: imageUrl }, 200, origin);
      } catch (e) {
        return jsonResponse({ error: 'Erreur upload: ' + e.message }, 500, origin);
      }
    }

    // ============================================================
    // POST /transcribe
    // ============================================================
    if (request.method === 'POST' && url.pathname === '/transcribe') {
      const email = url.searchParams.get('email');
      const token = getToken(request);
      if (!email || !await verifySession(env, email, token)) return jsonResponse({ error: 'non autorisé' }, 401, origin);
      try {
        const audioBlob = await request.arrayBuffer();
        const contentType = request.headers.get('Content-Type') || 'audio/webm';
        const formData = new FormData();
        formData.append('file', new Blob([audioBlob], { type: contentType }), 'audio.mp4');
        formData.append('model', 'whisper-1');
        formData.append('language', 'fr');
        const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + env.OPENAI_API_KEY },
          body: formData,
        });
        const data = await res.json();
        if (data.error) return jsonResponse({ error: data.error.message }, 500, origin);
        return jsonResponse({ text: data.text }, 200, origin);
      } catch (e) {
        return jsonResponse({ error: e.message }, 500, origin);
      }
    }

    // ============================================================
    // GET /image/:key
    // ============================================================
    if (request.method === 'GET' && url.pathname.startsWith('/image/')) {
      const key = url.pathname.slice(7);
      try {
        const obj = await env.IMAGES.get(key);
        if (!obj) return new Response('Image non trouvée', { status: 404 });
        const headers = new Headers();
        headers.set('Content-Type', obj.httpMetadata?.contentType || 'image/jpeg');
        headers.set('Cache-Control', 'public, max-age=31536000');
        headers.set('Access-Control-Allow-Origin', '*');
        return new Response(obj.body, { headers });
      } catch {
        return new Response('Erreur', { status: 500 });
      }
    }

    // ============================================================
    // GET /admin-costs
    // ============================================================
    if (request.method === 'GET' && url.pathname === '/admin-costs') {
      const adminToken = getToken(request);
      if (!adminToken || adminToken !== env.ADMIN_TOKEN) return adminJsonResponse({ error: 'Non autorisé' }, 403);

      const from = url.searchParams.get('from') ? parseInt(url.searchParams.get('from')) : 0;
      const to = url.searchParams.get('to') ? parseInt(url.searchParams.get('to')) : Date.now();

      try {
        const byDay = await env.DB.prepare(`
          SELECT
            date(created_at / 1000, 'unixepoch') as day,
            SUM(input_tokens) as input_tokens,
            SUM(output_tokens) as output_tokens,
            SUM(cost_usd) as cost_usd,
            COUNT(*) as nb_messages
          FROM token_usage
          WHERE created_at >= ? AND created_at <= ?
          GROUP BY day
          ORDER BY day DESC
          LIMIT 30
        `).bind(from, to).all();

        const byUser = await env.DB.prepare(`
          SELECT
            email,
            SUM(input_tokens) as input_tokens,
            SUM(output_tokens) as output_tokens,
            SUM(cost_usd) as cost_usd,
            COUNT(*) as nb_messages
          FROM token_usage
          WHERE created_at >= ? AND created_at <= ?
          GROUP BY email
          ORDER BY cost_usd DESC
        `).bind(from, to).all();

        const total = await env.DB.prepare(`
          SELECT
            SUM(input_tokens) as input_tokens,
            SUM(output_tokens) as output_tokens,
            SUM(cost_usd) as cost_usd,
            COUNT(*) as nb_messages
          FROM token_usage
          WHERE created_at >= ? AND created_at <= ?
        `).bind(from, to).first();

        return adminJsonResponse({ total, byDay: byDay.results, byUser: byUser.results });
      } catch (e) {
        return adminJsonResponse({ error: e.message }, 500);
      }
    }

    // ============================================================
    // POST / — CHAT
    // ============================================================
    if (request.method === 'POST' && url.pathname === '/') {
      const [systemPromptKV, modelRaw, freeMsgsRaw, maxDayRaw, maxHourRaw] = await Promise.all([
        env.ABRILOVE_PAID.get('config:system_prompt'),
        env.ABRILOVE_PAID.get('config:model'),
        env.ABRILOVE_PAID.get('config:free_msgs'),
        env.ABRILOVE_PAID.get('config:max_per_day'),
        env.ABRILOVE_PAID.get('config:max_per_hour'),
      ]);
      const SYSTEM_PROMPT = systemPromptKV || 'Tu es l\'IA d\'Abrilove.';
      const MODEL = modelRaw || 'claude-sonnet-4-20250514';
      const FREE_MSGS_SERVER = parseInt(freeMsgsRaw || '7');
      const MAX_MESSAGES_PER_DAY = parseInt(maxDayRaw || '100');
      const MAX_MESSAGES_PER_HOUR = parseInt(maxHourRaw || '30');

      const body = await request.json();
      const { email, messages, conversation_id } = body;
      const token = getToken(request);

      if (!email)    return jsonResponse({ error: 'email requis' }, 400, origin);
      if (!messages) return jsonResponse({ error: 'messages requis' }, 400, origin);

      const sessionValid = token ? await verifySession(env, email, token) : false;
      const paid         = sessionValid ? await isPaidUser(env, email) : false;

      let allMessages = messages;
      if (conversation_id && sessionValid && env.DB) {
        try {
          const dbMessages = await env.DB.prepare(
            'SELECT role, content FROM messages WHERE conversation_id = ? ORDER BY created_at ASC'
          ).bind(conversation_id).all();
          if (dbMessages.results && dbMessages.results.length > 0) {
            const history = dbMessages.results.map(m => {
              try { return { role: m.role, content: JSON.parse(m.content) }; }
              catch { return { role: m.role, content: m.content }; }
            });
            const newMsg = messages[messages.length - 1];
            allMessages = [...history, newMsg];
          }
        } catch {}
      }

      const msgCount = allMessages.filter(m => m.role === 'user').length;

      let freeCount = 0;
      if (!paid) {
        const userData = await getUser(env, email);
        if (!userData.notifSent && !sessionValid) {
          return jsonResponse({ error: 'non autorisé' }, 401, origin);
        }
        freeCount = userData.freeCount || 0;
        if (freeCount >= FREE_MSGS_SERVER) {
          return jsonResponse({ error: 'payment_required' }, 402, origin);
        }
        await saveUser(env, email, { freeCount: freeCount + 1 });
      }

      if (paid && sessionValid) {
        const rl = await checkRateLimit(env, email, MAX_MESSAGES_PER_HOUR, MAX_MESSAGES_PER_DAY);
        if (!rl.allowed) {
          const msg = rl.reason === 'hour'
            ? `Tu as atteint la limite de ${MAX_MESSAGES_PER_HOUR} messages par heure. Reviens dans quelques minutes 💛`
            : `Tu as atteint la limite de ${MAX_MESSAGES_PER_DAY} messages pour aujourd'hui. À demain ! 🌸`;
          return jsonResponse({ error: 'rate_limit', message: msg }, 429, origin);
        }
      }

      const userData = await getUser(env, email);
      const memory = userData.memory ? JSON.stringify(userData.memory) : null;

      let systemWithMemory = SYSTEM_PROMPT;
      if (!paid) {
        systemWithMemory += `\n\nATTENTION — cette utilisatrice est en mode gratuit (${freeCount}/${FREE_MSGS_SERVER} messages). Réponds de façon percutante et directe, donne un vrai diagnostic mais garde les détails et le plan d'action complet pour les abonnées.`;
      }
      if (memory) {
        try {
          const m = JSON.parse(memory);
          systemWithMemory += `\n\nCONTEXTE DE L'UTILISATRICE :
- Prénom : ${m.prenom || 'inconnu'}
- Profil : ${m.profil || 'inconnu'}
- Situation : ${m.situation || ''}
- Personnes citées : ${(m.personnes || []).join(', ') || 'aucune'}
- Thèmes récurrents : ${(m.themes || []).join(', ') || 'aucun'}
- Avancées : ${m.avancees || ''}
- À retenir : ${m.a_retenir || ''}`;
        } catch {
          systemWithMemory += `\n\nCONTEXTE DE L'UTILISATRICE :\n${memory}`;
        }
      }

      const recentMessages = allMessages.slice(-12);
      const claudeMessages = recentMessages.map(m => {
        if (typeof m.content === 'string') return m;
        if (Array.isArray(m.content)) {
          return {
            role: m.role,
            content: m.content.map(part => {
              if (part.type === 'r2_url') return null;
              if (part.type === 'image_url') {
                const imgUrl = part.image_url?.url || '';
                const match = imgUrl.match(/^data:(.+);base64,(.+)$/);
                if (match) return { type: 'image', source: { type: 'base64', media_type: match[1], data: match[2] } };
                return null;
              }
              return part;
            }).filter(Boolean),
          };
        }
        return m;
      });

      const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'anthropic-beta': 'prompt-caching-2024-07-31' },
        body: JSON.stringify({ model: MODEL, max_tokens: 1024, system: [{ type: 'text', text: systemWithMemory, cache_control: { type: 'ephemeral' } }], messages: claudeMessages }),
      });

      const claudeData = await claudeRes.json();
      const reply = claudeData.content?.[0]?.text || '';
      if (!reply) return jsonResponse({ error: 'Erreur Claude' }, 500, origin);

      const inputTokens = claudeData.usage?.input_tokens || 0;
      const outputTokens = claudeData.usage?.output_tokens || 0;
      const cacheReadTokens = claudeData.usage?.cache_read_input_tokens || 0;
      const cacheWriteTokens = claudeData.usage?.cache_creation_input_tokens || 0;
      const isHaiku = MODEL.includes('haiku');

      // Tarifs Haiku 4.5 : input $1/M, cache_write $1.25/M, cache_read $0.10/M, output $5/M
      // Tarifs Sonnet 4.x : input $3/M, cache_write $3.75/M, cache_read $0.30/M, output $15/M
      // Les cacheWrite et cacheRead tokens sont inclus dans inputTokens, on les soustrait puis on les facture à leur tarif propre
      const costUsd = isHaiku
        ? (Math.max(0, inputTokens - cacheReadTokens - cacheWriteTokens) * 0.000001)
          + (cacheWriteTokens * 0.00000125)
          + (cacheReadTokens * 0.0000001)
          + (outputTokens * 0.000005)
        : (Math.max(0, inputTokens - cacheReadTokens - cacheWriteTokens) * 0.000003)
          + (cacheWriteTokens * 0.00000375)
          + (cacheReadTokens * 0.0000003)
          + (outputTokens * 0.000015);

      try {
        await env.DB.prepare(
          'INSERT INTO token_usage (email, input_tokens, output_tokens, cache_read_tokens, cache_write_tokens, cost_usd, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(email, inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens, costUsd, Date.now()).run();
      } catch (e) { console.error('token_usage error:', e.message); }

      if (body.conversation_id && env.DB && sessionValid) {
        try {
          const now = Date.now();
          const lastUserMsg = messages[messages.length - 1];
          let userContent;
          if (typeof lastUserMsg?.content === 'string') {
            userContent = lastUserMsg.content;
          } else if (Array.isArray(lastUserMsg?.content)) {
            const contentToStore = lastUserMsg.content.map(part => {
              if (part.type === 'r2_url') return null;
              if (part.type === 'image_url') {
                const r2Part = lastUserMsg.content.find(p => p.type === 'r2_url');
                const r2Url = r2Part?.url;
                const finalUrl = r2Url && !r2Url.startsWith('data:') ? r2Url : '[image]';
                return { type: 'image_url', image_url: { url: finalUrl } };
              }
              return part;
            }).filter(Boolean);
            userContent = JSON.stringify(contentToStore);
          } else {
            userContent = JSON.stringify(lastUserMsg?.content || '');
          }
          await env.DB.prepare('INSERT INTO messages (id, conversation_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)')
            .bind(crypto.randomUUID(), body.conversation_id, 'user', userContent, now - 1).run();
          await env.DB.prepare('INSERT INTO messages (id, conversation_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)')
            .bind(crypto.randomUUID(), body.conversation_id, 'assistant', reply, now).run();
          if (msgCount === 1) {
            const title = (typeof lastUserMsg?.content === 'string' ? lastUserMsg.content : '[image]').slice(0, 60);
            await env.DB.prepare('UPDATE conversations SET title = ?, updated_at = ? WHERE id = ?')
              .bind(title + (title.length >= 60 ? '…' : ''), now, body.conversation_id).run();
          } else {
            await env.DB.prepare('UPDATE conversations SET updated_at = ? WHERE id = ?')
              .bind(now, body.conversation_id).run();
          }
        } catch (e) {
          return jsonResponse({ error: 'Erreur sauvegarde. Ton message a bien été reçu mais réessaie si tu ne vois pas la réponse.' }, 500, origin);
        }
      }

      if (paid && msgCount >= 3 && msgCount % 3 === 0) {
        const allMessagesWithReply = [...allMessages, { role: 'assistant', content: reply }];
        ctx.waitUntil(saveMemory(env, email, allMessagesWithReply, memory));
      }

      if (!paid && freeCount + 1 === FREE_MSGS_SERVER) {
        ctx.waitUntil(saveUser(env, email, { paywallAt: Date.now() }));
        const allMessagesWithReply = [...allMessages, { role: 'assistant', content: reply }];
        ctx.waitUntil(saveMemory(env, email, allMessagesWithReply, null));
      }

      if (msgCount === 5) {
        const tagPrompt = `Résume en 3-5 mots clés le problème principal. Uniquement les mots clés.\n\n${messages.slice(-8).map(m => typeof m.content === 'string' ? `${m.role}: ${m.content}` : `${m.role}: ${(m.content||[]).filter(p=>p.type==='text').map(p=>p.text).join(' ')}`).join('\n')}`;
        fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
          body: JSON.stringify({ model: MODEL, max_tokens: 50, messages: [{ role: 'user', content: tagPrompt }] }),
        }).then(r => r.json()).then(d => {
          const tag = d.content?.[0]?.text?.trim() || '';
          if (tag) fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'api-key': env.BREVO_API_KEY },
            body: JSON.stringify({ attributes: { PROBLEME_CHAT: tag, PAYWALL_ATTEINT: 'oui' } }),
          });
        });
      }

      return jsonResponse({ reply }, 200, origin);
    }

    return jsonResponse({ error: 'Route inconnue' }, 404, origin);
  },
};
