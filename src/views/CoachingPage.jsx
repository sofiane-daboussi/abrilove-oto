'use client'
import { useEffect, useRef } from 'react'
import Header from './Header'
import Footer from './Footer'

export default function CoachingPage() {
  const filloutRef = useRef(null)

  useEffect(() => {
    if (!filloutRef.current) return
    const existing = document.getElementById('fillout-script')
    if (existing) existing.remove()
    const s = document.createElement('script')
    s.id = 'fillout-script'
    s.src = 'https://server.fillout.com/embed/v1/'
    filloutRef.current.appendChild(s)
  }, [])

  useEffect(() => {
    const els = document.querySelectorAll('[data-fade]')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('fade-in'); obs.unobserve(entry.target) }
      })
    }, { threshold: 0.1 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])


  return (
    <div style={{ margin: '-24px -16px' }}>
      <style>{`
        @keyframes blob1 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(80px,-60px) scale(1.15); } 66% { transform:translate(-50px,40px) scale(0.88); } }
        @keyframes blob2 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(-70px,50px) scale(1.12); } 66% { transform:translate(60px,-40px) scale(0.9); } }
        @keyframes blob3 { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(60px,-70px) scale(1.1); } }
        @media (max-width: 720px) {
          .coaching-hero-cols { flex-direction: column !important; padding-top: 20px; }
          .coaching-2cols { flex-direction: column !important; }
          .coaching-2cols-rev { flex-direction: column-reverse !important; }
          .coaching-3cols { flex-direction: column !important; }
        }
      `}</style>

      <Header />

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        paddingTop: 'clamp(110px,12vw,170px)',
        paddingLeft: 'clamp(32px,5vw,80px)',
        paddingRight: 'clamp(32px,5vw,80px)',
        paddingBottom: 'calc(clamp(8px,1.5vw,16px) + 80px)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #660A43 0%, #8a1258 50%, #660A43 100%)',
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(190,25,105,0.6) 0%, transparent 65%)', top: '20%', right: '-10%', filter: 'blur(50px)', animation: 'blob1 6s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(160,15,85,0.55) 0%, transparent 65%)', bottom: '0%', left: '-10%', filter: 'blur(45px)', animation: 'blob2 8s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(210,40,120,0.5) 0%, transparent 65%)', top: '50%', left: '20%', filter: 'blur(50px)', animation: 'blob3 7s ease-in-out infinite' }} />
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
          <div className="coaching-hero-cols" style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'rgba(255,241,231,0.55)', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>Coaching individuel</p>
              <h1 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#FFF1E7', fontSize: 'clamp(22px,4vw,54px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 24 }}>
                Une heure pour comprendre ce qui se joue entre toi et lui.
              </h1>
              <p style={{ color: 'rgba(255,241,231,0.85)', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.85, marginBottom: 36, maxWidth: 520 }}>
                Il y a des histoires qui te prennent la tête, d'autres qui te prennent le cœur. Celles où tu veux comprendre, mais où tout te semble flou. L'Abri Clarté est une séance pensée pour ce moment-là : quand tu ne veux plus analyser seule, mais juste comprendre, apaiser, et retrouver ton discernement, avec un regard masculin lucide, bienveillant et sans jeu de rôle.
              </p>
              <a href="#reserver" onClick={e => { e.preventDefault(); document.getElementById('reserver')?.scrollIntoView({ behavior: 'smooth' }) }} style={{ display: 'inline-flex', alignItems: 'center', background: '#FFF1E7', color: '#660A43', textDecoration: 'none', padding: '16px 28px', borderRadius: 999, fontWeight: 700, fontSize: 15, boxShadow: '0 8px 24px rgba(0,0,0,0.25)', fontFamily: 'var(--font-dm-sans,sans-serif)', border: '1.5px solid rgba(232,99,122,0.55)' }}>
                Réserve un appel
              </a>
            </div>
            <div className="coaching-hero-img" style={{ flex: '0 0 38%' }}>
              <img src="/images/coaching-bg.jpg" alt="Coaching Abrilove" style={{ width: '100%', borderRadius: 24, objectFit: 'cover', maxHeight: 560 }} />
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', lineHeight: 0, zIndex: 2 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 80 }}>
            <path d="M0,35 Q720,58 1440,35 L1440,80 L0,80 Z" fill="#FFF4F7" />
          </svg>
        </div>
      </section>

      {/* ── TU ANALYSES TOUT ── */}
      <section style={{ background: '#FFF4F7', padding: 'clamp(32px,4vw,56px) clamp(32px,5vw,80px)' }}>
        <div data-fade style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#660A43', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, lineHeight: 1.3, marginBottom: 24 }}>
            Tu analyses tout. Mais rien ne t'éclaire.
          </h2>
          <p style={{ color: '#5a3040', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.85 }}>
            Tu veux comprendre ce qu'il pense. Pourquoi il s'éloigne. Pourquoi tu ressens autant pour quelqu'un qui donne si peu.<br /><br />
            Cette séance, c'est une pause pour remettre de la clarté dans ton cœur.
          </p>
        </div>
      </section>

      {/* ── CE QU'EST L'ABRI CLARTÉ ── */}
      <section style={{ background: 'linear-gradient(180deg, #660A43 0%, #8a1258 50%, #660A43 100%)', padding: 'calc(clamp(24px,3vw,44px) + 80px) clamp(32px,5vw,80px)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -1, left: 0, width: '100%', lineHeight: 0, zIndex: 2, pointerEvents: 'none' }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 80 }}>
            <path d="M0,0 L0,45 Q720,22 1440,45 L1440,0 Z" fill="#FFF4F7" />
          </svg>
        </div>
        <div style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', lineHeight: 0, zIndex: 2, pointerEvents: 'none' }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 80 }}>
            <path d="M0,35 Q720,58 1440,35 L1440,80 L0,80 Z" fill="#FFF4F7" />
          </svg>
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div data-fade className="coaching-2cols-rev" style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
            <div style={{ flex: 1 }}>
              <img src="/images/coaching-clarté.avif" alt="L'Abri Clarté" style={{ width: '100%', borderRadius: 24, objectFit: 'cover', maxHeight: 500 }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'rgba(255,241,231,0.55)', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>La séance</p>
              <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#FFF1E7', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
                Ce qu'est <em>L'Abri Clarté</em>
              </h2>
              <p style={{ color: 'rgba(255,241,231,0.85)', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.85, marginBottom: 32 }}>
                Une séance d'une heure avec Sofi, pour t'aider à voir ta situation amoureuse telle qu'elle est, sans illusions, sans jugements, avec douceur et vérité.<br /><br />
                Tu n'as pas besoin d'une "solution magique".<br />Tu as besoin de comprendre ce qui se passe vraiment entre vous.
              </p>
              <a href="#reserver" onClick={e => { e.preventDefault(); document.getElementById('reserver')?.scrollIntoView({ behavior: 'smooth' }) }} style={{ display: 'inline-flex', alignItems: 'center', background: '#FFF1E7', color: '#660A43', textDecoration: 'none', padding: '16px 28px', borderRadius: 999, fontWeight: 700, fontSize: 15, boxShadow: '0 8px 24px rgba(0,0,0,0.25)', fontFamily: 'var(--font-dm-sans,sans-serif)', border: '1.5px solid rgba(232,99,122,0.55)' }}>
                Réserve ton appel
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PENDANT LA SESSION ── */}
      <section style={{ background: '#FFF4F7', padding: 'clamp(32px,4vw,56px) clamp(32px,5vw,80px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div data-fade>
          <p style={{ color: '#660A43', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 16 }}>La séance</p>
          <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#660A43', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, textAlign: 'center', marginBottom: 48, lineHeight: 1.2 }}>
            Pendant la session
          </h2>
          <div className="coaching-3cols" style={{ display: 'flex', gap: 32, marginBottom: 40 }}>
            {[
              { icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#660A43" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6h24a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H13l-7 4V8a2 2 0 0 1 2-2z"/><line x1="11" y1="13" x2="25" y2="13"/><line x1="11" y1="18" x2="19" y2="18"/></svg>, title: 'Tu poses tout.', desc: "Ce que tu ressens, ce que tu observes, ce que tu n'oses plus dire à personne." },
              { icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#660A43" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="18" cy="18" rx="14" ry="9"/><circle cx="18" cy="18" r="4"/><circle cx="18" cy="18" r="1.5" fill="#660A43" stroke="none"/></svg>, title: 'On lit la dynamique.', desc: "Je t'explique ce qui se joue entre vous, les schémas, les peurs, les signaux émotionnels." },
              { icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#660A43" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="13"/><path d="M24 12l-3.5 9.5L11 25l3.5-9.5L24 12z"/><circle cx="18" cy="18" r="2" fill="#660A43" stroke="none"/></svg>, title: 'Tu repars claire.', desc: 'Avec 3 repères concrets et un plan émotionnel réaliste pour avancer sereinement.' },
            ].map((col, i) => (
              <div key={i} style={{ flex: 1, background: '#fff', borderRadius: 20, padding: '32px 28px', boxShadow: '0 4px 24px rgba(102,10,67,0.07)' }}>
                <div style={{ marginBottom: 20 }}>{col.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#660A43', fontSize: 20, fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}>{col.title}</h3>
                <p style={{ color: '#5a3040', fontSize: 15, lineHeight: 1.75 }}>{col.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ color: '#8a5060', fontSize: 14, textAlign: 'center', fontStyle: 'italic', lineHeight: 1.7 }}>
            À la fin, tu reçois une note vocale personnalisée et un mail récap pour ancrer ce qu'on a vu ensemble.
          </p>
          </div>
        </div>
      </section>

      {/* ── CE QUE TU RESSENS ── */}
      <section style={{ background: 'linear-gradient(180deg, #660A43 0%, #8a1258 50%, #660A43 100%)', padding: 'calc(clamp(24px,3vw,44px) + 80px) clamp(32px,5vw,80px)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -1, left: 0, width: '100%', lineHeight: 0, zIndex: 2, pointerEvents: 'none' }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 80 }}>
            <path d="M0,0 L0,45 Q720,22 1440,45 L1440,0 Z" fill="#FFF4F7" />
          </svg>
        </div>
        <div style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', lineHeight: 0, zIndex: 2, pointerEvents: 'none' }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 80 }}>
            <path d="M0,35 Q720,58 1440,35 L1440,80 L0,80 Z" fill="#FFF4F7" />
          </svg>
        </div>
        <div data-fade style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#FFF1E7', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 36 }}>
            Ce que tu ressens peut ressembler à ça…
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40, textAlign: 'left' }}>
            {[
              "Tu veux comprendre pourquoi il s'éloigne sans raison apparente.",
              'Tu sens que quelque chose cloche, mais tu ne veux pas te mentir.',
              "Tu hésites à lâcher ou à rester, et tu ne sais plus ce qui est juste.",
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, background: 'rgba(255,241,231,0.08)', borderRadius: 14, padding: '16px 20px' }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>✅</span>
                <p style={{ color: 'rgba(255,241,231,0.9)', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.7, margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>
          <p style={{ color: 'rgba(255,241,231,0.75)', fontSize: 16, lineHeight: 1.75, marginBottom: 36 }}>
            Cette séance ne te dira pas quoi faire à ma place, elle t'aidera à comprendre ce qui bloque, et à choisir ce qui est juste pour toi, avec un plan clair pour avancer.
          </p>
          <a href="#reserver" onClick={e => { e.preventDefault(); document.getElementById('reserver')?.scrollIntoView({ behavior: 'smooth' }) }} style={{ display: 'inline-flex', alignItems: 'center', background: '#FFF1E7', color: '#660A43', textDecoration: 'none', padding: '16px 28px', borderRadius: 999, fontWeight: 700, fontSize: 15, boxShadow: '0 8px 24px rgba(0,0,0,0.25)', fontFamily: 'var(--font-dm-sans,sans-serif)', border: '1.5px solid rgba(232,99,122,0.55)' }}>
            Je réserve mon appel
          </a>
        </div>
      </section>

      {/* ── MOI C'EST SOFI ── */}
      <section style={{ background: '#FFF4F7', padding: 'clamp(32px,4vw,56px) clamp(32px,5vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div data-fade className="coaching-2cols" style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
            <div style={{ flex: 1 }}>
              <img src="/images/coaching-sofi.avif" alt="Sofiane" style={{ width: '100%', borderRadius: 24, objectFit: 'cover', maxHeight: 500 }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#660A43', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Qui suis-je</p>
              <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#660A43', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
                Moi, c'est <em>Sofi</em>
              </h2>
              <p style={{ color: '#5a3040', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.85 }}>
                Je m'appelle Sofiane. J'écoute les femmes parler d'amour depuis des années.<br /><br />
                Et j'ai compris que ce qu'elles cherchent, ce n'est pas un "avis d'homme". C'est une lecture juste et apaisante de ce qu'elles vivent, un regard qui éclaire, sans juger.<br /><br />
                <strong>Mon approche :</strong> directe, douce, lucide. Ni froide, ni théorique. Juste humaine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section style={{ background: 'linear-gradient(180deg, #660A43 0%, #8a1258 50%, #660A43 100%)', padding: 'calc(clamp(24px,3vw,44px) + 80px) clamp(32px,5vw,80px)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -1, left: 0, width: '100%', lineHeight: 0, zIndex: 2, pointerEvents: 'none' }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 80 }}>
            <path d="M0,0 L0,45 Q720,22 1440,45 L1440,0 Z" fill="#FFF4F7" />
          </svg>
        </div>
        <div style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', lineHeight: 0, zIndex: 2, pointerEvents: 'none' }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 80 }}>
            <path d="M0,35 Q720,58 1440,35 L1440,80 L0,80 Z" fill="#FFF4F7" />
          </svg>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div data-fade>
          <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#FFF1E7', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, textAlign: 'center', marginBottom: 48, lineHeight: 1.2 }}>
            Elles en parlent mieux que moi
          </h2>
          <div className="coaching-3cols" style={{ display: 'flex', gap: 24 }}>
            {['/images/coaching-temo-1.avif', '/images/coaching-temo-2.avif', '/images/coaching-temo-3.avif'].map((src, i) => (
              <div key={i} style={{ flex: 1, borderRadius: 18, overflow: 'hidden' }}>
                <img src={src} alt={`Témoignage ${i + 1}`} style={{ width: '100%', display: 'block', borderRadius: 18 }} />
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* ── FILLOUT RÉSERVATION ── */}
      <section id="reserver" style={{ background: '#FFF4F7', padding: 'clamp(32px,4vw,56px) clamp(32px,5vw,80px)' }}>
        <div data-fade style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ color: '#660A43', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 16 }}>Réservation</p>
          <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#660A43', fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 700, textAlign: 'center', marginBottom: 40, lineHeight: 1.2 }}>
            Réserve ton appel Abri Clarté
          </h2>
          <div ref={filloutRef}>
            <div
              style={{ width: '100%', height: 500 }}
              data-fillout-id="wFDYhHfmwDus"
              data-fillout-embed-type="standard"
              data-fillout-inherit-parameters=""
              data-fillout-dynamic-resize=""
            />
          </div>
        </div>
      </section>

      {/* ── L'ABRI MAIL ── */}
      <section style={{ background: '#FFF4F7', padding: 'clamp(32px,4vw,56px) clamp(32px,5vw,80px)', borderTop: '1px solid rgba(102,10,67,0.08)' }}>
        <div data-fade style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#660A43', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Alternative</p>
          <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#660A43', fontSize: 'clamp(22px,3vw,34px)', fontWeight: 700, lineHeight: 1.3, marginBottom: 20 }}>
            Pas encore prête pour un appel ?
          </h2>
          <p style={{ color: '#5a3040', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.85, marginBottom: 32 }}>
            Tu veux d'abord déposer ce que tu ressens à l'écrit, sans visio, sans échange en direct ?<br /><br />
            Découvre <strong>L'Abri Mail</strong>, une lecture écrite et personnalisée de ta situation amoureuse. Tu m'écris, je te réponds personnellement sous 24h avec une analyse lucide et bienveillante pour t'aider à y voir plus clair.
          </p>
          <a href="/contact" style={{ display: 'inline-flex', alignItems: 'center', background: '#660A43', color: '#fff', textDecoration: 'none', padding: '16px 28px', borderRadius: 999, fontWeight: 700, fontSize: 15, boxShadow: '0 6px 20px rgba(102,10,67,0.3)', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>
            J'envoie mon message
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
