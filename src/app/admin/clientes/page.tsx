import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ClientesPage() {
  const supabase = await createClient()

  const { data: clientes } = await supabase
    .from('profiles')
    .select('*, portfolios(total_value, ytd_return)')
    .eq('role', 'client')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-gray-900">Clientes</h2>
        <Link
          href="/admin/clientes/nuevo"
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors"
        >
          + Nuevo cliente
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {!clientes || clientes.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            No hay clientes todavía. Crea el primero.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Cliente</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Email</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Valor cartera</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Rentab. YTD</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clientes.map((c: any) => {
                const portfolio = c.portfolios?.[0]
                const initials = c.full_name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                          {initials}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{c.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{c.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {portfolio ? `€${Number(portfolio.total_value).toLocaleString('es-ES')}` : '—'}
                    </td>
                    <td className="px-6 py-4">
                      {portfolio ? (
                        <span className={`text-sm font-medium ${portfolio.ytd_return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {portfolio.ytd_return >= 0 ? '+' : ''}{portfolio.ytd_return}%
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/clientes/${c.id}`}
                        className="text-xs text-gray-500 hover:text-gray-900"
                      >
                        Gestionar →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}