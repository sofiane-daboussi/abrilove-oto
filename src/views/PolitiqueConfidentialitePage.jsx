'use client'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'

export default function PolitiqueConfidentialitePage() {
  useEffect(() => {
    document.documentElement.style.background = '#660A43'
    return () => { document.documentElement.style.background = '' }
  }, [])

  return (
    <div style={{ margin: '-24px -16px' }}>
      <style>{`
        @media (max-width: 780px) {
          .pc-hero { padding-bottom: 56px !important; }
        }
        .pc-content ul { padding-left: 20px; margin: 8px 0; }
        .pc-content li { margin-bottom: 6px; }
      `}</style>
      <Header />

      {/* ── HERO ── */}
      <section className="pc-hero" style={{
        background: 'linear-gradient(180deg, #660A43 0%, #660A43 35%, #8a1258 65%, #660A43 100%)',
        padding: 'clamp(120px,12vw,160px) clamp(16px,5vw,80px) 100px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(190,25,105,0.45) 0%, transparent 65%)', top: '10%', right: '-8%', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(160,15,85,0.4) 0%, transparent 65%)', bottom: '-5%', left: '-6%', filter: 'blur(45px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,241,231,0.55)', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>
            Légal
          </p>
          <h1 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#FFF1E7', fontSize: 'clamp(28px,5vw,48px)', fontWeight: 700, lineHeight: 1.2 }}>
            Politique de confidentialité
          </h1>
        </div>

        <div style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', lineHeight: 0, zIndex: 2 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 80 }}>
            <path d="M0,35 Q720,58 1440,35 L1440,80 L0,80 Z" fill="#FFF4F7" />
          </svg>
        </div>
      </section>

      {/* ── CONTENU ── */}
      <section style={{ background: '#FFF4F7', padding: 'clamp(32px,4vw,56px) clamp(32px,5vw,80px) clamp(56px,6vw,96px)' }}>
        <div className="pc-content" style={{ maxWidth: 860, margin: '0 auto' }}>

          <p style={{ color: '#5a3040', fontSize: 14, marginBottom: 40, fontStyle: 'italic' }}>
            Dernière mise à jour : 1er mai 2026
          </p>

          <p style={{ color: '#5a3040', fontSize: 15, lineHeight: 1.85, marginBottom: 40 }}>
            La présente politique de confidentialité décrit la manière dont Abrilove, micro-entreprise représentée par Sofiane Daboussi, collecte, utilise, stocke et protège vos données personnelles dans le respect du Règlement Général sur la Protection des Données (RGPD).
          </p>

          <Block title="1. Qui sommes-nous ?">
            <p>
              Le site abrilove.fr est édité par la micro-entreprise <strong>Abrilove</strong> (Sofiane Daboussi)<br />
              Responsable du traitement : Sofiane Daboussi<br />
              Contact : <a href="mailto:bonjour@abrilove.fr" style={{ color: '#660A43' }}>bonjour@abrilove.fr</a>
            </p>
          </Block>

          <Block title="2. Données personnelles collectées">
            <p>Nous collectons uniquement les données strictement nécessaires à nos services.</p>

            <SubTitle>Lors de votre inscription à la newsletter :</SubTitle>
            <ul>
              <li>Prénom (facultatif)</li>
              <li>Adresse e-mail</li>
            </ul>

            <SubTitle>Lors d'un achat (e-book, formation) :</SubTitle>
            <ul>
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Adresse postale (en cas de livraison)</li>
              <li>Données de paiement (traitées par Stripe — nous n'y avons jamais accès directement)</li>
            </ul>

            <SubTitle>Lors d'un abonnement (Abr(IA)) :</SubTitle>
            <ul>
              <li>Adresse email et prénom (pour la création de compte)</li>
              <li>Données de paiement récurrent (traitées par Stripe — non accessibles par nos soins)</li>
              <li>Statut d'abonnement et dates de renouvellement</li>
            </ul>

            <SubTitle>Lors de la réservation d'un appel ou coaching :</SubTitle>
            <ul>
              <li>Prénom, email, disponibilité, éventuellement des notes ou commentaires</li>
              <li>Réponses à des formulaires préalables (s'ils existent)</li>
            </ul>

            <SubTitle>Lors de l'utilisation du widget Abr(IA) :</SubTitle>
            <ul>
              <li>Adresse email (pour l'authentification et la session)</li>
              <li>Prénom (facultatif, pour personnaliser les réponses)</li>
              <li>Contenu des conversations avec l'IA (questions posées et réponses reçues)</li>
              <li>Données de session (token de connexion, horodatage)</li>
            </ul>

            <SubTitle>Via les cookies :</SubTitle>
            <ul>
              <li>Données de navigation, adresse IP, durée de session, pages visitées, etc.</li>
            </ul>
          </Block>

          <Block title="3. Pourquoi nous utilisons vos données ?">
            <p>Nous utilisons vos données uniquement pour :</p>
            <ul>
              <li>Vous envoyer nos emails et newsletters (avec votre consentement)</li>
              <li>Vous permettre d'acheter et recevoir nos produits</li>
              <li>Gérer votre commande, votre livraison ou votre accompagnement</li>
              <li>Gérer votre abonnement Abr(IA) et vous donner accès au service</li>
              <li>Répondre à vos demandes de contact</li>
              <li>Améliorer l'expérience utilisateur sur le site (statistiques anonymisées)</li>
              <li>Respecter nos obligations légales (facturation, comptabilité, etc.)</li>
            </ul>
          </Block>

          <Block title="4. Bases légales du traitement">
            <p>Selon le RGPD, nous traitons vos données uniquement si l'une des bases suivantes est remplie :</p>
            <ul>
              <li>Votre <strong>consentement</strong> (newsletter, cookies)</li>
              <li>L'<strong>exécution d'un contrat</strong> (achat, réservation, abonnement)</li>
              <li>Le <strong>respect d'une obligation légale</strong></li>
              <li>Notre <strong>intérêt légitime</strong> (amélioration continue de nos services, statistiques anonymes)</li>
            </ul>
          </Block>

          <Block title="5. Durée de conservation">
            <ul>
              <li><strong>Données clients :</strong> conservées pendant 5 ans à partir de la dernière commande</li>
              <li><strong>Données de facturation :</strong> 10 ans (obligation légale)</li>
              <li><strong>Abonnés à la newsletter :</strong> jusqu'à désinscription (possible à tout moment)</li>
              <li><strong>Données de navigation (cookies) :</strong> selon durée définie dans notre bandeau cookies (généralement 13 mois max)</li>
              <li><strong>Conversations Abr(IA) :</strong> conservées pendant la durée de l'abonnement actif, puis supprimées dans un délai de 12 mois après la résiliation ou la dernière connexion</li>
              <li><strong>Données de session Abr(IA) :</strong> supprimées automatiquement après 30 jours d'inactivité</li>
              <li><strong>Données d'abonnement Abr(IA) :</strong> conservées 5 ans après la résiliation pour répondre à nos obligations légales et comptables</li>
            </ul>
          </Block>

          <Block title="6. Vos droits">
            <p>Vous pouvez à tout moment :</p>
            <ul>
              <li>Accéder à vos données</li>
              <li>Demander leur rectification ou suppression</li>
              <li>Demander la portabilité de vos données</li>
              <li>Retirer votre consentement</li>
              <li>Vous opposer à certains traitements</li>
            </ul>
            <p>Pour toute demande, écrivez à : <a href="mailto:bonjour@abrilove.fr" style={{ color: '#660A43' }}>bonjour@abrilove.fr</a><br />
            Nous nous engageons à répondre sous 30 jours.</p>
          </Block>

          <Block title="7. Sécurité des données">
            <p>
              Vos données sont stockées de manière sécurisée, avec accès restreint.<br />
              Nous utilisons des plateformes de confiance pour gérer les paiements (Stripe), les emails (Brevo), et les formulaires.<br /><br />
              Aucune donnée bancaire n'est stockée par nous.<br />
              Vos données ne sont jamais revendues à des tiers.
            </p>
          </Block>

          <Block title="8. Cookies">
            <p>Nous utilisons des cookies pour :</p>
            <ul>
              <li>Mesurer l'audience du site (Google Analytics, Meta Pixel)</li>
              <li>Optimiser votre navigation</li>
              <li>Afficher des publicités ciblées</li>
            </ul>
            <p>Un bandeau vous permet d'accepter ou de refuser tout ou partie de ces cookies dès votre arrivée sur le site. Vous pouvez aussi les gérer via votre navigateur.</p>
          </Block>

          <Block title="9. Sous-traitants">
            <p>Voici les outils avec lesquels nous travaillons et qui peuvent héberger vos données :</p>
            <ul>
              <li><strong>Brevo</strong> (envoi d'emails et gestion des listes)</li>
              <li><strong>Stripe</strong> (paiement et gestion des abonnements)</li>
              <li><strong>Cloudflare Pages</strong> (hébergement du site)</li>
              <li><strong>Google Analytics / Meta Pixel</strong> (statistiques et publicités)</li>
              <li><strong>Make / Zapier</strong> (automatisations)</li>
              <li><strong>Anthropic, PBC</strong> (traitement des messages via l'API Claude) — siège aux États-Unis. Les conversations transitent par leurs serveurs pour générer les réponses de l'IA. Anthropic s'engage contractuellement à ne pas utiliser ces données pour entraîner ses modèles sans consentement explicite.</li>
              <li><strong>Cloudflare, Inc.</strong> (hébergement du widget Abr(IA), stockage des conversations et des sessions) — siège aux États-Unis, données stockées en Europe lorsque possible. Cloudflare est certifié conforme au RGPD via ses clauses contractuelles types.</li>
            </ul>
            <p>Tous respectent les exigences RGPD, notamment via des clauses contractuelles types si leurs serveurs sont situés hors UE.</p>
          </Block>

          <Block title="10. Modifications de la politique" last>
            <p>
              Nous nous réservons le droit de modifier la présente politique à tout moment.<br />
              Toute modification substantielle fera l'objet d'un email ou d'une notification sur le site.
            </p>
          </Block>

        </div>
      </section>

      <Footer />
    </div>
  )
}

function SubTitle({ children }) {
  return (
    <p style={{ color: '#660A43', fontWeight: 600, fontSize: 14, marginTop: 20, marginBottom: 8 }}>
      {children}
    </p>
  )
}

function Block({ title, children, last }) {
  return (
    <div style={{ marginBottom: last ? 0 : 40, paddingBottom: last ? 0 : 40, borderBottom: last ? 'none' : '1px solid rgba(102,10,67,0.1)' }}>
      <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#660A43', fontSize: 20, fontWeight: 700, marginBottom: 14, lineHeight: 1.2 }}>
        {title}
      </h2>
      <div style={{ color: '#5a3040', fontSize: 15, lineHeight: 1.85 }}>
        {children}
      </div>
    </div>
  )
}
