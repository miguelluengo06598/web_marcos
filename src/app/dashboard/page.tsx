import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

const ASSET_LABELS: Record<string, string> = {
  renta_variable: "Renta variable",
  renta_fija: "Renta fija",
  liquidez: "Liquidez",
  alternativo: "Alternativo",
}

const ASSET_COLORS: Record<string, string> = {
  renta_variable: "#3b82f6",
  renta_fija: "#10b981",
  liquidez: "#f59e0b",
  alternativo: "#8b5cf6",
}

const RISK_LABELS: Record<string, string> = {
  conservador: "Conservador",
  moderado: "Moderado",
  agresivo: "Agresivo",
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("*, portfolio_positions(*)")
    .eq("client_id", user.id)
    .single()

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single()

  const positions = portfolio?.portfolio_positions || []
  const firstName = profile?.full_name?.split(" ")[0] || ""

  const now = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })

  return (
    <div className="space-y-6">

      {/* Header saludo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Area privada</p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
            Hola, {firstName} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-1">{now}</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 self-start sm:self-auto">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-700">Cartera activa</span>
        </div>
      </div>

      {!portfolio || portfolio.total_value === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">◎</div>
          <p className="font-medium text-gray-900 mb-2">Tu cartera esta en preparacion</p>
          <p className="text-sm text-gray-400 max-w-xs mx-auto">Tu asesor configurara tu cartera en breve. Pronto estara disponible aqui.</p>
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Valor total — card grande destacada */}
            <div className="sm:col-span-1 relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
              <div className="relative">
                <p className="text-xs font-medium text-white/50 uppercase tracking-widest mb-3">Valor total</p>
                <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-1">
                  €{Number(portfolio.total_value).toLocaleString("es-ES")}
                </p>
                <p className="text-xs text-white/40">EUR · Valor de mercado</p>
              </div>
            </div>

            {/* Rentabilidad */}
            <div className={`relative rounded-2xl p-6 overflow-hidden ${portfolio.ytd_return >= 0 ? "bg-gradient-to-br from-emerald-500 to-emerald-600" : "bg-gradient-to-br from-red-500 to-red-600"}`}>
              <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
              <div className="relative">
                <p className="text-xs font-medium text-white/70 uppercase tracking-widest mb-3">Rentabilidad YTD</p>
                <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-1">
                  {portfolio.ytd_return >= 0 ? "+" : ""}{portfolio.ytd_return}%
                </p>
                <p className="text-xs text-white/60">{portfolio.ytd_return >= 0 ? "Rentabilidad positiva" : "Rentabilidad negativa"}</p>
              </div>
            </div>

            {/* Perfil riesgo */}
            <div className="relative bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
              <div className="relative">
                <p className="text-xs font-medium text-white/70 uppercase tracking-widest mb-3">Perfil de riesgo</p>
                <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight capitalize mb-1">
                  {RISK_LABELS[portfolio.risk_profile] || portfolio.risk_profile}
                </p>
                <p className="text-xs text-white/60">Perfil revisado con tu asesor</p>
              </div>
            </div>
          </div>

          {/* Distribucion + posiciones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Distribucion */}
            {positions.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-semibold text-gray-900">Distribucion</h3>
                  <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                    {positions.length} posiciones
                  </span>
                </div>
                <div className="space-y-4">
                  {positions.map((pos: any) => (
                    <div key={pos.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background: ASSET_COLORS[pos.asset_type] || "#6b7280"}} />
                          <span className="text-sm font-medium text-gray-700">{pos.asset_name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-medium ${pos.return_pct >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {pos.return_pct >= 0 ? "+" : ""}{pos.return_pct}%
                          </span>
                          <span className="text-xs text-gray-400 w-8 text-right">{pos.weight_pct}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-1.5 rounded-full transition-all duration-1000"
                          style={{width: `${pos.weight_pct}%`, background: ASSET_COLORS[pos.asset_type] || "#6b7280"}}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Posiciones tabla */}
            {positions.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900">Posiciones</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {positions.map((pos: any) => (
                    <div key={pos.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{pos.asset_name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{background: `${ASSET_COLORS[pos.asset_type]}15`, color: ASSET_COLORS[pos.asset_type] || "#6b7280"}}>
                            {ASSET_LABELS[pos.asset_type] || pos.asset_type}
                          </span>
                          {pos.isin && <span className="text-[10px] text-gray-300 font-mono">{pos.isin}</span>}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-sm font-semibold text-gray-900">€{Number(pos.value).toLocaleString("es-ES")}</p>
                        <p className={`text-xs font-medium ${pos.return_pct >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                          {pos.return_pct >= 0 ? "+" : ""}{pos.return_pct}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Nota del asesor */}
          {portfolio.notes && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">◎</div>
                <p className="text-xs font-semibold text-blue-800 uppercase tracking-widest">Nota de tu asesor</p>
              </div>
              <p className="text-sm text-blue-900/70 leading-relaxed">{portfolio.notes}</p>
            </div>
          )}

          {/* Ultima actualizacion */}
          <div className="flex items-center justify-end gap-2 text-xs text-gray-300">
            <span>Ultima actualizacion:</span>
            <span className="font-medium text-gray-400">
              {new Date(portfolio.last_updated).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </>
      )}
    </div>
  )
}
