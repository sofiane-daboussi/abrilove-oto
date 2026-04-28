'use client'
import { useState, useEffect, useRef } from 'react'

const OBJECTIONS = [
  {
    front: "C'est trop cher.",
    back: "17€, c'est le prix d'un déjeuner. Le temps perdu à attendre quelqu'un qui ne s'engage pas, lui, il a un prix."
  },
  {
    front: "J'ai déjà tout essayé.",
    back: "T'as peut-être essayé de changer lui, ou de mieux te comporter. Pas de comprendre pourquoi tu retombes toujours dans le même schéma. C'est ça que ce livre t'apporte."
  },
  {
    front: "Je n'ai pas le temps.",
    back: "« Pas le temps » en relation, ça veut souvent dire suranalyse et charge mentale permanente. Ce livre ne te prend pas du temps, il t'en rend."
  },
  {
    front: "Je connais déjà mes schémas.",
    back: "Connaître ses schémas et comprendre pourquoi ils existent, c'est pas la même chose. La deuxième, c'est ce qui change vraiment quelque chose."
  },
]

const WORKER_URL = 'https://abrilove-oto-worker.sofiane-daboussi.workers.dev'
const PK = 'pk_live_51Rm9dBI8ilInoMaXKDs2hp5pR1Fq3fcK60MlclXizEDZZxFAUN92E6jpKjILZX0dHtO7gUa3KMfQZKchX6qaPIi8003ZsII2e7'

const QUIZ_ITEMS = [
  "Tu te sens bloquée et perdue et, quand tu regardes les autres femmes, tu as l'impression qu'elles connaissent des \"secrets\" pour vivre pleinement… pendant que toi, tu as la sensation de stagner.",
  "Tu es paralysée par la peur de retomber dans un schéma qui va te blesser, dans une relation, au travail, ou même dans ta famille.",
  "Tu as l'impression d'attirer encore et encore ce qui est indisponible ou toxique, puis tu te retrouves seule avec ce sentiment terrible : tu n'es pas importante.",
  "Tu te fais de moins en moins confiance. Tu as peur de refaire le mauvais choix et de perdre encore du temps.",
  "Tu manques de confiance en toi. De vieilles blessures reviennent, la peur du rejet se réactive, et chaque nouvelle tentative finit par cette pensée : \"encore une fois, ça n'a pas marché.\"",
  "Tu sais que tu \"fais quelque chose de travers\", que \"ça ne devrait pas être comme ça\"… mais tu n'arrives pas à trouver une sortie claire.",
  "Parfois, tu te dis que rien ne changera pour toi, parce que tes erreurs et tes expériences passées continueront toujours à te tirer vers le bas.",
  "Tu t'es récemment posé cette question : \"Et si le problème, c'était moi?\". Et il ne te reste que de la culpabilité et un sentiment d'égarement.",
]

const QUIZ_MESSAGES = {
  1: "Tu as coché 1 case. Une seule résonnance suffit. C'est un signal que tu mérites d'explorer.",
  2: "Tu as coché 2 cases. Ces deux points ne sont pas des coïncidences. Il y a un fil, et ce livre t'aide à le voir.",
  3: "Tu as coché 3 cases. Tu commences à voir un schéma. Ce n'est pas une fatalité, c'est quelque chose qui se comprend et se change.",
  4: "Tu as coché 4 cases. Ces schémas sont profondément ancrés, mais ils ont une origine. Et surtout, une sortie.",
  5: "Tu as coché 5 cases. Tu portes beaucoup en silence. Ce livre t'explique pourquoi, et comment poser tout ça.",
  6: "Tu as coché 6 cases. Tu te reconnais dans presque tout. Ce n'est pas ta faute, mais tu as le pouvoir de changer ça.",
  7: "Tu as coché 7 cases. Tu vis avec ça depuis longtemps. Il est temps que quelqu'un t'explique vraiment ce qui se passe.",
  8: "Tu as coché les 8 cases. Ce livre a été écrit pour exactement là où tu en es. Tu mérites de comprendre et d'avancer.",
}

const TOC_ITEMS = [
  "Quand ton corps s'attache plus vite que ton cœur n'a le temps de choisir",
  "Pourquoi la proximité te bouleverse plus que les autres",
  "Ce que tu protèges réellement quand tu t'accroches",
  "Ton vrai rythme d'attachement (et pourquoi tu le trahis)",
  "Les hommes que tu attires… et surtout ceux que tu choisis",
  "Le schéma que tu répètes (et comment tu t'y enfermes)",
  "Les hommes qui respectent ton rythme (et pourquoi, au début, ils peuvent te faire peur)",
  "Comment créer un lien sans te perdre",
  "Apprendre à rester ouverte sans te contracter",
  "Aimer sans te perdre",
]

const FAQ_ITEMS = [
  { q: "C'est quoi exactement cet e-book?", a: "Un guide de ~200 pages qui décrypte le profil \"Amoureuse Accro\" : pourquoi tu t'attaches à des hommes qui ne sont pas disponibles, comment sortir de ce schéma, et ce que tu mérites vraiment. Envoyé en PDF immédiatement après paiement." },
  { q: "Comment je reçois mon e-book?", a: "Tu entres ton email dans le formulaire de paiement, et tu reçois le PDF directement dans ta boîte mail dans les minutes qui suivent. Pense à vérifier tes spams si tu ne le vois pas." },
  { q: "C'est sécurisé de payer ici?", a: "Oui. Le paiement est géré par Stripe, la référence mondiale en matière de sécurité des paiements en ligne. Tes données bancaires ne passent jamais par nos serveurs." },
  { q: "Est-ce que ça correspond à ma situation?", a: "Si tu te retrouves à analyser ses messages en boucle, à attendre qu'il revienne, à t'accrocher même quand ça fait mal, oui, ce livre a été écrit pour toi." },
  { q: "C'est un achat unique?", a: "Oui, 17€ une seule fois. Pas d'abonnement, pas de frais cachés. Tu gardes l'accès à vie, et toutes les mises à jour futures sont incluses." },
]

function isValidEmail(e) {
  const at = e.indexOf('@')
  const dot = e.lastIndexOf('.')
  return at > 0 && dot > at + 1 && dot < e.length - 1
}

export default function AccroPage() {
  const [checkedItems, setCheckedItems] = useState(new Set())
  const [openFaq, setOpenFaq] = useState(null)
  const [toggleOn, setToggleOn] = useState(false)
  const [timerText, setTimerText] = useState('30:00')
  const [email, setEmail] = useState('')
  const [payError, setPayError] = useState('')
  const [paying, setPaying] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [stripeSkeleton, setStripeSkeleton] = useState(true)
  const [stickyVisible, setStickyVisible] = useState(false)
  const [stickyAnimating, setStickyAnimating] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [tocExpanded, setTocExpanded] = useState(false)
  const [addBump, setAddBump] = useState(false)
  const [addBump2, setAddBump2] = useState(false)
  const [objFlipped, setObjFlipped] = useState(OBJECTIONS.map(() => false))
  const objSectionRef = useRef(null)
  const flipDragRef = useRef({ startX: 0, startY: 0, direction: null, triggered: false })
  const flipBackDragRef = useRef({ startX: 0, startY: 0, direction: null, triggered: false })

  const narrativeEndRef = useRef(null)
  const paiementRef = useRef(null)
  const carouselRef = useRef(null)
  const trackRef = useRef(null)
  const stickyHideTimer = useRef(null)
  const stickyIsVisible = useRef(false)
  const lastScrollY = useRef(0)

  // Stripe refs
  const stripeRef = useRef(null)
  const elementsRef = useRef(null)

  // Timer
  useEffect(() => {
    const stored = localStorage.getItem('oto_accro_end')
    let endTime = stored ? parseInt(stored) : Date.now() + 30 * 60 * 1000
    if (!stored) localStorage.setItem('oto_accro_end', endTime)
    function tick() {
      const remaining = endTime - Date.now()
      if (remaining <= 0) { setTimerText('00:00'); return }
      const mins = Math.floor(remaining / 60000)
      const secs = Math.floor((remaining % 60000) / 1000)
      setTimerText(String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0'))
      setTimeout(tick, 1000)
    }
    tick()
  }, [])

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
          mode: 'payment', amount: 1700, currency: 'eur',
          appearance: { theme: 'stripe', variables: { colorPrimary: '#660A43', colorBackground: '#FFF1E7', colorText: '#1E120A', colorDanger: '#C0392B', fontFamily: 'DM Sans, sans-serif', borderRadius: '10px' } }
        })
        elementsRef.current = elements
        const paymentEl = elements.create('payment', {
          layout: 'tabs',
          paymentMethodOrder: isMobile ? ['apple_pay', 'google_pay', 'card'] : ['card', 'apple_pay', 'google_pay']
        })
        paymentEl.mount('#payment-element')
        paymentEl.on('ready', () => setStripeSkeleton(false))
      }
      document.head.appendChild(s)
      observer.disconnect()
    }, { rootMargin: '200px' })
    observer.observe(paiementRef.current)
    return () => observer.disconnect()
  }, [])

  // Check for redirect return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const secret = params.get('payment_intent_client_secret')
    if (!secret) return
    const checkPayment = async () => {
      paiementRef.current?.scrollIntoView({ behavior: 'smooth' })
      try {
        if (stripeRef.current) {
          const result = await stripeRef.current.retrievePaymentIntent(secret)
          if (result.paymentIntent?.status === 'succeeded') setShowPopup(true)
        }
      } catch (e) {}
    }
    setTimeout(checkPayment, 1500)
  }, [])

  // Sticky bar scroll logic
  useEffect(() => {
    function showBar() {
      if (stickyIsVisible.current) return
      stickyIsVisible.current = true
      clearTimeout(stickyHideTimer.current)
      setStickyAnimating(true)
      requestAnimationFrame(() => setStickyVisible(true))
    }
    function hideBar() {
      if (!stickyIsVisible.current) return
      stickyIsVisible.current = false
      setStickyVisible(false)
      stickyHideTimer.current = setTimeout(() => setStickyAnimating(false), 400)
    }
    function onScroll() {
      const currentY = window.scrollY
      const diff = currentY - lastScrollY.current
      lastScrollY.current = currentY
      const triggerPassed = narrativeEndRef.current?.getBoundingClientRect().top < 0
      if (diff < -5) hideBar()
      else if (diff > 5 && triggerPassed) showBar()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])


  // Fade-in au scroll
  useEffect(() => {
    const els = document.querySelectorAll('.fade-section')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } })
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' })
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Mise à jour montant Stripe si bump change
  useEffect(() => {
    if (!elementsRef.current) return
    const total = 1700 + (addBump ? 900 : 0) + (addBump2 ? 900 : 0)
    const el = document.getElementById('payment-element')
    if (el) el.style.pointerEvents = 'none'
    elementsRef.current.update({ amount: total })
    setTimeout(() => { if (el) el.style.pointerEvents = '' }, 800)
  }, [addBump, addBump2])

  // Auto-flip première carte objection
  useEffect(() => {
    if (!objSectionRef.current) return
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return
      observer.disconnect()
      setTimeout(() => {
        setObjFlipped(prev => { const n = [...prev]; n[0] = true; return n })
        setTimeout(() => {
          setObjFlipped(prev => { const n = [...prev]; n[0] = false; return n })
        }, 1400)
      }, 500)
    }, { threshold: 0.4 })
    observer.observe(objSectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Carousel
  useEffect(() => {
    const imgs = ['/images/accro1.avif', '/images/accro2.avif', '/images/accro3.avif', '/images/accro4.avif', '/images/accro5.avif', '/images/accro6.avif']
    const track = trackRef.current
    if (!track) return
    imgs.concat(imgs).forEach(src => {
      const card = document.createElement('div'); card.className = 'abri-screen-card'
      const img = document.createElement('img'); img.src = src; img.draggable = false
      card.appendChild(img); track.appendChild(card)
    })
    let pos = 0, paused = false, halfWidth = 0, rafId
    function calcWidths() { let w = 0; track.querySelectorAll('.abri-screen-card').forEach(c => { w += c.offsetWidth + 20 }); halfWidth = w / 2 }
    function step() { if (!paused) { pos += 0.7; if (pos >= halfWidth) pos -= halfWidth; track.style.transform = 'translateX(-' + pos + 'px)' } rafId = requestAnimationFrame(step) }
    function tryStart() { calcWidths(); if (halfWidth > 0) rafId = requestAnimationFrame(step); else setTimeout(tryStart, 100) }
    tryStart()
    const wrap = carouselRef.current
    if (!wrap) return
    wrap.addEventListener('mousedown', () => { paused = true })
    wrap.addEventListener('mouseup', () => { paused = false })
    wrap.addEventListener('mouseleave', () => { paused = false })
    let t = null
    wrap.addEventListener('touchstart', () => { t = setTimeout(() => { paused = true }, 150) }, { passive: true })
    wrap.addEventListener('touchmove', () => { clearTimeout(t); paused = false }, { passive: true })
    wrap.addEventListener('touchend', () => { clearTimeout(t); paused = false }, { passive: true })
    return () => { cancelAnimationFrame(rafId); track.innerHTML = '' }
  }, [])

  // iPhone animation
  useEffect(() => {
    const msgIds = ['abri-m1', 'abri-m2', 'abri-m3', 'abri-m4', 'abri-t1', 'abri-t2']
    const steps = [
      { show: 'abri-m1', delay: 600 }, { show: 'abri-t1', delay: 2000 },
      { hide: 'abri-t1', show: 'abri-m2', delay: 4500 }, { show: 'abri-m3', delay: 7000 },
      { show: 'abri-t2', delay: 8800 }, { hide: 'abri-t2', show: 'abri-m4', delay: 12000 },
      { restart: true, delay: 17000 }
    ]
    let timers = []
    function showEl(id) {
      const el = document.getElementById(id); if (!el) return
      el.style.display = 'flex'; el.style.flexDirection = 'column'
      setTimeout(() => {
        const b = el.querySelector('.bubble'); const t = el.querySelector('.typing')
        if (b) b.classList.add('show'); if (t) t.classList.add('show')
        const msgs = document.getElementById('abri-msgs'); if (msgs) msgs.scrollTop = 9999
      }, 30)
    }
    function hideEl(id) {
      const el = document.getElementById(id); if (!el) return
      el.style.display = 'none'
      const b = el.querySelector('.bubble'); const t = el.querySelector('.typing')
      if (b) b.classList.remove('show'); if (t) t.classList.remove('show')
    }
    function reset() {
      msgIds.forEach(hideEl)
      const msgs = document.getElementById('abri-msgs'); if (msgs) msgs.scrollTop = 0
      timers.push(setTimeout(() => run(), 800))
    }
    function run() {
      timers = steps.map(s => setTimeout(() => {
        if (s.restart) { reset(); return }
        if (s.hide) hideEl(s.hide)
        if (s.show) showEl(s.show)
      }, s.delay))
    }
    run()
    return () => timers.forEach(clearTimeout)
  }, [])

  function scrollToPaiement() {
    paiementRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function toggleQuiz(index) {
    setCheckedItems(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  function toggleFaq(index) {
    if (openFaq === index) { setOpenFaq(null); return }
    setOpenFaq(index)
    setTimeout(() => {
      const items = document.querySelectorAll('.faq-item')
      const item = items[index]
      if (!item) return
      const stickyBar = document.getElementById('sticky-bar-el')
      const barH = stickyIsVisible.current && stickyBar ? stickyBar.offsetHeight : 0
      const bottom = item.getBoundingClientRect().bottom
      const gap = bottom - (window.innerHeight - barH - 16)
      if (gap > 0) window.scrollBy({ top: gap, behavior: 'smooth' })
    }, 320)
  }

  async function handlePay() {
    setPayError('')
    if (!isValidEmail(email)) { setPayError('Entre ton adresse email valide.'); return }
    if (!elementsRef.current || !stripeRef.current) { setPayError('Le formulaire de paiement n\'est pas encore chargé.'); return }
    setPaying(true)
    const submitResult = await elementsRef.current.submit()
    if (submitResult.error) { setPayError(submitResult.error.message); setPaying(false); return }
    try {
      const res = await fetch(WORKER_URL + '/create-payment-intent', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profil: 'accro', email, bump: addBump, bump2: addBump2 })
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

  const checkedCount = checkedItems.size

  return (
    <>
      <div className="card">
        <span className="profil-tag">Résultat du quiz · Ton profil</span>

        <h1>
          Tu es une{' '}
          <em>
            <span className="underline-wave">
              Amoureuse Accro
              <svg className="wave-svg" viewBox="0 0 100 7" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,3 Q50,7 100,3" stroke="#660A43" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
            </span>.
          </em>
          <br />Et tu le savais déjà.
        </h1>

        <div className="narrative fade-section">
          <p>Tu viens de finir ce quiz. Et quelque part, tu n'es pas vraiment surprise par le résultat.</p>
          <p>Parce que tu le vis depuis longtemps.</p>
          <p>Cette façon de t'emballer pour quelqu'un en quelques jours. De commencer à imaginer une histoire avant même qu'elle existe vraiment. De surveiller ton téléphone sans vraiment te l'avouer.</p>
          <p>Et quand il répond moins vite. Quand le ton change un peu. Quand il y a un silence de trop, <strong>ton cerveau s'allume.</strong> Tu analyses. Tu cherches une explication. Tu espères que c'est rien.</p>
          <p>T'as pas besoin qu'on te l'explique. Tu sais exactement de quoi on parle.</p>
          <p>De l'extérieur, tout a l'air sous contrôle. Tu es intelligente, autonome, tu gères ta vie.</p>
          <p>Mais à l'intérieur, il y a souvent cette pensée qui revient : <em>« Pourquoi ça recommence toujours pareil? »</em></p>
          <p>Tu rencontres quelqu'un. Il y a de l'intensité, de la connexion, quelque chose de fort. Tu te dis que cette fois, c'est différent.</p>
          <p>Et puis… quelque chose se répète. Pas exactement la même histoire. Pas exactement le même homme. Mais toujours le même goût à la fin. <strong>Une distance. Un silence. Une blessure familière.</strong></p>
          <p>Alors tu te demandes : est-ce que c'est moi qui choisis mal? Est-ce que j'attire toujours le même type? Ou est-ce que le problème, c'est moi?</p>
          <p><strong>Le problème, ce n'est pas toi.</strong></p>
          <p>C'est que personne ne t'a jamais montré comment ton système d'attachement fonctionne. Pourquoi tu t'accroches si vite. Pourquoi l'intensité te rassure au lieu de t'alerter. Pourquoi tu confonds <strong>l'espoir d'une relation</strong> avec une relation réelle.</p>
          <p>Une fois que tu comprends ça, vraiment, quelque chose change. Tu ne deviens pas froide. Tu ne te fermes pas. Tu deviens simplement <em>plus libre.</em></p>
          <p>Libre de ne plus courir après quelqu'un qui avance à moitié. Libre de reconnaître très tôt quand tu donnes trop à quelqu'un qui donne trop peu. Libre d'aimer sans te consumer.</p>
          <p>C'est exactement ce que j'ai écrit dans cet e-book.</p>
        </div>
        <div ref={narrativeEndRef} id="narrative-end" />

        <button className="cta-scroll" onClick={scrollToPaiement}>
          Je choisis de comprendre → 17€
        </button>

        {/* QUIZ */}
        <div className="quiz-section fade-section">
          <p className="quiz-intro">Est-ce que tu te reconnais là-dedans?</p>
          <p className="quiz-sub">Coche ce qui te parle.</p>
          {QUIZ_ITEMS.map((text, i) => (
            <div key={i} className={`quiz-card${checkedItems.has(i) ? ' checked' : ''}`} onClick={() => toggleQuiz(i)}>
              <div className="quiz-check">
                <svg viewBox="0 0 12 10" fill="none"><polyline points="1,5 4.5,8.5 11,1"/></svg>
              </div>
              <p className="quiz-text">{text}</p>
            </div>
          ))}
          {checkedCount > 0 && (
            <div className="quiz-conclusion visible">
              <p dangerouslySetInnerHTML={{ __html: QUIZ_MESSAGES[checkedCount] + ' <strong>Cet e-book a été écrit pour toi.</strong>' }} />
              <a href="#paiement" onClick={e => { e.preventDefault(); scrollToPaiement() }}>Je veux mon e-book → 17€</a>
            </div>
          )}
        </div>

        {/* SI TU NE CHANGES RIEN */}
        <div className="inaction-section fade-section">
          <p className="inaction-title">Si tu ne changes rien…</p>
          <div className="inaction-list">
            {[
              "Tu continueras à perdre des heures dans des conversations qui se terminent en silence.",
              "Tu continueras à te demander : « Est-ce que le problème, c'est moi ? »",
              "Tu continueras à sur-analyser des messages qui n'ont aucune vraie intention.",
              "Tu continueras à baisser tes standards en espérant que cette fois, ça sera différent.",
            ].map((item, i) => (
              <div key={i} className="inaction-item">
                <span className="inaction-dot">💔</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
          <p className="inaction-conclusion">Pas parce qu'il y a quelque chose qui cloche chez toi. Parce que tu avances sans carte.</p>
          <button className="cta-scroll" onClick={scrollToPaiement}>Je veux comprendre → 17€</button>
        </div>

        {/* LIVRE POUR TOI / PAS POUR TOI */}
        <div className="book-section fade-section">
          <div className="book-wrap">
            <div className="book-spine" />
            <div className="book-pages">
              <div className="book-pg-stack book-pg-stack-4" />
              <div className="book-pg-stack book-pg-stack-3" />
              <div className="book-pg-stack book-pg-stack-2" />
              <div className="book-pg-stack book-pg-stack-1" />

              {/* Page derrière — Pour toi si */}
              <div
                className="book-pg-back"
                onTouchStart={e => {
                  if (!flipped) return
                  flipBackDragRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY, direction: null, triggered: false }
                }}
                onTouchMove={e => {
                  if (!flipped) return
                  const d = flipBackDragRef.current
                  if (d.triggered || d.direction === 'vertical') return
                  const dx = e.touches[0].clientX - d.startX
                  const dy = Math.abs(e.touches[0].clientY - d.startY)
                  if (Math.abs(dx) < 8 && dy < 8) return
                  if (!d.direction) d.direction = dy > Math.abs(dx) ? 'vertical' : 'horizontal'
                  if (d.direction === 'horizontal' && dx > 25) { d.triggered = true; setFlipped(false) }
                }}
              >
                <div className="book-page-rule" />
                <div className="book-back-header" style={{ visibility: flipped ? 'visible' : 'hidden' }}>
                  <p className="book-cover-subtitle book-cover-subtitle--back">Ce livre est fait pour toi si…</p>
                  <button className="book-btn-back" onClick={() => setFlipped(false)}>
                    <div className="book-peek-arrow">
                      <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
                        <path d="M7 2l-4 5 4 5" stroke="#660A43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>
                </div>
                {[
                  "Tu retombes dans le même schéma, même quand tu te promets « cette fois ce sera différent. »",
                  "Tu t'attaches trop vite, puis tu attends, analyses, espères, et tu t'épuises doucement.",
                  "Tu sur-analyses les messages et les silences parce que tu ne sais plus ce qui est réel.",
                  "Tu veux des repères clairs pour reconnaître un vrai intérêt et arrêter de vivre dans le doute.",
                  "Tu ne veux plus perdre ton temps et ton cœur dans des relations qui n'avancent pas.",
                  "Tu veux revenir à toi : plus de calme, plus de clarté, et savoir ce que tu fais.",
                ].map((text, i) => (
                  <div key={i} className="book-item">
                    <span className="book-item-icon">✓</span>
                    <span className="book-item-text">{text}</span>
                  </div>
                ))}
                <button className="book-btn-cta" onClick={scrollToPaiement}>
                  Je veux mon e-book → 17€
                </button>
              </div>

              {/* Page devant — Pas pour toi si */}
              <div
                className={`book-pg-front${flipped ? ' flipped' : ''}`}
                onTouchStart={e => {
                  if (flipped) return
                  flipDragRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY, direction: null, triggered: false }
                }}
                onTouchMove={e => {
                  if (flipped) return
                  const d = flipDragRef.current
                  if (d.triggered || d.direction === 'vertical') return
                  const dx = d.startX - e.touches[0].clientX
                  const dy = Math.abs(e.touches[0].clientY - d.startY)
                  if (Math.abs(dx) < 8 && dy < 8) return
                  if (!d.direction) d.direction = dy > Math.abs(dx) ? 'vertical' : 'horizontal'
                  if (d.direction === 'horizontal' && dx > 25) { d.triggered = true; setFlipped(true) }
                }}
              >
                <div className="book-face-front">
                  <div className="book-cover-top">
                    <p className="book-cover-series">Abrilove · E-book</p>
                    <h3 className="book-cover-main-title">Accro aux<br/>mauvais hommes</h3>
                  </div>
                  <div className="book-cover-divider" />
                  <p className="book-cover-subtitle">Ce livre n'est pas fait pour toi si…</p>
                  {[
                    "Tu veux « le faire changer » ou trouver la phrase parfaite pour qu'il devienne sérieux.",
                    "Tu n'as aucune envie de regarder tes propres schémas, parce que c'est toujours « la faute des hommes ».",
                    "Tu veux rester dans le doute plutôt qu'apprendre à voir clair, même si ça fait un peu mal au début.",
                  ].map((text, i) => (
                    <div key={i} className="book-item">
                      <span className="book-item-icon">✕</span>
                      <span className="book-item-text">{text}</span>
                    </div>
                  ))}
                  <button className="book-btn-flip" onClick={() => setFlipped(true)}>
                    Par contre, c'est pour toi si… →
                  </button>
                </div>
                <div className="book-face-back">
                  <div className="book-face-back-content">
                    <p className="book-testimonial-text">"Premier livre qui m'explique vraiment pourquoi je m'accroche. J'ai pleuré au chapitre 3 mais c'était libérateur."</p>
                    <p className="book-testimonial-author">Inès, 29 ans</p>
                  </div>
                </div>
              </div>

              {/* Peek tab droite */}
              {!flipped && (
                <div className="book-peek-tab" onClick={() => setFlipped(true)}>
                  <div className="book-peek-arrow">
                    <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
                      <path d="M3 2l4 5-4 5" stroke="#660A43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BÉNÉFICES */}
        <div className="benefits-section fade-section">
          <p className="benefits-title">Concrètement, après ce livre…</p>
          {[
            "Tu arrêtes de perdre des heures à analyser ses messages, tu lis les intentions, pas les mots.",
            "Tu reconnais très tôt quand tu donnes trop à quelqu'un qui donne trop peu.",
            "Tu dates avec plus de calme, moins de doute, et sans cette tension permanente.",
            "Tu n'attends plus d'être choisie. Tu choisis.",
          ].map((text, i) => (
            <div key={i} className="benefits-item">
              <span className="benefits-check">✓</span>
              <p>{text}</p>
            </div>
          ))}
        </div>

        {/* OBJECTIONS */}
        <div className="obj-section fade-section" ref={objSectionRef}>
          <p className="obj-title">Tu te demandes peut-être…</p>
          <p className="obj-hint"><span>👇</span> Touche une carte pour voir la réponse</p>
          <div className="obj-grid">
            {OBJECTIONS.map((obj, i) => (
              <div
                key={i}
                className={`obj-card${objFlipped[i] ? ' flipped' : ''}`}
                onClick={() => setObjFlipped(prev => { const n = prev.map(() => false); n[i] = !prev[i]; return n })}
              >
                <div className="obj-front">
                  <p><span className="obj-q">«</span> {obj.front}&nbsp;<span className="obj-q">»</span></p>
                  <div className="obj-flip-hint">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#660A43" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
                    </svg>
                  </div>
                </div>
                <div className="obj-back">
                  <p>{obj.back}</p>
                  <div className="obj-flip-hint obj-flip-hint--back">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CAROUSEL */}
        <p className="carousel-title fade-section">Elles aussi étaient à ta place.</p>
        <div className="abri-track-wrap fade-section" ref={carouselRef}>
          <div className="abri-track" ref={trackRef} />
        </div>

        {/* TABLE DES MATIÈRES */}
        <div className="toc-section fade-section">
          <div className="toc-header">
            <div className="toc-header-left">
              <span className="toc-eyebrow">Sommaire</span>
              <h2 className="toc-heading">Ce que tu vas découvrir.</h2>
              <span className="toc-badge">10 chapitres</span>
            </div>
          </div>
          <div className="toc-list">
            {TOC_ITEMS.slice(0, 3).map((title, i) => (
              <div key={i} className="toc-item">
                <span className="toc-num">{String(i + 1).padStart(2, '0')}</span>
                <p className="toc-chapter">{title}</p>
              </div>
            ))}
            <div className={`toc-hidden${tocExpanded ? ' open' : ''}`}>
              <div>
                {TOC_ITEMS.slice(3).map((title, i) => (
                  <div key={i} className="toc-item" style={{ animationDelay: `${i * 0.06}s` }}>
                    <span className="toc-num">{String(i + 4).padStart(2, '0')}</span>
                    <p className="toc-chapter">{title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button className="toc-toggle-btn" onClick={() => setTocExpanded(v => !v)}>
            <span className="toc-toggle-line" />
            <span className="toc-toggle-label">{tocExpanded ? 'Réduire' : `+ ${TOC_ITEMS.length - 3} chapitres`}</span>
            <span className={`toc-toggle-arrow${tocExpanded ? ' flipped' : ''}`}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 4.5l4.5 4.5 4.5-4.5" stroke="#660A43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="toc-toggle-line" />
          </button>
          <button className="cta-scroll toc-cta" onClick={scrollToPaiement}>
            Je veux mes 10 chapitres → 17€
          </button>
        </div>

        {/* INTERRUPTEUR */}
        <div className="fade-section" style={{ marginTop: '64px' }}>
        <div className={`abri-section${toggleOn ? ' active' : ''}`} style={{ marginTop: 0 }}>
          <div className="abri-left">
            <h2>Tu as deux choix :</h2>
          </div>
          <div className="abri-right">
            <div className="abri-text-wrapper">
              <div className="abri-text-off">
                <p>Continuer à <strong>analyser ses messages, attendre, douter…</strong></p>
                <p className="abri-ou">ou tu peux <strong>actionner l'interrupteur…</strong></p>
              </div>
              <div className="abri-text-on">
                <p>et comprendre enfin pourquoi tu t'accroches, et comment arrêter. C'est exactement ce que cet e-book t'apporte.</p>
              </div>
            </div>
            <button className={`abri-toggle${toggleOn ? ' on' : ''}`} onClick={() => setToggleOn(v => !v)} aria-label="Activer">
              <div className="abri-toggle-knob" />
            </button>
            <button className="abri-cta-ebook" onClick={scrollToPaiement}>
              Je veux mon e-book → 17€
            </button>
          </div>
        </div>
        </div>

        {/* PAIEMENT */}
        <div className="payment-block fade-section" ref={paiementRef} id="paiement">
          <span className="offer-label">✦ Offre réservée · résultats du quiz</span>
          <div className="payment-book-row">
            <div className="payment-book-details">
              <h2>{addBump && addBump2 ? 'Pack 3 e-books' : addBump ? 'Accro aux mauvais hommes + Applis de rencontre' : addBump2 ? 'Accro aux mauvais hommes + Tu t\'es encore fait ghoster' : 'Accro aux mauvais hommes'}</h2>
              <p className="offer-sub">{(addBump || addBump2) ? `${1 + (addBump ? 1 : 0) + (addBump2 ? 1 : 0)} e-books · PDF envoyés immédiatement par mail · Mises à jour à vie` : '~200 pages · PDF envoyé immédiatement par mail · Mises à jour à vie'}</p>
            </div>
            <img src="/images/accro-cover.avif" alt="Accro aux mauvais hommes" className="payment-book-img" width="72" height="113" />
          </div>
          <div className="price-row">
            <span className="price-current">{17 + (addBump ? 9 : 0) + (addBump2 ? 9 : 0)}€</span>
            <span className="price-old">{34 + (addBump ? 34 : 0) + (addBump2 ? 18 : 0)}€</span>
          </div>
          <p className="price-note">Paiement unique · Accès à vie</p>
          <div className="timer-row">
            ⏳ Offre disponible pendant <span className="timer-display">{timerText}</span>
          </div>

          {!showSuccess && !showPopup && (
            <>
              <label className="field-label" htmlFor="email-field">Email · pour recevoir ton PDF</label>
              <input type="email" id="email-field" className="field-input" placeholder="ton@email.fr" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
              {stripeSkeleton && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                  <div className="stripe-skeleton-bar" />
                  <div className="stripe-skeleton-bar" />
                </div>
              )}
              <div id="payment-element" />
              <div className={`order-bump${addBump ? ' selected' : ''}`} onClick={() => setAddBump(v => !v)}>
                <p className="order-bump-title">Ajoute <strong>« Comment trouver l'amour sur les applications de rencontre »</strong></p>
                <div className="order-bump-row">
                  <div className="order-bump-check">
                    {addBump && <svg viewBox="0 0 12 10" fill="none"><polyline points="1,5 4.5,8.5 11,1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <div className="order-bump-content">
                    <p className="order-bump-sub">Un e-book de 250 pages pour transformer ton approche du dating, sans perdre ton temps ni te perdre en chemin.</p>
                    <p className="order-bump-price"><span className="order-bump-old">34€</span> → <strong>+9€ seulement</strong></p>
                  </div>
                  <img src="/images/dating.avif" alt="Applis de rencontre" className="order-bump-img" width="52" height="68" />
                </div>
              </div>

              <div className={`order-bump${addBump2 ? ' selected' : ''}`} onClick={() => setAddBump2(v => !v)}>
                <p className="order-bump-title">Ajoute <strong>« Tu t'es encore fait ghoster »</strong></p>
                <div className="order-bump-row">
                  <div className="order-bump-check">
                    {addBump2 && <svg viewBox="0 0 12 10" fill="none"><polyline points="1,5 4.5,8.5 11,1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <div className="order-bump-content">
                    <p className="order-bump-sub">Comprendre pourquoi tu as été ghostée, guérir le rejet, et poser les bases d'un amour sain.</p>
                    <p className="order-bump-price"><span className="order-bump-old">18€</span> → <strong>+9€ seulement</strong></p>
                  </div>
                  <img src="/images/ghosting.avif" alt="Tu t'es encore fait ghoster" className="order-bump-img" width="52" height="68" />
                </div>
              </div>

              {payError && <div className="payment-errors">{payError}</div>}
              <button className="btn-pay" disabled={paying} onClick={handlePay}>
                <span>{paying ? 'Traitement...' : (addBump && addBump2 ? 'Obtenir mes 3 e-books →' : (addBump || addBump2) ? 'Obtenir mes 2 e-books →' : 'Obtenir mon e-book →')}</span>
                {paying && <div className="spinner" />}
              </button>
              <div className="secure-note">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Paiement sécurisé · PDF envoyé immédiatement
              </div>
            </>
          )}
        </div>

        {/* BLOC IA */}
        <div className="fade-section" style={{ marginTop: '72px' }}>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: '22px', fontWeight: 700, color: '#660A43', marginBottom: '16px', lineHeight: 1.3 }}>Tu as une question avant de te décider?</h3>
              <p style={{ marginBottom: '20px' }}>Tu analyses ses messages depuis des heures. Tu sais pas si tu dois lui écrire. Tu te demandes si tu t'accroches trop ou si c'est lui le problème.</p>
              <p style={{ marginBottom: '24px' }}>Pose ta question, tu reçois une réponse en quelques secondes, maintenant, peu importe l'heure. Des milliers d'heures de coaching en relations amoureuses, disponibles pour toi instantanément.</p>
              <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                <div style={{ position: 'absolute', top: '-12px', right: '12px', background: '#FFF1E7', color: '#660A43', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', whiteSpace: 'nowrap', border: '1.5px solid #660A43' }}>7 premiers messages offerts</div>
                <a href="https://ia.abrilove.fr" target="_blank" rel="noreferrer" style={{ display: 'block', width: '100%', padding: '14px', background: '#660A43', color: 'white', borderRadius: '12px', fontFamily: "var(--font-dm-sans), sans-serif", fontSize: '15px', fontWeight: 600, textDecoration: 'none', boxSizing: 'border-box', textAlign: 'center' }}>Poser ma question maintenant →</a>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--brun2)', opacity: 0.6, marginTop: '8px', textAlign: 'center' }}>Sans carte bancaire</p>
            </div>
            <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '280px', margin: '0 auto' }}>
              <div className="iphone">
                <div className="status-bar">
                  <span>9:41</span>
                  <div className="dynamic-island" />
                  <span>●●●</span>
                </div>
                <div className="chat-header">
                  <span className="back">‹</span>
                  <div className="avatar"><img src="https://cdn.prod.website-files.com/686bb5337ed61a425660e143/69b163fc41e69155b8609953_Copie%20de%20Copie%20de%20Copie%20de%20Copie%20de%20Blue%20and%20Pink%20Soft%20Magazine%20Cover%20Mockup%20Instagram%20Post%20(6).avif" alt="Sofi & Oli" /></div>
                  <div className="info">
                    <div className="name">Sofi & Oli, Abrilove</div>
                    <div className="online">● En ligne</div>
                  </div>
                </div>
                <div className="messages" id="abri-msgs">
                  <div className="row" id="abri-m1" style={{ alignItems: 'flex-end', display: 'none' }}><div className="bubble bubble-u">Il me laisse en vu depuis 2 jours… 😞</div></div>
                  <div className="row" id="abri-t1" style={{ display: 'none' }}><div className="typing"><span /><span /><span /></div></div>
                  <div className="row" id="abri-m2" style={{ alignItems: 'flex-start', display: 'none' }}><div className="sender">Sofi & Oli 💛</div><div className="bubble bubble-a">C'est nouveau chez lui ou il l'a déjà fait avant?</div></div>
                  <div className="row" id="abri-m3" style={{ alignItems: 'flex-end', display: 'none' }}><div className="bubble bubble-u">Jamais… 😔</div></div>
                  <div className="row" id="abri-t2" style={{ display: 'none' }}><div className="typing"><span /><span /><span /></div></div>
                  <div className="row" id="abri-m4" style={{ alignItems: 'flex-start', display: 'none' }}><div className="sender">Sofi & Oli 💛</div><div className="bubble bubble-a">Les hommes se retirent rarement par indifférence. Voilà quoi faire 👇</div></div>
                </div>
                <div className="input-bar">
                  <div className="input-field">Écris ta situation…</div>
                  <div className="send-btn"><svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="fade-section" style={{ marginTop: '72px' }}>
          <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: '20px', fontWeight: 700, color: '#660A43', marginBottom: '20px', textAlign: 'center' }}>Questions fréquentes</h3>
          <div className="faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="faq-item">
                <button className={`faq-q${openFaq === i ? ' open' : ''}`} onClick={() => toggleFaq(i)}>
                  {item.q}
                  <span className="faq-icon">+</span>
                </button>
                <div className={`faq-a${openFaq === i ? ' open' : ''}`}>
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STICKY BAR */}
      <div id="sticky-bar-el" className={`sticky-bar${stickyAnimating ? ' animating' : ''}${stickyVisible ? ' visible' : ''}`}>
        <div className="sticky-bar-text">
          Accro aux mauvais hommes
          <span>E-book · PDF immédiat · 17€</span>
        </div>
        <button className="sticky-bar-btn" onClick={scrollToPaiement}>Obtenir → 17€</button>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div style={{ background: '#FFF1E7', borderRadius: '20px', padding: '28px 24px', maxWidth: '360px', width: '100%', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎉</div>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: '20px', fontWeight: 700, color: '#660A43', margin: '0 0 6px' }}>Ton e-book est en route !</h2>
            <p style={{ fontSize: '13px', color: '#5C3D2A', margin: '0 0 20px', lineHeight: 1.5 }}>Vérifie ta boîte mail, pense à checker tes spams.</p>
            <div style={{ background: '#fdf0f7', borderRadius: '14px', padding: '16px', marginBottom: '20px', textAlign: 'left' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#660A43', margin: '0 0 8px', fontFamily: "var(--font-playfair), serif" }}>Et si tu voulais aller plus loin?</p>
              <p style={{ fontSize: '13px', color: '#5C3D2A', lineHeight: 1.6, margin: '0 0 10px' }}>Nous, Sofi & Oli, on a condensé des milliers d'heures de coaching en relations amoureuses dans <strong style={{ color: '#660A43' }}>l'Abri</strong>, notre IA. Tu poses ta question, elle comprend ta situation, et te répond en quelques secondes, 24h/24.</p>
              <p style={{ fontSize: '13px', color: '#5C3D2A', lineHeight: 1.6, margin: 0 }}>Un message qui te tracasse, un schéma qui revient, une situation avec un homme que tu n'arrives pas à décoder, <strong style={{ color: '#660A43' }}>l'Abri</strong> est là maintenant 🩷</p>
            </div>
            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
              <div style={{ position: 'absolute', top: '-12px', right: '12px', background: '#FFF1E7', color: '#660A43', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', whiteSpace: 'nowrap', border: '1.5px solid #660A43' }}>7 messages offerts</div>
              <a href="https://ia.abrilove.fr" style={{ display: 'block', width: '100%', padding: '14px', background: '#660A43', color: 'white', borderRadius: '12px', fontFamily: "var(--font-dm-sans), sans-serif", fontSize: '15px', fontWeight: 600, textDecoration: 'none', boxSizing: 'border-box' }}>Commencer gratuitement →</a>
            </div>
            <div style={{ marginTop: '12px' }}>
              <a href="https://abrilove.fr" style={{ fontSize: '12px', color: '#5C3D2A', textDecoration: 'underline', fontFamily: "var(--font-dm-sans), sans-serif" }}>Retour au site</a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
