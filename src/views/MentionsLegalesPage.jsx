'use client'
import Header from './Header'
import Footer from './Footer'

export default function MentionsLegalesPage() {
  return (
    <div style={{ margin: '-24px -16px' }}>
      <style>{`
        @media (max-width: 780px) {
          .ml-hero { padding-bottom: 56px !important; }
        }
      `}</style>
      <Header />

      {/* ── HERO ── */}
      <section className="ml-hero" style={{
        background: 'linear-gradient(180deg, #660A43 0%, #8a1258 50%, #660A43 100%)',
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
            Mentions légales
          </h1>
        </div>

        <div style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', lineHeight: 0, zIndex: 2 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 80 }}>
            <path d="M0,35 Q720,58 1440,35 L1440,80 L0,80 Z" fill="#FFF4F7" />
          </svg>
        </div>
      </section>

      {/* ── CONTENU ── */}
      <section style={{ background: '#FFF4F7', padding: 'clamp(32px,4vw,56px) clamp(16px,5vw,80px) clamp(56px,6vw,96px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ color: '#5a3040', fontSize: 15, lineHeight: 1.85, marginBottom: 40 }}>
            Conformément aux dispositions des articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l'Économie Numérique (LCEN), il est porté à la connaissance des utilisateurs et visiteurs du site abrilove.fr les présentes mentions légales.
          </p>

          <Block title="Éditeur du site">
            <p>Le site abrilove.fr est édité par :</p>
            <p><strong>Abrilove</strong> (Sofiane Daboussi) – micro-entreprise<br />
            Représentée par : Sofiane Daboussi<br />
            Adresse : disponible sur demande<br />
            Email : <a href="mailto:bonjour@abrilove.fr" style={{ color: '#660A43' }}>bonjour@abrilove.fr</a><br />
            SIRET : 82384565600011<br />
            TVA : non applicable – article 293 B du CGI<br />
            Responsable de la publication : Sofiane Daboussi</p>
          </Block>

          <Block title="Hébergeur">
            <p>Le site est hébergé par :<br />
            <strong>Cloudflare, Inc.</strong><br />
            Adresse : 101 Townsend St, San Francisco, CA 94107, USA<br />
            Site : cloudflare.com</p>
          </Block>

          <Block title="Crédits">
            <p>Conception, textes et visuels : Abrilove<br />
            Toute reproduction, totale ou partielle, sans autorisation préalable est interdite.</p>
          </Block>

          <Block title="Propriété intellectuelle">
            <p>L'ensemble du site, sa structure, ses textes, images, vidéos, illustrations et tout autre contenu sont la propriété exclusive d'Abrilove, sauf mention contraire.<br /><br />
            Toute reproduction, représentation, adaptation, publication ou diffusion est strictement interdite sans autorisation écrite.</p>
          </Block>

          <Block title="Données personnelles">
            <p>Le traitement de vos données personnelles est décrit dans notre <a href="/politique-de-confidentialite" style={{ color: '#660A43' }}>Politique de confidentialité</a>. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression en écrivant à <a href="mailto:bonjour@abrilove.fr" style={{ color: '#660A43' }}>bonjour@abrilove.fr</a>.</p>
          </Block>

          <Block title="Conditions générales de vente">
            <p>L'achat de produits et services sur ce site (e-books, coaching, abonnements) est soumis à nos <a href="/cgv" style={{ color: '#660A43' }}>Conditions Générales de Vente</a>.</p>
          </Block>

          <Block title="Cookies">
            <p>Ce site utilise des cookies techniques nécessaires à son fonctionnement (paiement, mémorisation de session). Aucun cookie publicitaire n'est utilisé sans votre consentement.</p>
          </Block>

          <Block title="Contact" last>
            <p>Pour toute question, vous pouvez nous écrire à : <a href="mailto:bonjour@abrilove.fr" style={{ color: '#660A43' }}>bonjour@abrilove.fr</a></p>
          </Block>
        </div>
      </section>

      <Footer />
    </div>
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
