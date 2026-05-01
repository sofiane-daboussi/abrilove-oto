'use client'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'

export default function SofiEtOliPage() {
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
        @keyframes abri-bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(6px); } }
        @keyframes sao-pulse { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-4px); } }
        .sao-cta { display:inline-flex; align-items:center; text-decoration:none; padding:16px 28px; border-radius:999px; font-weight:700; font-size:15px; font-family:var(--font-dm-sans,sans-serif); transition:transform 0.2s, box-shadow 0.2s; animation:sao-pulse 2.5s ease-in-out infinite; will-change:transform; }
        .sao-cta:hover { transform:translateY(-3px) !important; animation:none; }
        .sao-cta-light { background:#FFF1E7; color:#660A43; box-shadow:0 8px 24px rgba(0,0,0,0.25); border:1.5px solid rgba(232,99,122,0.55); }
        .sao-cta-light:hover { box-shadow:0 12px 30px rgba(0,0,0,0.3); }
        .sao-cta-dark { background:#660A43; color:#fff; box-shadow:0 6px 20px rgba(102,10,67,0.3); }
        .sao-cta-dark:hover { box-shadow:0 10px 28px rgba(102,10,67,0.5); }
        @media (max-width: 720px) {
          .sao-hero-cols { flex-direction: column !important; gap: 24px !important; }
          .sao-hero-imgs { width: 100% !important; flex: none !important; flex-direction: row !important; gap: 12px !important; }
          .sao-hero-imgs img { max-height: 220px !important; }
          .sao-hero-section { padding-top: 140px !important; }
          .sao-2cols { flex-direction: column !important; }
          .sao-2cols-rev { flex-direction: column-reverse !important; }
          .sao-3cols { flex-direction: column !important; }
        }
      `}</style>

      <Header />

      {/* ── HERO ── */}
      <section className="sao-hero-section" style={{
        minHeight: '100vh',
        paddingTop: 'clamp(110px,12vw,170px)',
        paddingLeft: 'clamp(32px,5vw,80px)',
        paddingRight: 'clamp(32px,5vw,80px)',
        paddingBottom: 'calc(clamp(8px,1.5vw,16px) + 36px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
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
          <div className="sao-hero-cols" style={{ display: 'flex', alignItems: 'center', gap: 60, marginBottom: 48 }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'rgba(255,241,231,0.55)', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>À propos</p>
              <h1 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#FFF1E7', fontSize: 'clamp(22px,4vw,54px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 24 }}>
                Nous, c'est <em style={{ fontStyle: 'italic', color: '#FFF1E7' }}>Sofi & Oli.</em>
              </h1>
              <p style={{ color: 'rgba(255,241,231,0.85)', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.85, maxWidth: 520 }}>
                Un couple à Marseille, un projet à deux cœurs (et quatre pattes). Notre envie commune : créer un espace sincère pour parler d'amour autrement.
              </p>
            </div>
            <div className="sao-hero-imgs" style={{ flex: '0 0 42%', display: 'flex', gap: 16, alignItems: 'flex-end' }}>
              <img src="/images/sofi-oli-1.avif" alt="Sofi & Oli" style={{ flex: 1, borderRadius: 24, objectFit: 'cover', maxHeight: 520, width: 0 }} />
              <img src="/images/sofi-oli-2.jpg" alt="Pumba" style={{ flex: 1, borderRadius: 24, objectFit: 'cover', maxHeight: 440, width: 0 }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <a
              href="#adeux"
              onClick={e => { e.preventDefault(); document.getElementById('adeux')?.scrollIntoView({ behavior: 'smooth' }) }}
              style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8, textDecoration: 'none' }}
            >
              <span style={{ fontFamily: 'var(--font-dm-sans,sans-serif)', fontSize: 11, fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: '#FFF1E7' }}>Découvrir</span>
              <div style={{ width: 36, height: 36, border: '1px solid rgba(255,241,231,0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'abri-bounce 2s 1s ease-in-out infinite' }}>
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="#FFF1E7" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              </div>
            </a>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', lineHeight: 0, zIndex: 2 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 80 }}>
            <path d="M0,35 Q720,58 1440,35 L1440,80 L0,80 Z" fill="#FFF4F7" />
          </svg>
        </div>
      </section>

      {/* ── À DEUX, MAIS PAS QUE POUR NOUS ── */}
      <section id="adeux" style={{ background: '#FFF4F7', padding: 'clamp(56px,6vw,96px) clamp(32px,5vw,80px)' }}>
        <div data-fade style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#660A43', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, lineHeight: 1.3, marginBottom: 32 }}>
            À deux, mais pas que pour nous ❤️
          </h2>
          <p style={{ color: '#5a3040', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.85 }}>
            On est en couple dans la vie, mais aussi dans ce projet un peu fou qu'est Abrilove.<br /><br />
            L'idée est née un jour de doute et de grande discussion :<br /><br />
            <em style={{ fontStyle: 'italic', color: '#660A43' }}>"Et si on créait un espace pour parler d'amour autrement ?"</em><br /><br />
            Pas comme une formule magique.<br />
            Pas comme un mode d'emploi.<br /><br />
            Mais comme un refuge sincère, pour celles et ceux qui aiment fort, et veulent aimer juste.
          </p>
        </div>
      </section>

      {/* ── CE QUI NOUS RELIE ── */}
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
          <div data-fade className="sao-2cols-rev" style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
            <div style={{ flex: '0 0 38%' }}>
              <img src="/images/tu-ecris.avif" alt="Ce qui nous relie" style={{ width: '100%', borderRadius: 24, objectFit: 'cover', maxHeight: 500 }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'rgba(255,241,231,0.55)', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Notre histoire</p>
              <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#FFF1E7', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
                Ce qui nous relie
              </h2>
              <p style={{ color: 'rgba(255,241,231,0.85)', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.85 }}>
                On vient de deux pays (🇫🇷 & 🇵🇱), on a des parcours très différents, mais une envie commune: <strong style={{ color: '#FFF1E7' }}>comprendre au lieu de juger.</strong><br /><br />
                Aimer sans flou, sans jeux, sans performance.<br /><br />
                Et partager tout ça avec celles et ceux qui veulent encore y croire, avec lucidité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── POURQUOI L'ABRI LOVE ── */}
      <section style={{ background: '#FFF4F7', padding: 'clamp(56px,6vw,96px) clamp(32px,5vw,80px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div data-fade>
            <p style={{ color: '#660A43', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 16 }}>Notre raison d'être</p>
            <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#660A43', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, textAlign: 'center', marginBottom: 48, lineHeight: 1.2 }}>
              Pourquoi l'Abri Love ?
            </h2>
            <div className="sao-3cols" style={{ display: 'flex', gap: 32, marginBottom: 48 }}>
              {[
                {
                  icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#660A43" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 3C18 3 6 10 6 20a12 12 0 0 0 24 0C30 10 18 3 18 3z"/><path d="M18 14v8M14 18h8" opacity="0.4"/></svg>,
                  title: 'Ras-le-bol des conseils creux',
                  desc: "On en a eu marre des promesses vides, des recettes toutes faites, et des injonctions à se taire ou à séduire."
                },
                {
                  icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#660A43" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12S24.627 6 18 6z"/><path d="M18 14v4l3 3"/></svg>,
                  title: 'Des blessures qui ont appris',
                  desc: "On a connu des relations floues, parfois douloureuses, et on a appris à aimer autrement, avec plus de conscience."
                },
                {
                  icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#660A43" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6h24a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H13l-7 4V8a2 2 0 0 1 2-2z"/><line x1="11" y1="13" x2="25" y2="13"/><line x1="11" y1="18" x2="19" y2="18"/></svg>,
                  title: "Une autre façon d'en parler",
                  desc: "On croit à une parole plus vraie sur l'amour. Avec nuance, honnêteté et courage. Sans masque ni façade."
                },
              ].map((col, i) => (
                <div key={i} style={{ flex: 1, background: '#fff', borderRadius: 20, padding: '32px 28px', boxShadow: '0 4px 24px rgba(102,10,67,0.07)' }}>
                  <div style={{ marginBottom: 20 }}>{col.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#660A43', fontSize: 20, fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}>{col.title}</h3>
                  <p style={{ color: '#5a3040', fontSize: 15, lineHeight: 1.75 }}>{col.desc}</p>
                </div>
              ))}
            </div>
            <p style={{ color: '#5a3040', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.85, textAlign: 'center', maxWidth: 640, margin: '0 auto', fontStyle: 'italic' }}>
              Abrilove, c'est notre façon d'ouvrir la porte à tout ça.<br />
              Un abri dans le bruit. Un espace pour respirer, réfléchir… et (re)choisir.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
