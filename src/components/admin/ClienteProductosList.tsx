'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Product, RiskLevel } from '@/lib/types'

const RISK_COLORS: Record<RiskLevel, string> = {
  bajo: 'bg-green-100 text-green-700',
  moderado: 'bg-amber-100 text-amber-700',
  alto: 'bg-orange-100 text-orange-700',
  muy_alto: 'bg-red-100 text-red-700',
}

const RISK_LABELS: Record<RiskLevel, string> = {
  bajo: 'Bajo',
  moderado: 'Moderado',
  alto: 'Alto',
  muy_alto: 'Muy alto',
}

interface Props {
  productos: Product[]
  clienteId: string
}

export default function ClienteProductosList({ productos, clienteId }: Props) {
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este producto?')) return
    await supabase.from('products').delete().eq('id', id)
    router.refresh()
  }

  if (productos.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-sm text-gray-400 mb-3">No hay productos asignados todavía</p>
        <Link
          href={`/admin/productos/nuevo?cliente=${clienteId}`}
          className="text-sm text-gray-900 underline underline-offset-2"
        >
          Asignar primer producto
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {productos.map(p => (
        <div
          key={p.id}
          className={`bg-white rounded-xl border p-5 ${p.is_priority ? 'border-blue-200' : 'border-gray-200'}`}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                {p.is_priority && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    Prioritario
                  </span>
                )}
                {p.interest_expressed && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    Interesado
                  </span>
                )}
              </div>
              <h4 className="text-sm font-medium text-gray-900">{p.name}</h4>
              {p.isin && <p className="text-xs text-gray-400">{p.isin} · {p.manager}</p>}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${RISK_COLORS[p.risk_level]}`}>
                {RISK_LABELS[p.risk_level]}
              </span>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-3">
            {p.estimated_return && (
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-400">Rentab. est.</p>
                <p className="text-sm font-medium text-green-600">{p.estimated_return}</p>
              </div>
            )}
            {p.min_horizon_years && (
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-400">Plazo mín.</p>
                <p className="text-sm font-medium text-gray-900">{p.min_horizon_years} años</p>
              </div>
            )}
            {p.min_investment && (
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-400">Inv. mínima</p>
                <p className="text-sm font-medium text-gray-900">€{p.min_investment.toLocaleString('es-ES')}</p>
              </div>
            )}
            {p.management_fee && (
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-400">Comisión</p>
                <p className="text-sm font-medium text-gray-900">{p.management_fee}%</p>
              </div>
            )}
          </div>

          {p.advisor_note && (
            <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border-l-2 border-gray-300">
              {p.advisor_note}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}