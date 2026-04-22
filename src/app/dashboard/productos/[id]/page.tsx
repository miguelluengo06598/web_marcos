import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import type { ClientProductSnapshot, Operation } from '@/lib/types'
import CapitalChart from '@/components/dashboard/CapitalChart'
import OperacionesView from '@/components/dashboard/OperacionesView'

export default async function ProductoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch client_product — must belong to this user
  const { data: cp } = await supabase
    .from('client_products')
    .select('*, investment_products(*)')
    .eq('id', id)
    .eq('client_id', user.id)
    .single()

  if (!cp) notFound()

  const [{ data: snapshotData }, { data: operationsData }] = await Promise.all([
    supabase
      .from('client_product_snapshots')
      .select('id, client_product_id, capital_total, recorded_at')
      .eq('client_product_id', id)
      .order('recorded_at', { ascending: false })
      .limit(52),
    supabase
      .from('operations')
      .select('*')
      .eq('client_product_id', id)
      .order('operated_at', { ascending: false }),
  ])

  const snapshots = (snapshotData ?? []) as ClientProductSnapshot[]
  const operations = (operationsData ?? []) as Operation[]
  const product = cp.investment_products as any

  const capital = cp.current_capital
  const inversion = cp.initial_investment
  const rent = inversion > 0 ? ((capital - inversion) / inversion) * 100 : null
  const isPos = rent !== null && rent >= 0

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link href="/dashboard/productos" className="text-sm text-gray-400 hover:text-gray-700 transition-colors inline-block">
        ← Mis productos
      </Link>

      {/* Header */}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Producto de inversión</p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">{product?.name || '—'}</h1>
        {product?.description && (
          <p className="text-sm text-gray-500 mt-2 max-w-lg">{product.description}</p>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-5 translate-x-5" />
          <div className="relative">
            <p className="text-xs font-medium text-white/50 uppercase tracking-widest mb-3">Capital Total</p>
            <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-1">
              €{capital.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-white/40">Valor actual</p>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-5 translate-x-5" />
          <div className="relative">
            <p className="text-xs font-medium text-white/70 uppercase tracking-widest mb-3">Inversión Inicial</p>
            <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-1">
              €{inversion.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-white/60">Capital de referencia</p>
          </div>
        </div>

        <div className={`relative rounded-2xl p-6 overflow-hidden ${
          rent === null
            ? 'bg-gradient-to-br from-gray-100 to-gray-200'
            : isPos
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
              : 'bg-gradient-to-br from-red-500 to-red-600'
        }`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-5 translate-x-5" />
          <div className="relative">
            <p className={`text-xs font-medium uppercase tracking-widest mb-3 ${rent === null ? 'text-gray-400' : 'text-white/70'}`}>
              Rentabilidad
            </p>
            {rent === null ? (
              <>
                <p className="text-3xl font-bold text-gray-400 tracking-tight mb-1">—</p>
                <p className="text-xs text-gray-400">Sin inversión inicial</p>
              </>
            ) : (
              <>
                <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-1">
                  {isPos ? '+' : ''}{rent.toFixed(2)}%
                </p>
                <p className="text-xs text-white/60">
                  {isPos ? 'Ganancia acumulada' : 'Pérdida acumulada'}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Operaciones */}
      <OperacionesView operations={operations} />

      {/* History */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Historial de capital</h3>
          <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
            {snapshots.length} registros
          </span>
        </div>

        {/* Chart — handles its own empty state when < 2 snapshots */}
        <div className="px-5 pt-5 pb-2">
          <CapitalChart snapshots={snapshots} isPositive={rent !== null ? isPos : true} />
        </div>

        {/* Table */}
        {snapshots.length > 0 && (
          <div className="divide-y divide-gray-50">
            <div className="px-5 py-2.5 grid grid-cols-2 bg-gray-50 border-t border-gray-50">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Fecha</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">Capital Total</span>
            </div>
            {snapshots.map(s => (
              <div key={s.id} className="px-5 py-3.5 grid grid-cols-2 hover:bg-gray-50/60 transition-colors">
                <span className="text-sm text-gray-500">
                  {new Date(s.recorded_at).toLocaleDateString('es-ES', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </span>
                <span className="text-sm font-semibold text-gray-900 text-right">
                  €{Number(s.capital_total).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
