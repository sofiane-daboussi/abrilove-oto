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
        width: 'calc(100% - 48px)',
        maxWidth: 860,
      }}>
        <div style={{
          background: 'rgba(255,241,231,0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(102,10,67,0.15)',
          borderRadius: 999,
          padding: '0 28px',
          height: 52,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <a href="/" style={{
            fontFamily: 'var(--font-playfair, serif)',
            color: '#1a0011',
            fontSize: 18,
            fontWeight: 700,
            textDecoration: 'none',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
          }}>
            Abrilove
          </a>

          <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }} className="desktop-nav">
            {LINKS.map(l => (
              <a key={l.href} href={l.href} style={{
                color: l.href === '/contact' ? '#660A43' : '#8a5060',
                fontSize: 13,
                textDecoration: 'none',
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-dm-sans, sans-serif)',
                transition: 'color 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => e.target.style.color = '#1a0011'}
              onMouseLeave={e => e.target.style.color = l.href === '/contact' ? '#660A43' : '#8a5060'}
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
              color: '#1a0011',
              fontSize: 20,
              lineHeight: 1,
            }}
            className="burger"
            aria-label="Menu"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>

        {open && (
          <div style={{
            marginTop: 8,
            background: 'rgba(255,241,231,0.97)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(102,10,67,0.15)',
            borderRadius: 20,
            padding: '20px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}>
            {LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
                color: l.href === '/contact' ? '#660A43' : '#8a5060',
                fontSize: 15,
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
