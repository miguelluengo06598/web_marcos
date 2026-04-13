import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const ASSET_LABELS: Record<string, string> = {
  renta_variable: 'Renta variable',
  renta_fija: 'Renta fija',
  liquidez: 'Liquidez',
  alternativo: 'Alternativo',
}

const RISK_LABELS: Record<string, string> = {
  conservador: 'Conservador',
  moderado: 'Moderado',
  agresivo: 'Agresivo',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('*, portfolio_positions(*)')
    .eq('client_id', user.id)
    .single()

  const positions = portfolio?.portfolio_positions || []

  return (
    <div>
      <h2 className="text-xl font-medium text-gray-900 mb-6">Mi cartera</h2>

      {!portfolio || portfolio.total_value === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
          Tu asesor todavía no ha configurado tu cartera. Pronto estará disponible.
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs text-gray-500 mb-1">Valor total</p>
              <p className="text-2xl font-medium text-gray-900">
                €{Number(portfolio.total_value).toLocaleString('es-ES')}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs text-gray-500 mb-1">Rentabilidad YTD</p>
              <p className={`text-2xl font-medium ${portfolio.ytd_return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolio.ytd_return >= 0 ? '+' : ''}{portfolio.ytd_return}%
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs text-gray-500 mb-1">Perfil de riesgo</p>
              <p className="text-2xl font-medium text-gray-900">
                {RISK_LABELS[portfolio.risk_profile] || portfolio.risk_profile}
              </p>
            </div>
          </div>

          {/* Posiciones */}
          {positions.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-900">Posiciones</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Activo</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Tipo</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Valor</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Peso</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Rentab.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {positions.map((pos: any) => (
                    <tr key={pos.id}>
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">{pos.asset_name}</td>
                      <td className="px-6 py-3 text-sm text-gray-500">{ASSET_LABELS[pos.asset_type] || pos.asset_type}</td>
                      <td className="px-6 py-3 text-sm text-gray-900">€{Number(pos.value).toLocaleString('es-ES')}</td>
                      <td className="px-6 py-3 text-sm text-gray-500">{pos.weight_pct}%</td>
                      <td className="px-6 py-3">
                        <span className={`text-sm font-medium ${pos.return_pct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {pos.return_pct >= 0 ? '+' : ''}{pos.return_pct}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Notas del asesor */}
          {portfolio.notes && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-medium text-gray-500 mb-2">Nota de tu asesor</p>
              <p className="text-sm text-gray-700 leading-relaxed">{portfolio.notes}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}