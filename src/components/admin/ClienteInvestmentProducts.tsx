'use client'

import { useState } from 'react'
import type { InvestmentProduct, ClientProduct } from '@/lib/types'
import OperacionesAdminSection from './OperacionesAdminSection'

interface Props {
  clienteId: string
  catalog: InvestmentProduct[]
  initialAssignments: ClientProduct[]
}

interface AssignForm {
  productId: string
  initialInvestment: string
  currentCapital: string
}

interface EditState {
  initialInvestment: string
  currentCapital: string
}

export default function ClienteInvestmentProducts({ clienteId, catalog, initialAssignments }: Props) {
  const [assignments, setAssignments] = useState<ClientProduct[]>(initialAssignments)
  const [showAssignForm, setShowAssignForm] = useState(false)
  const [assignForm, setAssignForm] = useState<AssignForm>({ productId: '', initialInvestment: '', currentCapital: '' })
  const [assigning, setAssigning] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editState, setEditState] = useState<EditState>({ initialInvestment: '', currentCapital: '' })
  const [savingId, setSavingId] = useState<string | null>(null)
  const [snapshotId, setSnapshotId] = useState<string | null>(null)
  const [snapshotDoneId, setSnapshotDoneId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const assignedProductIds = new Set(assignments.map(a => a.product_id))
  const availableCatalog = catalog.filter(p => !assignedProductIds.has(p.id))

  // ── Assign ──────────────────────────────────────────────────────────
  async function handleAssign() {
    if (!assignForm.productId) { setError('Selecciona un producto'); return }
    setAssigning(true); setError('')
    const res = await fetch('/api/admin/client-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: clienteId,
        productId: assignForm.productId,
        initialInvestment: assignForm.initialInvestment,
        currentCapital: assignForm.currentCapital,
      }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setAssigning(false); return }
    setAssignments(prev => [...prev, data])
    setAssignForm({ productId: '', initialInvestment: '', currentCapital: '' })
    setShowAssignForm(false)
    setAssigning(false)
  }

  // ── Update capital ──────────────────────────────────────────────────
  function startEdit(a: ClientProduct) {
    setEditingId(a.id)
    setEditState({
      initialInvestment: a.initial_investment.toString(),
      currentCapital: a.current_capital.toString(),
    })
    setError('')
  }

  async function handleUpdate(id: string) {
    setSavingId(id); setError('')
    const res = await fetch(`/api/admin/client-products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        initialInvestment: editState.initialInvestment,
        currentCapital: editState.currentCapital,
      }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setSavingId(null); return }
    setAssignments(prev => prev.map(a => a.id === id
      ? { ...a, initial_investment: data.initial_investment, current_capital: data.current_capital }
      : a
    ))
    setEditingId(null)
    setSavingId(null)
  }

  // ── Snapshot ────────────────────────────────────────────────────────
  async function handleSnapshot(id: string) {
    setSnapshotId(id); setError('')
    const res = await fetch(`/api/admin/client-products/${id}/snapshot`, { method: 'POST' })
    if (!res.ok) { const d = await res.json(); setError(d.error) }
    else {
      setSnapshotDoneId(id)
      setTimeout(() => setSnapshotDoneId(null), 3000)
    }
    setSnapshotId(null)
  }

  // ── Unassign ────────────────────────────────────────────────────────
  async function handleUnassign(id: string, name: string) {
    if (!confirm(`¿Desasignar "${name}" de este cliente? Se eliminarán también sus snapshots.`)) return
    const res = await fetch(`/api/admin/client-products/${id}`, { method: 'DELETE' })
    if (!res.ok) { const d = await res.json(); setError(d.error); return }
    setAssignments(prev => prev.filter(a => a.id !== id))
  }

  const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
  const labelClass = "block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1"

  return (
    <div className="space-y-4">

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">{error}</p>
      )}

      {/* Assign form */}
      {showAssignForm ? (
        <div className="bg-white border-2 border-gray-900 rounded-xl p-5 space-y-4">
          <p className="text-sm font-bold text-gray-900">Asignar producto al cliente</p>

          <div>
            <label className={labelClass}>Producto *</label>
            {availableCatalog.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Todos los productos del catálogo ya están asignados</p>
            ) : (
              <select
                value={assignForm.productId}
                onChange={e => setAssignForm(f => ({ ...f, productId: e.target.value }))}
                className={inputClass}
              >
                <option value="">Seleccionar producto...</option>
                {availableCatalog.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Inversión Inicial (€)</label>
              <input
                type="number"
                value={assignForm.initialInvestment}
                onChange={e => setAssignForm(f => ({ ...f, initialInvestment: e.target.value }))}
                placeholder="0"
                min="0"
                step="0.01"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Capital Actual (€)</label>
              <input
                type="number"
                value={assignForm.currentCapital}
                onChange={e => setAssignForm(f => ({ ...f, currentCapital: e.target.value }))}
                placeholder="0"
                min="0"
                step="0.01"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAssign}
              disabled={assigning || availableCatalog.length === 0}
              className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-40 transition-colors"
            >
              {assigning ? 'Asignando...' : 'Asignar'}
            </button>
            <button
              onClick={() => { setShowAssignForm(false); setError('') }}
              className="px-5 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => { setShowAssignForm(true); setError('') }}
          className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 text-gray-500 rounded-xl text-sm font-semibold hover:border-gray-400 hover:text-gray-700 transition-colors w-full justify-center"
        >
          <span className="text-lg leading-none">+</span> Asignar producto
        </button>
      )}

      {/* Assignment cards */}
      {assignments.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl py-10 text-center">
          <p className="text-sm text-gray-400">No hay productos asignados todavía</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map(a => {
            const product = a.investment_products || catalog.find(p => p.id === a.product_id)
            const capital = a.current_capital
            const inversion = a.initial_investment
            const rent = inversion > 0 ? ((capital - inversion) / inversion) * 100 : null
            const isPos = rent !== null && rent >= 0

            return (
              <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{product?.name || '—'}</p>
                    {product?.description && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{product.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleUnassign(a.id, product?.name || 'este producto')}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors ml-3 flex-shrink-0"
                  >
                    Desasignar
                  </button>
                </div>

                {editingId === a.id ? (
                  // Edit mode
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Inversión Inicial (€)</label>
                        <input
                          type="number"
                          value={editState.initialInvestment}
                          onChange={e => setEditState(s => ({ ...s, initialInvestment: e.target.value }))}
                          step="0.01"
                          min="0"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Capital Actual (€)</label>
                        <input
                          type="number"
                          value={editState.currentCapital}
                          onChange={e => setEditState(s => ({ ...s, currentCapital: e.target.value }))}
                          step="0.01"
                          min="0"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(a.id)}
                        disabled={savingId === a.id}
                        className="px-4 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-800 disabled:opacity-40 transition-colors"
                      >
                        {savingId === a.id ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode — KPIs
                  <>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Capital Total</p>
                        <p className="text-sm font-bold text-gray-900">
                          €{capital.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Inv. Inicial</p>
                        <p className="text-sm font-bold text-gray-900">
                          €{inversion.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className={`rounded-lg p-3 border ${rent === null ? 'bg-gray-50 border-gray-100' : isPos ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                        <p className="text-xs text-gray-400 mb-1">Rentabilidad</p>
                        {rent === null ? (
                          <p className="text-sm font-bold text-gray-300">—</p>
                        ) : (
                          <p className={`text-sm font-bold ${isPos ? 'text-emerald-600' : 'text-red-600'}`}>
                            {isPos ? '+' : ''}{rent.toFixed(2)}%
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => startEdit(a)}
                        className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Editar capital
                      </button>
                      <button
                        onClick={() => handleSnapshot(a.id)}
                        disabled={snapshotId === a.id}
                        className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg disabled:opacity-40 transition-colors"
                      >
                        {snapshotId === a.id ? 'Guardando...' : '📸 Snapshot'}
                      </button>
                      {snapshotDoneId === a.id && (
                        <span className="text-xs text-emerald-600 font-medium">Snapshot guardado ✓</span>
                      )}
                    </div>

                    <OperacionesAdminSection clientProductId={a.id} />
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
