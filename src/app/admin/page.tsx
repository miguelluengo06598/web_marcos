import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function AdminPage() {
  const supabase = await createClient()

  const { count: totalClientes } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "client")
  const { count: totalPosts } = await supabase.from("posts").select("*", { count: "exact", head: true }).eq("published", true)
  const { count: productosConInteres } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("interest_expressed", true)
  const { data: intereses } = await supabase.from("products").select("*, profiles(full_name, email)").eq("interest_expressed", true).order("interest_at", { ascending: false }).limit(5)
  const { data: ultimosClientes } = await supabase.from("profiles").select("*").eq("role", "client").order("created_at", { ascending: false }).limit(4)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Panel admin</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Resumen</h1>
        </div>
        <Link href="/admin/clientes/nuevo"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all self-start">
          + Nuevo cliente
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-6 translate-x-6" />
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Clientes activos</p>
          <p className="text-4xl font-black text-white tracking-tight">{totalClientes ?? 0}</p>
          <Link href="/admin/clientes" className="text-xs text-white/40 hover:text-white/70 mt-2 inline-block transition-colors">Ver todos →</Link>
        </div>
        <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
          <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-3">Posts publicados</p>
          <p className="text-4xl font-black text-white tracking-tight">{totalPosts ?? 0}</p>
          <Link href="/admin/posts" className="text-xs text-white/60 hover:text-white mt-2 inline-block transition-colors">Gestionar →</Link>
        </div>
        <div className="relative bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
          <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-3">Intereses pendientes</p>
          <p className="text-4xl font-black text-white tracking-tight">{productosConInteres ?? 0}</p>
          <p className="text-xs text-white/60 mt-2">Requieren atencion</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Ultimos intereses */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Intereses en productos</h3>
            <span className="text-xs text-gray-400 bg-orange-50 text-orange-600 border border-orange-100 px-2.5 py-1 rounded-full font-medium">
              {productosConInteres ?? 0} pendientes
            </span>
          </div>
          {!intereses || intereses.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-300">Ningun cliente ha expresado interes todavia</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {intereses.map((p: any) => {
                const name = (p.profiles as any)?.full_name || ""
                const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
                return (
                  <div key={p.id} className="px-5 py-3.5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                      <p className="text-xs text-gray-400 truncate">{p.name}</p>
                    </div>
                    <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full flex-shrink-0">
                      Interesado
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Ultimos clientes */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Clientes recientes</h3>
            <Link href="/admin/clientes" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Ver todos →</Link>
          </div>
          {!ultimosClientes || ultimosClientes.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-300">No hay clientes todavia</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {ultimosClientes.map((c: any) => {
                const initials = c.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
                const colors = ["from-blue-400 to-blue-600", "from-violet-400 to-violet-600", "from-emerald-400 to-emerald-600", "from-pink-400 to-pink-600"]
                const colorIdx = c.full_name.charCodeAt(0) % colors.length
                return (
                  <div key={c.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50/60 transition-colors">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors[colorIdx]} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{c.full_name}</p>
                      <p className="text-xs text-gray-400 truncate">{c.email}</p>
                    </div>
                    <Link href={`/admin/clientes/${c.id}`} className="text-xs text-gray-400 hover:text-gray-900 transition-colors flex-shrink-0">
                      Gestionar →
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
