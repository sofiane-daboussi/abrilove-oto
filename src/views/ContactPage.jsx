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
      background: '#660A43',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '80px 8px 40px',
      fontFamily: 'var(--font-dm-sans, sans-serif)',
    }}>
      <Header />

      <div style={{
        background: '#fff1e7',
        borderRadius: 24,
        padding: '40px 28px',
        width: '100%',
        maxWidth: 680,
        marginTop: 8,
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
                <label style={labelStyle}>Prénom</label>
                <input
                  type="text"
                  required
                  placeholder="Ton prénom"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#660A43'}
                  onBlur={e => e.target.style.borderColor = 'rgba(102,10,67,0.2)'}
                />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  required
                  placeholder="ton@email.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#660A43'}
                  onBlur={e => e.target.style.borderColor = 'rgba(102,10,67,0.2)'}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Message</label>
              <textarea
                required
                rows={5}
                placeholder="Dis-nous tout…"
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 130 }}
                onFocus={e => e.target.style.borderColor = '#660A43'}
                onBlur={e => e.target.style.borderColor = 'rgba(102,10,67,0.2)'}
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
  background: '#fff',
  border: '1px solid rgba(102,10,67,0.2)',
  borderRadius: 8,
  padding: '14px 16px',
  color: '#2a0a1a',
  fontSize: 16,
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
  fontFamily: 'var(--font-dm-sans, sans-serif)',
}
