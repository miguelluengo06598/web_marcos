import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ClienteCarteraForm from '@/components/admin/ClienteCarteraForm'
import ClienteProductosList from '@/components/admin/ClienteProductosList'
import ClienteIntradiarioForm from '@/components/admin/ClienteIntradiarioForm'
import ClienteInvestmentProducts from '@/components/admin/ClienteInvestmentProducts'

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

  const [
    { data: portfolio },
    { data: productos },
    { data: catalog },
    { data: clientProducts },
    { data: snapshots },
  ] = await Promise.all([
    supabase.from('portfolios').select('*, portfolio_positions(*)').eq('client_id', id).single(),
    supabase.from('products').select('*').eq('client_id', id).order('created_at', { ascending: false }),
    supabase.from('investment_products').select('*').order('name'),
    supabase.from('client_products').select('*, investment_products(*)').eq('client_id', id).order('created_at'),
    supabase.from('portfolio_snapshots').select('capital_total, recorded_at').eq('client_id', id).order('recorded_at', { ascending: false }).limit(10),
  ])

  const initials = cliente.full_name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="max-w-4xl space-y-8">
      {/* Back */}
      <Link href="/admin/clientes" className="text-sm text-gray-400 hover:text-gray-700 transition-colors inline-block">
        ← Clientes
      </Link>

      {/* Client header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700 flex-shrink-0">
          {initials}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{cliente.full_name}</h2>
          <p className="text-sm text-gray-400">{cliente.email}</p>
        </div>
      </div>

      {/* ── Cartera Intradiaria ─────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Cartera Intradiaria</h3>
          <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-semibold">Live</span>
        </div>
        <ClienteIntradiarioForm
          clienteId={id}
          portfolio={portfolio ? {
            id: portfolio.id,
            total_value: portfolio.total_value,
            initial_investment: portfolio.initial_investment ?? 0,
          } : null}
        />

        {snapshots && snapshots.length > 0 && (
          <div className="mt-4 bg-white border border-gray-100 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Últimos snapshots intradiarios</p>
            </div>
            <div className="divide-y divide-gray-50">
              {snapshots.map((s: any, i: number) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {new Date(s.recorded_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    €{Number(s.capital_total).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Productos de inversión ──────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Productos de inversión</h3>
          <Link
            href="/admin/productos"
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            Gestionar catálogo →
          </Link>
        </div>
        <ClienteInvestmentProducts
          clienteId={id}
          catalog={catalog ?? []}
          initialAssignments={clientProducts ?? []}
        />
      </section>

      {/* ── Cartera & Posiciones ────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Cartera & Posiciones</h3>
        </div>
        <ClienteCarteraForm clienteId={id} portfolio={portfolio} />
      </section>

      {/* ── Recomendaciones (productos legacy) ─────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Recomendaciones</h3>
          <Link
            href={`/admin/productos/nuevo?cliente=${id}`}
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            + Asignar recomendación
          </Link>
        </div>
        <ClienteProductosList productos={productos || []} clienteId={id} />
      </section>
    </div>
  )
}
