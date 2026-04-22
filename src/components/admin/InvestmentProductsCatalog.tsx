'use client'

import { useState } from 'react'
import type { InvestmentProduct } from '@/lib/types'

interface Props {
  initialProducts: InvestmentProduct[]
}

interface FormState {
  name: string
  description: string
}

const emptyForm: FormState = { name: '', description: '' }

export default function InvestmentProductsCatalog({ initialProducts }: Props) {
  const [products, setProducts] = useState<InvestmentProduct[]>(initialProducts)
  const [creating, setCreating] = useState(false)
  const [createForm, setCreateForm] = useState<FormState>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ── Create ─────────────────────────────────────────────────────────
  async function handleCreate() {
    if (!createForm.name.trim()) { setError('El nombre es obligatorio'); return }
    setLoading(true); setError('')
    const res = await fetch('/api/admin/investment-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createForm),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    setProducts(prev => [data, ...prev])
    setCreateForm(emptyForm)
    setCreating(false)
    setLoading(false)
  }

  // ── Edit ───────────────────────────────────────────────────────────
  function startEdit(p: InvestmentProduct) {
    setEditingId(p.id)
    setEditForm({ name: p.name, description: p.description || '' })
    setError('')
  }

  async function handleUpdate() {
    if (!editingId) return
    if (!editForm.name.trim()) { setError('El nombre es obligatorio'); return }
    setLoading(true); setError('')
    const res = await fetch(`/api/admin/investment-products/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    setProducts(prev => prev.map(p => p.id === editingId ? data : p))
    setEditingId(null)
    setLoading(false)
  }

  // ── Delete ─────────────────────────────────────────────────────────
  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar "${name}"? Se desasignará de todos los clientes.`)) return
    setLoading(true); setError('')
    const res = await fetch(`/api/admin/investment-products/${id}`, { method: 'DELETE' })
    if (!res.ok) { const d = await res.json(); setError(d.error); setLoading(false); return }
    setProducts(prev => prev.filter(p => p.id !== id))
    setLoading(false)
  }

  const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
  const labelClass = "block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1"

  return (
    <div className="space-y-4">

      {/* Error banner */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">{error}</div>
      )}

      {/* Create form */}
      {creating ? (
        <div className="bg-white border-2 border-gray-900 rounded-2xl p-5 space-y-4">
          <p className="text-sm font-bold text-gray-900">Nuevo producto</p>
          <div>
            <label className={labelClass}>Nombre <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={createForm.name}
              onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Ej: Fondo Mixto Global"
              className={inputClass}
              autoFocus
            />
          </div>
          <div>
            <label className={labelClass}>Descripción (opcional)</label>
            <textarea
              value={createForm.description}
              onChange={e => setCreateForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Descripción breve del producto de inversión..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={loading}
              className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-40 transition-colors"
            >
              {loading ? 'Creando...' : 'Crear producto'}
            </button>
            <button
              onClick={() => { setCreating(false); setCreateForm(emptyForm); setError('') }}
              className="px-5 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => { setCreating(true); setError('') }}
          className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 text-gray-500 rounded-xl text-sm font-semibold hover:border-gray-400 hover:text-gray-700 transition-colors w-full justify-center"
        >
          <span className="text-lg leading-none">+</span> Nuevo producto
        </button>
      )}

      {/* Product list */}
      {products.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl py-14 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl">◇</div>
          <p className="text-sm text-gray-400">No hay productos en el catálogo todavía</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
            <div className="col-span-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Producto</div>
            <div className="col-span-5 text-xs font-semibold text-gray-400 uppercase tracking-widest">Descripción</div>
            <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">Creado</div>
            <div className="col-span-1" />
          </div>

          <div className="divide-y divide-gray-50">
            {products.map(p => (
              <div key={p.id}>
                {editingId === p.id ? (
                  // Inline edit row
                  <div className="px-5 py-4 space-y-3 bg-blue-50/40">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Nombre *</label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                          className={inputClass}
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Descripción</label>
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="px-4 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-800 disabled:opacity-40 transition-colors"
                      >
                        {loading ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setError('') }}
                        className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-white transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  // Normal row
                  <div className="grid grid-cols-12 gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors items-center group">
                    <div className="col-span-8 sm:col-span-4">
                      <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                      {p.description && (
                        <p className="text-xs text-gray-400 mt-0.5 sm:hidden line-clamp-1">{p.description}</p>
                      )}
                    </div>
                    <div className="col-span-5 hidden sm:block">
                      <p className="text-sm text-gray-500 line-clamp-2">{p.description || <span className="text-gray-300">Sin descripción</span>}</p>
                    </div>
                    <div className="col-span-2 hidden sm:block">
                      <p className="text-xs text-gray-400">
                        {new Date(p.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="col-span-4 sm:col-span-1 flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="text-xs text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
