import { createClient } from '@/lib/supabase/server'
import InvestmentProductsCatalog from '@/components/admin/InvestmentProductsCatalog'

export default async function ProductosAdminPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('investment_products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Panel admin</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Catálogo de productos</h1>
          <p className="text-sm text-gray-400 mt-1">{products?.length ?? 0} productos disponibles</p>
        </div>
      </div>

      <InvestmentProductsCatalog initialProducts={products ?? []} />
    </div>
  )
}
