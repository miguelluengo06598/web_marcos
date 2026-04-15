import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function ClientesPage() {
  const supabase = await createClient()

  const { data: clientes } = await supabase
    .from("profiles")
    .select("*, portfolios(total_value, ytd_return, risk_profile)")
    .eq("role", "client")
    .order("created_at", { ascending: false })

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Panel admin</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Clientes</h1>
          <p className="text-sm text-gray-400 mt-1">{clientes?.length ?? 0} clientes registrados</p>
        </div>
        <Link
          href="/admin/clientes/nuevo"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all self-start sm:self-auto"
        >
          <span className="text-base leading-none">+</span>
          Nuevo cliente
        </Link>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        {!clientes || clientes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-2xl">◎</div>
            <p className="font-semibold text-gray-900 mb-1">No hay clientes todavia</p>
            <p className="text-sm text-gray-400 mb-6">Crea tu primer cliente para empezar a gestionar carteras.</p>
            <Link href="/admin/clientes/nuevo" className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
              Crear primer cliente
            </Link>
          </div>
        ) : (
          <>
            {/* Header tabla */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100">
              <div className="col-span-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Cliente</div>
              <div className="col-span-3 text-xs font-semibold text-gray-400 uppercase tracking-widest hidden sm:block">Email</div>
              <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-widest hidden md:block">Cartera</div>
              <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-widest hidden md:block">Rentab.</div>
              <div className="col-span-1 text-xs font-semibold text-gray-400 uppercase tracking-widest text-right"></div>
            </div>

            {/* Filas */}
            <div className="divide-y divide-gray-50">
              {clientes.map((c: any) => {
                const portfolio = c.portfolios?.[0]
                const initials = c.full_name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
                const ytd = portfolio?.ytd_return ?? null
                const colors = ["from-blue-400 to-blue-600", "from-violet-400 to-violet-600", "from-emerald-400 to-emerald-600", "from-orange-400 to-orange-600", "from-pink-400 to-pink-600"]
                const colorIdx = c.full_name.charCodeAt(0) % colors.length

                return (
                  <div key={c.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors items-center group">

                    {/* Nombre */}
                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${colors[colorIdx]} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{c.full_name}</p>
                        <p className="text-xs text-gray-400 sm:hidden truncate">{c.email}</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-span-3 hidden sm:block">
                      <p className="text-sm text-gray-500 truncate">{c.email}</p>
                    </div>

                    {/* Cartera */}
                    <div className="col-span-2 hidden md:block">
                      {portfolio ? (
                        <p className="text-sm font-semibold text-gray-900">
                          {Number(portfolio.total_value).toLocaleString("es-ES")}
                        </p>
                      ) : (
                        <span className="text-xs text-gray-300 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">Sin cartera</span>
                      )}
                    </div>

                    {/* Rentabilidad */}
                    <div className="col-span-2 hidden md:block">
                      {ytd !== null ? (
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${ytd >= 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
                          {ytd >= 0 ? "▲" : "▼"} {Math.abs(ytd)}%
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </div>

                    {/* Accion */}
                    <div className="col-span-4 sm:col-span-1 flex justify-end">
                      <Link
                        href={`/admin/clientes/${c.id}`}
                        className="text-xs font-semibold text-gray-400 hover:text-gray-900 group-hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all"
                      >
                        Gestionar →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
