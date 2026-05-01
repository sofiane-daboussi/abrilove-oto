'use client'
import { useState, useEffect, useRef, memo } from 'react'
import Header from './Header'
import Footer from './Footer'
import QuizPage from './QuizPage'

const AVATAR = '/images/hero-avatar.avif'

const HERO_WORDS = ['le ghosting.', 'le silence.', 'le doute.', "l'attachement anxieux.", "la peur d'aimer.", "l'amour non réciproque.", 'la tromperie.', 'le manque de confiance.', "l'amour qui fait mal."]

const TEMOS = [
  '/images/temo-1.avif',
  '/images/temo-2.avif',
  '/images/temo-3.avif',
  '/images/temo-4.avif',
  '/images/temo-5.avif',
  '/images/temo-6.avif',
]

const FAQ_DATA = [
  { q: 'Est-ce que les réponses sont vraiment personnalisées ?', a: 'Oui. L\'Abri IA s\'appuie sur des milliers de situations réelles accompagnées par Sofi & Oli. Ce n\'est pas une réponse générique.' },
  { q: 'Est-ce que c\'est comme parler à un coach ?', a: 'C\'est le plus proche possible. L\'IA reprend exactement leur manière d\'analyser les situations et de répondre.' },
  { q: 'Est-ce que ça remplace un accompagnement ?', a: 'L\'Abri IA t\'aide à y voir clair immédiatement. Pour aller plus loin, des coachings et programmes sont disponibles.' },
  { q: 'Et si ma situation est compliquée ou différente ?', a: 'Tu peux quand même l\'utiliser. Les dynamiques relationnelles reviennent souvent, peu importe la situation.' },
  { q: 'Je ne sais pas quoi écrire, ça marche quand même ?', a: 'Oui. Quelques lignes suffisent. Tu décris ce que tu ressens, et l\'IA t\'aide à aller plus loin.' },
  { q: 'Combien ça coûte ?', a: '3 premiers messages gratuits. Puis 4,90€ le 1er mois, puis 19,90€/mois, sans engagement.' },
  { q: 'Est-ce que c\'est confidentiel ?', a: 'Oui, tout est confidentiel. Sans jugement, rien n\'est partagé publiquement.' },
  { q: 'Est-ce que ça fonctionne même sans chercher une relation ?', a: 'Oui, que tu sois en relation, célibataire ou simplement curieuse de mieux te comprendre.' },
  { q: 'Et si je veux aller plus loin ?', a: 'Des accompagnements individuels, ateliers et contenus sont disponibles sur la plateforme.' },
  { q: 'Est-ce que ça va vraiment m\'aider ?', a: 'L\'objectif : t\'offrir un regard plus juste pour prendre de meilleures décisions. C\'est à toi d\'essayer.' },
]

const HEART_SVG = (
  <svg viewBox="0 0 160 148" fill="none">
    <path d="M80 136 C80 136 8 90 8 44 C8 22 24 8 44 8 C58 8 70 16 80 28 C90 16 102 8 116 8 C136 8 152 22 152 44 C152 90 80 136 80 136Z" fill="rgba(102,10,67,0.08)" stroke="#660A43" strokeOpacity="0.2" strokeWidth="1.5"/>
  </svg>
)

function HeartsSection() {
  const ref = useRef(null)
  const n1 = useRef(null)
  const n2 = useRef(null)
  const n3 = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function count(spanRef, target, duration) {
      const span = spanRef.current
      if (!span) return
      const step = target / (duration / 16)
      let val = 0
      const t = setInterval(() => {
        val += step
        if (val >= target) { val = target; clearInterval(t) }
        span.textContent = Math.floor(val).toLocaleString('fr-FR')
      }, 16)
    }

    function start() {
      el.querySelectorAll('.abri-heart-item').forEach((item, i) => {
        setTimeout(() => item.classList.add('visible'), i * 200)
      })
      count(n1, 11400, 2000)
      setTimeout(() => count(n2, 89300, 2200), 200)
      setTimeout(() => count(n3, 100, 1800), 400)
    }

    let done = false
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done) { done = true; start() }
    }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section style={{ background: '#FFF4F7', padding: 'clamp(32px,4vw,56px) clamp(32px,5vw,80px)' }}>
      <div data-fade style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 60 }} className="hp-2cols">
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#660A43', fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 24 }}>
            Ce que tu vis a du sens.
          </h2>
          <p style={{ color: '#5a3040', fontSize: 'clamp(15px,1.8vw,18px)', lineHeight: 1.85, marginBottom: 36 }}>
            Que tu sois perdue, attachée, en train de douter, ou simplement fatiguée de revivre les mêmes situations… Il y a toujours quelque chose derrière. Des dynamiques. Des schémas. Des choses que tu ressens… sans forcément réussir à les expliquer.<br /><br />
            Et plus tu comprends ce qui se joue vraiment, plus tu reprends le contrôle.
          </p>
          <a href="https://ia.abrilove.fr" target="_blank" rel="noopener noreferrer" className="hp-btn-dark">Comprendre ma situation →</a>
        </div>
        <div style={{ flex: 1 }}>
          <div className="abri-hearts" ref={ref}>
            <div className="abri-heart-item">
              <div className="abri-heart-svg-wrap" style={{ animationDelay: '0s' }}>
                {HEART_SVG}
                <div className="abri-heart-text">
                  <div className="abri-heart-num"><span ref={n1}>0</span></div>
                </div>
              </div>
              <div className="abri-heart-label">femmes<br />accompagnées</div>
            </div>
            <div className="abri-heart-item">
              <div className="abri-heart-svg-wrap" style={{ animationDelay: '0.3s' }}>
                {HEART_SVG}
                <div className="abri-heart-text">
                  <div className="abri-heart-num"><span ref={n2}>0</span></div>
                </div>
              </div>
              <div className="abri-heart-label">questions<br />répondues</div>
            </div>
            <div className="abri-heart-item">
              <div className="abri-heart-svg-wrap" style={{ animationDelay: '0.6s' }}>
                {HEART_SVG}
                <div className="abri-heart-text">
                  <div className="abri-heart-num"><span ref={n3}>0</span><span style={{ fontSize: 22, color: '#660A43' }}>%</span></div>
                </div>
              </div>
              <div className="abri-heart-label">nous<br />recommandent</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TemuSection() {
  const trackRef = useRef(null)
  const wrapRef = useRef(null)
  const posRef = useRef(0)
  const pausedRef = useRef(false)
  const rafRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    const wrap = wrapRef.current
    if (!track || !wrap) return

    let halfWidth = 0

    function calcWidths() {
      const cards = track.querySelectorAll('.abri-screen-card')
      let total = 0
      cards.forEach(c => { total += c.offsetWidth + 20 })
      halfWidth = total / 2
    }

    function step() {
      if (!pausedRef.current) {
        posRef.current += 0.7
        if (posRef.current >= halfWidth) posRef.current -= halfWidth
        track.style.transform = 'translateX(-' + posRef.current + 'px)'
      }
      rafRef.current = requestAnimationFrame(step)
    }

    function startCarousel() { calcWidths(); rafRef.current = requestAnimationFrame(step) }

    function onLoad() {
      const ref = new Image()
      ref.onload = () => {
        const cardWidth = Math.round(ref.naturalWidth * 340 / ref.naturalHeight)
        track.querySelectorAll('.abri-screen-card').forEach(c => { c.style.width = cardWidth + 'px' })
        startCarousel()
      }
      ref.onerror = startCarousel
      ref.src = TEMOS[0]
    }

    if (document.readyState === 'complete') { onLoad() }
    else { window.addEventListener('load', onLoad) }

    const pause = () => { pausedRef.current = true }
    const resume = () => { pausedRef.current = false }
    let timer = null
    const touchStart = () => { timer = setTimeout(pause, 150) }
    const touchMove = () => { clearTimeout(timer); resume() }
    const touchEnd = () => { clearTimeout(timer); resume() }

    wrap.addEventListener('mousedown', pause)
    wrap.addEventListener('mouseup', resume)
    wrap.addEventListener('mouseleave', resume)
    wrap.addEventListener('touchstart', touchStart, { passive: true })
    wrap.addEventListener('touchmove', touchMove, { passive: true })
    wrap.addEventListener('touchend', touchEnd, { passive: true })
    wrap.addEventListener('touchcancel', touchEnd, { passive: true })

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('load', onLoad)
      wrap.removeEventListener('mousedown', pause)
      wrap.removeEventListener('mouseup', resume)
      wrap.removeEventListener('mouseleave', resume)
      wrap.removeEventListener('touchstart', touchStart)
      wrap.removeEventListener('touchmove', touchMove)
      wrap.removeEventListener('touchend', touchEnd)
      wrap.removeEventListener('touchcancel', touchEnd)
    }
  }, [])

  const allImgs = [...TEMOS, ...TEMOS]

  return (
    <section style={{ background: 'linear-gradient(180deg, #660A43 0%, #8a1258 50%, #660A43 100%)', padding: 'calc(clamp(24px,3vw,44px) + 80px) 0', position: 'relative' }}>
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
      <div data-fade className="temo-title-wrap" style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 20, paddingLeft: 20, paddingRight: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#FFF1E7', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, textAlign: 'center', marginBottom: 20 }}>
          Elles ont osé écrire.{' '}
          <span style={{ display: 'inline' }} className="temo-break">Voilà ce qui s'est passé.</span>
        </h2>
      </div>
      <div className="abri-track-wrap" ref={wrapRef}>
        <div className="abri-track" ref={trackRef}>
          {allImgs.map((src, i) => (
            <div key={i} className="abri-screen-card">
              <img src={src} alt="témoignage" draggable={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCounter({ target, suffix = '', label, color = '#FFF1E7', labelColor = 'rgba(255,241,231,0.55)' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      obs.disconnect()
      const start = performance.now()
      const duration = 1600
      function tick(now) {
        const p = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        const val = Math.round(eased * target)
        setCount(val)
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])
  const formatted = count >= 1000 ? Math.floor(count / 1000) + ' ' + String(count % 1000).padStart(3, '0') : String(count)
  return (
    <div ref={ref}>
      <div style={{ fontFamily: 'var(--font-playfair,serif)', fontSize: 'clamp(22px,2.5vw,34px)', fontWeight: 700, color, lineHeight: 1 }}>{formatted}{suffix}</div>
      <div style={{ fontSize: 12, color: labelColor, letterSpacing: '0.05em', marginTop: 4 }}>{label}</div>
    </div>
  )
}

const IPhoneChat = memo(function IPhoneChat() {
  const [op, setOp] = useState({ m1:0, t1:0, m2:0, m3:0, t2:0, m4:0 })
  const msgsRef = useRef(null)

  useEffect(() => {
    const timers = []

    function show(key) {
      setOp(prev => ({ ...prev, [key]: 1 }))
      if (msgsRef.current) msgsRef.current.scrollTop = 9999
    }
    function hide(key) {
      setOp(prev => ({ ...prev, [key]: 0 }))
    }
    function reset() {
      setOp({ m1:0, t1:0, m2:0, m3:0, t2:0, m4:0 })
      if (msgsRef.current) msgsRef.current.scrollTop = 0
      timers.push(setTimeout(run, 800))
    }
    function run() {
      timers.push(setTimeout(() => show('m1'), 600))
      timers.push(setTimeout(() => show('t1'), 2000))
      timers.push(setTimeout(() => { hide('t1'); show('m2') }, 4500))
      timers.push(setTimeout(() => show('m3'), 7000))
      timers.push(setTimeout(() => show('t2'), 8800))
      timers.push(setTimeout(() => { hide('t2'); show('m4') }, 12000))
      timers.push(setTimeout(reset, 17000))
    }
    run()
    return () => timers.forEach(clearTimeout)
  }, [])

  const row = (key, align, children) => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:align, opacity:op[key], transform:op[key]?'translateY(0)':'translateY(8px)', transition:'opacity 0.4s,transform 0.4s', pointerEvents:'none' }}>
      {children}
    </div>
  )

  return (
    <div className="iphone" style={{ width:260, background:'#FFF1E7', borderRadius:44, border:'11px solid #1a0812', boxShadow:'0 0 0 1px #3a1020,0 30px 70px rgba(0,0,0,0.4)', overflow:'hidden', margin:'0 auto', fontFamily:'-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif' }}>
      <div style={{ background:'#FFF1E7', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 22px 8px', fontSize:13, fontWeight:700, color:'#2a0a1a', position:'relative' }}>
        <span>9:41</span>
        <div style={{ position:'absolute', top:6, left:'50%', transform:'translateX(-50%)', width:95, height:30, background:'#1a0812', borderRadius:20 }} />
        <span>●●●</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 14px 10px', borderBottom:'1px solid rgba(102,10,67,0.1)' }}>
        <span style={{ color:'#660A43', fontSize:22, fontWeight:300 }}>‹</span>
        <div style={{ width:34, height:34, borderRadius:'50%', overflow:'hidden', flexShrink:0 }}>
          <img src={AVATAR} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="" />
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12, fontWeight:700, color:'#2a0a1a' }}>Sofi & Oli, Abrilove</div>
          <div style={{ fontSize:10, color:'#4caf50', fontWeight:500 }}>● En ligne</div>
        </div>
      </div>
      <div ref={msgsRef} style={{ padding:12, display:'flex', flexDirection:'column', gap:7, minHeight:340, background:'#FFF1E7', overflow:'hidden' }}>
        {row('m1','flex-end', <div style={{ maxWidth:'80%', padding:'9px 13px', borderRadius:'18px 18px 4px 18px', fontSize:12.5, lineHeight:1.45, background:'#660A43', color:'#fff' }}>Il me laisse en vu depuis 2 jours… 😞</div>)}
        {row('t1','flex-start', <div style={{ display:'flex', gap:4, padding:'10px 14px', background:'rgba(102,10,67,0.1)', borderRadius:'18px 18px 18px 4px' }}><span style={{ width:6,height:6,borderRadius:'50%',background:'#660A43',opacity:0.35,animation:'abri-dot 1.2s infinite',display:'inline-block' }}/><span style={{ width:6,height:6,borderRadius:'50%',background:'#660A43',opacity:0.35,animation:'abri-dot 1.2s 0.2s infinite',display:'inline-block' }}/><span style={{ width:6,height:6,borderRadius:'50%',background:'#660A43',opacity:0.35,animation:'abri-dot 1.2s 0.4s infinite',display:'inline-block' }}/></div>)}
        {row('m2','flex-start', <><div style={{ fontSize:9.5, fontWeight:700, color:'#660A43', marginBottom:3, paddingLeft:2 }}>Sofi & Oli 💛</div><div style={{ maxWidth:'80%', padding:'9px 13px', borderRadius:'18px 18px 18px 4px', fontSize:12.5, lineHeight:1.45, background:'rgba(102,10,67,0.1)', color:'#2a0a1a' }}>C'est nouveau chez lui ou il l'a déjà fait avant ?</div></>)}
        {row('m3','flex-end', <div style={{ maxWidth:'80%', padding:'9px 13px', borderRadius:'18px 18px 4px 18px', fontSize:12.5, lineHeight:1.45, background:'#660A43', color:'#fff' }}>Jamais… 😔</div>)}
        {row('t2','flex-start', <div style={{ display:'flex', gap:4, padding:'10px 14px', background:'rgba(102,10,67,0.1)', borderRadius:'18px 18px 18px 4px' }}><span style={{ width:6,height:6,borderRadius:'50%',background:'#660A43',opacity:0.35,animation:'abri-dot 1.2s infinite',display:'inline-block' }}/><span style={{ width:6,height:6,borderRadius:'50%',background:'#660A43',opacity:0.35,animation:'abri-dot 1.2s 0.2s infinite',display:'inline-block' }}/><span style={{ width:6,height:6,borderRadius:'50%',background:'#660A43',opacity:0.35,animation:'abri-dot 1.2s 0.4s infinite',display:'inline-block' }}/></div>)}
        {row('m4','flex-start', <><div style={{ fontSize:9.5, fontWeight:700, color:'#660A43', marginBottom:3, paddingLeft:2 }}>Sofi & Oli 💛</div><div style={{ maxWidth:'80%', padding:'9px 13px', borderRadius:'18px 18px 18px 4px', fontSize:12.5, lineHeight:1.45, background:'rgba(102,10,67,0.1)', color:'#2a0a1a' }}>Les hommes se retirent rarement par indifférence. Voilà quoi faire 👇</div></>)}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px 18px', background:'#FFF1E7', borderTop:'1px solid rgba(102,10,67,0.08)' }}>
        <div style={{ flex:1, background:'rgba(102,10,67,0.07)', borderRadius:20, padding:'9px 13px', fontSize:12, color:'rgba(42,10,26,0.35)' }}>Écris ta situation…</div>
        <div style={{ width:30, height:30, background:'#660A43', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="#FFF1E7"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
        </div>
      </div>
    </div>
  )
})

function StepsSection() {
  useEffect(() => {
    let mounted = true
    const dPaths = {
      girl1: "M 100 144 C 100 280, 380 300, 527 300",
      girl2: "M 580 353 C 520 450, 280 460, 100 458",
      couple: null
    }
    const mPaths = {
      girl1: "M 80 114 C 80 220, 310 180, 310 258",
      girl2: "M 310 342 C 310 430, 80 400, 80 458",
      couple: null
    }
    function samplePath(svgEl, pathStr, steps) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', pathStr)
      svgEl.appendChild(path)
      const len = path.getTotalLength()
      const pts = []
      for (let i = 0; i <= steps; i++) {
        const p = path.getPointAtLength((i / steps) * len)
        pts.push({ x: p.x, y: p.y })
      }
      svgEl.removeChild(path)
      return pts
    }
    function animateEmoji(el, svgEl, pathStr, dur, onEnd) {
      const pts = samplePath(svgEl, pathStr, 80)
      let start = null
      el.setAttribute('opacity', '1')
      function step(ts) {
        if (!mounted) return
        if (!start) start = ts
        const prog = Math.min((ts - start) / dur, 1)
        const pt = pts[Math.round(prog * 80)]
        el.setAttribute('transform', 'translate(' + pt.x + ',' + pt.y + ')')
        if (prog < 1) requestAnimationFrame(step)
        else if (onEnd) onEnd()
      }
      requestAnimationFrame(step)
    }
    function runCycle(prefix, paths) {
      if (!mounted) return
      const g1 = document.getElementById('abri-' + prefix + '-girl1')
      const g2 = document.getElementById('abri-' + prefix + '-girl2')
      const cp = document.getElementById('abri-' + prefix + '-couple')
      if (!g1 || !g2 || !cp) return
      const svgEl = g1.closest('svg')
      ;[g1, g2, cp].forEach(e => { e.setAttribute('opacity', '0'); e.setAttribute('transform', 'translate(0,0)') })
      const pts2 = samplePath(svgEl, paths.girl2, 80)
      g2.setAttribute('transform', 'translate(' + pts2[0].x + ',' + pts2[0].y + ')')
      animateEmoji(g1, svgEl, paths.girl1, 5000, () => {
        if (!mounted) return
        g1.setAttribute('opacity', '0')
        animateEmoji(g2, svgEl, paths.girl2, 4500, () => {
          if (!mounted) return
          g2.setAttribute('opacity', '0')
          const lastTransform = g2.getAttribute('transform')
          cp.setAttribute('transform', lastTransform)
          cp.setAttribute('opacity', '1')
          const match = lastTransform.match(/translate\(([^,]+),([^)]+)\)/)
          const tx = match ? parseFloat(match[1]) : 0
          const ty = match ? parseFloat(match[2]) : 0
          let startTime = null
          const duration = 2800
          function heartbeat(ts) {
            if (!mounted) return
            if (!startTime) startTime = ts
            const elapsed = ts - startTime
            let scale
            if (elapsed < 300) { scale = elapsed / 300 }
            else { const t = (elapsed - 300) / 1000; const beat = Math.sin(t * Math.PI * 2.5); scale = 1 + Math.max(0, beat) * 0.35 }
            cp.setAttribute('transform', 'translate(' + tx + ',' + ty + ') scale(' + scale + ')')
            if (elapsed < duration) { requestAnimationFrame(heartbeat) }
            else {
              let fadeStart = null
              function fadeOut(ts2) {
                if (!mounted) return
                if (!fadeStart) fadeStart = ts2
                const p = Math.min((ts2 - fadeStart) / 400, 1)
                cp.setAttribute('opacity', 1 - p)
                if (p < 1) requestAnimationFrame(fadeOut)
                else { cp.setAttribute('opacity', '0'); setTimeout(() => { if (mounted) runCycle(prefix, paths) }, 300) }
              }
              requestAnimationFrame(fadeOut)
            }
          }
          requestAnimationFrame(heartbeat)
        })
      })
    }
    const section = document.getElementById('abri-steps-section')
    if (!section) return
    let started = false
    function startAnimations() {
      if (started) return
      started = true
      setTimeout(() => { if (mounted) runCycle('d', dPaths) }, 300)
      setTimeout(() => { if (mounted) runCycle('m', mPaths) }, 300)
    }
    let observer
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) { startAnimations(); observer.disconnect() } })
      }, { threshold: 0.3 })
      observer.observe(section)
    } else { startAnimations() }
    return () => { mounted = false; if (observer) observer.disconnect() }
  }, [])

  return (
    <section id="abri-steps-section" style={{ padding: 'calc(clamp(24px,3vw,44px) + 80px) 20px', background: 'linear-gradient(180deg, #660A43 0%, #8a1258 50%, #660A43 100%)', position: 'relative' }}>
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
      <div data-fade>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#FFF1E7', fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 700, lineHeight: 1.2 }}>
          Comment on t'aide <em>concrètement</em>
        </h2>
      </div>

      <svg className="steps-svg-d" viewBox="0 0 900 600" style={{ display: 'block', width: '100%', maxWidth: 900, margin: '0 auto' }}>
        <path d="M 100 144 C 100 280, 380 300, 527 300" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeDasharray="8 12" strokeLinecap="round"/>
        <path d="M 580 353 C 520 450, 280 460, 100 458" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeDasharray="8 12" strokeLinecap="round"/>
        <circle cx="100" cy="90" r="52" fill="#E8637A" style={{ filter: 'drop-shadow(0 6px 20px rgba(232,99,122,0.6))' }}/>
        <text x="100" y="80" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="9" fontWeight="500" letterSpacing="2.5" fill="rgba(255,255,255,0.75)">ÉTAPE</text>
        <text x="100" y="108" textAnchor="middle" fontFamily="Playfair Display,serif" fontSize="30" fontWeight="700" fill="white">01</text>
        <circle cx="580" cy="300" r="52" fill="#E8637A" style={{ filter: 'drop-shadow(0 6px 20px rgba(232,99,122,0.6))' }}/>
        <text x="580" y="290" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="9" fontWeight="500" letterSpacing="2.5" fill="rgba(255,255,255,0.75)">ÉTAPE</text>
        <text x="580" y="318" textAnchor="middle" fontFamily="Playfair Display,serif" fontSize="30" fontWeight="700" fill="white">02</text>
        <circle cx="100" cy="510" r="52" fill="#E8637A" style={{ filter: 'drop-shadow(0 6px 20px rgba(232,99,122,0.6))' }}/>
        <text x="100" y="500" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="9" fontWeight="500" letterSpacing="2.5" fill="rgba(255,255,255,0.75)">ÉTAPE</text>
        <text x="100" y="528" textAnchor="middle" fontFamily="Playfair Display,serif" fontSize="30" fontWeight="700" fill="white">03</text>
        <text id="abri-d-girl1" fontSize="30" textAnchor="middle" opacity="0">👩</text>
        <text id="abri-d-girl2" fontSize="30" textAnchor="middle" opacity="0">👩</text>
        <text id="abri-d-couple" fontSize="30" textAnchor="middle" opacity="0">💑</text>
        <foreignObject x="168" y="48" width="340" height="160">
          <div xmlns="http://www.w3.org/1999/xhtml" className="fo-text">
            <h3>Tu poses ta situation</h3>
            <p>Tu écris ce que tu vis, tel que c'est, sans réfléchir.</p>
          </div>
        </foreignObject>
        <foreignObject x="648" y="258" width="245" height="160">
          <div xmlns="http://www.w3.org/1999/xhtml" className="fo-text">
            <h3>On t'aide à comprendre</h3>
            <p>Tu reçois une réponse claire sur ce qui se passe vraiment.</p>
          </div>
        </foreignObject>
        <foreignObject x="168" y="490" width="340" height="140">
          <div xmlns="http://www.w3.org/1999/xhtml" className="fo-text">
            <h3>Tu avances différemment</h3>
            <p>Tu prends des décisions plus justes et tu arrêtes de répéter les mêmes schémas.</p>
          </div>
        </foreignObject>
      </svg>

      <div className="steps-svg-m">
        <svg viewBox="0 0 400 600" style={{ display: 'block', width: '100%' }}>
          <path d="M 80 114 C 80 220, 310 180, 310 258" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeDasharray="7 11" strokeLinecap="round"/>
          <path d="M 310 343 C 310 430, 80 400, 80 458" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeDasharray="7 11" strokeLinecap="round"/>
          <circle cx="80" cy="70" r="42" fill="#E8637A" style={{ filter: 'drop-shadow(0 5px 15px rgba(232,99,122,0.6))' }}/>
          <text x="80" y="62" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="8" fontWeight="500" letterSpacing="2" fill="rgba(255,255,255,0.75)">ÉTAPE</text>
          <text x="80" y="86" textAnchor="middle" fontFamily="Playfair Display,serif" fontSize="24" fontWeight="700" fill="white">01</text>
          <circle cx="310" cy="300" r="42" fill="#E8637A" style={{ filter: 'drop-shadow(0 5px 15px rgba(232,99,122,0.6))' }}/>
          <text x="310" y="292" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="8" fontWeight="500" letterSpacing="2" fill="rgba(255,255,255,0.75)">ÉTAPE</text>
          <text x="310" y="316" textAnchor="middle" fontFamily="Playfair Display,serif" fontSize="24" fontWeight="700" fill="white">02</text>
          <circle cx="80" cy="500" r="42" fill="#E8637A" style={{ filter: 'drop-shadow(0 5px 15px rgba(232,99,122,0.6))' }}/>
          <text x="80" y="492" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="8" fontWeight="500" letterSpacing="2" fill="rgba(255,255,255,0.75)">ÉTAPE</text>
          <text x="80" y="516" textAnchor="middle" fontFamily="Playfair Display,serif" fontSize="24" fontWeight="700" fill="white">03</text>
          <text id="abri-m-girl1" fontSize="26" textAnchor="middle" opacity="0">👩</text>
          <text id="abri-m-girl2" fontSize="26" textAnchor="middle" opacity="0">👩</text>
          <text id="abri-m-couple" fontSize="26" textAnchor="middle" opacity="0">💑</text>
          <foreignObject x="134" y="30" width="255" height="110">
            <div xmlns="http://www.w3.org/1999/xhtml" className="fo-text">
              <h3>Tu poses ta situation</h3>
              <p>Tu écris ce que tu vis, tel que c'est, sans réfléchir.</p>
            </div>
          </foreignObject>
          <foreignObject x="14" y="248" width="240" height="120">
            <div xmlns="http://www.w3.org/1999/xhtml" className="fo-text">
              <h3>On t'aide à comprendre</h3>
              <p>Tu reçois une réponse claire sur ce qui se passe vraiment.</p>
            </div>
          </foreignObject>
          <foreignObject x="134" y="458" width="255" height="110">
            <div xmlns="http://www.w3.org/1999/xhtml" className="fo-text">
              <h3>Tu avances différemment</h3>
              <p>Tu prends des décisions plus justes et tu arrêtes de répéter les mêmes schémas.</p>
            </div>
          </foreignObject>
        </svg>
      </div>

      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <a href="https://ia.abrilove.fr" target="_blank" rel="noopener noreferrer" className="hp-btn-light">
          Pose ta première question →
        </a>
      </div>
      </div>
    </section>
  )
}

function BentoSection() {
  useEffect(() => {
    const grid = document.querySelector('.bento-grid')
    if (!grid) return
    const cards = Array.from(grid.querySelectorAll('.bento-c'))
    cards.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(24px)' })
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const card = entry.target
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
        card.style.opacity = '1'
        card.style.transform = 'translateY(0)'
        setTimeout(() => { card.style.transition = '' }, 520)
        obs.unobserve(card)
      })
    }, { threshold: 0.2 })
    cards.forEach(c => obs.observe(c))
    return () => obs.disconnect()
  }, [])

  return (
    <section style={{ background: '#FFF4F7', padding: 'clamp(32px,4vw,56px) 0' }}>
      <div>
        <div data-fade style={{ padding: '0 clamp(32px,5vw,80px)', maxWidth: 1080, margin: '0 auto', marginBottom: 'clamp(40px,5vw,60px)' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair,serif)', fontSize: 'clamp(24px,3.5vw,40px)', color: '#660A43', lineHeight: 1.2, fontWeight: 700 }}>
            Tout ce dont tu as besoin pour <em>avancer</em>
          </h2>
        </div>
        <div className="bento-grid-wrap" style={{ padding: '0 clamp(32px,5vw,80px)', maxWidth: 1080, margin: '0 auto' }}>
        <div className="bento-grid">

          <div className="bento-c bento-coaching" onClick={() => { window.location.href = 'https://abrilove.fr/coaching' }}>
            <div className="bento-card-inner">
              <div>
                <span className="bento-icon bento-icon-lg">🤝</span>
                <span className="bento-label" style={{ color: 'rgba(255,255,255,.4)' }}>Coaching individuel</span>
                <h3 className="bento-title" style={{ fontSize: 'clamp(26px,3vw,36px)', color: '#fff', marginBottom: 14 }}>Coaching 1-1<br/>avec Sofi</h3>
                <p className="bento-desc" style={{ color: 'rgba(255,255,255,.65)', maxWidth: 300 }}>On analyse ta situation ensemble, on décrypte les comportements qui te bloquent, et je te donne des stratégies concrètes, pas des platitudes.</p>
              </div>
              <a href="https://abrilove.fr/coaching" className="bento-cta" style={{ color: '#E8637A' }} onClick={e => e.stopPropagation()}>Prendre rendez-vous →</a>
            </div>
          </div>

          <div className="bento-c bento-ebooks" onClick={() => { window.location.href = 'https://abrilove.fr/amour' }}>
            <div>
              <span className="bento-icon">📖</span>
              <span className="bento-label" style={{ color: '#E8637A' }}>Ressources</span>
              <h3 className="bento-title" style={{ fontSize: 19, color: '#1A1118', marginBottom: 8 }}>E-books</h3>
              <p className="bento-desc" style={{ color: '#7A6070', fontSize: 13 }}>Applications de rencontre, ghosting, love bombing, confiance en soi, énergie féminine... Découvre toutes nos ressources écrites.</p>
            </div>
            <a href="https://abrilove.fr/amour" className="bento-cta" style={{ color: '#E8637A' }} onClick={e => e.stopPropagation()}>Découvrir →</a>
          </div>

          <div className="bento-c bento-ateliers" onClick={() => { window.location.href = 'https://abrilove.fr/amour' }}>
            <div>
              <span className="bento-icon">🎯</span>
              <span className="bento-label" style={{ color: '#E8637A' }}>Ressources</span>
              <h3 className="bento-title" style={{ fontSize: 19, color: '#1A1118', marginBottom: 8 }}>Cours & Ateliers</h3>
              <p className="bento-desc" style={{ color: '#7A6070', fontSize: 13 }}>Des cours et sessions live et en replay pour reprendre confiance et avancer.</p>
            </div>
            <a href="https://abrilove.fr/amour" className="bento-cta" style={{ color: '#E8637A' }} onClick={e => e.stopPropagation()}>Voir les cours →</a>
          </div>

          <div className="bento-c bento-ia" onClick={() => { window.location.href = 'https://ia.abrilove.fr/' }}>
            <div className="bento-ia-blob" />
            <div>
              <span className="bento-icon">💬</span>
              <span className="bento-label" style={{ color: 'rgba(255,255,255,.6)' }}>IA disponible 24h/24</span>
              <h3 className="bento-title" style={{ fontSize: 22, color: '#fff', marginBottom: 10 }}>L'Abr(IA)</h3>
              <p className="bento-desc" style={{ color: 'rgba(255,255,255,.85)', fontSize: 13 }}>On répond à tes questions à toute heure, sans jugement.</p>
              <a href="https://ia.abrilove.fr/" className="bento-cta" style={{ color: '#fff' }} onClick={e => e.stopPropagation()}>Essayer gratuitement →</a>
            </div>
          </div>

        </div>
        </div>
      </div>
    </section>
  )
}

function ToggleSection() {
  const [active, setActive] = useState(false)
  return (
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
      <div data-fade style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className={`abri-section${active ? ' active' : ''}`} style={{ marginTop: 0 }}>
          <div className="abri-left">
            <h2>Maintenant, tu as deux choix :</h2>
          </div>
          <div className="abri-right">
            <div className="abri-text-wrapper">
              <div className="abri-text-off">
                <p>Continuer à <strong>douter, analyser, attendre…</strong></p>
                <p className="abri-ou">ou tu peux <strong>actionner l'interrupteur...</strong></p>
              </div>
              <div className="abri-text-on">
                <p>et passer à l'action : poser ta situation et comprendre enfin ce qui se passe vraiment.</p>
              </div>
            </div>
            <button className={`abri-toggle${active ? ' on' : ''}`} onClick={() => setActive(a => !a)} aria-label="Activer">
              <div className="abri-toggle-knob" />
            </button>
            <a href="https://ia.abrilove.fr/" className="abri-cta-ebook" target="_blank" rel="noopener noreferrer">
              Je vous écris gratuitement →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid rgba(255,241,231,0.15)' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', textAlign: 'left', gap: 16 }}>
        <span style={{ fontFamily: 'var(--font-playfair, serif)', color: '#FFF1E7', fontSize: 'clamp(15px, 2vw, 17px)', fontWeight: 600, lineHeight: 1.35 }}>{q}</span>
        <span style={{ color: 'rgba(255,241,231,0.6)', fontSize: 22, lineHeight: 1, flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>+</span>
      </button>
      {open && <p style={{ color: 'rgba(255,241,231,0.8)', fontSize: 15, lineHeight: 1.7, paddingBottom: 20, margin: 0 }}>{a}</p>}
    </div>
  )
}

export default function HomePage() {
  const [guideEmail, setGuideEmail] = useState('')
  const [guideStatus, setGuideStatus] = useState(null)
  const [heroWordIdx, setHeroWordIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setHeroWordIdx(i => (i + 1) % HERO_WORDS.length), 2300)
    return () => clearInterval(t)
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

  async function handleGuide(e) {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!guideEmail || !emailRegex.test(guideEmail)) return
    setGuideStatus('sending')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: guideEmail }),
      })
      setGuideStatus(res.ok ? 'sent' : 'error')
    } catch {
      setGuideStatus('error')
    }
  }

  return (
    <div style={{ margin: '-24px -16px' }}>
      <style>{`
        @keyframes hero-word-in { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes abri-dot { 0%,60%,100% { opacity:0.2; transform:scale(0.8); } 30% { opacity:1; transform:scale(1); } }
        .iphone .bubble { max-width:80%; padding:9px 13px; border-radius:18px; font-size:12.5px; line-height:1.45; opacity:0; transform:translateY(6px); transition:opacity 0.4s,transform 0.4s; }
        .iphone .bubble.show { opacity:1; transform:translateY(0); }
        .iphone .bubble-u { background:#660A43; color:#fff; align-self:flex-end; border-radius:18px 18px 4px 18px; }
        .iphone .bubble-a { background:rgba(102,10,67,0.1); color:#2a0a1a; align-self:flex-start; border-radius:18px 18px 18px 4px; }
        .iphone .sender { font-size:9.5px; font-weight:700; color:#660A43; margin-bottom:3px; padding-left:2px; }
        .iphone .typing { display:flex; gap:4px; padding:10px 14px; background:rgba(102,10,67,0.1); border-radius:18px 18px 18px 4px; width:fit-content; opacity:0; transition:opacity 0.3s; }
        .iphone .typing.show { opacity:1; }
        .iphone .typing span { width:6px; height:6px; border-radius:50%; background:#660A43; opacity:0.35; animation:abri-dot 1.2s infinite; display:inline-block; }
        .iphone .typing span:nth-child(2) { animation-delay:0.2s; }
        .iphone .typing span:nth-child(3) { animation-delay:0.4s; }
        @keyframes abri-pop { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }
        @keyframes abri-bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(6px); } }
        @keyframes blob1 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(80px,-60px) scale(1.15); } 66% { transform:translate(-50px,40px) scale(0.88); } }
        @keyframes blob2 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(-70px,50px) scale(1.12); } 66% { transform:translate(60px,-40px) scale(0.9); } }
        @keyframes blob3 { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(60px,-70px) scale(1.1); } }
        .abri-hearts { display:flex; gap:52px; align-items:flex-start; justify-content:center; flex-wrap:wrap; }
        .abri-heart-item { display:flex; flex-direction:column; align-items:center; gap:20px; opacity:0; transform:translateY(16px); transition:opacity 0.7s,transform 0.7s; }
        .abri-heart-item.visible { opacity:1; transform:translateY(0); }
        .abri-heart-svg-wrap { position:relative; width:160px; height:148px; animation:abri-hpulse 2.4s ease-in-out infinite; }
        @keyframes abri-hpulse { 0%,100% { transform:scale(1); } 15% { transform:scale(1.09); } 30% { transform:scale(1); } 45% { transform:scale(1.05); } 60% { transform:scale(1); } }
        .abri-heart-svg-wrap svg { position:absolute; inset:0; width:100%; height:100%; }
        .abri-heart-text { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; padding-bottom:12px; }
        .abri-heart-num { word-break:break-all; font-family:'Playfair Display',Georgia,serif; font-size:28px; font-weight:700; color:#660A43; line-height:1; letter-spacing:-1px; }
        .abri-heart-suf { font-size:14px; color:rgba(102,10,67,0.35); }
        .abri-heart-label { font-size:10px; font-weight:500; letter-spacing:2px; text-transform:uppercase; color:rgba(102,10,67,0.45); text-align:center; line-height:1.7; }
        @media(max-width:600px) {
          .abri-hearts { gap:8px; flex-wrap:nowrap; }
          .abri-heart-svg-wrap { width:100px; height:93px; }
          .abri-heart-num { font-size:22px; }
          .abri-heart-suf { font-size:10px; }
          .abri-heart-label { font-size:8px; letter-spacing:1px; }
        }
        .abri-track-wrap { overflow:hidden; mask-image:linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%); -webkit-mask-image:linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%); user-select:none; -webkit-user-select:none; }
        .abri-track { display:flex; gap:20px; width:max-content; will-change:transform; }
        .abri-screen-card { flex-shrink:0; border-radius:18px; overflow:hidden; height:340px; opacity:0.92; transition:opacity 0.3s; background:#fff; display:flex; align-items:center; justify-content:center; }
        .abri-screen-card img { width:100%; height:auto; display:block; -webkit-touch-callout:none; pointer-events:none; user-select:none; -webkit-user-select:none; }
        .hp-btn-light { display:inline-flex; align-items:center; background:#FFF1E7; color:#660A43; text-decoration:none; padding:16px 28px; border-radius:999px; font-weight:700; font-size:15px; transition:transform 0.2s,box-shadow 0.2s; box-shadow:0 8px 24px rgba(0,0,0,0.25); font-family:var(--font-dm-sans,sans-serif); animation:pulse 2.5s ease-in-out infinite; will-change:transform; }
        .hp-btn-light:hover { transform:translateY(-2px); box-shadow:0 12px 30px rgba(0,0,0,0.3); animation:none; }
        .hp-btn-dark { display:inline-flex; align-items:center; background:#660A43; color:#fff; text-decoration:none; padding:14px 28px; border-radius:999px; font-weight:700; font-size:15px; transition:transform 0.2s,box-shadow 0.2s; box-shadow:0 6px 20px rgba(102,10,67,0.4); font-family:var(--font-dm-sans,sans-serif); animation:pulse 2.5s ease-in-out infinite; will-change:transform; }
        .hp-btn-dark:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(102,10,67,0.5); animation:none; }
.hp-bento-card { background:rgba(255,241,231,0.06); border:1px solid rgba(255,241,231,0.12); border-radius:20px; padding:28px; transition:background 0.2s; }
        .hp-bento-card:hover { background:rgba(255,241,231,0.1); }
        .hp-bento-link { color:rgba(255,241,231,0.7); font-size:14px; text-decoration:none; display:inline-flex; align-items:center; gap:4px; margin-top:16px; transition:color 0.15s; }
        .hp-bento-link:hover { color:#FFF1E7; }
        @media (max-width:720px) {
          .hp-hero-cols { flex-direction:column !important; }
          .hp-2cols { flex-direction:column !important; }
          .hp-2cols-rev { flex-direction:column-reverse !important; }
          .hp-steps { grid-template-columns:1fr !important; }
          .hp-bento-2 { grid-template-columns:1fr !important; }
          .hp-about { flex-direction:column !important; }
          .hp-hero-stats { gap:16px !important; flex-wrap:nowrap !important; }
          .hp-hero-stats > div > div:first-child { font-size:20px !important; }
          .hp-hero-stats > div > div:last-child { font-size:10px !important; }
          .temo-break { display: block !important; }
          .temo-title-wrap { padding-bottom: 8px !important; }
          .temo-title-wrap h2 { margin-bottom: 8px !important; }
          .hp-quiz-text { flex: 0 0 auto !important; }
          .hp-quiz-cols { gap: 32px !important; }
          .hp-quiz-embed { margin-left: -10px; margin-right: -10px; }
          .hp-ia-img { display: none !important; }
        }
        @media (max-width:680px) {
          .bento-grid-wrap { margin-left: -10px !important; margin-right: -10px !important; }
        }
        .hp-quiz-embed .qz-wrap { padding: 0 !important; max-width: 100% !important; }
        .hp-quiz-embed .qz-progress-bar { display: none !important; }
        .hp-quiz-embed .qz-resume-overlay { background: rgba(20,0,10,0.75) !important; }
        .hp-quiz-section p strong, .hp-quiz-section p em { color: #FFF1E7 !important; }
        .fo-text h3 { font-size:10px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:rgba(255,241,231,0.55); margin-bottom:8px; }
        .fo-text p { font-size:14px; line-height:1.7; color:rgba(255,241,231,0.9); font-weight:300; }
        @media (max-width:640px) { .steps-svg-d { display:none !important; } }
        @media (min-width:641px) { .steps-svg-m { display:none !important; } }
        .bento-grid { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:260px 280px; gap:14px; }
        .bento-coaching { grid-column:1; grid-row:1/3; }
        .bento-ebooks { grid-column:2; grid-row:1; }
        .bento-ateliers { grid-column:3; grid-row:1; }
        .bento-ia { grid-column:2/4; grid-row:2; }
        .bento-c { border-radius:20px; padding:28px 26px; position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between; cursor:pointer; transition:transform .28s cubic-bezier(.34,1.4,.64,1); }
        .bento-c:hover { transform:scale(1.02); }
        .bento-coaching { background:#1A1118 url('/images/coaching-bg.jpg') center/cover no-repeat; padding:36px 34px; }
        .bento-coaching::before { content:''; position:absolute; inset:0; background:rgba(0,0,0,0.5); border-radius:20px; z-index:1; }
        .bento-card-inner { position:relative; z-index:2; display:flex; flex-direction:column; justify-content:space-between; height:100%; }
        .bento-ia { background:#E8637A url('/images/ia-bg.png') center/cover no-repeat; }
        .bento-ia::before { content:''; position:absolute; inset:0; background:rgba(0,0,0,0.62); border-radius:20px; z-index:1; }
        .bento-ia > * { position:relative; z-index:2; }
        .bento-ia-blob { position:absolute; border-radius:50%; width:180px; height:180px; background:radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 65%); right:-30px; top:-30px; pointer-events:none; }
        .bento-ebooks { background:#FFF1E7; }
        .bento-ateliers { background:#FDE8EC; }
        .bento-icon { font-size:32px; line-height:1; margin-bottom:16px; display:block; }
        .bento-icon-lg { font-size:40px; }
        .bento-label { font-size:9px; font-weight:600; letter-spacing:.22em; text-transform:uppercase; display:block; margin-bottom:8px; }
        .bento-title { font-family:var(--font-playfair,serif); line-height:1.15; font-weight:700; }
        .bento-desc { font-size:13.5px; line-height:1.65; font-weight:300; }
        .bento-cta { display:inline-flex; align-items:center; gap:6px; font-size:12.5px; font-weight:600; text-decoration:none; margin-top:20px; transition:gap .2s; width:fit-content; }
        .bento-c:hover .bento-cta { gap:12px; }
        @media (max-width:680px) {
          .bento-grid { grid-template-columns:1fr 1fr; grid-template-rows:auto; }
          .bento-coaching { grid-column:1/3; grid-row:1; min-height:280px; }
          .bento-ateliers { grid-column:1; grid-row:2; }
          .bento-ebooks { grid-column:2; grid-row:2; }
          .bento-ia { grid-column:1/3; grid-row:3; }
        }
      `}</style>

      <Header />

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', paddingTop: 'clamp(110px,12vw,170px)', paddingLeft: 'clamp(32px,5vw,80px)', paddingRight: 'clamp(32px,5vw,80px)', paddingBottom: 'calc(clamp(8px,1.5vw,16px) + 80px)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #660A43 0%, #8a1258 50%, #660A43 100%)' }}>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0 }}>
          <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(190,25,105,0.6) 0%, transparent 65%)', top:'20%', right:'-10%', filter:'blur(50px)', animation:'blob1 6s ease-in-out infinite' }} />
          <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(160,15,85,0.55) 0%, transparent 65%)', bottom:'0%', left:'-10%', filter:'blur(45px)', animation:'blob2 8s ease-in-out infinite' }} />
          <div style={{ position:'absolute', width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle, rgba(210,40,120,0.5) 0%, transparent 65%)', top:'50%', left:'20%', filter:'blur(50px)', animation:'blob3 7s ease-in-out infinite' }} />
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
          <div className="hp-hero-cols" style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,241,231,0.12)', border: '1px solid rgba(255,241,231,0.22)', backdropFilter: 'blur(10px)', padding: '7px 18px 7px 7px', borderRadius: 100, marginBottom: 28, animation: 'abri-pop 0.4s 0.3s cubic-bezier(0.34,1.56,0.64,1) both' }}>
                <div style={{ position: 'relative', width: 34, height: 34, flexShrink: 0 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,241,231,0.35)' }}>
                    <img src={AVATAR} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                  </div>
                  <div style={{ position: 'absolute', width: 9, height: 9, borderRadius: '50%', background: '#4caf50', border: '2px solid #660A43', bottom: 0, right: 0 }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#FFF1E7', letterSpacing: '0.2px' }}>Hey, c'est Sofi & Oli.</span>
              </div>

              <h1 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#FFF1E7', fontSize: 'clamp(29px,5vw,62px)', fontWeight: 700, lineHeight: 1.25, marginBottom: 24 }}>
                Tu mérites mieux que<br />
                <em key={heroWordIdx} style={{ display: 'block', color: '#E8637A', fontStyle: 'italic', animation: 'hero-word-in 0.45s cubic-bezier(0.22,1,0.36,1) both' }}>
                  {HERO_WORDS[heroWordIdx]}
                </em>
              </h1>

              <p style={{ color: 'rgba(255,241,231,0.9)', fontSize: 'clamp(15px,1.8vw,18px)', lineHeight: 1.7, marginBottom: 36, maxWidth: 520 }}>
                Pose ta question à L'Abri IA et reçois une réponse claire, personnalisée et sans jugement. Que tu sois en plein dating, dans une relation floue, célibataire, en rupture ou simplement en train d'essayer de mieux te comprendre.
              </p>

              <a href="https://ia.abrilove.fr" target="_blank" rel="noopener noreferrer" className="hp-btn-light">
                Reçois nos conseils gratuits
              </a>

              <div className="hp-hero-stats" style={{ display: 'flex', gap: 48, marginTop: 52 }}>
                <StatCounter target={11400} label="femmes accompagnées" />
                <StatCounter target={89300} label="questions répondues" />
                <StatCounter target={100} suffix="%" label="femmes satisfaites" />
              </div>
            </div>

            <div className="hp-hero-iphone" style={{ flexShrink: 0 }}>
              <IPhoneChat />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <a
              href="#abria"
              onClick={e => { e.preventDefault(); document.getElementById('abria')?.scrollIntoView({ behavior: 'smooth' }) }}
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

      {/* ── L'ABRI IA ── */}
      <section id="abria" style={{ background: '#FFF4F7', padding: 'clamp(32px,4vw,56px) clamp(32px,5vw,80px)' }}>
        <div data-fade style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="hp-2cols" style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#660A43', fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
                Ce n'est pas une IA comme les autres.
              </h2>
              <p style={{ color: '#5a3040', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.85, marginBottom: 32 }}>
                L'Abri IA s'appuie sur tout ce qu'on a construit ces dernières années : des <strong>milliers d'heures de coaching</strong>, des <strong>milliers d'échanges</strong>, et des situations réelles qu'on a accompagnées.<br /><br />
                Ce n'est pas une réponse générique. C'est une vraie compréhension de ce que tu vis. C'est comme parler à nous, mais disponible à tout moment, <strong>24h/24, 7j/7</strong>.
              </p>
              <a href="https://ia.abrilove.fr" target="_blank" rel="noopener noreferrer" className="hp-btn-dark">Commence maintenant</a>
            </div>
            <div className="hp-ia-img" style={{ flex: 1 }}>
              <img src="/images/sofi-oli.avif" alt="Sofi et Oli" style={{ width: '100%', borderRadius: 24, objectFit: 'cover', maxHeight: 500 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── QUIZ TEASER ── */}
      <section className="hp-quiz-section" style={{ background: 'linear-gradient(180deg, #660A43 0%, #8a1258 50%, #660A43 100%)', padding: 'calc(clamp(24px,3vw,44px) + 80px) clamp(32px,5vw,80px)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -1, left: 0, width: '100%', lineHeight: 0, zIndex: 2, pointerEvents: 'none' }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 80 }}>
            <path d="M0,0 L0,45 Q720,22 1440,45 L1440,0 Z" fill="#FFF4F7" />
          </svg>
        </div>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(190,25,105,0.6) 0%, transparent 65%)', top: '-10%', right: '-10%', filter: 'blur(50px)', animation: 'blob1 6s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(160,15,85,0.55) 0%, transparent 65%)', bottom: '-10%', left: '-10%', filter: 'blur(45px)', animation: 'blob2 8s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(210,40,120,0.5) 0%, transparent 65%)', top: '50%', left: '30%', filter: 'blur(50px)', animation: 'blob3 7s ease-in-out infinite' }} />
        </div>
        <div data-fade style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="hp-2cols hp-quiz-cols" style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            <div style={{ flex: 1 }} className="hp-quiz-text">
              <p style={{ color: 'rgba(255,241,231,0.55)', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Quiz gratuit</p>
              <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#FFF1E7', fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
                Tu veux aller plus loin qu'une simple réponse ?
              </h2>
              <p style={{ color: 'rgba(255,241,231,0.9)', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.85, marginBottom: 0 }}>
                Parfois, le vrai problème n'est pas seulement la situation que tu vis aujourd'hui. C'est le schéma derrière. Celui qui te fait douter, t'attacher trop vite, sur-analyser, ou répéter les mêmes histoires.<br /><br />
                Fais le <strong>test gratuit</strong> et découvre ton profil amoureux, pour mieux comprendre ce que tu vis, en profondeur.
              </p>
            </div>
            <div style={{ flex: 1 }} className="hp-quiz-embed" >
              <QuizPage />
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', lineHeight: 0, zIndex: 2, pointerEvents: 'none' }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 80 }}>
            <path d="M0,35 Q720,58 1440,35 L1440,80 L0,80 Z" fill="#FFF4F7" />
          </svg>
        </div>
      </section>

      {/* ── TU ÉCRIS ── */}
      <section style={{ background: '#FFF4F7', padding: 'clamp(32px,4vw,56px) clamp(32px,5vw,80px)' }}>
        <div data-fade style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="hp-2cols-rev" style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
            <div style={{ flex: 1 }}>
              <img src="/images/tu-ecris.avif" alt="abrilove" style={{ width: '100%', borderRadius: 24, objectFit: 'cover', maxHeight: 500 }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#660A43', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>C'est maintenant.</p>
              <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#660A43', fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
                Tu écris. On te répond.<br /><em style={{ color: '#660A43' }}>Comme en coaching.</em>
              </h2>
              <p style={{ color: '#5a3040', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.85, marginBottom: 32 }}>
                Pendant des années, on a accompagné des femmes dans des situations comme la tienne. À analyser, décoder, comprendre ce qui se joue vraiment derrière les mots, les silences, les comportements.<br /><br />
                Aujourd'hui, tu peux accéder à ce niveau de compréhension à tout moment. Tu écris ta situation, même en plein doute, même tard, même quand tout est flou, et tu reçois une réponse qui t'aide vraiment à y voir clair.
              </p>
              <a href="https://ia.abrilove.fr" target="_blank" rel="noopener noreferrer" className="hp-btn-dark">J'essaye gratuitement</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <TemuSection />

      {/* ── CE QUE TU VIS ── */}
      <HeartsSection />

      {/* ── COMMENT ON T'AIDE ── */}
      <StepsSection />

      {/* ── BENTO OFFRES ── */}
      <BentoSection />

      {/* ── DEUX CHOIX ── */}
      <ToggleSection />

      {/* ── SOFI & OLI ── */}
      <section style={{ background: '#FFF4F7', padding: 'clamp(32px,4vw,56px) clamp(32px,5vw,80px)' }}>
        <div data-fade style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="hp-2cols" style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
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
              <a href="https://ia.abrilove.fr" target="_blank" rel="noopener noreferrer" className="hp-btn-dark">Parle-nous de ta situation →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
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
        <div data-fade style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,241,231,0.55)', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 16 }}>Tu te poses peut-être ces questions…</p>
          <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#FFF1E7', fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>Questions fréquentes</h2>
          {FAQ_DATA.map(item => <FaqItem key={item.q} q={item.q} a={item.a} />)}
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <p style={{ color: 'rgba(255,241,231,0.75)', fontSize: 16, marginBottom: 24, lineHeight: 1.6 }}>
              Tu n'as plus besoin de tourner en boucle. Pose ta situation maintenant et y voir plus clair, tout de suite.
            </p>
            <a href="https://ia.abrilove.fr" target="_blank" rel="noopener noreferrer" className="hp-btn-light">Je pose ma situation (gratuit)</a>
            <p style={{ color: 'rgba(255,241,231,0.35)', fontSize: 13, marginTop: 16, fontStyle: 'italic' }}>Le regard de Sofi & Oli, disponible à tout moment.</p>
          </div>
        </div>
      </section>

      {/* ── GUIDE GRATUIT ── */}
      <section style={{ background: '#FFF4F7', padding: 'clamp(32px,4vw,56px) clamp(32px,5vw,80px)' }}>
        <div data-fade style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="hp-2cols" style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#660A43', fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
                Tu préfères commencer <em style={{ color: '#660A43' }}>tranquillement ?</em>
              </h2>
              <p style={{ color: '#5a3040', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.85, marginBottom: 32 }}>
                Tu ne sais pas toujours comment interpréter une situation, ou tu veux simplement y voir plus clair sans te précipiter ? Ce <strong>guide gratuit</strong> te donne des repères simples pour mieux comprendre ce que tu vis.
              </p>
              {guideStatus === 'sent' ? (
                <div style={{ background: 'rgba(102,10,67,0.08)', borderRadius: 16, padding: '20px 24px' }}>
                  <p style={{ color: '#660A43', fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Merci 💌</p>
                  <p style={{ color: '#5a3040', fontSize: 14, margin: 0 }}>Ton guide vient de partir dans ta boîte mail. Vérifie tes spams ou l'onglet "Promotions".</p>
                </div>
              ) : (
                <form onSubmit={handleGuide} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <input type="email" placeholder="Ton adresse email" value={guideEmail} onChange={e => setGuideEmail(e.target.value)} required style={{ flex: 1, minWidth: 220, background: '#fff', border: '2px solid rgba(102,10,67,0.2)', borderRadius: 999, padding: '14px 20px', fontSize: 15, color: '#2a0a1a', outline: 'none', fontFamily: 'var(--font-dm-sans,sans-serif)' }} />
                  <button type="submit" disabled={guideStatus === 'sending'} style={{ background: '#660A43', color: '#fff', border: 'none', borderRadius: 999, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 6px 20px rgba(102,10,67,0.3)', fontFamily: 'var(--font-dm-sans,sans-serif)' }}>
                    {guideStatus === 'sending' ? 'Envoi…' : 'Je le veux pour 0€'}
                  </button>
                </form>
              )}
              <div style={{ display: 'flex', gap: 32, marginTop: 32, flexWrap: 'wrap' }}>
                {[{ num: '3500+', label: 'Lecteurs' }, { num: '53M+', label: 'Vues insta' }, { num: '100%', label: 'Gratuit' }].map(s => (
                  <div key={s.label}>
                    <div style={{ fontFamily: 'var(--font-playfair,serif)', fontSize: 24, fontWeight: 700, color: '#660A43' }}>{s.num}</div>
                    <div style={{ fontSize: 12, color: '#8a5060', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <img src="/images/repere.png" alt="Ebook gratuit Abrilove" style={{ width: '75%', borderRadius: 24, objectFit: 'contain', display: 'block', margin: '0 auto' }} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
