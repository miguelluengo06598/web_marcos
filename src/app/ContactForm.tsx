"use client"

import { useState } from "react"

export default function ContactForm() {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", mensaje: "" })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

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
    if (res.ok) {
      setSent(true)
    } else {
      setError("Error al enviar. Intentalo de nuevo.")
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="bg-white/3 border border-white/10 rounded-2xl p-10 text-center">
        <div className="w-12 h-12 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-400 text-xl">✓</span>
        </div>
        <p className="font-medium text-white mb-1">Mensaje recibido</p>
        <p className="text-sm text-white/40">Me pondre en contacto contigo en menos de 24 horas.</p>
      </div>
    )
  }

  return (
    <div className="bg-white/3 border border-white/10 rounded-2xl p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-white/40 mb-1.5">Nombre *</label>
          <input
            type="text"
            value={form.nombre}
            onChange={e => update("nombre", e.target.value)}
            placeholder="Tu nombre"
            className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/40 mb-1.5">Telefono</label>
          <input
            type="tel"
            value={form.telefono}
            onChange={e => update("telefono", e.target.value)}
            placeholder="+34 600 000 000"
            className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-white/40 mb-1.5">Email *</label>
        <input
          type="email"
          value={form.email}
          onChange={e => update("email", e.target.value)}
          placeholder="tu@email.com"
          className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-white/40 mb-1.5">Mensaje *</label>
        <textarea
          value={form.mensaje}
          onChange={e => update("mensaje", e.target.value)}
          rows={4}
          placeholder="Cuentame tu situacion y que buscas..."
          className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 resize-none"
        />
      </div>
      {error && <p className="text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-white text-black py-2.5 rounded-lg text-sm font-medium hover:bg-white/90 disabled:opacity-40 transition-colors"
      >
        {loading ? "Enviando..." : "Enviar mensaje"}
      </button>
      <p className="text-xs text-white/20 text-center">Tus datos no seran compartidos con terceros.</p>
    </div>
  )
}
