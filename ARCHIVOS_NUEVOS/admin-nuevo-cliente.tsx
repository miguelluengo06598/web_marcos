'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NuevoClientePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
  })

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    if (!form.full_name || !form.email || !form.password) {
      setError('Nombre, email y contraseña son obligatorios')
      return
    }

    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Error al crear el cliente')
      setLoading(false)
      return
    }

    router.push('/admin/clientes')
    router.refresh()
  }

  const fieldStyle = {
    width: "100%",
    padding: "10px 14px",
    fontSize: 13,
  }

  const labelStyle = {
    display: "block" as const,
    fontSize: 12,
    fontWeight: 500 as const,
    fontFamily: "var(--font-display)",
    color: "var(--text-muted)",
    marginBottom: 6,
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
        <button
          onClick={() => router.back()}
          style={{
            fontSize: 13,
            color: "var(--text-dim)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-display)",
            padding: 0,
            transition: "color 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}
        >
          ← Volver
        </button>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>
          Nuevo cliente
        </h2>
      </div>

      <div style={{
        background: "var(--surface2)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}>
        <div>
          <label style={labelStyle}>Nombre completo <span style={{ color: "var(--red)" }}>*</span></label>
          <input type="text" value={form.full_name} onChange={e => update('full_name', e.target.value)} placeholder="Juan López García" style={fieldStyle} />
        </div>

        <div>
          <label style={labelStyle}>Email <span style={{ color: "var(--red)" }}>*</span></label>
          <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="juan@email.com" style={fieldStyle} />
        </div>

        <div>
          <label style={labelStyle}>Contraseña inicial <span style={{ color: "var(--red)" }}>*</span></label>
          <input type="text" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Mínimo 8 caracteres" style={fieldStyle} />
          <p style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 5 }}>
            El cliente podrá cambiarla después desde su perfil
          </p>
        </div>

        <div>
          <label style={labelStyle}>Teléfono (opcional)</label>
          <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+34 600 000 000" style={fieldStyle} />
        </div>

        {error && (
          <div style={{
            fontSize: 12,
            color: "var(--red)",
            background: "var(--red-dim)",
            border: "1px solid rgba(255,77,106,0.2)",
            padding: "10px 14px",
            borderRadius: 8,
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "11px 0",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "var(--font-display)",
            background: "var(--cyan)",
            color: "var(--bg)",
            border: "none",
            borderRadius: 8,
            cursor: loading ? "wait" : "pointer",
            opacity: loading ? 0.5 : 1,
            transition: "opacity 0.15s",
            letterSpacing: "-0.01em",
          }}
        >
          {loading ? 'Creando cliente...' : 'Crear cliente'}
        </button>
      </div>
    </div>
  )
}
