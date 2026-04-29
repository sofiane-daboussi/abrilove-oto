'use client'
import { useState } from 'react'
import Header from './Header'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
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
    <div style={{
      minHeight: '100vh',
      padding: '84px 0 0',
      fontFamily: 'var(--font-dm-sans, sans-serif)',
    }}>
      <style>{`
        .contact-input::placeholder { color: rgba(102,10,67,0.4); }
        .contact-input:focus { border-color: #660A43 !important; }
      `}</style>
      <Header />

      <div style={{
        background: '#FFF1E7',
        borderRadius: 20,
        maxWidth: 680,
        margin: '0 auto',
        padding: '36px 28px 48px',
      }}>

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
                  required
                  placeholder="Ton prénom"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={inputStyle}
                  className="contact-input"
                />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={labelStyle}>Email <span style={{color:'#660A43'}}>*</span></label>
                <input
                  type="email"
                  required
                  placeholder="ton@email.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={inputStyle}
                  className="contact-input"
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Message <span style={{color:'#660A43'}}>*</span></label>
              <textarea
                required
                rows={5}
                placeholder="Dis-nous tout…"
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 130 }}
                className="contact-input"
              />
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
    </div>
  )
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
