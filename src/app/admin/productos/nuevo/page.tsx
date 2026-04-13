'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { RiskLevel } from '@/lib/types'

const RISK_OPTIONS: { value: RiskLevel; label: string }[] = [
  { value: 'bajo', label: 'Bajo' },
  { value: 'moderado', label: 'Moderado' },
  { value: 'alto', label: 'Alto' },
  { value: 'muy_alto', label: 'Muy alto' },
]

export default function NuevoProductoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [clientes, setClientes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    client_id: searchParams.get('cliente') || '',
    name: '',
    isin: '',
    manager: '',
    estimated_return: '',
    min_horizon_years: '',
    min_investment: '',
    management_fee: '',
    risk_level: 'moderado' as RiskLevel,
    advisor_note: '',
    is_priority: false,
  })

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, full_name')
      .eq('role', 'client')
      .then(({ data }) => setClientes(data || []))
  }, [])

  function update(field: string, value: any) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    if (!form.client_id || !form.name) {
      setError('Cliente y nombre del producto son obligatorios')
      return
    }
    setLoading(true)
    setError('')

    const { error: err } = await supabase.from('products').insert({
      client_id: form.client_id,
      name: form.name,
      isin: form.isin || null,
      manager: form.manager || null,
      estimated_return: form.estimated_return || null,
      min_horizon_years: form.min_horizon_years ? parseInt(form.min_horizon_years) : null,
      min_investment: form.min_investment ? parseFloat(form.min_investment) : null,
      management_fee: form.management_fee ? parseFloat(form.management_fee) : null,
      risk_level: form.risk_level,
      advisor_note: form.advisor_note || null,
      is_priority: form.is_priority,
    })

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    const clienteId = form.client_id
    router.push(clienteId ? `/admin/clientes/${clienteId}` : '/admin/productos')
    router.refresh()
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-900">
          ← Volver
        </button>
        <h2 className="text-xl font-medium text-gray-900">Asignar producto</h2>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Cliente *</label>
          <select
            value={form.client_id}
            onChange={e => update('client_id', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="">Seleccionar cliente...</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.full_name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre del producto *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="Ej: Fondo Mixto Global"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Gestora</label>
            <input
              type="text"
              value={form.manager}
              onChange={e => update('manager', e.target.value)}
              placeholder="Ej: Amundi"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ISIN</label>
            <input
              type="text"
              value={form.isin}
              onChange={e => update('isin', e.target.value)}
              placeholder="Ej: FR0010315770"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Rentabilidad estimada</label>
            <input
              type="text"
              value={form.estimated_return}
              onChange={e => update('estimated_return', e.target.value)}
              placeholder="Ej: 6-8%"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Plazo mín. (años)</label>
            <input
              type="number"
              value={form.min_horizon_years}
              onChange={e => update('min_horizon_years', e.target.value)}
              placeholder="3"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Inversión mínima (€)</label>
            <input
              type="number"
              value={form.min_investment}
              onChange={e => update('min_investment', e.target.value)}
              placeholder="5000"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Comisión gestión (%)</label>
            <input
              type="number"
              step="0.01"
              value={form.management_fee}
              onChange={e => update('management_fee', e.target.value)}
              placeholder="0.85"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nivel de riesgo</label>
          <div className="flex gap-2">
            {RISK_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => update('risk_level', opt.value)}
                className={`flex-1 py-2 rounded-lg text-xs transition-colors ${
                  form.risk_level === opt.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nota personalizada para el cliente</label>
          <textarea
            value={form.advisor_note}
            onChange={e => update('advisor_note', e.target.value)}
            rows={4}
            placeholder="Explica por qué le recomiendas este producto..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_priority}
            onChange={e => update('is_priority', e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm text-gray-700">Marcar como recomendación prioritaria</span>
        </label>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-40 transition-colors"
        >
          {loading ? 'Asignando...' : 'Asignar producto'}
        </button>
      </div>
    </div>
  )
}