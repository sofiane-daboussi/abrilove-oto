'use client'
import { useState } from 'react'
import Header from './Header'
import Footer from './Footer'

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
  if (!re.test(email)) return 'Email invalide'
  const tld = email.split('.').pop().toLowerCase()
  const common = ['fr','com','net','org','io','co','eu','be','ch','ca','uk','de','es','it']
  if (tld.length >= 2 && !common.includes(tld)) return 'Vérifie l\'extension (ex: .com, .fr)'
  return null
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)

  function validate() {
    const e = {}
    if (form.name.trim().length < 2) e.name = 'Prénom trop court'
    const emailErr = validateEmail(form.email)
    if (emailErr) e.email = emailErr
    if (form.message.trim().length < 10) e.message = 'Message trop court'
    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <style>{`
        .contact-input::placeholder { color: rgba(255,255,255,0.4); }
        .contact-input:focus { border-color: rgba(255,255,255,0.8) !important; }
        @keyframes contact-blob1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-20px) scale(1.1)} }
        @keyframes contact-blob2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,30px) scale(0.95)} }
        @keyframes contact-pulse { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        .contact-btn-submit { transition: transform 0.2s, box-shadow 0.2s; animation: contact-pulse 2.5s ease-in-out infinite; will-change: transform; }
        .contact-btn-submit:hover:not(:disabled) { transform: translateY(-3px) !important; animation: none; box-shadow: 0 10px 28px rgba(0,0,0,0.2); }
        .contact-btn-ia { transition: transform 0.2s, box-shadow 0.2s, background 0.2s; animation: contact-pulse 2.5s ease-in-out infinite; will-change: transform; }
        .contact-btn-ia:hover { background: #4a0830 !important; transform: translateY(-3px) !important; animation: none; box-shadow: 0 10px 28px rgba(102,10,67,0.4); }
      `}</style>
      <div style={{ margin: '-24px -16px' }}>
        <Header />

        {/* ── HERO BORDEAUX ── */}
        <section style={{ background: 'linear-gradient(180deg, #660A43 0%, #8a1258 50%, #660A43 100%)', padding: 'clamp(120px,12vw,160px) clamp(16px,5vw,80px) 100px', position: 'relative', overflow: 'hidden' }}>
          {/* Blobs */}
          <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(190,25,105,0.5) 0%, transparent 65%)', top:'10%', right:'-10%', filter:'blur(50px)', animation:'contact-blob1 7s ease-in-out infinite', pointerEvents:'none' }} />
          <div style={{ position:'absolute', width:380, height:380, borderRadius:'50%', background:'radial-gradient(circle, rgba(160,15,85,0.45) 0%, transparent 65%)', bottom:'-5%', left:'-8%', filter:'blur(45px)', animation:'contact-blob2 9s ease-in-out infinite', pointerEvents:'none' }} />

          <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <p style={{ color: 'rgba(255,241,231,0.55)', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20, textAlign: 'center' }}>
              Contact
            </p>

            <h1 style={{ fontFamily: 'var(--font-playfair, serif)', color: '#FFF1E7', fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: 700, textAlign: 'center', marginBottom: 12, lineHeight: 1.2 }}>
              Une question ?<br />
              <em style={{ fontStyle: 'italic' }}>On te répond.</em>
            </h1>

            <p style={{ color: 'rgba(255,241,231,0.85)', textAlign: 'center', fontSize: 15, marginBottom: 40, lineHeight: 1.6 }}>
              Pour toute question sur nos e-books, un problème de commande,<br />ou simplement pour dire bonjour.
            </p>

            {status === 'sent' ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <p style={{ color: '#fff', fontSize: 20, fontFamily: 'var(--font-playfair, serif)', marginBottom: 8 }}>
                  Message envoyé ✓
                </p>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>On te répond dans les 24h.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <label style={labelStyle}>Prénom <span style={{color:'rgba(255,180,200,0.9)'}}>*</span></label>
                    <input
                      type="text"
                      placeholder="Ton prénom"
                      value={form.name}
                      onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({...er, name: null})) }}
                      style={{ ...inputStyle, borderColor: errors.name ? '#f4a0a0' : 'rgba(255,255,255,0.25)' }}
                      className="contact-input"
                    />
                    {errors.name && <p style={errorStyle}>{errors.name}</p>}
                  </div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <label style={labelStyle}>Email <span style={{color:'rgba(255,180,200,0.9)'}}>*</span></label>
                    <input
                      type="email"
                      placeholder="ton@email.com"
                      value={form.email}
                      onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({...er, email: null})) }}
                      style={{ ...inputStyle, borderColor: errors.email ? '#f4a0a0' : 'rgba(255,255,255,0.25)' }}
                      className="contact-input"
                    />
                    {errors.email && <p style={errorStyle}>{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Message <span style={{color:'rgba(255,180,200,0.9)'}}>*</span></label>
                  <textarea
                    rows={5}
                    placeholder="Dis-nous tout…"
                    value={form.message}
                    onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setErrors(er => ({...er, message: null})) }}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 130, borderColor: errors.message ? '#f4a0a0' : 'rgba(255,255,255,0.25)' }}
                    className="contact-input"
                  />
                  {errors.message && <p style={errorStyle}>{errors.message}</p>}
                </div>

                {status === 'error' && (
                  <p style={{ color: '#f4a0a0', fontSize: 14 }}>
                    Une erreur s'est produite. Écris-nous à <a href="mailto:bonjour@abrilove.fr" style={{ color: '#fff' }}>bonjour@abrilove.fr</a>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="contact-btn-submit"
                  style={{
                    background: status === 'sending' ? 'rgba(255,255,255,0.15)' : '#fff',
                    color: status === 'sending' ? '#fff' : '#660A43',
                    border: 'none',
                    borderRadius: 8,
                    padding: '16px 32px',
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                    letterSpacing: '0.05em',
                  }}
                >
                  {status === 'sending' ? 'Envoi…' : 'Envoyer le message'}
                </button>

              </form>
            )}

            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center', marginTop: 28 }}>
              Ou par email : <a href="mailto:bonjour@abrilove.fr" style={{ color: 'rgba(255,255,255,0.8)' }}>bonjour@abrilove.fr</a>
            </p>
          </div>

          {/* Arc bas */}
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ position:'absolute', bottom:0, left:0, width:'100%', height:80, display:'block' }}>
            <path d="M0,80 C360,0 1080,0 1440,80 L1440,80 L0,80 Z" fill="#FFF4F7" />
          </svg>
        </section>

        {/* ── L'ABRI IA ── */}
        <section style={{ background: '#FFF4F7', padding: 'clamp(56px,6vw,96px) clamp(16px,5vw,80px)' }}>
          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ color: '#660A43', fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
              IA disponible 24h/24
            </p>
            <h2 style={{ fontFamily: 'var(--font-playfair, serif)', color: '#660A43', fontSize: 'clamp(22px,4vw,34px)', fontWeight: 700, marginBottom: 20, lineHeight: 1.25 }}>
              Ce n'est pas une IA comme les autres.
            </h2>
            <p style={{ color: '#5a3040', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.85, marginBottom: 36 }}>
              L'Abri IA s'appuie sur tout ce qu'on a construit ces dernières années : des <strong>milliers d'heures de coaching</strong>, des <strong>milliers d'échanges</strong>, et des situations réelles qu'on a accompagnées.<br /><br />
              Ce n'est pas une réponse générique. C'est une vraie compréhension de ce que tu vis. C'est comme parler à nous, mais disponible à tout moment, <strong>24h/24, 7j/7</strong>.
            </p>
            <a
              href="https://ia.abrilove.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn-ia"
              style={{
                display: 'inline-block',
                background: '#660A43',
                color: '#fff',
                borderRadius: 8,
                padding: '16px 36px',
                fontSize: 16,
                fontWeight: 600,
                textDecoration: 'none',
                letterSpacing: '0.05em',
              }}
            >
              Essayer gratuitement →
            </a>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}

const errorStyle = {
  color: '#f4a0a0',
  fontSize: 12,
  marginTop: 4,
}

const labelStyle = {
  display: 'block',
  color: 'rgba(255,255,255,0.7)',
  fontSize: 13,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: 8,
}

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.25)',
  borderRadius: 8,
  padding: '14px 16px',
  color: '#fff',
  fontSize: 16,
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
  fontFamily: 'var(--font-dm-sans, sans-serif)',
}
