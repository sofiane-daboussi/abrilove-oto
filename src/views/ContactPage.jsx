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
      background: '#fff1e7',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px 24px 60px',
      fontFamily: 'var(--font-dm-sans, sans-serif)',
    }}>
      <Header />
      <div style={{ maxWidth: 560, width: '100%' }}>

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
          fontSize: 'clamp(28px, 6vw, 44px)',
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
          marginBottom: 48,
          lineHeight: 1.6,
        }}>
          Pour toute question sur nos e-books, un problème de commande,<br />
          ou simplement pour dire bonjour.
        </p>

        {status === 'sent' ? (
          <div style={{
            background: '#fff1e7',
            borderRadius: 20,
            padding: '40px 32px',
            textAlign: 'center',
          }}>
            <p style={{ color: '#660A43', fontSize: 20, fontFamily: 'var(--font-playfair, serif)', marginBottom: 8 }}>
              Message envoyé ✓
            </p>
            <p style={{ color: '#8a5060', fontSize: 14 }}>
              On te répond dans les 24h.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{
            display: 'flex', flexDirection: 'column', gap: 20,
            background: '#fff',
            borderRadius: 20,
            padding: '36px 32px',
            boxShadow: '0 2px 20px rgba(102,10,67,0.08)',
          }}>

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
              <p style={{ color: '#e07070', fontSize: 13 }}>
                Une erreur s'est produite. Réessaie ou écris-nous directement à contact@abrilove.fr
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
                fontSize: 15,
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

        <p style={{ color: '#8a5060', fontSize: 12, textAlign: 'center', marginTop: 40 }}>
          Ou par email directement : <a href="mailto:contact@abrilove.fr" style={{ color: '#c97aaa' }}>contact@abrilove.fr</a>
        </p>

      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  color: '#8a5060',
  fontSize: 12,
  letterSpacing: '0.1em',
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
  fontSize: 15,
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
  fontFamily: 'var(--font-dm-sans, sans-serif)',
}
