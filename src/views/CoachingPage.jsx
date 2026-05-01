'use client'
import Header from './Header'
import Footer from './Footer'

export default function CoachingPage() {
  return (
    <div style={{ margin: '-24px -16px' }}>
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
              <p style={{ color: 'rgba(255,241,231,0.55)', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>
                Coaching individuel
              </p>
              <h1 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#FFF1E7', fontSize: 'clamp(22px,4vw,54px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 24 }}>
                Une heure pour comprendre ce qui se joue entre toi et lui.
              </h1>
              <p style={{ color: 'rgba(255,241,231,0.85)', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.85, marginBottom: 36, maxWidth: 520 }}>
                Il y a des histoires qui te prennent la tête, d'autres qui te prennent le cœur. Celles où tu veux comprendre, mais où tout te semble flou. L'Abri Clarté est une séance pensée pour ce moment-là : quand tu ne veux plus analyser seule, mais juste comprendre, apaiser, et retrouver ton discernement, avec un regard masculin lucide, bienveillant et sans jeu de rôle.
              </p>
              <a href="#reserver" onClick={e => { e.preventDefault(); document.getElementById('reserver')?.scrollIntoView({ behavior: 'smooth' }) }} style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: '#FFF1E7',
                color: '#660A43',
                textDecoration: 'none',
                padding: '16px 28px',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 15,
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                fontFamily: 'var(--font-dm-sans,sans-serif)',
                border: '1.5px solid rgba(232,99,122,0.55)',
              }}>
                Réserve un appel
              </a>
            </div>

            <div className="coaching-hero-img" style={{ flex: '0 0 38%', flexShrink: 0 }}>
              <img
                src="/images/coaching-bg.jpg"
                alt="Coaching Abrilove"
                style={{ width: '100%', borderRadius: 24, objectFit: 'cover', maxHeight: 560 }}
              />
            </div>

          </div>
        </div>

        <div style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', lineHeight: 0, zIndex: 2 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 80 }}>
            <path d="M0,35 Q720,58 1440,35 L1440,80 L0,80 Z" fill="#FFF4F7" />
          </svg>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes blob1 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(80px,-60px) scale(1.15); } 66% { transform:translate(-50px,40px) scale(0.88); } }
        @keyframes blob2 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(-70px,50px) scale(1.12); } 66% { transform:translate(60px,-40px) scale(0.9); } }
        @keyframes blob3 { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(60px,-70px) scale(1.1); } }
        @media (max-width: 720px) {
          .coaching-hero-cols { flex-direction: column !important; padding-top: 20px; }
        }
      `}</style>
    </div>
  )
}
