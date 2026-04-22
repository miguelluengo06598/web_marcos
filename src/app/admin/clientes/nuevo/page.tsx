'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

function generatePassword(length = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function NuevoClientePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null)
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    initial_investment: '',
  })

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleAutoPassword() {
    update('password', generatePassword())
  }

  async function handleSubmit() {
    if (!form.full_name || !form.email || !form.password) {
      setError('Nombre, email y contraseña son obligatorios')
      return
    }
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        initial_investment: parseFloat(form.initial_investment) || 0,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Error al crear el cliente')
      setLoading(false)
      return
    }

    setCreated({ email: form.email, password: form.password })
    setLoading(false)
  }

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide"

  if (created) {
    return (
      <div style={{ maxWidth: 520 }}>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-2xl">✓</div>
          <h2 className="text-xl font-bold text-gray-900">Cliente creado correctamente</h2>
          <p className="text-sm text-gray-500">Guarda estas credenciales y compártelas con el cliente de forma segura.</p>

          <div className="bg-white border border-emerald-200 rounded-xl p-5 text-left space-y-3 mt-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Email</p>
              <p className="text-sm font-mono font-semibold text-gray-900 select-all">{created.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Contraseña temporal</p>
              <p className="text-sm font-mono font-semibold text-gray-900 select-all">{created.password}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                setCreated(null)
                setForm({ full_name: '', email: '', password: '', phone: '', initial_investment: '' })
              }}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Crear otro cliente
            </button>
            <button
              onClick={() => router.push('/admin/clientes')}
              className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              Ver clientes →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <div className="flex items-center gap-3 mb-7">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          ← Volver
        </button>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Nuevo cliente</h2>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">

        <div>
          <label className={labelClass}>Nombre completo <span className="text-red-400">*</span></label>
          <input
            type="text"
            value={form.full_name}
            onChange={e => update('full_name', e.target.value)}
            placeholder="Juan López García"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Email <span className="text-red-400">*</span></label>
          <input
            type="email"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            placeholder="juan@email.com"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Contraseña inicial <span className="text-red-400">*</span></label>
          <div className="flex gap-2">
            <input
              type="text"
              value={form.password}
              onChange={e => update('password', e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className={inputClass}
            />
            <button
              type="button"
              onClick={handleAutoPassword}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 whitespace-nowrap transition-colors"
            >
              Generar
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1.5">El cliente podrá cambiarla después desde su perfil</p>
        </div>

        <div>
          <label className={labelClass}>Teléfono (opcional)</label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => update('phone', e.target.value)}
            placeholder="+34 600 000 000"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Inversión inicial (€)</label>
          <input
            type="number"
            value={form.initial_investment}
            onChange={e => update('initial_investment', e.target.value)}
            placeholder="0"
            min="0"
            step="0.01"
            className={inputClass}
          />
          <p className="text-xs text-gray-400 mt-1.5">Importe de referencia para calcular la rentabilidad intradiaria</p>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Creando cliente...' : 'Crear cliente'}
        </button>
      </div>
    </div>
  )
}
