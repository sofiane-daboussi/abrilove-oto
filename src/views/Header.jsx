'use client'
import { useState, useEffect } from 'react'

const CHAT_MSGS = [
  { role: 'user', text: 'Il me laisse en vu depuis 2 jours 😞' },
  { role: 'ai', text: 'C\'est douloureux 💗' },
  { role: 'ai', text: 'Qu\'est-ce qui s\'est passé ?' },
  { role: 'user', text: 'On a eu une dispute...' },
  { role: 'ai', text: 'Je suis là pour toi 🌸' },
]

function MiniChat() {
  const [shown, setShown] = useState(1)

  useEffect(() => {
    const t = setTimeout(() => {
      setShown(s => s >= CHAT_MSGS.length ? 1 : s + 1)
    }, shown >= CHAT_MSGS.length ? 3000 : 1400)
    return () => clearTimeout(t)
  }, [shown])

  return (
    <div style={{ width: 152, flexShrink: 0 }}>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, textAlign: 'center', margin: '0 0 8px' }}>
        Tu veux parler à notre IA ?
      </p>
      <div style={{
        background: 'rgba(0,0,0,0.35)',
        borderRadius: 14,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          padding: '7px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff6b9d, #9b2c75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, flexShrink: 0,
          }}>💗</div>
          <div>
            <div style={{ color: '#fff', fontSize: 10, fontWeight: 600, lineHeight: 1.2, fontFamily: 'var(--font-dm-sans, sans-serif)' }}>Sofi &amp; Oli</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8, fontFamily: 'var(--font-dm-sans, sans-serif)' }}>IA Abrilove</div>
          </div>
        </div>
        <div style={{ padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 5, minHeight: 110 }}>
          {CHAT_MSGS.slice(0, shown).map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', animation: 'chatPop 0.2s ease' }}>
              <div style={{
                background: m.role === 'user' ? 'linear-gradient(135deg, #9b59b6, #660A43)' : 'rgba(255,255,255,0.13)',
                color: '#fff',
                borderRadius: m.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                padding: '5px 8px',
                fontSize: 9.5,
                maxWidth: '88%',
                lineHeight: 1.4,
                fontFamily: 'var(--font-dm-sans, sans-serif)',
              }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      <a href="https://ia.abrilove.fr" style={{
        display: 'block',
        background: 'rgba(255,255,255,0.1)',
        color: '#fff',
        textAlign: 'center',
        fontSize: 9.5,
        padding: '7px',
        borderRadius: 8,
        textDecoration: 'none',
        marginTop: 7,
        fontWeight: 600,
        border: '1px solid rgba(255,255,255,0.15)',
        fontFamily: 'var(--font-dm-sans, sans-serif)',
      }}>
        Essayer gratuitement →
      </a>
    </div>
  )
}

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
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const curr = window.scrollY
      const atBottom = curr + window.innerHeight >= document.documentElement.scrollHeight - 60
      if (curr < 60 || atBottom) { setVisible(true) }
      else if (curr > last) { setVisible(false) }
      else { setVisible(true) }
      last = curr
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        borderRadius: 999,
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-200px)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease',
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
          background: '#FFF4F7',
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
          padding: '20px',
          display: 'flex',
          flexDirection: 'row',
          gap: 16,
          alignItems: 'flex-start',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, paddingTop: 2 }}>
            {LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: 16,
                textDecoration: 'none',
                fontFamily: 'var(--font-dm-sans, sans-serif)',
                padding: '2px 0',
              }}>
                {l.label}
              </a>
            ))}
          </div>
          <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
          <MiniChat />
        </div>
      )}

      <style>{`
        @keyframes chatPop {
          from { opacity: 0; transform: scale(0.85) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (min-width: 781px) {
          .logo-img { height: 48px !important; }
          .desktop-cta-btn { padding: 12px 20px !important; transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease !important; }
          .desktop-cta-btn:hover { transform: scale(1.07) !important; box-shadow: 0 6px 24px rgba(0,0,0,0.18) !important; }
        }
        @media (max-width: 780px) {
          .mobile-pill { top: calc(env(safe-area-inset-top) + 20px) !important; transform: none !important; transition: opacity 0.35s ease !important; }
          .desktop-nav { display: none !important; }
          .desktop-cta { display: none !important; }
          .burger { display: block !important; }
          .mobile-cta { display: flex !important; position: absolute !important; left: 50% !important; transform: translateX(-50%) !important; }
          .mobile-pill {
            background: linear-gradient(135deg, rgb(80,5,50) 0%, rgb(130,15,80) 50%, rgb(80,5,50) 100%) !important;
            border: 1px solid rgba(255,255,255,0.15) !important;
            border-radius: 999px !important;
            transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
        }
      `}</style>
    </>
  )
}
