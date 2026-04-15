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
    if (res.ok) setSent(true)
    else setError("Error al enviar. Intentalo de nuevo.")
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
        <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500 text-xl">✓</div>
        <p className="font-medium text-gray-900 mb-1">Mensaje recibido</p>
        <p className="text-sm text-gray-400">Me pondre en contacto contigo en menos de 24 horas.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Nombre *</label>
          <input type="text" value={form.nombre} onChange={e => update("nombre", e.target.value)}
            placeholder="Tu nombre" className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder:text-gray-300" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Telefono</label>
          <input type="tel" value={form.telefono} onChange={e => update("telefono", e.target.value)}
            placeholder="+34 600 000 000" className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder:text-gray-300" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Email *</label>
        <input type="email" value={form.email} onChange={e => update("email", e.target.value)}
          placeholder="tu@email.com" className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder:text-gray-300" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Mensaje *</label>
        <textarea value={form.mensaje} onChange={e => update("mensaje", e.target.value)}
          rows={4} placeholder="Cuentame tu situacion..." className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none text-gray-900 placeholder:text-gray-300" />
      </div>
      {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      <button onClick={handleSubmit} disabled={loading}
        className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-40 transition-colors">
        {loading ? "Enviando..." : "Enviar mensaje"}
      </button>
      <p className="text-xs text-gray-300 text-center">Tus datos no seran compartidos con terceros.</p>
    </div>
  )
}
