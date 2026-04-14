"use client"

import { useState } from "react"

export default function ContactFormWope() {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", mensaje: "" })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [focused, setFocused] = useState("")

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    if (!form.nombre || !form.email || !form.mensaje) {
      setError("Nombre, email y mensaje son obligatorios")
      return
    }
    setLoading(true)
    setError("")
    const res = await fetch("/api/contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) setSent(true)
    else setError("Error al enviar. Intentalo de nuevo.")
    setLoading(false)
  }

  const inputStyle = (field: string) => ({
    width: "100%",
    background: focused === field ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
    border: `1px solid ${focused === field ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 14,
    color: "#fff",
    outline: "none",
    transition: "all 0.2s",
    fontFamily: "-apple-system, sans-serif",
    cursor: "none",
  })

  if (sent) {
    return (
      <div style={{background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 16, padding: 40, textAlign: "center"}}>
        <div style={{width: 48, height: 48, borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 20, color: "#22c55e"}}>✓</div>
        <p style={{fontSize: 18, fontWeight: 700, marginBottom: 8}}>Mensaje recibido</p>
        <p style={{fontSize: 13, color: "rgba(255,255,255,0.4)"}}>Me pondre en contacto contigo en menos de 24 horas.</p>
      </div>
    )
  }

  return (
    <div style={{background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 28}}>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12}}>
        <div>
          <label style={{display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: 6}}>Nombre *</label>
          <input
            type="text"
            value={form.nombre}
            onChange={e => update("nombre", e.target.value)}
            onFocus={() => setFocused("nombre")}
            onBlur={() => setFocused("")}
            placeholder="Tu nombre"
            style={{...inputStyle("nombre"), boxSizing: "border-box"} as any}
          />
        </div>
        <div>
          <label style={{display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: 6}}>Telefono</label>
          <input
            type="tel"
            value={form.telefono}
            onChange={e => update("telefono", e.target.value)}
            onFocus={() => setFocused("telefono")}
            onBlur={() => setFocused("")}
            placeholder="+34 600 000 000"
            style={{...inputStyle("telefono"), boxSizing: "border-box"} as any}
          />
        </div>
      </div>
      <div style={{marginBottom: 12}}>
        <label style={{display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: 6}}>Email *</label>
        <input
          type="email"
          value={form.email}
          onChange={e => update("email", e.target.value)}
          onFocus={() => setFocused("email")}
          onBlur={() => setFocused("")}
          placeholder="tu@email.com"
          style={inputStyle("email") as any}
        />
      </div>
      <div style={{marginBottom: 16}}>
        <label style={{display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: 6}}>Mensaje *</label>
        <textarea
          value={form.mensaje}
          onChange={e => update("mensaje", e.target.value)}
          onFocus={() => setFocused("mensaje")}
          onBlur={() => setFocused("")}
          placeholder="Cuentame tu situacion..."
          rows={4}
          style={{...inputStyle("mensaje"), resize: "none", boxSizing: "border-box"} as any}
        />
      </div>
      {error && <p style={{fontSize: 12, color: "#ef4444", marginBottom: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "8px 12px"}}>{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{width: "100%", background: loading ? "rgba(34,197,94,0.5)" : "#22c55e", color: "#000", border: "none", borderRadius: 10, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "none", transition: "all 0.2s", boxShadow: "0 0 20px rgba(34,197,94,0.2)"}}
      >
        {loading ? "Enviando..." : "Enviar mensaje →"}
      </button>
      <p style={{fontSize: 11, color: "rgba(255,255,255,0.15)", textAlign: "center", marginTop: 12, textTransform: "uppercase", letterSpacing: "0.08em"}}>Tus datos no seran compartidos</p>
    </div>
  )
}
