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
          <img src="/images/logo-header.png" alt="Abrilove" style={{ height: 36, objectFit: 'contain' }} />
        </a>

        {/* Nav pill centre */}
        <nav className="desktop-nav" style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(80,5,50,0.88)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.1)',
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

        {/* CTA droite */}
        <a href="/quiz-gratuit" className="desktop-cta" style={{
          background: '#fff',
          color: '#660A43',
          fontSize: 13,
          fontWeight: 600,
          textDecoration: 'none',
          padding: '10px 20px',
          borderRadius: 999,
          fontFamily: 'var(--font-dm-sans, sans-serif)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          pointerEvents: 'auto',
        }}>
          Fais notre quiz gratuit 🩷
        </a>

        {/* CTA mobile — visible entre logo et burger */}
        <a href="/quiz-gratuit" className="mobile-cta" style={{
          display: 'none',
          background: '#fff',
          color: '#660A43',
          fontSize: 12,
          fontWeight: 600,
          textDecoration: 'none',
          padding: '8px 14px',
          borderRadius: 999,
          fontFamily: 'var(--font-dm-sans, sans-serif)',
          whiteSpace: 'nowrap',
          pointerEvents: 'auto',
        }}>
          Quiz gratuit 🩷
        </a>

        {/* Burger mobile */}
        <button
          onClick={() => setOpen(o => !o)}
          className="burger"
          style={{
            display: 'none',
            background: 'rgba(80,5,50,0.88)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 999,
            cursor: 'pointer',
            color: '#fff',
            fontSize: 20,
            padding: '8px 14px',
            pointerEvents: 'auto',
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
          top: 72,
          left: 16,
          right: 16,
          zIndex: 99,
          background: 'rgba(80,5,50,0.96)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.1)',
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
          <a href="/quiz-gratuit" onClick={() => setOpen(false)} style={{
            background: '#fff',
            color: '#660A43',
            fontSize: 15,
            fontWeight: 600,
            textDecoration: 'none',
            padding: '12px 20px',
            borderRadius: 999,
            textAlign: 'center',
            fontFamily: 'var(--font-dm-sans, sans-serif)',
            marginTop: 8,
          }}>
            Fais notre quiz gratuit 🩷
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 780px) {
          .desktop-nav { display: none !important; }
          .desktop-cta { display: none !important; }
          .burger { display: block !important; }
          .mobile-cta { display: block !important; }
          .mobile-pill {
            background: rgba(80,5,50,0.88) !important;
            backdrop-filter: blur(16px) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            border-radius: 999px !important;
            padding: 0 12px !important;
            height: 48px !important;
          }
        }
      `}</style>
    </>
  )
}
