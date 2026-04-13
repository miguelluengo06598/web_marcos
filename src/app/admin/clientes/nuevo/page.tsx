'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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

    // Crear usuario en Supabase Auth vía API route
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

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Volver
        </button>
        <h2 className="text-xl font-medium text-gray-900">Nuevo cliente</h2>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Nombre completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.full_name}
            onChange={e => update('full_name', e.target.value)}
            placeholder="Juan López García"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            placeholder="juan@email.com"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Contraseña inicial <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.password}
            onChange={e => update('password', e.target.value)}
            placeholder="Mínimo 8 caracteres"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <p className="text-xs text-gray-400 mt-1">
            El cliente podrá cambiarla después desde su perfil
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Teléfono (opcional)
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => update('phone', e.target.value)}
            placeholder="+34 600 000 000"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-40 transition-colors"
        >
          {loading ? 'Creando cliente...' : 'Crear cliente'}
        </button>
      </div>
    </div>
  )
}