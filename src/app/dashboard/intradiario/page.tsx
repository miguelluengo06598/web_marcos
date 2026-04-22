import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { PortfolioSnapshot, Operation } from '@/lib/types'
import CapitalChart from '@/components/dashboard/CapitalChart'
import OperacionesView from '@/components/dashboard/OperacionesView'

export default async function IntradiarioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: portfolio }, { data: snapshotData }, { data: operationsData }] = await Promise.all([
    supabase
      .from('portfolios')
      .select('total_value, initial_investment')
      .eq('client_id', user.id)
      .single(),
    supabase
      .from('portfolio_snapshots')
      .select('id, client_id, capital_total, recorded_at')
      .eq('client_id', user.id)
      .order('recorded_at', { ascending: false })
      .limit(52),
    supabase
      .from('operations')
      .select('*, client_products(investment_products(name))')
      .order('operated_at', { ascending: false }),
  ])

  const capitalTotal = portfolio?.total_value ?? 0
  const inversionInicial = portfolio?.initial_investment ?? 0
  const rentabilidad =
    inversionInicial > 0
      ? ((capitalTotal - inversionInicial) / inversionInicial) * 100
      : null
  const isPositive = rentabilidad !== null && rentabilidad >= 0

  const snapshots = (snapshotData ?? []) as PortfolioSnapshot[]
  const operations = (operationsData ?? []) as Operation[]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Area privada</p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">Cartera Intradiaria</h1>
        <p className="text-sm text-gray-400 mt-1">Seguimiento en tiempo real de tu inversión</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Capital Total */}
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -translate-y-6 translate-x-6" />
          <div className="relative">
            <p className="text-xs font-medium text-white/50 uppercase tracking-widest mb-3">Capital Total</p>
            <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-1">
              €{capitalTotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-white/40">Valor actual de mercado</p>
          </div>
        </div>

        {/* Inversión Inicial */}
        <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
          <div className="relative">
            <p className="text-xs font-medium text-white/70 uppercase tracking-widest mb-3">Inversión Inicial</p>
            <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-1">
              €{inversionInicial.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-white/60">Capital de referencia</p>
          </div>
        </div>

        {/* Rentabilidad */}
        <div className={`relative rounded-2xl p-6 overflow-hidden ${
          rentabilidad === null
            ? 'bg-gradient-to-br from-gray-100 to-gray-200'
            : isPositive
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
              : 'bg-gradient-to-br from-red-500 to-red-600'
        }`}>
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
          <div className="relative">
            <p className={`text-xs font-medium uppercase tracking-widest mb-3 ${rentabilidad === null ? 'text-gray-400' : 'text-white/70'}`}>
              Rentabilidad
            </p>
            {rentabilidad === null ? (
              <>
                <p className="text-3xl sm:text-4xl font-bold text-gray-400 tracking-tight mb-1">—</p>
                <p className="text-xs text-gray-400">Sin inversión inicial</p>
              </>
            ) : (
              <>
                <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-1">
                  {isPositive ? '+' : ''}{rentabilidad.toFixed(2)}%
                </p>
                <p className="text-xs text-white/60">
                  {isPositive ? 'Ganancia sobre inversión' : 'Pérdida sobre inversión'}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Operaciones */}
      <OperacionesView operations={operations} showProductName />

      {/* Historial */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Historial de capital</h3>
          <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
            {snapshots.length} registros
          </span>
        </div>

        {/* Chart — handles its own empty state when < 2 snapshots */}
        <div className="px-5 pt-5 pb-2">
          <CapitalChart snapshots={snapshots} isPositive={rentabilidad !== null ? isPositive : true} />
        </div>

        {/* Table */}
        {snapshots.length > 0 && (
          <div className="divide-y divide-gray-50">
            <div className="px-5 py-2.5 grid grid-cols-2 bg-gray-50 border-t border-gray-50">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Fecha</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">Capital Total</span>
            </div>
            {snapshots.map((s) => (
              <div key={s.id} className="px-5 py-3.5 grid grid-cols-2 hover:bg-gray-50/60 transition-colors">
                <span className="text-sm text-gray-500">
                  {new Date(s.recorded_at).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
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
