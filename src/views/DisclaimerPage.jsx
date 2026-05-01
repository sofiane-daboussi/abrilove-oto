'use client'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'

export default function DisclaimerPage() {
  useEffect(() => {
    document.documentElement.style.background = '#660A43'
    return () => { document.documentElement.style.background = '' }
  }, [])

  return (
    <div style={{ margin: '-24px -16px' }}>
      <style>{`
        @media (max-width: 780px) {
          .disclaimer-hero { padding-bottom: 56px !important; }
        }
      `}</style>
      <Header />

      {/* ── HERO ── */}
      <section className="disclaimer-hero" style={{
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
            Disclaimer
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
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          <Block title="À des fins d'information uniquement">
            <p>
              Les contenus proposés par Abrilove — e-books, newsletters, accompagnements, publications, formations et toute autre ressource — ont une vocation d'information et de développement personnel.<br /><br />
              Ils ne remplacent en aucun cas un suivi médical, thérapeutique ou psychologique. Si vous traversez une période difficile, n'hésitez pas à consulter un professionnel de santé ou un(e) thérapeute qualifié(e).
            </p>
          </Block>

          <Block title="Pas de substitut à un accompagnement spécialisé">
            <p>
              Les ressources Abrilove — y compris les échanges avec le widget Abr(IA) — ne se substituent pas à une prise en charge médicale, ni à un accompagnement spécialisé en santé mentale.<br /><br />
              L'intelligence artificielle Abr(IA) est un outil de réflexion et d'accompagnement basé sur les contenus et la méthode Abrilove. Elle ne formule pas de diagnostic, ne prescrit aucun traitement et ne remplace pas l'avis d'un professionnel qualifié.
            </p>
          </Block>

          <Block title="Résultats non garantis">
            <p>
              Les témoignages et exemples partagés sur le site reflètent des expériences individuelles et ne constituent pas une garantie de résultats. Chaque situation est unique, et les progrès dépendent de nombreux facteurs propres à chaque personne.
            </p>
          </Block>

          <Block title="Responsabilité" last>
            <p>
              Abrilove ne peut être tenue responsable des décisions prises sur la base de ses contenus, ni des conséquences directes ou indirectes de leur utilisation.<br /><br />
              En accédant aux ressources d'Abrilove, vous reconnaissez avoir pris connaissance de ce disclaimer et en acceptez les termes.
            </p>
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
