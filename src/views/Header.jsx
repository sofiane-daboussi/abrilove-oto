'use client'
import { useState } from 'react'

const LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Coaching', href: '/coaching' },
  { label: 'Quiz', href: '/quiz-gratuit' },
  { label: 'Ressources', href: '/amour' },
  { label: 'Sofi & Oli', href: '/sofi-et-oli' },
  { label: 'Écris-nous', href: '/contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="mobile-pill" style={{
        position: 'fixed',
        top: 24,
        left: 16,
        right: 16,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        pointerEvents: 'none',
      }}>

        {/* Logo gauche */}
        <a href="/" style={{ textDecoration: 'none', pointerEvents: 'auto', flexShrink: 0 }}>
          <img src="/images/logo-header.png" alt="Abrilove" className="logo-img" style={{ height: 36, objectFit: 'contain' }} />
        </a>

        {/* Nav pill — centré en absolu sur desktop */}
        <nav className="desktop-nav" style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(80,5,50,0.9) 0%, rgba(130,15,80,0.9) 50%, rgba(80,5,50,0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 999,
          padding: '6px 8px',
          gap: 2,
          pointerEvents: 'auto',
        }}>
          {LINKS.map(l => (
            <a key={l.href} href={l.href} style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: 13,
              textDecoration: 'none',
              padding: '7px 13px',
              borderRadius: 999,
              fontFamily: 'var(--font-dm-sans, sans-serif)',
              transition: 'background 0.2s, color 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.color = '#fff' }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'rgba(255,255,255,0.8)' }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA droite desktop */}
        <a href="/quiz-gratuit" className="desktop-cta desktop-cta-btn" style={{
          background: '#fff',
          color: '#660A43',
          fontSize: 12,
          fontWeight: 600,
          textDecoration: 'none',
          padding: '7px 14px',
          borderRadius: 999,
          fontFamily: 'var(--font-dm-sans, sans-serif)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          pointerEvents: 'auto',
        }}>
          Fais notre quiz gratuit 🩷
        </a>

        {/* CTA mobile — centré en absolu dans le pill */}
        <div className="mobile-cta" style={{ display: 'none', position: 'absolute', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'auto' }}>
          <a href="/quiz-gratuit" style={{
            background: '#fff',
            color: '#660A43',
            fontSize: 11,
            fontWeight: 600,
            textDecoration: 'none',
            padding: '4px 10px',
            borderRadius: 999,
            fontFamily: 'var(--font-dm-sans, sans-serif)',
            whiteSpace: 'nowrap',
            pointerEvents: 'auto',
          }}>
            Fais notre quiz gratuit 🩷
          </a>
        </div>

        {/* Burger mobile */}
        <button
          onClick={() => setOpen(o => !o)}
          className="burger"
          style={{
            display: 'none',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 999,
            cursor: 'pointer',
            color: '#fff',
            fontSize: 16,
            padding: '5px 10px',
            pointerEvents: 'auto',
            lineHeight: 1,
            flexShrink: 0,
          }}
          aria-label="Menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </header>

      {/* Menu mobile arrondi */}
      {open && (
        <div style={{
          position: 'fixed',
          top: 80,
          left: 16,
          right: 16,
          zIndex: 99,
          background: 'linear-gradient(160deg, rgba(70,3,42,0.97) 0%, rgba(130,15,80,0.97) 50%, rgba(70,3,42,0.97) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 20,
          padding: '20px 20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          {LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: 16,
              textDecoration: 'none',
              fontFamily: 'var(--font-dm-sans, sans-serif)',
              padding: '4px 0',
            }}>
              {l.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 781px) {
          .logo-img { height: 48px !important; }
          .desktop-cta-btn { padding: 12px 20px !important; transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease !important; }
          .desktop-cta-btn:hover { transform: scale(1.07) !important; box-shadow: 0 6px 24px rgba(0,0,0,0.18) !important; }
        }
        @media (max-width: 780px) {
          .mobile-pill { top: 12px !important; }
          .desktop-nav { display: none !important; }
          .desktop-cta { display: none !important; }
          .burger { display: block !important; }
          .mobile-cta { display: flex !important; position: absolute !important; left: 50% !important; transform: translateX(-50%) !important; }
          .mobile-pill {
            background: linear-gradient(135deg, rgba(80,5,50,0.9) 0%, rgba(130,15,80,0.9) 50%, rgba(80,5,50,0.9) 100%) !important;
            backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255,255,255,0.15) !important;
            border-radius: 999px !important;
            padding: 0 12px !important;
            height: 48px !important;
          }
        }
      `}</style>
    </>
  )
}
