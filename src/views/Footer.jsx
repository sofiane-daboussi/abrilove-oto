'use client'
import { useState } from 'react'

const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Coaching', href: '/coaching' },
  { label: 'Quiz', href: '/quiz-gratuit' },
  { label: 'Ressources', href: '/amour' },
  { label: 'Sofi & Oli', href: '/sofi-et-oli' },
  { label: 'Nous contacter', href: '/contact' },
]

const LEGAL_LINKS = [
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'Politique de confidentialité', href: '/confidentialite' },
  { label: 'CGV', href: '/cgv' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Gérer mes cookies', href: '#cookies', highlight: true },
]

function IgIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

function FbIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function TkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  )
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [nlStatus, setNlStatus] = useState(null)
  const [consentError, setConsentError] = useState(false)

  async function handleNewsletter(e) {
    e.preventDefault()
    if (!consent) { setConsentError(true); return }
    setConsentError(false)
    if (!email) return
    setNlStatus('sending')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setNlStatus(res.ok ? 'sent' : 'error')
    } catch {
      setNlStatus('error')
    }
  }

  return (
    <footer style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', marginTop: 'clamp(72px, 10vw, 140px)' }}>

      {/* Newsletter */}
      <div style={{
        background: 'linear-gradient(135deg, #3d0228 0%, #5e063c 55%, #7a1050 100%)',
        padding: 'clamp(24px, 5vw, 64px) 20px',
        textAlign: 'center',
        borderRadius: 20,
        border: '1.5px solid rgba(255,255,255,0.85)',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-playfair, serif)',
          color: '#fff',
          fontSize: 'clamp(22px, 3.5vw, 42px)',
          fontWeight: 700,
          lineHeight: 1.25,
          maxWidth: 680,
          margin: '0 auto 14px',
        }}>
          Rejoins plus de 10 000 personnes qui lisent notre newsletter hebdomadaire
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 12, lineHeight: 1.6 }}>
          Apprends à trouver l'amour… et à ne pas tout gâcher.
        </p>

        <div style={{ marginBottom: 12 }}>
          <img src="/images/logo-header.png" alt="L'Abrilove" style={{ height: 72, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
        </div>

        {nlStatus === 'sent' ? (
          <p style={{ color: '#fff', fontSize: 18 }}>Bienvenue dans l'Abri, une surprise t'attend dans tes mails 🩷</p>
        ) : (
          <form onSubmit={handleNewsletter} style={{ maxWidth: 560, margin: '0 auto' }}>
            <div className="nl-form-row" style={{
              display: 'flex',
              borderRadius: 12,
              overflow: 'hidden',
              border: '1.5px solid rgba(255,255,255,0.25)',
              marginBottom: 16,
            }}>
              <input
                type="email"
                placeholder="Ton adresse mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="nl-input"
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  padding: '16px 20px',
                  color: '#fff',
                  fontSize: 16,
                  outline: 'none',
                  fontFamily: 'var(--font-dm-sans, sans-serif)',
                }}
              />
              <button
                type="submit"
                disabled={nlStatus === 'sending'}
                className="nl-btn"
                style={{
                  background: 'linear-gradient(135deg, #c85d82, #d97090)',
                  border: 'none',
                  padding: '16px 28px',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: nlStatus === 'sending' ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-dm-sans, sans-serif)',
                  flexShrink: 0,
                }}
              >
                {nlStatus === 'sending' ? 'Envoi…' : 'Je m\'inscris'}
              </button>
            </div>
            {nlStatus === 'error' && (
              <p style={{ color: 'rgba(255,150,150,0.9)', fontSize: 13, marginBottom: 10 }}>
                Une erreur s'est produite. Réessaie plus tard.
              </p>
            )}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, justifyContent: 'center', cursor: 'pointer', maxWidth: 480, margin: '0 auto' }}>
              <input
                type="checkbox"
                checked={consent}
                onChange={e => { setConsent(e.target.checked); setConsentError(false) }}
                style={{ marginTop: 3, accentColor: '#c85d82', flexShrink: 0 }}
              />
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, textAlign: 'left', lineHeight: 1.5 }}>
                J'accepte de recevoir la newsletter d'Abrilove. Je peux me désinscrire à tout moment.{' '}
                <a href="/confidentialite" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'underline' }}>Politique</a>
              </span>
            </label>
            {consentError && (
              <p style={{ color: '#ffb3c8', fontSize: 13, marginTop: 8 }}>
                Coche la case pour t'inscrire 🩷
              </p>
            )}
          </form>
        )}
      </div>

      {/* Colonnes */}
      <div style={{ padding: 'clamp(40px, 6vw, 72px) 20px', marginTop: 40 }}>
        <div className="footer-grid" style={{ maxWidth: 1100, margin: '0 auto' }}>

          <div className="footer-col-brand">
            <img src="/images/logo-header.png" alt="Abrilove" style={{ height: 40, objectFit: 'contain', marginBottom: 12, filter: 'brightness(0) invert(1)' }} />
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}>L'amour, le vrai.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { href: 'https://instagram.com/abrilove.fr', icon: <IgIcon /> },
                { href: 'https://www.facebook.com/abrilove.fr', icon: <FbIcon /> },
                { href: 'https://tiktok.com/@abrilove.fr', icon: <TkIcon /> },
              ].map(s => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="social-icon">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col-nav">
            <p style={colTitleStyle}>C'est nous</p>
            {NAV_LINKS.map(l => <a key={l.href} href={l.href} style={linkStyle}>{l.label}</a>)}
          </div>

          <div className="footer-col-legal">
            <p style={colTitleStyle}>Pages légales</p>
            {LEGAL_LINKS.map(l => (
              <a key={l.href} href={l.href} style={{ ...linkStyle, ...(l.highlight ? { color: '#d080b0' } : {}) }}>
                {l.label}
              </a>
            ))}
          </div>

          <div className="footer-col-contact">
            <p style={colTitleStyle}>Contact</p>
            <a href="tel:+33644105583" style={linkStyle}>+33.6.44.10.55.83</a>
            <a href="mailto:bonjour@abrilove.fr" style={linkStyle}>bonjour@abrilove.fr</a>
          </div>

        </div>
      </div>

      {/* CTA bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', padding: 'clamp(32px, 5vw, 56px) 20px' }}>
        <div className="footer-cta" style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-playfair, serif)',
              color: '#fff',
              fontSize: 'clamp(20px, 3vw, 30px)',
              fontWeight: 700,
              marginBottom: 8,
            }}>
              Tu veux discuter avec nous ?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.5 }}>
              N'hésite pas à nous contacter et nous te répondrons avec plaisir.
            </p>
          </div>
          <a href="/contact" className="footer-cta-btn" style={{
            background: 'linear-gradient(135deg, #c85d82, #9b3090)',
            color: '#fff',
            textDecoration: 'none',
            padding: '14px 28px',
            borderRadius: 999,
            fontWeight: 600,
            fontSize: 15,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            ✦ Nous contacter
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '18px 20px' }}>
        <p style={{ maxWidth: 1100, margin: '0 auto', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
          © Tous droits réservés – Abrilove, 2026.
        </p>
      </div>

      <style>{`
        .nl-input { -webkit-appearance: none; appearance: none; background: rgba(255,255,255,0.1) !important; color: #fff !important; }
        .nl-input::placeholder { color: rgba(255,255,255,0.45); }
        @media (max-width: 540px) {
          .nl-form-row { flex-direction: column !important; border-radius: 12px !important; overflow: visible !important; border: none !important; gap: 10px; }
          .nl-input { border-radius: 12px !important; border: 1.5px solid rgba(255,255,255,0.25) !important; text-align: center !important; }
          .nl-btn { border-radius: 12px !important; width: 100%; }
        }
        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .social-icon:hover { background: rgba(255,255,255,0.15); }
        .footer-cta-btn { transition: opacity 0.2s, transform 0.2s; }
        .footer-cta-btn:hover { opacity: 0.88; transform: scale(1.02); }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1.5fr 1.5fr;
          gap: 40px;
        }
        .footer-col-nav { order: 1; }
        .footer-col-legal { order: 2; }
        .footer-col-contact { order: 3; }
        .footer-col-brand { order: 4; }
        @media (max-width: 780px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
          .footer-cta { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>
    </footer>
  )
}

const colTitleStyle = {
  color: 'rgba(255,255,255,0.4)',
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  marginBottom: 16,
}

const linkStyle = {
  display: 'block',
  color: 'rgba(255,255,255,0.7)',
  fontSize: 14,
  textDecoration: 'none',
  marginBottom: 12,
  lineHeight: 1.4,
  transition: 'color 0.15s',
}
