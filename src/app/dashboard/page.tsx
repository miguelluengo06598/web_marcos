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
  renta_fija: "#22c55e",
  liquidez: "#f97316",
  alternativo: "#a855f7",
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: portfolio } = await supabase.from("portfolios").select("*, portfolio_positions(*)").eq("client_id", user.id).single()
  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()

  const positions = portfolio?.portfolio_positions || []

  return (
    <div>
      <div style={{marginBottom: 28}}>
        <h1 style={{fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4}}>
          Hola, {profile?.full_name?.split(" ")[0]} 👋
        </h1>
        <p style={{fontSize: 13, color: "rgba(255,255,255,0.35)"}}>
          Aqui tienes el estado actual de tu cartera
        </p>
      </div>

      {!portfolio || portfolio.total_value === 0 ? (
        <div style={{background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 48, textAlign: "center"}}>
          <p style={{fontSize: 32, marginBottom: 12}}>◎</p>
          <p style={{fontSize: 15, fontWeight: 600, marginBottom: 8}}>Tu cartera esta en preparacion</p>
          <p style={{fontSize: 13, color: "rgba(255,255,255,0.35)"}}>Tu asesor configurara tu cartera en breve. Pronto estara disponible aqui.</p>
        </div>
      ) : (
        <>
          <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16}}>
            {[
              { label: "Valor total", value: `${Number(portfolio.total_value).toLocaleString("es-ES")}`, suffix: "", color: "#fff", sub: "EUR" },
              { label: "Rentabilidad YTD", value: `${portfolio.ytd_return >= 0 ? "+" : ""}${portfolio.ytd_return}%`, color: portfolio.ytd_return >= 0 ? "#22c55e" : "#ef4444", sub: portfolio.ytd_return >= 0 ? "Positiva" : "Negativa" },
              { label: "Perfil de riesgo", value: portfolio.risk_profile, color: "#a855f7", sub: "Revisado" },
            ].map(s => (
              <div key={s.label} style={{background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 18}}>
                <p style={{fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", marginBottom: 10}}>{s.label}</p>
                <p style={{fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", color: s.color, marginBottom: 4, textTransform: "capitalize"}}>{s.value}</p>
                <p style={{fontSize: 11, color: "rgba(255,255,255,0.25)"}}>{s.sub}</p>
              </div>
            ))}
          </div>

          {positions.length > 0 && (
            <div style={{background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden", marginBottom: 16}}>
              <div style={{padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)"}}>
                <h3 style={{fontSize: 13, fontWeight: 600}}>Posiciones</h3>
              </div>
              <table style={{width: "100%", borderCollapse: "collapse"}}>
                <thead>
                  <tr style={{borderBottom: "1px solid rgba(255,255,255,0.05)"}}>
                    {["Activo", "Tipo", "Valor", "Peso", "Rentab."].map(h => (
                      <th key={h} style={{textAlign: "left", padding: "10px 18px", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.25)", fontWeight: 500}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {positions.map((pos: any) => (
                    <tr key={pos.id} style={{borderBottom: "1px solid rgba(255,255,255,0.03)"}}>
                      <td style={{padding: "12px 18px", fontSize: 13, fontWeight: 500}}>{pos.asset_name}</td>
                      <td style={{padding: "12px 18px"}}>
                        <span style={{fontSize: 11, color: ASSET_COLORS[pos.asset_type] || "#fff", background: `${ASSET_COLORS[pos.asset_type]}15`, border: `1px solid ${ASSET_COLORS[pos.asset_type]}25`, padding: "3px 8px", borderRadius: 20}}>
                          {ASSET_LABELS[pos.asset_type] || pos.asset_type}
                        </span>
                      </td>
                      <td style={{padding: "12px 18px", fontSize: 13}}>{Number(pos.value).toLocaleString("es-ES")}</td>
                      <td style={{padding: "12px 18px", fontSize: 13, color: "rgba(255,255,255,0.5)"}}>{pos.weight_pct}%</td>
                      <td style={{padding: "12px 18px"}}>
                        <span style={{fontSize: 13, fontWeight: 600, color: pos.return_pct >= 0 ? "#22c55e" : "#ef4444"}}>
                          {pos.return_pct >= 0 ? "+" : ""}{pos.return_pct}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {portfolio.notes && (
            <div style={{background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.12)", borderRadius: 12, padding: 16}}>
              <p style={{fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#22c55e", marginBottom: 8}}>Nota de tu asesor</p>
              <p style={{fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6}}>{portfolio.notes}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
