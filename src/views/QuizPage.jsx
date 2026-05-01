'use client'
import { useState, useEffect } from 'react'

const QUESTIONS = [
  { q: 1, text: "Quand quelqu'un me plaît, j'ai tendance à répondre très vite à ses messages et à m'inquiéter s'il met longtemps à répondre." },
  { q: 2, text: "Je repasse souvent nos conversations dans ma tête pour analyser chaque mot, emoji ou silence." },
  { q: 3, text: "Des semaines (ou des mois) peuvent passer sans que je fasse quoi que ce soit de concret pour rencontrer de nouvelles personnes (apps, soirées, événements…)." },
  { q: 4, text: "Quand je sens qu'il prend de la distance, je le ressens physiquement (nœud au ventre, tension, besoin de faire quelque chose tout de suite)." },
  { q: 5, text: "J'ai besoin de me sentir sûre de ce que l'autre ressent avant de m'autoriser vraiment à m'attacher." },
  { q: 6, text: "Je me dis souvent : « Je me mettrai sérieusement au dating quand je serai plus prête » (plus confiante, moins débordée, avec plus de temps ou \"quand ce sera le bon moment\")." },
  { q: 7, text: "Il m'est déjà arrivé de changer mes plans ou mes priorités pour être disponible pour quelqu'un qui m'intéresse." },
  { q: 8, text: "Avant d'écrire ou de répondre, je me fais plein de scénarios dans ma tête (« s'il dit ça, je répondrai ça… ») au lieu de simplement voir ce qui se passe." },
  { q: 9, text: "La majorité de mon énergie \"amour\" part dans les pensées, les discussions, les contenus sur les relations… et beaucoup moins dans de vraies rencontres." },
  { q: 10, text: "Même quand quelqu'un est distant, se cherche des excuses ou souffle le chaud et le froid, une partie de moi veut encore \"faire un effort\" pour que ça marche." },
  { q: 11, text: "Quand quelque chose se passe mal (ghosting, silence, rupture floue), je passe beaucoup de temps à chercher des explications, des vidéos, des articles pour comprendre." },
  { q: 12, text: "J'adore l'idée d'être en couple, mais quand il faut passer à l'action (apps, premiers messages, premiers rendez-vous…), j'ai tendance à repousser." },
  { q: 13, text: "Quand quelqu'un se rapproche trop de moi émotionnellement, je commence vite à voir ses défauts ou à chercher une raison de prendre de la distance." },
  { q: 14, text: "Je suis très fière d'être indépendante et l'idée \"d'avoir besoin de quelqu'un\" ne me plaît pas trop." },
  { q: 15, text: "On m'a déjà dit que j'envoyais des signaux contradictoires (parfois très proche, parfois froide ou distante)." },
  { q: 16, text: "L'idée de me montrer vraiment vulnérable, d'être vue comme je suis et peut-être rejetée, me fait plus peur que l'idée de rester célibataire encore longtemps." },
]

const PROFILE_QUESTIONS = {
  accro: [1, 4, 7, 10],
  reveuse: [3, 6, 9, 12],
  cerebrale: [2, 5, 8, 11],
  louve: [13, 14, 15, 16],
}

const PROFILE_URLS = {
  accro: 'https://abrilove.fr/accro',
  reveuse: 'https://abrilove.fr/reveuse',
  cerebrale: 'https://abrilove.fr/cerebrale',
  louve: 'https://abrilove.fr/louve',
}

const PRIORITY_ORDER = ['accro', 'cerebrale', 'louve', 'reveuse']

const OPTS = [
  { value: 0, label: 'Pas du tout moi' },
  { value: 1, label: 'Un peu moi' },
  { value: 2, label: 'Tellement moi' },
]

const CSS = `
.qz-body {
  font-family: 'Crimson Pro', serif;
  background: linear-gradient(180deg, #660A43 0%, #660A43 12%, #9e1566 30%, #cc2d82 50%, #9e1566 70%, #660A43 88%, #660A43 100%);
  min-height: 100dvh;
}
@keyframes qz-blob-a {
  0%,100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(70px,-50px) scale(1.18); }
  66% { transform: translate(-45px,65px) scale(0.85); }
}
@keyframes qz-blob-b {
  0%,100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(-80px,55px) scale(1.14); }
  66% { transform: translate(55px,-70px) scale(0.88); }
}
@keyframes qz-blob-c {
  0%,100% { transform: translate(0,0) scale(1); }
  50% { transform: translate(50px,-60px) scale(1.12); }
}
.qz-blob {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}
.qz-back-home {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgba(255,241,231,0.45);
  text-decoration: none;
  font-family: var(--font-dm-sans, sans-serif);
  font-size: 12px;
  font-weight: 400;
  transition: color 0.2s;
}
.qz-back-home:hover { color: rgba(255,241,231,0.7); }

.qz-progress-bar {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 4px;
  background: rgba(102,10,67,0.1);
  z-index: 100;
}
.qz-progress-fill {
  height: 100%;
  background: #660A43;
  width: 0%;
  transition: width 0.3s ease;
}

.qz-wrap {
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  padding: 3rem 0.3rem 2rem;
}

@media (min-width: 769px) {
  .qz-wrap { max-width: 700px; }
}

.qz-card {
  background: #FFF4F7;
  border-radius: 24px;
  padding: 0;
  position: relative;
  box-shadow: 0 10px 40px rgba(102,10,67,0.15);
  overflow: hidden;
}
.qz-card:before {
  content: '💗';
  position: absolute;
  bottom: 1rem; left: 15%;
  font-size: 2rem;
  opacity: 0.1;
  pointer-events: none;
  animation: qz-float 6s ease-in-out infinite;
  z-index: 0;
}
.qz-card:after {
  content: '💕';
  position: absolute;
  bottom: 1.5rem; right: 15%;
  font-size: 1.8rem;
  opacity: 0.1;
  pointer-events: none;
  animation: qz-float 7s ease-in-out infinite reverse;
  z-index: 0;
}
@keyframes qz-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.qz-card-progress {
  height: 6px;
  background: rgba(102,10,67,0.1);
  width: 100%;
}
.qz-card-progress-fill {
  height: 100%;
  background: #660A43;
  width: 0%;
  transition: width 0.4s ease;
}

.qz-logo {
  position: absolute;
  top: 1.5rem; right: 1.5rem;
  width: 70px; height: auto;
  opacity: 0.85;
  z-index: 10;
}

.qz-card-content {
  padding: 1.8rem 1.5rem;
  position: relative;
  z-index: 2;
}
.qz-card-inner {
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.qz-question {
  display: none;
  flex-direction: column;
  flex: 1;
}
.qz-question.active { display: flex; }

.qz-question-number {
  font-size: 0.9rem;
  color: #660A43;
  font-weight: 700;
  margin-bottom: 1.2rem;
  letter-spacing: 0.5px;
}
.qz-question-text {
  font-size: 1.15rem;
  color: #660A43;
  font-weight: 500;
  margin-bottom: auto;
  line-height: 1.5;
  padding-bottom: 1.5rem;
}

.qz-options {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-bottom: 1.5rem;
}

.qz-option {
  position: relative;
  background: white;
  border: 2px solid #E8D5DE;
  border-radius: 50px;
  padding: 1rem 1.3rem 1rem 3.2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #2C2C2C;
}
@media (min-width: 769px) {
  .qz-option:hover {
    background: #FFE5EC;
    border-color: #C4A3B3;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102,10,67,0.1);
  }
}
.qz-option:active { transform: scale(0.98); }
.qz-option:before {
  content: '';
  position: absolute;
  left: 1.2rem; top: 50%;
  transform: translateY(-50%);
  width: 20px; height: 20px;
  border: 2px solid #C4A3B3;
  border-radius: 50%;
  background: white;
  transition: all 0.2s;
}
.qz-option.selected { background: #FFE5EC; border-color: #660A43; }
.qz-option.selected:before {
  border-color: #660A43;
  background: #660A43;
  box-shadow: inset 0 0 0 3px white;
}

.qz-email-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  animation: qz-slide-in 0.6s ease;
  padding-top: 2.5rem;
}
@keyframes qz-slide-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.qz-email-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: #660A43;
  margin-bottom: 1rem;
  line-height: 1.3;
}
.qz-email-subtitle {
  font-size: 1.05rem;
  color: #5A5A5A;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}
.qz-email-input {
  width: 100%;
  background: white;
  border: 2px solid #E8D5DE;
  border-radius: 50px;
  padding: 1.1rem 1.5rem;
  font-size: 1.05rem;
  font-family: 'Crimson Pro', serif;
  transition: all 0.25s;
  margin-bottom: 0.8rem;
  color: #660A43;
}
.qz-email-input::placeholder { color: #C4A3B3; }
.qz-email-input:focus { outline: none; border-color: #660A43; background: #FFE5EC; }
.qz-email-disclaimer {
  font-size: 0.8rem;
  color: #999;
  line-height: 1.3;
  margin-bottom: 1.5rem;
}

.qz-nav {
  display: flex;
  gap: 0.8rem;
  margin-top: 1.5rem;
}
.qz-btn-back {
  background: white;
  color: #660A43;
  border: 2px solid #660A43;
  border-radius: 50px;
  padding: 0.85rem 1.2rem;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: 'Crimson Pro', serif;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
  white-space: nowrap;
}
.qz-btn-back:active { transform: scale(0.97); }
.qz-btn-submit {
  flex: 1;
  background: #660A43;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 0.85rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: 'Crimson Pro', serif;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 6px 20px rgba(102,10,67,0.4);
  white-space: nowrap;
}
.qz-btn-submit:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
.qz-btn-submit:active { transform: scale(0.97); }

.qz-loading {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: linear-gradient(180deg, #660A43 0%, #8B1F5C 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  flex-direction: column;
}
.qz-spinner {
  width: 50px; height: 50px;
  border: 4px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: qz-spin 1s linear infinite;
  margin-bottom: 1.5rem;
}
@keyframes qz-spin { to { transform: rotate(360deg); } }
.qz-loading-text {
  color: white;
  font-size: 1.3rem;
  font-family: 'Playfair Display', serif;
}

.qz-resume-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
}
.qz-resume-box {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 90%;
  width: 400px;
  text-align: center;
  font-family: 'Crimson Pro', serif;
}
.qz-resume-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: #660A43;
  font-weight: 700;
  margin-bottom: 1rem;
}
.qz-resume-text {
  color: #5A5A5A;
  margin-bottom: 2rem;
  line-height: 1.5;
  font-size: 1rem;
}
.qz-resume-btns {
  display: flex;
  gap: 1rem;
}
.qz-resume-restart, .qz-resume-continue {
  flex: 1;
  padding: 0.9rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Crimson Pro', serif;
}
.qz-resume-restart {
  background: white;
  color: #660A43;
  border: 2px solid #660A43;
}
.qz-resume-continue {
  background: #660A43;
  color: white;
  border: none;
}
`

export default function QuizPage() {
  const [answers, setAnswers] = useState({})
  const [currentQ, setCurrentQ] = useState(1)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResume, setShowResume] = useState(false)
  const [savedData, setSavedData] = useState(null)

  useEffect(() => {
    document.documentElement.style.background = '#660A43'
    return () => { document.documentElement.style.background = '' }
  }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('abrilove_quiz_progress')
      if (!saved) return
      const data = JSON.parse(saved)
      const hoursDiff = (Date.now() - new Date(data.timestamp).getTime()) / (1000 * 60 * 60)
      if (hoursDiff < 24 && data.currentQ < 17) {
        setSavedData(data)
        setShowResume(true)
      } else {
        try { localStorage.removeItem('abrilove_quiz_progress') } catch {}
      }
    } catch {}
  }, [])

  useEffect(() => {
    function handleKey(e) {
      if (loading) return
      if (currentQ === 17) {
        if (e.key === 'Enter' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) submitQuiz()
        return
      }
      const cur = answers[currentQ]
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const idx = cur !== undefined ? cur : -1
        const next = e.key === 'ArrowDown' ? (idx + 1) % 3 : (idx - 1 + 3) % 3
        setAnswers(a => ({ ...a, [currentQ]: next }))
      }
      if (e.key === 'Enter' && cur !== undefined) {
        e.preventDefault()
        setTimeout(() => setCurrentQ(q => q + 1), 300)
      }
      if ((e.key === 'Backspace' || e.key === 'ArrowLeft') && currentQ > 1) {
        e.preventDefault()
        setCurrentQ(q => q - 1)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [currentQ, answers, email, loading])

  function saveProgress(newAnswers, q) {
    try {
      localStorage.setItem('abrilove_quiz_progress', JSON.stringify({
        answers: newAnswers, currentQ: q, timestamp: new Date().toISOString()
      }))
    } catch {}
  }

  function selectOption(qNum, value) {
    const newAnswers = { ...answers, [qNum]: value }
    setAnswers(newAnswers)
    saveProgress(newAnswers, qNum)
    setTimeout(() => setCurrentQ(q => q + 1), 400)
  }

  function resumeContinue() {
    if (!savedData) return
    setAnswers(savedData.answers)
    setCurrentQ(savedData.currentQ)
    setShowResume(false)
    setTimeout(() => {
      document.querySelector('.qz-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  function resumeRestart() {
    try { localStorage.removeItem('abrilove_quiz_progress') } catch {}
    setShowResume(false)
    setTimeout(() => {
      document.querySelector('.qz-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  async function submitQuiz() {
    setLoading(true)
    try { localStorage.removeItem('abrilove_quiz_progress') } catch {}

    const scores = { accro: 0, reveuse: 0, cerebrale: 0, louve: 0 }
    for (const profile in PROFILE_QUESTIONS) {
      PROFILE_QUESTIONS[profile].forEach(qNum => { scores[profile] += answers[qNum] || 0 })
    }

    const maxScore = Math.max(...Object.values(scores))
    const tied = Object.keys(scores).filter(p => scores[p] === maxScore)
    const dominant = tied.length === 1 ? tied[0] : PRIORITY_ORDER.find(p => tied.includes(p))
    const redirectUrl = PROFILE_URLS[dominant] + (dominant === 'accro' ? '?email=' + encodeURIComponent(email) : '')

    try {
      await Promise.race([
        fetch('https://abrilove-quiz-submit.sofiane-daboussi.workers.dev', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, profile: dominant, scores, answers, timestamp: new Date().toISOString() }),
          keepalive: true,
        }),
        new Promise(r => setTimeout(r, 3000)),
      ])
    } catch (_) {}

    window.location.href = redirectUrl
  }

  const progress = ((currentQ - 1) / 17) * 100
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Crimson+Pro:wght@300;400;500;600&display=swap" />
      <div>

      {showResume && (
        <div className="qz-resume-overlay">
          <div className="qz-resume-box">
            <div className="qz-resume-title">Quiz en cours 💌</div>
            <p className="qz-resume-text">Tu as déjà commencé ce quiz. Veux-tu continuer où tu t'es arrêté·e ou recommencer ?</p>
            <div className="qz-resume-btns">
              <button className="qz-resume-restart" onClick={resumeRestart}>Recommencer</button>
              <button className="qz-resume-continue" onClick={resumeContinue}>Continuer</button>
            </div>
          </div>
        </div>
      )}

      <div className="qz-progress-bar">
        <div className="qz-progress-fill" style={{ width: progress + '%' }} />
      </div>

      <div className="qz-blob" style={{ width: 550, height: 550, background: 'radial-gradient(circle, rgba(230,60,150,0.65) 0%, transparent 65%)', top: '12%', right: '-12%', filter: 'blur(55px)', animation: 'qz-blob-a 7s ease-in-out infinite' }} />
      <div className="qz-blob" style={{ width: 480, height: 480, background: 'radial-gradient(circle, rgba(200,30,120,0.6) 0%, transparent 65%)', bottom: '18%', left: '-10%', filter: 'blur(50px)', animation: 'qz-blob-b 9s ease-in-out infinite' }} />
      <div className="qz-blob" style={{ width: 420, height: 420, background: 'radial-gradient(circle, rgba(240,70,155,0.55) 0%, transparent 65%)', bottom: '20%', right: '-8%', filter: 'blur(52px)', animation: 'qz-blob-a 8s ease-in-out infinite reverse' }} />
      <div className="qz-blob" style={{ width: 380, height: 380, background: 'radial-gradient(circle, rgba(240,80,160,0.5) 0%, transparent 65%)', top: '40%', left: '30%', filter: 'blur(60px)', animation: 'qz-blob-c 6s ease-in-out infinite' }} />

      <div className="qz-wrap" style={{ position: 'relative', zIndex: 1 }}>
        <div className="qz-card">
          <div className="qz-card-progress">
            <div className="qz-card-progress-fill" style={{ width: progress + '%' }} />
          </div>

          <img
            className="qz-logo"
            src="/images/logo-abrilove.avif"
            alt="Abrilove"
          />

          <div className="qz-card-content">
            <div className="qz-card-inner">

              {QUESTIONS.map(({ q, text }) => (
                <div key={q} className={`qz-question${currentQ === q ? ' active' : ''}`}>
                  <div className="qz-question-number">QUESTION {q}/16</div>
                  <div className="qz-question-text">{text}</div>
                  <div className="qz-options">
                    {OPTS.map(opt => (
                      <div
                        key={opt.value}
                        className={`qz-option${answers[q] === opt.value ? ' selected' : ''}`}
                        onClick={() => selectOption(q, opt.value)}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                  {q > 1 && (
                    <div className="qz-nav">
                      <button className="qz-btn-back" onClick={() => setCurrentQ(q - 1)}>← Retour</button>
                    </div>
                  )}
                </div>
              ))}

              <div className={`qz-question${currentQ === 17 ? ' active' : ''}`}>
                <div className="qz-email-section">
                  <div className="qz-email-title">Merci d'avoir répondu au quiz 💌</div>
                  <p className="qz-email-subtitle">Entre ton email pour découvrir ton profil amoureux et ce que ça change concrètement pour toi (beaucoup de choses...)</p>
                  <input
                    type="email"
                    className="qz-email-input"
                    placeholder="Ton email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && emailValid) submitQuiz() }}
                  />
                  <p className="qz-email-disclaimer">En laissant ton email, tu rejoins aussi la newsletter Abrilove. Tu peux te désinscrire à tout moment.</p>
                </div>
                <div className="qz-nav">
                  <button className="qz-btn-back" onClick={() => setCurrentQ(16)}>← Retour</button>
                  <button className="qz-btn-submit" disabled={!emailValid || loading} onClick={submitQuiz}>
                    Découvrir mon profil
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'flex-end', paddingRight: 24, paddingBottom: 'max(env(safe-area-inset-bottom, 20px), 20px)', paddingTop: 10, zIndex: 10, pointerEvents: 'none' }}>
        <a href="/" className="qz-back-home" style={{ pointerEvents: 'auto' }}>← Retour à l'accueil</a>
      </div>

      {loading && (
        <div className="qz-loading">
          <div className="qz-spinner" />
          <p className="qz-loading-text">Analyse en cours...</p>
        </div>
      )}
    </>
  )
}
