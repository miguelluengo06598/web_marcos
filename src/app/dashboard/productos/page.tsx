import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { ClientProduct } from '@/lib/types'

export default async function ProductosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: clientProducts } = await supabase
    .from('client_products')
    .select('*, investment_products(*)')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  const products = (clientProducts ?? []) as ClientProduct[]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Area privada</p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">Mis productos</h1>
        <p className="text-sm text-gray-400 mt-1">{products.length} producto{products.length !== 1 ? 's' : ''} asignado{products.length !== 1 ? 's' : ''}</p>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">◇</div>
          <p className="font-medium text-gray-900 mb-2">No tienes productos asignados</p>
          <p className="text-sm text-gray-400 max-w-xs mx-auto">Tu asesor te asignará productos de inversión en breve.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map(cp => {
            const product = cp.investment_products
            const capital = cp.current_capital
            const inversion = cp.initial_investment
            const rent = inversion > 0 ? ((capital - inversion) / inversion) * 100 : null
            const isPos = rent !== null && rent >= 0

            return (
              <Link
                key={cp.id}
                href={`/dashboard/productos/${cp.id}`}
                className="block bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
              >
                {/* Product name */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {product?.name || '—'}
                    </p>
                    {product?.description && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{product.description}</p>
                    )}
                  </div>
                  <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-lg ml-3 flex-shrink-0">→</span>
                </div>

                {/* KPI trio */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Capital</p>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      €{capital.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Inv. inicial</p>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      €{inversion.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className={`rounded-xl p-3 border ${rent === null ? 'bg-gray-50 border-gray-100' : isPos ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Rentab.</p>
                    {rent === null ? (
                      <p className="text-sm font-bold text-gray-300">—</p>
                    ) : (
                      <p className={`text-sm font-bold ${isPos ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isPos ? '+' : ''}{rent.toFixed(2)}%
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
