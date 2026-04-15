import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

const RISK_COLORS: Record<string, string> = {
  bajo: "bg-emerald-50 text-emerald-700 border-emerald-100",
  moderado: "bg-amber-50 text-amber-700 border-amber-100",
  alto: "bg-orange-50 text-orange-700 border-orange-100",
  muy_alto: "bg-red-50 text-red-600 border-red-100",
}
const RISK_LABELS: Record<string, string> = {
  bajo: "Bajo", moderado: "Moderado", alto: "Alto", muy_alto: "Muy alto",
}

export default async function ProductosAdminPage() {
  const supabase = await createClient()
  const { data: productos } = await supabase
    .from("products")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Panel admin</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Productos asignados</h1>
          <p className="text-sm text-gray-400 mt-1">{productos?.length ?? 0} productos</p>
        </div>
        <Link href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all self-start">
          + Asignar producto
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        {!productos || productos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-2xl">◇</div>
            <p className="font-semibold text-gray-900 mb-1">No hay productos asignados</p>
            <p className="text-sm text-gray-400 mb-6">Asigna el primer producto a un cliente.</p>
            <Link href="/admin/productos/nuevo" className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
              Asignar producto
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
              <div className="col-span-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Producto</div>
              <div className="col-span-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">Cliente</div>
              <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">Riesgo</div>
              <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">Rentab. est.</div>
              <div className="col-span-1 text-xs font-semibold text-gray-400 uppercase tracking-widest">Interes</div>
            </div>
            <div className="divide-y divide-gray-50">
              {productos.map((p: any) => (
                <div key={p.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors items-center">
                  <div className="sm:col-span-4">
                    <div className="flex items-center gap-2 mb-0.5">
                      {p.is_priority && (
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full">Prioritario</span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                    {p.isin && <p className="text-xs text-gray-400 font-mono mt-0.5">{p.isin}</p>}
                  </div>
                  <div className="sm:col-span-3">
                    <p className="text-sm text-gray-600">{(p.profiles as any)?.full_name || "—"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${RISK_COLORS[p.risk_level] || "bg-gray-50 text-gray-500 border-gray-100"}`}>
                      {RISK_LABELS[p.risk_level] || p.risk_level}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm font-semibold text-emerald-600">{p.estimated_return || "—"}</p>
                  </div>
                  <div className="sm:col-span-1">
                    {p.interest_expressed
                      ? <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-1 rounded-full">Si</span>
                      : <span className="text-xs text-gray-300">—</span>
                    }
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
