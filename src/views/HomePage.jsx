'use client'
import { useState, useEffect, useRef, memo } from 'react'
import Header from './Header'
import Footer from './Footer'
import QuizPage from './QuizPage'

const AVATAR = '/images/hero-avatar.avif'

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
    <section style={{ background: '#FFF4F7', padding: 'clamp(60px,8vw,100px) clamp(32px,5vw,80px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 60 }} className="hp-2cols">
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#1a0011', fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 24 }}>
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

    function onLoad() { calcWidths(); rafRef.current = requestAnimationFrame(step) }

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
    <section style={{ background: 'linear-gradient(180deg, #660A43 0%, #8a1258 50%, #660A43 100%)', padding: 'clamp(40px,6vw,80px) 0', position: 'relative' }}>
      <div className="temo-title-wrap" style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 20, paddingLeft: 20, paddingRight: 20 }}>
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
      <div style={{ fontFamily: 'var(--font-playfair,serif)', fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 700, color, lineHeight: 1 }}>{formatted}{suffix}</div>
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
          <div style={{ fontSize:12, fontWeight:700, color:'#2a0a1a' }}>Sofi & Oli — Abrilove</div>
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

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid rgba(102,10,67,0.12)' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', textAlign: 'left', gap: 16 }}>
        <span style={{ fontFamily: 'var(--font-playfair, serif)', color: '#1a0011', fontSize: 'clamp(15px, 2vw, 17px)', fontWeight: 600, lineHeight: 1.35 }}>{q}</span>
        <span style={{ color: '#660A43', fontSize: 22, lineHeight: 1, flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>+</span>
      </button>
      {open && <p style={{ color: '#5a3040', fontSize: 15, lineHeight: 1.7, paddingBottom: 20, margin: 0 }}>{a}</p>}
    </div>
  )
}

export default function HomePage() {
  const [guideEmail, setGuideEmail] = useState('')
  const [guideStatus, setGuideStatus] = useState(null)

  async function handleGuide(e) {
    e.preventDefault()
    if (!guideEmail) return
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
        .abri-screen-card { flex-shrink:0; border-radius:18px; overflow:hidden; height:340px; opacity:0.92; transition:opacity 0.3s; }
        .abri-screen-card img { height:100%; width:auto; display:block; -webkit-touch-callout:none; pointer-events:none; user-select:none; -webkit-user-select:none; }
        .hp-btn-light { display:inline-flex; align-items:center; background:#FFF1E7; color:#660A43; text-decoration:none; padding:16px 28px; border-radius:999px; font-weight:700; font-size:15px; transition:transform 0.2s,box-shadow 0.2s; box-shadow:0 8px 24px rgba(0,0,0,0.25); font-family:var(--font-dm-sans,sans-serif); }
        .hp-btn-light:hover { transform:translateY(-2px); box-shadow:0 12px 30px rgba(0,0,0,0.3); }
        .hp-btn-dark { display:inline-flex; align-items:center; background:#660A43; color:#fff; text-decoration:none; padding:14px 28px; border-radius:999px; font-weight:700; font-size:15px; transition:transform 0.2s,box-shadow 0.2s; box-shadow:0 6px 20px rgba(102,10,67,0.4); font-family:var(--font-dm-sans,sans-serif); }
        .hp-btn-dark:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(102,10,67,0.5); }
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
        }
        .hp-quiz-embed .qz-wrap { padding: 0 !important; max-width: 100% !important; }
        .hp-quiz-embed .qz-progress-bar { display: none !important; }
        .hp-quiz-embed .qz-resume-overlay { background: rgba(20,0,10,0.75) !important; }
        .hp-quiz-section p strong, .hp-quiz-section p em { color: #FFF1E7 !important; }
      `}</style>

      <Header />

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', padding: 'clamp(110px,12vw,170px) clamp(32px,5vw,80px) clamp(60px,8vw,100px)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #660A43 0%, #8a1258 50%, #660A43 100%)' }}>
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

              <h1 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#FFF1E7', fontSize: 'clamp(24px,5vw,62px)', fontWeight: 700, lineHeight: 1.15, marginBottom: 24 }}>
                C'est quoi ton plus grand problème amoureux ?
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

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 64 }}>
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
      </section>

      {/* ── L'ABRI IA ── */}
      <section id="abria" style={{ background: '#FFF4F7', padding: 'clamp(60px,8vw,120px) clamp(32px,5vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="hp-2cols" style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#1a0011', fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
                Ce n'est pas une IA comme les autres.
              </h2>
              <p style={{ color: '#5a3040', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.85, marginBottom: 32 }}>
                L'Abri IA s'appuie sur tout ce qu'on a construit ces dernières années : des <strong>milliers d'heures de coaching</strong>, des <strong>milliers d'échanges</strong>, et des situations réelles qu'on a accompagnées.<br /><br />
                Ce n'est pas une réponse générique. C'est une vraie compréhension de ce que tu vis. C'est comme parler à nous, mais disponible à tout moment, <strong>24h/24, 7j/7</strong>.
              </p>
              <a href="https://ia.abrilove.fr" target="_blank" rel="noopener noreferrer" className="hp-btn-dark">Commence maintenant</a>
            </div>
            <div style={{ flex: 1 }}>
              <img src="/images/sofi-oli.avif" alt="Sofi et Oli" style={{ width: '100%', borderRadius: 24, objectFit: 'cover', maxHeight: 500 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── QUIZ TEASER ── */}
      <section className="hp-quiz-section" style={{ background: 'linear-gradient(180deg, #660A43 0%, #8a1258 50%, #660A43 100%)', padding: 'clamp(60px,8vw,120px) clamp(32px,5vw,80px)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(190,25,105,0.6) 0%, transparent 65%)', top: '-10%', right: '-10%', filter: 'blur(50px)', animation: 'blob1 6s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(160,15,85,0.55) 0%, transparent 65%)', bottom: '-10%', left: '-10%', filter: 'blur(45px)', animation: 'blob2 8s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(210,40,120,0.5) 0%, transparent 65%)', top: '50%', left: '30%', filter: 'blur(50px)', animation: 'blob3 7s ease-in-out infinite' }} />
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
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
      </section>

      {/* ── TU ÉCRIS ── */}
      <section style={{ background: '#FFF4F7', padding: 'clamp(60px,8vw,120px) clamp(32px,5vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="hp-2cols-rev" style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
            <div style={{ flex: 1 }}>
              <img src="/images/tu-ecris.avif" alt="abrilove" style={{ width: '100%', borderRadius: 24, objectFit: 'cover', maxHeight: 500 }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#660A43', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>C'est maintenant.</p>
              <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#1a0011', fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
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
      <section style={{ padding: 'clamp(60px,8vw,120px) clamp(32px,5vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(24px,6vw,80px)', marginBottom: 72, flexWrap: 'wrap' }}>
            {[
              { num: '11 400+', label: 'femmes accompagnées' },
              { num: '89 300+', label: 'questions répondues' },
              { num: '100%', label: 'nous recommandent' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-playfair,serif)', fontSize: 'clamp(32px,4vw,48px)', fontWeight: 700, color: '#660A43', lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: 14, color: '#8a5060', marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', color: '#660A43', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 40 }}>Comment on t'aide / concrètement</p>

          <div className="hp-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginBottom: 48 }}>
            {[
              { num: '01', title: 'Tu poses ta situation', desc: 'Tu écris ce que tu vis, tel que c\'est, sans réfléchir.' },
              { num: '02', title: 'On t\'aide à comprendre', desc: 'Tu reçois une réponse claire sur ce qui se passe vraiment.' },
              { num: '03', title: 'Tu avances différemment', desc: 'Tu prends des décisions plus justes et tu arrêtes de répéter les mêmes schémas.' },
            ].map(s => (
              <div key={s.num} style={{ background: '#fff', border: '1px solid rgba(102,10,67,0.1)', borderRadius: 20, padding: 28 }}>
                <div style={{ fontFamily: 'var(--font-playfair,serif)', fontSize: 48, fontWeight: 700, color: 'rgba(102,10,67,0.08)', lineHeight: 1, marginBottom: 16 }}>{s.num}</div>
                <h3 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#1a0011', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{s.title}</h3>
                <p style={{ color: '#5a3040', fontSize: 15, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <a href="https://ia.abrilove.fr" target="_blank" rel="noopener noreferrer" className="hp-btn-dark">Pose ta première question →</a>
          </div>
        </div>
      </section>

      {/* ── BENTO OFFRES ── */}
      <section style={{ background: 'linear-gradient(135deg, #1a0011 0%, #3d0228 55%, #660A43 100%)', padding: 'clamp(60px,8vw,120px) clamp(32px,5vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#FFF1E7', fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
            Tout ce dont tu as besoin pour <em>avancer</em>
          </h2>
          <p style={{ color: 'rgba(255,241,231,0.55)', textAlign: 'center', fontSize: 16, marginBottom: 48 }}>Des ressources pensées pour toi, à chaque étape.</p>
          <div className="hp-bento-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
            {[
              { badge: 'IA disponible 24h/24', title: "L'Abr(IA)", desc: "On répond à tes questions à toute heure, sans jugement.", href: 'https://ia.abrilove.fr', cta: 'Essayer gratuitement →', featured: true },
              { badge: 'Coaching individuel', title: 'Coaching 1-1 avec Sofi', desc: "On analyse ta situation ensemble, on décrypte les comportements qui te bloquent, et je te donne des stratégies concrètes.", href: '/coaching', cta: 'Prendre rendez-vous →' },
              { badge: 'Ressources', title: 'E-books', desc: "Applications de rencontre, ghosting, love bombing, confiance en soi, énergie féminine... Toutes nos ressources.", href: '/amour', cta: 'Découvrir →' },
              { badge: 'En live ou en replay', title: 'Cours & Ateliers', desc: "Des sessions live et en replay pour reprendre confiance et avancer.", href: '/amour', cta: 'Voir les cours →' },
            ].map(c => (
              <div key={c.title} className="hp-bento-card" style={c.featured ? { background: 'rgba(255,241,231,0.1)', border: '1px solid rgba(255,241,231,0.22)' } : {}}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,241,231,0.45)', display: 'block', marginBottom: 12 }}>{c.badge}</span>
                <h3 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#FFF1E7', fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{c.title}</h3>
                <p style={{ color: 'rgba(255,241,231,0.65)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{c.desc}</p>
                <a href={c.href} className="hp-bento-link" {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  {c.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEUX CHOIX ── */}
      <section style={{ padding: 'clamp(40px,6vw,80px) clamp(32px,5vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(135deg, #1a0011 0%, #3d0228 60%, #660A43 100%)', borderRadius: 24, padding: 'clamp(40px,6vw,80px) clamp(32px,5vw,80px)', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#FFF1E7', fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 24 }}>
              Maintenant, tu as deux choix :
            </h2>
            <p style={{ color: 'rgba(255,241,231,0.75)', fontSize: 'clamp(15px,1.8vw,18px)', lineHeight: 1.8, marginBottom: 10 }}>
              Continuer à <strong style={{ color: '#FFF1E7' }}>douter, analyser, attendre…</strong>
            </p>
            <p style={{ color: 'rgba(255,241,231,0.75)', fontSize: 'clamp(15px,1.8vw,18px)', lineHeight: 1.8, marginBottom: 36 }}>
              ou tu peux <strong style={{ color: '#FFF1E7' }}>actionner l'interrupteur…</strong> et passer à l'action : poser ta situation et comprendre enfin ce qui se passe vraiment.
            </p>
            <a href="https://ia.abrilove.fr" target="_blank" rel="noopener noreferrer" className="hp-btn-light">Je vous écris gratuitement →</a>
          </div>
        </div>
      </section>

      {/* ── SOFI & OLI + PRODUITS ── */}
      <section style={{ padding: 'clamp(40px,6vw,80px) clamp(32px,5vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="hp-about" style={{ display: 'flex', gap: 24 }}>
            <div style={{ flex: 1.3, background: 'linear-gradient(135deg, #fdf5f8, #f5e5f0)', borderRadius: 24, padding: '36px 32px' }}>
              <h3 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#1a0011', fontSize: 'clamp(22px,2.5vw,28px)', fontWeight: 700, marginBottom: 20 }}>
                Hey, nous sommes <em style={{ color: '#660A43' }}>Sofi & Oli</em>
              </h3>
              <p style={{ color: '#5a3040', fontSize: 15, lineHeight: 1.85, marginBottom: 24 }}>
                Chaque jour, nous accompagnons des femmes dans leurs relations, leurs doutes, leurs schémas et ce qu'elles traversent intérieurement. Au fil de milliers d'heures de coaching, de conversations et de situations réelles, nous avons appris à voir ce qui se joue vraiment derrière les mots, les silences et les comportements.
              </p>
              <img src="/images/section-img-2.avif" alt="Sofi et Oli" style={{ width: '100%', borderRadius: 16, objectFit: 'cover', maxHeight: 280 }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { badge: 'Accompagnement personnalisé', title: 'Coaching individuel', desc: 'Un espace pour toi seule. On travaille ensemble sur tes schémas, tes blocages, ce qui se répète…', href: '/coaching', cta: 'Découvrir le coaching →' },
                { badge: 'En live ou en replay', title: 'Ateliers & cours', desc: 'Des sessions thématiques pour comprendre la psychologie masculine, décoder les dynamiques et agir autrement.', href: '/amour', cta: 'Voir les ateliers →' },
                { badge: 'À ton rythme', title: 'Guides & ebooks', desc: 'Des ressources concrètes à parcourir chez toi — avec des exercices pour avancer à ton rythme.', href: '/amour', cta: 'Explorer les ressources →' },
              ].map(c => (
                <div key={c.title} style={{ background: '#fdf5f8', border: '1px solid rgba(102,10,67,0.1)', borderRadius: 20, padding: '22px 20px', flex: 1 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(102,10,67,0.45)', display: 'block', marginBottom: 8 }}>{c.badge}</span>
                  <h3 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#1a0011', fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{c.title}</h3>
                  <p style={{ color: '#5a3040', fontSize: 13, lineHeight: 1.65, marginBottom: 12 }}>{c.desc}</p>
                  <a href={c.href} style={{ color: '#660A43', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>{c.cta}</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) clamp(32px,5vw,80px)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{ color: '#660A43', fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>Tu te poses peut-être ces questions…</p>
          <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#1a0011', fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>Questions fréquentes</h2>
          {FAQ_DATA.map(item => <FaqItem key={item.q} q={item.q} a={item.a} />)}
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <p style={{ color: '#5a3040', fontSize: 16, marginBottom: 24, lineHeight: 1.6 }}>
              Tu n'as plus besoin de tourner en boucle. Pose ta situation maintenant et y voir plus clair, tout de suite.
            </p>
            <a href="https://ia.abrilove.fr" target="_blank" rel="noopener noreferrer" className="hp-btn-dark">Je pose ma situation (gratuit)</a>
            <p style={{ color: 'rgba(102,10,67,0.45)', fontSize: 13, marginTop: 16, fontStyle: 'italic' }}>Le regard de Sofi & Oli, disponible à tout moment.</p>
          </div>
        </div>
      </section>

      {/* ── GUIDE GRATUIT ── */}
      <section style={{ background: 'linear-gradient(135deg, #fdf5f8 0%, #f5e5f0 50%, #fdf8fa 100%)', padding: 'clamp(60px,8vw,100px) clamp(32px,5vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="hp-2cols" style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#1a0011', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, lineHeight: 1.3, marginBottom: 16 }}>
                Tu préfères commencer <em style={{ color: '#660A43' }}>tranquillement ?</em>
              </h2>
              <p style={{ color: '#5a3040', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.85, marginBottom: 28 }}>
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
            <div style={{ flex: 0.7, display: 'flex', justifyContent: 'center' }}>
              <img src="/images/section-img-1.jpg" alt="Ebook gratuit Abrilove" style={{ width: '100%', maxWidth: 300, borderRadius: 20, objectFit: 'cover', boxShadow: '0 20px 60px rgba(102,10,67,0.2)' }} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
