import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const RISK_COLORS: Record<string, string> = {
  bajo: 'bg-green-100 text-green-700',
  moderado: 'bg-amber-100 text-amber-700',
  alto: 'bg-orange-100 text-orange-700',
  muy_alto: 'bg-red-100 text-red-700',
}

const RISK_LABELS: Record<string, string> = {
  bajo: 'Bajo', moderado: 'Moderado', alto: 'Alto', muy_alto: 'Muy alto',
}

export default async function ProductosAdminPage() {
  const supabase = await createClient()

  const { data: productos } = await supabase
    .from('products')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-gray-900">Productos asignados</h2>
        <Link
          href="/admin/productos/nuevo"
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors"
        >
          + Asignar producto
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {!productos || productos.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            No hay productos asignados todavía.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Producto</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Cliente</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Riesgo</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Rentab. est.</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Interés</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {productos.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{p.name}</p>
                    {p.isin && <p className="text-xs text-gray-400">{p.isin}</p>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {(p.profiles as any)?.full_name}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${RISK_COLORS[p.risk_level]}`}>
                      {RISK_LABELS[p.risk_level]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-green-600">{p.estimated_return || '—'}</td>
                  <td className="px-6 py-4">
                    {p.interest_expressed
                      ? <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Interesado</span>
                      : <span className="text-xs text-gray-400">—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}