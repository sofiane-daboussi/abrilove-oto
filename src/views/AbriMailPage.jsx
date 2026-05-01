'use client'
import { useEffect, useRef, useState } from 'react'
import Header from './Header'
import Footer from './Footer'

const WORKER_URL = 'https://abrilove-oto-worker.sofiane-daboussi.workers.dev'
const PK = 'pk_live_51Rm9dBI8ilInoMaXKDs2hp5pR1Fq3fcK60MlclXizEDZZxFAUN92E6jpKjILZX0dHtO7gUa3KMfQZKchX6qaPIi8003ZsII2e7'

export default function AbriMailPage() {
  const [email, setEmail] = useState('')
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')
  const [stripeSkeleton, setStripeSkeleton] = useState(true)
  const [showPopup, setShowPopup] = useState(false)
  const paiementRef = useRef(null)
  const stripeRef = useRef(null)
  const elementsRef = useRef(null)

  // Pre-fill email from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const emailFromUrl = params.get('email') || params.get('prefilled_email') || ''
    if (emailFromUrl) setEmail(emailFromUrl)
  }, [])

  // Stripe lazy load
  useEffect(() => {
    if (!paiementRef.current) return
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return
      const s = document.createElement('script')
      s.src = 'https://js.stripe.com/v3/'
      s.onload = () => {
        const stripe = window.Stripe(PK)
        stripeRef.current = stripe
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        const elements = stripe.elements({
          mode: 'payment', amount: 1500, currency: 'eur',
          appearance: { theme: 'stripe', variables: { colorPrimary: '#660A43', colorBackground: '#FFF4F7', colorText: '#1E120A', colorDanger: '#C0392B', fontFamily: 'DM Sans, sans-serif', borderRadius: '10px' }, rules: { '.Tab--selected': { backgroundColor: 'rgba(102,10,67,0.08)', boxShadow: 'none' }, '.Tab': { backgroundColor: 'transparent' } } }
        })
        elementsRef.current = elements
        const paymentEl = elements.create('payment', {
          layout: 'tabs',
          paymentMethodOrder: isMobile ? ['apple_pay', 'google_pay', 'card'] : ['card', 'apple_pay', 'google_pay']
        })
        paymentEl.mount('#abrimail-payment-element')
        paymentEl.on('ready', () => setStripeSkeleton(false))
      }
      document.head.appendChild(s)
      observer.disconnect()
    }, { rootMargin: '200px' })
    observer.observe(paiementRef.current)
    return () => observer.disconnect()
  }, [])

  // Check redirect return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const secret = params.get('payment_intent_client_secret')
    if (!secret) return
    const check = async () => {
      paiementRef.current?.scrollIntoView({ behavior: 'smooth' })
      try {
        if (stripeRef.current) {
          const result = await stripeRef.current.retrievePaymentIntent(secret)
          if (result.paymentIntent?.status === 'succeeded') setShowPopup(true)
        }
      } catch (e) {}
    }
    setTimeout(check, 1500)
  }, [])

  async function handlePay() {
    setPayError('')
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setPayError('Entre ton adresse email valide.'); return }
    if (!elementsRef.current || !stripeRef.current) { setPayError('Le formulaire de paiement n\'est pas encore chargé.'); return }
    setPaying(true)
    const submitResult = await elementsRef.current.submit()
    if (submitResult.error) { setPayError(submitResult.error.message); setPaying(false); return }
    try {
      const res = await fetch(WORKER_URL + '/create-payment-intent', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profil: 'abrimail', email })
      })
      const data = await res.json()
      if (data.error) { setPayError('Erreur : ' + data.error); setPaying(false); return }
      const returnUrl = window.location.origin + window.location.pathname + '?email=' + encodeURIComponent(email) + '&payment_intent_client_secret=' + encodeURIComponent(data.clientSecret)
      const confirmResult = await stripeRef.current.confirmPayment({
        elements: elementsRef.current, clientSecret: data.clientSecret,
        confirmParams: { return_url: returnUrl, payment_method_data: { billing_details: { email } } },
        redirect: 'if_required'
      })
      if (confirmResult.error) { setPayError(confirmResult.error.message); setPaying(false); return }
      if (confirmResult.paymentIntent?.status === 'succeeded') { setShowPopup(true); setPaying(false) }
    } catch (e) { setPayError('Une erreur est survenue.'); setPaying(false) }
  }

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
          .abrimail-2cols { flex-direction: column !important; }
          .abrimail-2cols-rev { flex-direction: column-reverse !important; }
          .abrimail-3cols { flex-direction: column !important; }
          .abrimail-4cols { flex-direction: column !important; }
          .abrimail-section-img { flex: none !important; width: 100% !important; }
        }
        @keyframes coaching-pulse { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-4px); } }
        .coaching-cta { display:inline-flex; align-items:center; text-decoration:none; padding:16px 28px; border-radius:999px; font-weight:700; font-size:15px; font-family:var(--font-dm-sans,sans-serif); transition:transform 0.2s, box-shadow 0.2s; animation:coaching-pulse 2.5s ease-in-out infinite; will-change:transform; }
        .coaching-cta:hover { transform:translateY(-3px) !important; animation:none; }
        .coaching-cta-light { background:#FFF1E7; color:#660A43; box-shadow:0 8px 24px rgba(0,0,0,0.25); border:1.5px solid rgba(232,99,122,0.55); }
        .coaching-cta-light:hover { box-shadow:0 12px 30px rgba(0,0,0,0.3); }
        .coaching-cta-dark { background:#660A43; color:#fff; box-shadow:0 6px 20px rgba(102,10,67,0.3); }
        .coaching-cta-dark:hover { box-shadow:0 10px 28px rgba(102,10,67,0.5); }
      `}</style>

      <Header />

      {/* ── HERO ── */}
      <section style={{
        paddingTop: 'clamp(130px,14vw,190px)',
        paddingLeft: 'clamp(32px,5vw,80px)',
        paddingRight: 'clamp(32px,5vw,80px)',
        paddingBottom: '80px',
        display: 'flex',
        alignItems: 'center',
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
        <div data-fade style={{ maxWidth: 720, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,241,231,0.55)', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>L'Abri Mail</p>
          <h1 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#FFF1E7', fontSize: 'clamp(22px,4vw,54px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 24 }}>
            Ta lecture écrite personnalisée
          </h1>
          <p style={{ color: 'rgba(255,241,231,0.85)', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.85, maxWidth: 560, margin: '0 auto 40px' }}>
            Une réponse claire, bienveillante et lucide à ta situation amoureuse. Tu m'écris, je te réponds personnellement sous 24h avec une analyse lucide et bienveillante pour t'aider à y voir plus clair.
          </p>
          <a href="#paiement" onClick={e => { e.preventDefault(); document.getElementById('paiement')?.scrollIntoView({ behavior: 'smooth' }) }} className="coaching-cta coaching-cta-light">
            C'est parti
          </a>
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
          <p style={{ color: '#5a3040', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.85, marginBottom: 36 }}>
            Tu veux comprendre ce qu'il pense. Pourquoi il s'éloigne. Pourquoi tu ressens autant pour quelqu'un qui donne si peu.<br /><br />
            Cette séance, c'est une pause pour remettre de la clarté dans ton cœur.
          </p>
          <a href="#paiement" onClick={e => { e.preventDefault(); document.getElementById('paiement')?.scrollIntoView({ behavior: 'smooth' }) }} className="coaching-cta coaching-cta-dark">
            C'est parti
          </a>
        </div>
      </section>

      {/* ── TU VEUX COMPRENDRE ── */}
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
          <div data-fade className="abrimail-2cols-rev" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(24px,4vw,60px)' }}>
            <div className="abrimail-section-img" style={{ flex: '0 0 38%' }}>
              <img src="/images/abrimail-section.jpg" alt="L'Abri Mail" style={{ width: '100%', borderRadius: 24, objectFit: 'cover', maxHeight: 560 }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'rgba(255,241,231,0.55)', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>L'Abri Mail</p>
              <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#FFF1E7', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
                Tu veux comprendre sans devoir tout raconter à voix haute ?
              </h2>
              <p style={{ color: 'rgba(255,241,231,0.85)', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.85, marginBottom: 32 }}>
                Parfois, tu as juste besoin d'un regard extérieur. D'une réponse qui met des mots justes sur ce que tu ressens, sans devoir passer par un appel.<br /><br />
                L'Abri Mail, c'est une lecture écrite et personnalisée de ta situation amoureuse, rédigée par Sofi ou Oli — avec la lucidité et la douceur Abrilove.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section style={{ background: '#FFF4F7', padding: 'clamp(32px,4vw,56px) clamp(32px,5vw,80px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div data-fade>
            <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#660A43', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, textAlign: 'center', marginBottom: 48, lineHeight: 1.2 }}>
              Comment ça marche ?
            </h2>
            <div className="abrimail-4cols" style={{ display: 'flex', gap: 28 }}>
              {[
                { n: 1, text: 'Tu procèdes au paiement en ligne (15 €).' },
                { n: 2, text: "Tu reçois immédiatement un e-mail avec l'adresse à laquelle écrire." },
                { n: 3, text: "Tu m'envoies ton message en décrivant ta situation et ce que tu veux comprendre." },
                { n: 4, text: 'Sous 24h, tu reçois ta réponse écrite : une lecture lucide, des repères clairs, et des pistes concrètes pour avancer sans te perdre.' },
              ].map(({ n, text }) => (
                <div key={n} style={{ flex: 1, background: '#fff', borderRadius: 20, padding: '32px 24px', boxShadow: '0 4px 24px rgba(102,10,67,0.07)', textAlign: 'center' }}>
                  <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
                    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                      <circle cx="26" cy="26" r="25" stroke="#660A43" strokeWidth="1.6" fill="rgba(102,10,67,0.05)" />
                      <text x="26" y="32" textAnchor="middle" fontFamily="Georgia, serif" fontSize="20" fontWeight="700" fill="#660A43">{n}</text>
                    </svg>
                  </div>
                  <p style={{ color: '#5a3040', fontSize: 15, lineHeight: 1.75 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CE QUE TU RECEVRAS ── */}
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
          <p style={{ color: 'rgba(255,241,231,0.55)', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Ta réponse</p>
          <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#FFF1E7', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 32 }}>
            Ce que tu recevras
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32, textAlign: 'left' }}>
            {[
              'Une réponse personnalisée et détaillée',
              'Une analyse émotionnelle et relationnelle juste',
              'Des conseils concrets pour te recentrer et agir avec discernement',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, background: 'rgba(255,241,231,0.08)', borderRadius: 14, padding: '16px 20px' }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>✅</span>
                <p style={{ color: 'rgba(255,241,231,0.9)', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.7, margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>
          <p style={{ color: 'rgba(255,241,231,0.7)', fontSize: 15, lineHeight: 1.75, marginBottom: 36, fontStyle: 'italic' }}>
            Pas de jugement, pas de phrases toutes faites — juste une lecture humaine, honnête et apaisante.
          </p>
          <a href="#paiement" onClick={e => { e.preventDefault(); document.getElementById('paiement')?.scrollIntoView({ behavior: 'smooth' }) }} className="coaching-cta coaching-cta-light">
            J'envoie mon message
          </a>
        </div>
      </section>

      {/* ── SOFI & OLI ── */}
      <section style={{ background: '#FFF4F7', padding: 'clamp(32px,4vw,56px) clamp(32px,5vw,80px)' }}>
        <div data-fade style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="abrimail-2cols" style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
            <div style={{ flex: 1 }}>
              <img src="/images/section-img-2.avif" alt="Sofi et Oli" style={{ width: '100%', borderRadius: 24, objectFit: 'cover', maxHeight: 500 }} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#660A43', fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
                Hey, nous sommes <em style={{ color: '#660A43' }}>Sofi & Oli</em>
              </h2>
              <p style={{ color: '#5a3040', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.85, marginBottom: 32 }}>
                Chaque jour, nous accompagnons des femmes dans leurs relations, leurs doutes, leurs schémas et ce qu'elles traversent intérieurement. Au fil de milliers d'heures de coaching, de conversations et de situations réelles, nous avons appris à voir ce qui se joue vraiment derrière les mots, les silences et les comportements.
              </p>
              <a href="#paiement" onClick={e => { e.preventDefault(); document.getElementById('paiement')?.scrollIntoView({ behavior: 'smooth' }) }} className="coaching-cta coaching-cta-dark">
                J'envoie ma situation
              </a>
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
              Ce que disent celles qui l'ont testée
            </h2>
            <div className="abrimail-3cols" style={{ display: 'flex', gap: 24 }}>
              {['/images/abrimail-temo-1.avif', '/images/abrimail-temo-2.avif', '/images/abrimail-temo-3.avif'].map((src, i) => (
                <div key={i} style={{ flex: 1, borderRadius: 18, overflow: 'hidden' }}>
                  <img src={src} alt={`Témoignage ${i + 1}`} style={{ width: '100%', display: 'block', borderRadius: 18 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PAIEMENT ── */}
      <section id="paiement" style={{ background: '#FFF4F7', padding: 'clamp(32px,4vw,56px) clamp(32px,5vw,80px) clamp(56px,6vw,80px)', borderTop: '1px solid rgba(102,10,67,0.08)' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <p style={{ color: '#660A43', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 16 }}>Paiement</p>
          <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#660A43', fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 700, textAlign: 'center', marginBottom: 40, lineHeight: 1.2 }}>
            Prête à y voir plus clair ?
          </h2>
          {showPopup ? (
            <div style={{ background: 'rgba(102,10,67,0.06)', borderRadius: 16, padding: '32px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: 32, marginBottom: 12 }}>💌</p>
              <p style={{ color: '#660A43', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Paiement confirmé !</p>
              <p style={{ color: '#5a3040', fontSize: 15, lineHeight: 1.7 }}>Tu vas recevoir un email avec l'adresse à laquelle m'écrire. Vérifie tes spams si besoin.</p>
            </div>
          ) : (
            <div className="payment-block" ref={paiementRef} style={{ background: 'transparent', border: '2px solid rgba(102,10,67,0.4)', borderRadius: '16px' }}>
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontFamily: 'var(--font-playfair,serif)', color: '#660A43', fontWeight: 700, fontSize: 20, marginBottom: 4 }}>L'Abri Mail</p>
                <p style={{ color: '#8a5060', fontSize: 14 }}>Réponse personnalisée sous 24h · Envoyée par mail</p>
              </div>
              <div className="price-row">
                <span className="price-current">15€</span>
              </div>
              <label className="field-label" htmlFor="abrimail-email">Email · pour recevoir ta réponse</label>
              <input type="email" id="abrimail-email" className="field-input" placeholder="ton@email.fr" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
              {stripeSkeleton && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                  <div className="stripe-skeleton-bar" />
                  <div className="stripe-skeleton-bar" />
                </div>
              )}
              <div id="abrimail-payment-element" />
              {payError && <div className="payment-errors">{payError}</div>}
              <button className="btn-pay" disabled={paying} onClick={handlePay}>
                <span>{paying ? 'Traitement...' : 'J\'envoie mon message → 15€'}</span>
                {paying && <div className="spinner" />}
              </button>
              <div className="secure-note">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Paiement sécurisé · Réponse reçue sous 24h
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── COACHING ── */}
      <section style={{ background: '#FFF4F7', padding: 'clamp(56px,6vw,80px) clamp(32px,5vw,80px)', borderTop: '1px solid rgba(102,10,67,0.08)' }}>
        <div data-fade style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#660A43', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Alternative</p>
          <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#660A43', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 24 }}>
            Envie d'en parler de vive voix ?
          </h2>
          <p style={{ color: '#5a3040', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.85, marginBottom: 36 }}>
            Parfois, tu as besoin de plus qu'une réponse écrite. Tu veux échanger, poser des mots à l'oral, et être guidée en direct pour comprendre ce que tu vis.<br /><br />
            L'Abri Love, c'est une séance de coaching individuelle en visio avec Sofi. Pendant une heure, tu poses tout, on analyse ensemble ta situation, et tu repars avec des repères clairs pour avancer, apaisée et confiante.
          </p>
          <a href="/coaching" className="coaching-cta coaching-cta-dark">
            Je réserve mon appel
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
