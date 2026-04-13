import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProductoInteresButton from '@/components/dashboard/ProductoInteresButton'

const RISK_COLORS: Record<string, string> = {
  bajo: 'bg-green-100 text-green-700',
  moderado: 'bg-amber-100 text-amber-700',
  alto: 'bg-orange-100 text-orange-700',
  muy_alto: 'bg-red-100 text-red-700',
}

const RISK_LABELS: Record<string, string> = {
  bajo: 'Riesgo bajo',
  moderado: 'Riesgo moderado',
  alto: 'Riesgo alto',
  muy_alto: 'Riesgo muy alto',
}

export default async function ProductosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: productos } = await supabase
    .from('products')
    .select('*')
    .eq('client_id', user.id)
    .eq('is_visible', true)
    .order('is_priority', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div>
      <h2 className="text-xl font-medium text-gray-900 mb-2">Mis recomendaciones</h2>
      <p className="text-sm text-gray-500 mb-6">Productos seleccionados por tu asesor. Solo tú puedes ver esto.</p>

      {!productos || productos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
          Tu asesor todavía no te ha asignado productos. Pronto aparecerán aquí.
        </div>
      ) : (
        <div className="space-y-4">
          {productos.map((p: any) => (
            <div
              key={p.id}
              className={`bg-white rounded-xl border p-6 ${p.is_priority ? 'border-blue-200' : 'border-gray-200'}`}
            >
              {p.is_priority && (
                <div className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-lg mb-4 inline-block">
                  Recomendación prioritaria
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-medium text-gray-900">{p.name}</h3>
                  {p.isin && (
                    <p className="text-xs text-gray-400 mt-0.5">{p.manager && `${p.manager} · `}ISIN: {p.isin}</p>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${RISK_COLORS[p.risk_level]}`}>
                  {RISK_LABELS[p.risk_level]}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {p.estimated_return && (
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">Rentab. estimada</p>
                    <p className="text-sm font-medium text-green-600">{p.estimated_return}</p>
                  </div>
                )}
                {p.min_horizon_years && (
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">Plazo mínimo</p>
                    <p className="text-sm font-medium text-gray-900">{p.min_horizon_years} años</p>
                  </div>
                )}
                {p.min_investment && (
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">Inv. mínima</p>
                    <p className="text-sm font-medium text-gray-900">€{Number(p.min_investment).toLocaleString('es-ES')}</p>
                  </div>
                )}
                {p.management_fee && (
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">Comisión</p>
                    <p className="text-sm font-medium text-gray-900">{p.management_fee}%</p>
                  </div>
                )}
              </div>

              {p.advisor_note && (
                <div className="bg-gray-50 rounded-lg px-4 py-3 mb-4 border-l-2 border-gray-300">
                  <p className="text-xs text-gray-400 mb-1">Nota de tu asesor</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{p.advisor_note}</p>
                </div>
              )}

              <ProductoInteresButton
                productoId={p.id}
                interesExpresado={p.interest_expressed}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}