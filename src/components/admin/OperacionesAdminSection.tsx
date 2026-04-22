'use client'

import { useState, useCallback } from 'react'
import type { Operation } from '@/lib/types'

interface Props {
  clientProductId: string
}

interface OperationForm {
  type: 'buy' | 'sell'
  points: string
  action_price: string
  result: '' | 'win' | 'loss'
  notes: string
  operated_at: string
}

function defaultForm(): OperationForm {
  return {
    type: 'buy',
    points: '',
    action_price: '',
    result: '',
    notes: '',
    operated_at: new Date().toISOString().slice(0, 16),
  }
}

const inputClass = 'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white'
const labelClass = 'block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1'

export default function OperacionesAdminSection({ clientProductId }: Props) {
  const [open, setOpen] = useState(false)
  const [operations, setOperations] = useState<Operation[]>([])
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<OperationForm>(defaultForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const fetchOperations = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/operations?clientProductId=${clientProductId}`)
    if (res.ok) setOperations(await res.json())
    setLoading(false)
    setLoaded(true)
  }, [clientProductId])

  function toggle() {
    if (!open && !loaded) fetchOperations()
    setOpen(o => !o)
    setError('')
    setShowForm(false)
  }

  async function handleSubmit() {
    if (!form.points || !form.action_price) { setError('Puntos y precio son obligatorios'); return }
    setSubmitting(true); setError('')
    const res = await fetch('/api/admin/operations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientProductId,
        type: form.type,
        points: form.points,
        actionPrice: form.action_price,
        result: form.result || undefined,
        notes: form.notes || undefined,
        operatedAt: form.operated_at,
      }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setSubmitting(false); return }
    setOperations(prev => [data, ...prev])
    setForm(defaultForm())
    setShowForm(false)
    setSubmitting(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta operación?')) return
    const res = await fetch(`/api/admin/operations/${id}`, { method: 'DELETE' })
    if (res.ok) setOperations(prev => prev.filter(o => o.id !== id))
    else { const d = await res.json(); setError(d.error) }
  }

  return (
    <div className="mt-4 border-t border-gray-100 pt-3">
      <button
        onClick={toggle}
        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
      >
        <span className={`inline-block transition-transform duration-150 ${open ? 'rotate-90' : ''}`}>▶</span>
        Operaciones {loaded && operations.length > 0 && <span className="text-gray-400 font-normal">({operations.length})</span>}
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">{error}</p>
          )}

          {/* Form toggle */}
          {!showForm ? (
            <button
              onClick={() => { setShowForm(true); setError('') }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-gray-200 text-gray-400 rounded-lg text-xs font-semibold hover:border-gray-400 hover:text-gray-600 transition-colors"
            >
              + Nueva operación
            </button>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Tipo *</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value as 'buy' | 'sell' }))}
                    className={inputClass}
                  >
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Puntos *</label>
                  <input
                    type="number"
                    value={form.points}
                    onChange={e => setForm(f => ({ ...f, points: e.target.value }))}
                    placeholder="Ej: 15.5"
                    step="0.01"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Precio de acción *</label>
                  <input
                    type="number"
                    value={form.action_price}
                    onChange={e => setForm(f => ({ ...f, action_price: e.target.value }))}
                    placeholder="Ej: 4523.00"
                    step="0.01"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Resultado (auto si vacío)</label>
                  <select
                    value={form.result}
                    onChange={e => setForm(f => ({ ...f, result: e.target.value as '' | 'win' | 'loss' }))}
                    className={inputClass}
                  >
                    <option value="">Auto (por puntos)</option>
                    <option value="win">Win</option>
                    <option value="loss">Loss</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Fecha y hora</label>
                <input
                  type="datetime-local"
                  value={form.operated_at}
                  onChange={e => setForm(f => ({ ...f, operated_at: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Notas</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Notas opcionales..."
                  rows={2}
                  className={inputClass}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-800 disabled:opacity-40 transition-colors"
                >
                  {submitting ? 'Guardando...' : 'Guardar operación'}
                </button>
                <button
                  onClick={() => { setShowForm(false); setError('') }}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Operations list */}
          {loading ? (
            <p className="text-xs text-gray-400 py-1">Cargando...</p>
          ) : operations.length === 0 ? (
            <p className="text-xs text-gray-400 italic py-1">Sin operaciones registradas</p>
          ) : (
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-3 py-2 text-left font-semibold text-gray-400 uppercase tracking-wide">Fecha</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-400 uppercase tracking-wide">Tipo</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-400 uppercase tracking-wide">Puntos</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-400 uppercase tracking-wide">Precio</th>
                    <th className="px-3 py-2 text-center font-semibold text-gray-400 uppercase tracking-wide">Result.</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-400 uppercase tracking-wide">Notas</th>
                    <th className="px-2 py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {operations.map(op => (
                    <tr key={op.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap">
                        {new Date(op.operated_at).toLocaleDateString('es-ES', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}{' '}
                        <span className="text-gray-400">
                          {new Date(op.operated_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full font-semibold ${
                          op.type === 'buy'
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-purple-50 text-purple-600'
                        }`}>
                          {op.type === 'buy' ? 'Buy' : 'Sell'}
                        </span>
                      </td>
                      <td className={`px-3 py-2.5 text-right font-semibold ${Number(op.points) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {Number(op.points) > 0 ? '+' : ''}{Number(op.points).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-2.5 text-right text-gray-700">
                        {Number(op.action_price).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full font-bold ${
                          op.result === 'win'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-red-50 text-red-600'
                        }`}>
                          {op.result === 'win' ? 'WIN' : 'LOSS'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-gray-400 max-w-[140px] truncate">{op.notes || '—'}</td>
                      <td className="px-2 py-2.5">
                        <button
                          onClick={() => handleDelete(op.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors font-bold text-sm leading-none"
                          title="Eliminar"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
