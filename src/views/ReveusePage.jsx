'use client'
import { useState, useEffect, useRef } from 'react'
import { trackEvent, useScrollTracking } from '../utils/analytics'

const OBJECTIONS = [
  {
    front: "C'est trop cher.",
    back: "17€, c'est le prix d'un déjeuner. L'énergie perdue à attendre quelqu'un qui ne te choisit pas clairement, elle, elle a un prix."
  },
  {
    front: "J'ai déjà tout essayé.",
    back: "T'as peut-être essayé d'attendre encore. Pas de comprendre pourquoi tu confonds espoir et engagement. C'est ça que ce livre t'apporte, une méthode concrète, pas un texte motivationnel."
  },
  {
    front: "Je n'ai pas le temps.",
    back: "Chez une Rêveuse, « pas le temps » veut dire trop d'énergie donnée au flou. 10 minutes suffisent. Cet e-book ne te prend pas du temps. Il t'en rend."
  },
  {
    front: "Je connais déjà mes schémas.",
    back: "Connaître ses schémas et comprendre pourquoi tu restes dans l'attente, c'est pas la même chose. La deuxième, c'est ce qui change vraiment."
  },
]

const WORKER_URL = 'https://abrilove-oto-worker.sofiane-daboussi.workers.dev'
const PK = 'pk_live_51Rm9dBI8ilInoMaXKDs2hp5pR1Fq3fcK60MlclXizEDZZxFAUN92E6jpKjILZX0dHtO7gUa3KMfQZKchX6qaPIi8003ZsII2e7'

const QUIZ_ITEMS = [
  "Tu es sensible et romantique… mais tu t'accroches vite à un « peut-être », parce que ton cœur veut croire que « ça va finir par devenir clair ».",
  "Quand quelqu'un te plaît, tu ne vois pas seulement qui il est aujourd'hui : tu imagines ce que ça pourrait devenir, et tu commences à écrire l'histoire dans ta tête.",
  "Tu excuses le flou : « il est occupé », « il traverse une période », « il a peur », « il lui faut du temps »… et tu restes, en espérant.",
  "Tu as du mal à demander de la clarté, parce que tu as peur d'être « trop », de « mettre la pression » ou de faire fuir.",
  "Quand il y a des silences ou des messages irréguliers, ton mental cherche des signes, et ton cœur attend la prochaine preuve.",
  "Quand ça n'avance pas, tu ne fais pas de drame : tu doutes en silence et tu te demandes si tu n'en demandes pas trop, alors que tu demandes juste du clair.",
  "Tu t'adaptes pour que ça marche : tu es compréhensive, légère, « facile », en espérant que ça se transforme enfin en quelque chose de vrai.",
  "Il t'arrive de penser : « Pourquoi je finis toujours dans des histoires 'presque' ? » et tu sens que tu mérites mieux, mais tu ne sais plus comment sortir de l'attente.",
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
  "Quand ton esprit écrit l'histoire avant la relation",
  "Pourquoi le flou t'attache plus que la clarté",
  "Ce que tu protèges vraiment en attendant",
  "Ton faux rythme : quand tu avances sans bouger",
  "Les hommes que tu choisis quand tu espères",
  "Le cycle de l'attente (et comment tu t'y enfermes)",
  "Les hommes clairs (et pourquoi ils te font peur)",
  "Créer un lien sans attendre qu'il change",
  "Rester ouverte sans vivre dans l'espoir",
  "Aimer sans te perdre dans le futur",
]

const FAQ_ITEMS = [
  { q: "L'accès aux contenus est-il permanent ?", a: "L'accès aux contenus est à vie." },
  { q: "Puis-je lire l'e-book à mon rythme ?", a: "Oui. Chaque chapitre peut être lu séparément, à ton propre rythme. Ce n'est pas un livre « à lire de A à Z », mais un guide pratique auquel tu peux revenir quand tu en as besoin." },
  { q: "Comment je reçois mon e-book ?", a: "Après le paiement, le fichier PDF sera envoyé automatiquement à ton adresse e-mail. Pense à vérifier ton dossier « Spam » ou « Promotions » si tu ne le vois pas tout de suite." },
  { q: "Sur quels appareils puis-je le lire ?", a: "L'e-book est au format PDF, tu peux donc le lire sur ordinateur, tablette et téléphone, où que ce soit, comme c'est le plus pratique pour toi." },
  { q: "C'est juste de la théorie ?", a: "C'est avant tout de la pratique. Dans l'e-book, tu trouveras non seulement de la connaissance, mais aussi des exemples concrets de conversations, de stratégies, de messages, et même des exercices pour travailler par toi-même." },
  { q: "Le paiement est-il sécurisé ?", a: "En toute sécurité, par carte bancaire ou par virement en ligne rapide. Tout est chiffré et géré par un opérateur de paiement de confiance." },
]

function isValidEmail(e) {
  const at = e.indexOf('@')
  const dot = e.lastIndexOf('.')
  return at > 0 && dot > at + 1 && dot < e.length - 1
}

export default function ReveusePage() {
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

  const stripeRef = useRef(null)
  const elementsRef = useRef(null)

  useScrollTracking('reveuse')

  // Timer
  useEffect(() => {
    let stored; try { stored = localStorage.getItem('oto_reveuse_end') } catch {}
    let endTime = stored ? parseInt(stored) : Date.now() + 30 * 60 * 1000
    if (!stored) try { localStorage.setItem('oto_reveuse_end', endTime) } catch {}
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
      const atBottom = currentY + window.innerHeight >= document.documentElement.scrollHeight - 80
      if (diff < -5 && !atBottom) hideBar()
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
      const img = document.createElement('img'); img.src = src; img.alt = ''; img.draggable = false
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
    trackEvent('cta_click', { profil: 'reveuse' })
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
    trackEvent('purchase_attempt', { profil: 'reveuse' })
    setPaying(true)
    const submitResult = await elementsRef.current.submit()
    if (submitResult.error) { setPayError(submitResult.error.message); setPaying(false); return }
    try {
      const res = await fetch(WORKER_URL + '/create-payment-intent', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profil: 'reveuse', email, bump: addBump, bump2: addBump2 })
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
      if (confirmResult.paymentIntent?.status === 'succeeded') { trackEvent('purchase_success', { profil: 'reveuse' }); setShowPopup(true); setPaying(false) }
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
              Rêveuse en attente
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
          <p>Cette façon de t'accrocher vite à un « peut-être ». De commencer à écrire l'histoire dans ta tête avant même qu'elle existe vraiment. D'attendre la prochaine preuve qu'il est là, pour être sûre.</p>
          <p>Et quand le message tarde. Quand le ton change un peu. Quand il dit « on verra » au lieu de « oui », <strong>ton cœur attend.</strong> Tu espères. Tu excuses. Tu te dis que ça va changer.</p>
          <p>T'as pas besoin qu'on te l'explique. Tu sais exactement de quoi on parle.</p>
          <p>De l'extérieur, tout a l'air sous contrôle. Tu es intelligente, autonome, tu gères ta vie.</p>
          <p>Mais à l'intérieur, il y a souvent cette fatigue : <em>la fatigue de l'espoir.</em> D'attendre quelqu'un qui ne choisit pas clairement. De ne jamais savoir vraiment où tu en es.</p>
          <p>Et cette pensée qui revient : <em>« Est-ce qu'un jour quelqu'un sera simplement clair avec moi ? »</em></p>
          <p>Tu rencontres quelqu'un. Il y a quelque chose de prometteur, de doux, de potentiel. Tu te dis que cette fois, ce sera différent.</p>
          <p>Et puis… quelque chose se répète. Pas exactement la même histoire. Pas exactement le même homme. Mais toujours la même attente. <strong>Un « peut-être ». Un flou. Une fatigue familière.</strong></p>
          <p>Alors tu te demandes : est-ce que j'attends trop ? Est-ce que je demande trop ? Ou est-ce que le problème, c'est moi ?</p>
          <p><strong>Le problème, ce n'est pas toi.</strong></p>
          <p>C'est que personne ne t'a jamais montré comment distinguer l'espoir de l'engagement. Pourquoi tu restes dans l'attente même quand quelque chose te dit que non. Pourquoi tu confonds <strong>le potentiel d'une relation</strong> avec une relation réelle.</p>
          <p>Une fois que tu comprends ça, vraiment, quelque chose change. Tu ne deviens pas froide. Tu ne fermes pas ton cœur. Tu deviens simplement <em>plus libre.</em></p>
          <p>Libre de ne plus attendre quelqu'un qui ne choisit pas clairement. Libre de reconnaître très tôt quand le flou est une réponse en soi. Libre d'aimer sans te perdre dans l'espoir.</p>
          <p>C'est exactement ce que j'ai écrit dans cet e-book.</p>
        </div>
        <div ref={narrativeEndRef} id="narrative-end" />

        <button className="cta-scroll" onClick={scrollToPaiement}>
          Je choisis la clarté → 17€
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
              "Tu continueras à t'accrocher à des signes (un message, un « tu me manques », une soirée intense) et à en faire une histoire entière.",
              "Tu continueras à attendre que ça devienne clair, au lieu d'exiger une clarté dès le départ.",
              "Tu continueras à excuser le flou (« il a peur », « il traverse un truc », « il lui faut du temps »), et à rester.",
              "Tu continueras à te rendre plus facile, plus compréhensive, moins exigeante, en espérant que ça te « mérite » enfin.",
              "Tu continueras à douter de toi en silence : « Je demande trop ? Je suis trop ? », alors que tu demandes juste du simple : une intention, une présence, un vrai mouvement.",
              "Et ton cœur restera ouvert, mais aussi fatigué, parce qu'à force d'aimer sans être choisie clairement, tu t'épuises.",
            ].map((item, i) => (
              <div key={i} className="inaction-item">
                <span className="inaction-dot">💔</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
          <p className="inaction-conclusion">Tu t'habitues à espérer, à patienter, à « ne pas mettre la pression », et tu finis par confondre attachement et engagement. Pas parce que tu es naïve. Mais parce que personne ne t'a appris à reconnaître le flou, et à choisir la clarté sans culpabiliser.</p>
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
                  "Tu retombes dans le même schéma… même quand tu te promets : « cette fois, ce sera différent. »",
                  "Tu t'accroches à l'espoir et au potentiel : un bon rendez-vous… et ton cœur écrit la suite de l'histoire.",
                  "Tu restes dans le « peut-être » parce que tu veux donner une chance, même quand ce n'est pas clair.",
                  "Quand c'est flou, tu trouves toujours une explication : « il a peur », « il lui faut du temps ».",
                  "Tu n'oses pas demander clairement, tu t'adaptes, tu deviens « facile », en espérant que ça finira par devenir réel.",
                  "Tu veux une relation où tu es choisie clairement, sans avoir besoin de deviner.",
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
                    <h3 className="book-cover-main-title">Toujours dans<br/>l'attente qu'il change</h3>
                  </div>
                  <div className="book-cover-divider" />
                  <p className="book-cover-subtitle">Ce livre n'est pas fait pour toi si…</p>
                  {[
                    "Tu veux analyser, sans pratiquer ni changer tes réflexes.",
                    "Tu veux juste te rassurer que « ça va venir » sans changer ta façon d'agir.",
                    "Tu cherches des « phrases pour le garder », pas des outils pour te choisir.",
                    "Tu refuses de demander de la clarté parce que tu as peur de « mettre la pression ».",
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
                    <p className="book-testimonial-text">"J'ai enfin compris pourquoi je restais dans l'attente. Ce livre m'a redonné de la clarté sur ce que je veux vraiment."</p>
                    <p className="book-testimonial-author">Léa, 27 ans</p>
                  </div>
                </div>
              </div>

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
            "Tu sortiras du mode « j'attends le signe » et tu apprendras à te recentrer quand tu t'emballes, sans t'accrocher à la prochaine preuve.",
            "Tu comprendras pourquoi tu t'accroches au potentiel et comment revenir aux faits : ce qu'il fait, ce qu'il choisit, pas ce que tu espères.",
            "Tu repéreras la clarté, ou l'absence de clarté, sans décoder chaque silence ni lui trouver des excuses.",
            "Tu apprendras à demander de la clarté, poser tes limites, et choisir les hommes présents et intentionnés.",
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
                  <p>Continuer à <strong>attendre, espérer, excuser le flou…</strong></p>
                  <p className="abri-ou">ou tu peux <strong>actionner l'interrupteur…</strong></p>
                </div>
                <div className="abri-text-on">
                  <p>et comprendre pourquoi tu restes dans l'attente, et comment en sortir vraiment.</p>
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
              <h2>{addBump && addBump2 ? 'Pack 3 e-books' : addBump ? 'Toujours dans l\'attente + Applis de rencontre' : addBump2 ? 'Toujours dans l\'attente + Tu t\'es encore fait ghoster' : 'Toujours dans l\'attente qu\'il change'}</h2>
              <p className="offer-sub">{(addBump || addBump2) ? `${1 + (addBump ? 1 : 0) + (addBump2 ? 1 : 0)} e-books · PDF envoyés immédiatement par mail · Mises à jour à vie` : '~200 pages · PDF envoyé immédiatement par mail · Mises à jour à vie'}</p>
            </div>
            <img src="/images/reveuse.avif" alt="Toujours dans l'attente qu'il change" className="payment-book-img" width="72" height="113" />
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
              <p style={{ marginBottom: '20px' }}>Tu attends qu'il réponde depuis des heures. Tu sais pas si tu dois lui écrire. Tu te demandes si le flou est une réponse ou juste une mauvaise période.</p>
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
                  <div className="avatar"><img src="/images/sofi-oli-avatar.avif" alt="Sofi & Oli" width="80" height="80" /></div>
                  <div className="info">
                    <div className="name">Sofi & Oli, Abrilove</div>
                    <div className="online">● En ligne</div>
                  </div>
                </div>
                <div className="messages" id="abri-msgs">
                  <div className="row" id="abri-m1" style={{ alignItems: 'flex-end', display: 'none' }}><div className="bubble bubble-u">Il m'a dit « on verra » pour ce week-end… 😔</div></div>
                  <div className="row" id="abri-t1" style={{ display: 'none' }}><div className="typing"><span /><span /><span /></div></div>
                  <div className="row" id="abri-m2" style={{ alignItems: 'flex-start', display: 'none' }}><div className="sender">Sofi & Oli 💛</div><div className="bubble bubble-a">C'est la première fois qu'il te répond comme ça?</div></div>
                  <div className="row" id="abri-m3" style={{ alignItems: 'flex-end', display: 'none' }}><div className="bubble bubble-u">Non… il fait souvent ça 😞</div></div>
                  <div className="row" id="abri-t2" style={{ display: 'none' }}><div className="typing"><span /><span /><span /></div></div>
                  <div className="row" id="abri-m4" style={{ alignItems: 'flex-start', display: 'none' }}><div className="sender">Sofi & Oli 💛</div><div className="bubble bubble-a">Le flou répété n'est pas de la timidité. Voilà comment lire ça vraiment 👇</div></div>
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
          Toujours dans l'attente qu'il change
          <span>17€ · PDF immédiat</span>
        </div>
        <button className="sticky-bar-btn" onClick={scrollToPaiement}>Obtenir → 17€</button>
      </div>

      {/* POPUP SUCCÈS */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="success-block" onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '40px 28px', maxWidth: '360px', width: '100%' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <h3>Paiement confirmé !</h3>
            <p>Ton e-book arrive dans ta boîte mail dans quelques minutes. Pense à vérifier tes spams.</p>
          </div>
        </div>
      )}
    </>
  )
}
