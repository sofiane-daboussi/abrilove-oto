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
      <header style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        width: 'calc(100% - 32px)',
        maxWidth: 980,
        background: 'rgba(80,5,50,0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 999,
        padding: '0 20px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* Logo gauche */}
        <a href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <img src="/images/logo-header.png" alt="Abrilove" style={{ height: 36, objectFit: 'contain' }} />
        </a>

        {/* Nav centre — pill */}
        <nav className="desktop-nav" style={{
          display: 'flex',
          gap: 4,
          alignItems: 'center',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 999,
          padding: '6px 16px',
        }}>
          {LINKS.map(l => (
            <a key={l.href} href={l.href} style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: 13,
              textDecoration: 'none',
              padding: '6px 12px',
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
        <a href="/quiz-gratuit" className="desktop-nav" style={{
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
        }}>
          Fais le quiz gratuit
        </a>

        {/* Burger mobile */}
        <button
          onClick={() => setOpen(o => !o)}
          className="burger"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            fontSize: 22,
            padding: 4,
          }}
          aria-label="Menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </header>

      {/* Menu mobile */}
      {open && (
        <div style={{
          position: 'fixed',
          top: 80,
          left: 16,
          right: 16,
          zIndex: 99,
          background: 'rgba(50,2,30,0.98)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20,
          padding: '20px 24px 28px',
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
            Fais le quiz gratuit
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 780px) {
          .desktop-nav { display: none !important; }
          .burger { display: block !important; }
        }
      `}</style>
    </>
  )
}
