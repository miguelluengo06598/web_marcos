'use client'

import { useState } from 'react'

interface Props {
  clienteId: string
  portfolio: {
    id: string
    total_value: number
    initial_investment: number
  } | null
}

export default function ClienteIntradiarioForm({ clienteId, portfolio }: Props) {
  const [capitalTotal, setCapitalTotal] = useState(portfolio?.total_value?.toString() || '0')
  const [inversionInicial, setInversionInicial] = useState(portfolio?.initial_investment?.toString() || '0')
  const [saving, setSaving] = useState(false)
  const [snapshotting, setSnapshotting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [snapshotSaved, setSnapshotSaved] = useState(false)
  const [error, setError] = useState('')

  const capital = parseFloat(capitalTotal) || 0
  const inversion = parseFloat(inversionInicial) || 0
  const rentabilidad = inversion > 0 ? ((capital - inversion) / inversion) * 100 : null
  const isPositive = rentabilidad !== null && rentabilidad >= 0

  async function handleSave() {
    if (!portfolio?.id) return
    setSaving(true)
    setSaved(false)
    setError('')

    const res = await fetch('/api/admin/intradiario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        portfolioId: portfolio.id,
        capitalTotal,
        inversionInicial,
      }),
    })

    const data = await res.json()
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      setError(data.error || 'Error al guardar')
    }
    setSaving(false)
  }

  async function handleSnapshot() {
    setSnapshotting(true)
    setSnapshotSaved(false)
    setError('')

    const res = await fetch('/api/admin/snapshot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: clienteId,
        capitalTotal: capital,
      }),
    })

    const data = await res.json()
    if (res.ok) {
      setSnapshotSaved(true)
      setTimeout(() => setSnapshotSaved(false), 3000)
    } else {
      setError(data.error || 'Error al guardar snapshot')
    }
    setSnapshotting(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">

      {/* KPI preview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Capital Total</p>
          <p className="text-xl font-bold text-gray-900">
            €{capital.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Inv. Inicial</p>
          <p className="text-xl font-bold text-gray-900">
            €{inversion.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className={`rounded-xl p-4 border ${rentabilidad === null ? 'bg-gray-50 border-gray-100' : isPositive ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Rentabilidad</p>
          {rentabilidad === null ? (
            <p className="text-xl font-bold text-gray-300">—</p>
          ) : (
            <p className={`text-xl font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{rentabilidad.toFixed(2)}%
            </p>
          )}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Capital Total (€)
          </label>
          <input
            type="number"
            value={capitalTotal}
            onChange={e => setCapitalTotal(e.target.value)}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Inversión Inicial (€)
          </label>
          <input
            type="number"
            value={inversionInicial}
            onChange={e => setInversionInicial(e.target.value)}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">{error}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleSave}
          disabled={saving || !portfolio?.id}
          className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-40 transition-colors"
        >
          {saving ? 'Guardando...' : 'Guardar valores'}
        </button>

        <button
          onClick={handleSnapshot}
          disabled={snapshotting}
          className="border border-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 disabled:opacity-40 transition-colors"
        >
          {snapshotting ? 'Guardando...' : '📸 Guardar snapshot ahora'}
        </button>

        {saved && <span className="text-sm text-emerald-600 font-medium">Guardado ✓</span>}
        {snapshotSaved && <span className="text-sm text-emerald-600 font-medium">Snapshot guardado ✓</span>}
      </div>

      <p className="text-xs text-gray-400">
        Los snapshots semanales se guardan automáticamente. Usa el botón para forzar uno manual.
      </p>
    </div>
  )
}
