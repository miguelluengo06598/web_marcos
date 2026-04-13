import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()

  const { count: totalClientes } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'client')

  const { count: totalPosts } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('published', true)

  const { count: productosConInteres } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('interest_expressed', true)

  const { data: intereses } = await supabase
    .from('products')
    .select('*, profiles(full_name, email)')
    .eq('interest_expressed', true)
    .order('interest_at', { ascending: false })
    .limit(5)

  return (
    <div>
      <h2 className="text-xl font-medium text-gray-900 mb-6">Resumen</h2>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 mb-1">Clientes activos</p>
          <p className="text-3xl font-medium text-gray-900">{totalClientes ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 mb-1">Posts publicados</p>
          <p className="text-3xl font-medium text-gray-900">{totalPosts ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 mb-1">Intereses pendientes</p>
          <p className="text-3xl font-medium text-amber-600">{productosConInteres ?? 0}</p>
        </div>
      </div>

      {/* Últimos intereses */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Últimos intereses en productos</h3>
          <Link href="/admin/clientes" className="text-xs text-gray-500 hover:text-gray-900">
            Ver todos →
          </Link>
        </div>

        {!intereses || intereses.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-gray-400">
            Ningún cliente ha expresado interés todavía
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {intereses.map((p: any) => (
              <div key={p.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {(p.profiles as any)?.full_name}
                  </p>
                  <p className="text-xs text-gray-500">{p.name}</p>
                </div>
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                  Interesado
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
