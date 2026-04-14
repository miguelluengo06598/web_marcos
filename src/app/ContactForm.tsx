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
      <div className="border border-black/10 p-10 text-center bg-white/50">
        <p className="text-xs uppercase tracking-widest text-black/30 mb-4">Recibido</p>
        <p className="text-2xl font-light mb-2" style={{fontFamily: "Georgia, serif"}}>Mensaje enviado.</p>
        <p className="text-sm text-black/40">Me pondre en contacto contigo en menos de 24 horas.</p>
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {[
        { field: "nombre", label: "Nombre", type: "text", placeholder: "Tu nombre completo" },
        { field: "email", label: "Email", type: "email", placeholder: "tu@email.com" },
        { field: "telefono", label: "Telefono", type: "tel", placeholder: "+34 600 000 000" },
      ].map((f) => (
        <div key={f.field} className="border-t border-black/10 py-4">
          <label className="block text-xs uppercase tracking-widest text-black/30 mb-2">{f.label}</label>
          <input
            type={f.type}
            value={(form as any)[f.field]}
            onChange={e => update(f.field, e.target.value)}
            placeholder={f.placeholder}
            className="w-full bg-transparent text-sm text-black placeholder:text-black/20 focus:outline-none py-1"
          />
        </div>
      ))}
      <div className="border-t border-black/10 py-4">
        <label className="block text-xs uppercase tracking-widest text-black/30 mb-2">Mensaje</label>
        <textarea
          value={form.mensaje}
          onChange={e => update("mensaje", e.target.value)}
          placeholder="Cuentame tu situacion..."
          rows={4}
          className="w-full bg-transparent text-sm text-black placeholder:text-black/20 focus:outline-none resize-none py-1"
        />
      </div>
      <div className="border-t border-black/10 pt-6">
        {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="text-xs uppercase tracking-widest border border-black px-8 py-4 hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-30 w-full"
        >
          {loading ? "Enviando..." : "Enviar mensaje →"}
        </button>
        <p className="text-xs text-black/20 mt-3 text-center">Tus datos no seran compartidos con terceros.</p>
      </div>
    </div>
  )
}
