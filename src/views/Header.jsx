'use client'
import { useState } from 'react'

const LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Quiz', href: '/quiz-gratuit' },
  { label: 'Coaching', href: '/coaching' },
  { label: 'Ressources', href: '/amour' },
  { label: 'Sofi & Oli', href: '/sofi-et-oli' },
  { label: 'Écris nous', href: '/contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        width: 'calc(100% - 32px)',
        maxWidth: 860,
      }}>
        <div style={{
          background: 'rgba(80,5,50,0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 999,
          padding: '0 24px',
          height: 52,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img src="/images/logo-header.png" alt="Abrilove" style={{ height: 32, objectFit: 'contain' }} />
          </a>

          <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }} className="desktop-nav">
            {LINKS.map(l => (
              <a key={l.href} href={l.href} style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: 13,
                textDecoration: 'none',
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-dm-sans, sans-serif)',
                transition: 'color 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <button
            onClick={() => setOpen(o => !o)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: '#fff',
              fontSize: 20,
              lineHeight: 1,
            }}
            className="burger"
            aria-label="Menu"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>

        {/* Menu mobile — fond sombre pour lisibilité */}
        {open && (
          <div style={{
            marginTop: 8,
            background: 'rgba(50,2,30,0.97)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20,
            padding: '20px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}>
            {LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: 16,
                textDecoration: 'none',
                fontFamily: 'var(--font-dm-sans, sans-serif)',
              }}>
                {l.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 700px) {
          .desktop-nav { display: none !important; }
          .burger { display: block !important; }
        }
      `}</style>
    </>
  )
}
