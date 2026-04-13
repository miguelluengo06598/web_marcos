import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ClienteCarteraForm from '@/components/admin/ClienteCarteraForm'
import ClienteProductosList from '@/components/admin/ClienteProductosList'

export default async function ClienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: cliente } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('role', 'client')
    .single()

  if (!cliente) notFound()

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('*, portfolio_positions(*)')
    .eq('client_id', id)
    .single()

  const { data: productos } = await supabase
    .from('products')
    .select('*')
    .eq('client_id', id)
    .order('created_at', { ascending: false })

  const initials = cliente.full_name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/clientes" className="text-sm text-gray-500 hover:text-gray-900">
          ← Clientes
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700">
          {initials}
        </div>
        <div>
          <h2 className="text-xl font-medium text-gray-900">{cliente.full_name}</h2>
          <p className="text-sm text-gray-500">{cliente.email}</p>
        </div>
        <Link
          href={`/admin/productos/nuevo?cliente=${id}`}
          className="ml-auto bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors"
        >
          + Asignar producto
        </Link>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Cartera</h3>
        <ClienteCarteraForm clienteId={id} portfolio={portfolio} />
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Productos asignados</h3>
        <ClienteProductosList productos={productos || []} clienteId={id} />
      </div>
    </div>
  )
}