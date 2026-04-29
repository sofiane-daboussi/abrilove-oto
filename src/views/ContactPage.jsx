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
        .contact-input::placeholder { color: rgba(102,10,67,0.4); }
        .contact-input:focus { border-color: #660A43 !important; }
        .contact-card { position: relative; overflow: hidden; margin-top: 72px !important; }
        .contact-card:before {
          content: '💗';
          position: absolute;
          bottom: 1rem; left: 15%;
          font-size: 2rem;
          opacity: 0.1;
          pointer-events: none;
          animation: contact-float 6s ease-in-out infinite;
          z-index: 0;
        }
        .contact-card:after {
          content: '💕';
          position: absolute;
          bottom: 1.5rem; right: 15%;
          font-size: 1.8rem;
          opacity: 0.1;
          pointer-events: none;
          animation: contact-float 7s ease-in-out infinite reverse;
          z-index: 0;
        }
        @keyframes contact-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
      <Header />

      <div className="card contact-card">
        <span style={{ position: 'absolute', top: '1rem', left: '15%', fontSize: '2rem', opacity: 0.1, pointerEvents: 'none', animation: 'contact-float 8s ease-in-out infinite', zIndex: 0 }}>💗</span>
        <span style={{ position: 'absolute', top: '1.5rem', right: '15%', fontSize: '1.8rem', opacity: 0.1, pointerEvents: 'none', animation: 'contact-float 5s ease-in-out infinite reverse', zIndex: 0 }}>💕</span>

        <p style={{
          color: '#660A43',
          fontSize: 13,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: 16,
          textAlign: 'center',
        }}>
          Contact
        </p>

        <h1 style={{
          fontFamily: 'var(--font-playfair, serif)',
          color: '#1a0011',
          fontSize: 'clamp(26px, 5vw, 40px)',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: 12,
          lineHeight: 1.2,
        }}>
          Une question ?<br />
          <em style={{ color: '#660A43', fontStyle: 'italic' }}>On te répond.</em>
        </h1>

        <p style={{
          color: '#8a5060',
          textAlign: 'center',
          fontSize: 15,
          marginBottom: 32,
          lineHeight: 1.6,
        }}>
          Pour toute question sur nos e-books, un problème de commande,
          ou simplement pour dire bonjour.
        </p>

        {status === 'sent' ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <p style={{ color: '#660A43', fontSize: 20, fontFamily: 'var(--font-playfair, serif)', marginBottom: 8 }}>
              Message envoyé ✓
            </p>
            <p style={{ color: '#8a5060', fontSize: 14 }}>On te répond dans les 24h.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={labelStyle}>Prénom <span style={{color:'#660A43'}}>*</span></label>
                <input
                  type="text"
                  placeholder="Ton prénom"
                  value={form.name}
                  onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({...er, name: null})) }}
                  style={{ ...inputStyle, borderColor: errors.name ? '#c0392b' : 'rgba(102,10,67,0.3)' }}
                  className="contact-input"
                />
                {errors.name && <p style={errorStyle}>{errors.name}</p>}
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={labelStyle}>Email <span style={{color:'#660A43'}}>*</span></label>
                <input
                  type="email"
                  placeholder="ton@email.com"
                  value={form.email}
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({...er, email: null})) }}
                  style={{ ...inputStyle, borderColor: errors.email ? '#c0392b' : 'rgba(102,10,67,0.3)' }}
                  className="contact-input"
                />
                {errors.email && <p style={errorStyle}>{errors.email}</p>}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Message <span style={{color:'#660A43'}}>*</span></label>
              <textarea
                rows={5}
                placeholder="Dis-nous tout…"
                value={form.message}
                onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setErrors(er => ({...er, message: null})) }}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 130, borderColor: errors.message ? '#c0392b' : 'rgba(102,10,67,0.3)' }}
                className="contact-input"
              />
              {errors.message && <p style={errorStyle}>{errors.message}</p>}
            </div>

            {status === 'error' && (
              <p style={{ color: '#c0392b', fontSize: 14 }}>
                Une erreur s'est produite. Écris-nous à <a href="mailto:bonjour@abrilove.fr" style={{ color: '#660A43' }}>bonjour@abrilove.fr</a>
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              style={{
                background: status === 'sending' ? '#4a0830' : '#660A43',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '16px 32px',
                fontSize: 16,
                fontWeight: 600,
                cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                letterSpacing: '0.05em',
              }}
            >
              {status === 'sending' ? 'Envoi…' : 'Envoyer le message'}
            </button>

          </form>
        )}

        <p style={{ color: '#8a5060', fontSize: 13, textAlign: 'center', marginTop: 28 }}>
          Ou par email : <a href="mailto:bonjour@abrilove.fr" style={{ color: '#660A43' }}>bonjour@abrilove.fr</a>
        </p>

      </div>
      <Footer />
    </>
  )
}

const errorStyle = {
  color: '#c0392b',
  fontSize: 12,
  marginTop: 4,
}

const labelStyle = {
  display: 'block',
  color: '#8a5060',
  fontSize: 13,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: 8,
}

const inputStyle = {
  width: '100%',
  background: 'transparent',
  border: '1px solid rgba(102,10,67,0.3)',
  borderRadius: 8,
  padding: '14px 16px',
  color: '#2a0a1a',
  fontSize: 16,
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
  fontFamily: 'var(--font-dm-sans, sans-serif)',
}
