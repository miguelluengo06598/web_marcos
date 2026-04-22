import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

const ASSET_LABELS: Record<string, string> = {
  renta_variable: "Renta variable",
  renta_fija: "Renta fija",
  liquidez: "Liquidez",
  alternativo: "Alternativo",
}

const ASSET_COLORS: Record<string, string> = {
  renta_variable: "#6366f1",
  renta_fija:     "#12b76a",
  liquidez:       "#f79009",
  alternativo:    "#f97066",
}

const ASSET_BG: Record<string, string> = {
  renta_variable: "rgba(99,102,241,0.10)",
  renta_fija:     "rgba(18,183,106,0.10)",
  liquidez:       "rgba(247,144,9,0.10)",
  alternativo:    "rgba(249,112,102,0.10)",
}

const RISK_LABELS: Record<string, string> = {
  conservador: "Conservador",
  moderado:    "Moderado",
  agresivo:    "Agresivo",
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

  const S: Record<string, React.CSSProperties> = {
    label: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.10em",
      textTransform: "uppercase" as const,
      color: "var(--text-muted)",
      margin: "0 0 10px",
      fontFamily: "DM Mono, monospace",
    },
    bigNum: {
      fontFamily: "Plus Jakarta Sans, sans-serif",
      fontWeight: 800,
      fontSize: "clamp(26px, 4vw, 34px)",
      color: "var(--text-primary)",
      margin: "0 0 4px",
      lineHeight: 1,
    },
    sub: { fontSize: 12, color: "var(--text-muted)", margin: 0 },
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div className="card-enter card-enter-1" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, paddingBottom: 4 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.10em", textTransform: "uppercase", margin: "0 0 6px", fontFamily: "DM Mono, monospace" }}>
            Area privada
          </p>
          <h1 style={{ fontWeight: 800, fontSize: "clamp(22px, 4vw, 30px)", color: "var(--text-primary)", margin: "0 0 4px", lineHeight: 1.1 }}>
            Hola, {firstName} 👋
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>{now}</p>
        </div>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "var(--green-light)",
            border: "1px solid rgba(18,183,106,0.2)",
            borderRadius: 20, padding: "8px 14px",
            fontSize: 12, fontWeight: 600, color: "var(--green)",
          }}
        >
          <span
            className="pulse-dot"
            style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", display: "block" }}
          />
          Cartera activa
        </div>
      </div>

      {!portfolio || portfolio.total_value === 0 ? (
        <div className="card card-enter card-enter-2" style={{ padding: "64px 24px", textAlign: "center" }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: 16,
              background: "var(--accent-light)", display: "flex",
              alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px", fontSize: 26,
            }}
          >
            ◎
          </div>
          <p style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", margin: "0 0 8px" }}>
            Tu cartera esta en preparacion
          </p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 280, margin: "0 auto" }}>
            Tu asesor configurara tu cartera en breve.
          </p>
        </div>
      ) : (
        <>
          {/* KPI row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 14,
            }}
          >
            {/* Valor total — accent card */}
            <div className="kpi-card-accent card-enter card-enter-2">
              <div
                style={{
                  position: "absolute", top: -30, right: -30,
                  width: 110, height: 110, borderRadius: "50%",
                  background: "rgba(255,255,255,0.10)", pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute", bottom: -20, left: -10,
                  width: 80, height: 80, borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)", pointerEvents: "none",
                }}
              />
              <p style={{ ...S.label, color: "rgba(255,255,255,0.65)" }}>Valor total</p>
              <p className="animate-count" style={{ ...S.bigNum, color: "#fff" }}>
                €{Number(portfolio.total_value).toLocaleString("es-ES")}
              </p>
              <p style={{ ...S.sub, color: "rgba(255,255,255,0.55)" }}>EUR · Valor de mercado</p>
            </div>

            {/* Rentabilidad */}
            <div
              className="kpi-card card-enter card-enter-3"
              style={portfolio.ytd_return >= 0
                ? { borderColor: "rgba(18,183,106,0.2)", background: "linear-gradient(135deg, rgba(18,183,106,0.05) 0%, #fff 60%)" }
                : { borderColor: "rgba(240,68,56,0.2)",  background: "linear-gradient(135deg, rgba(240,68,56,0.05) 0%, #fff 60%)" }
              }
            >
              <p style={S.label}>Rentabilidad YTD</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <p
                  className="animate-count"
                  style={{
                    ...S.bigNum,
                    color: portfolio.ytd_return >= 0 ? "var(--green)" : "var(--red)",
                  }}
                >
                  {portfolio.ytd_return >= 0 ? "+" : ""}{portfolio.ytd_return}%
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                <span
                  className={`badge ${portfolio.ytd_return >= 0 ? "badge-green" : "badge-red"}`}
                  style={{ fontSize: 10 }}
                >
                  {portfolio.ytd_return >= 0 ? "▲ Positiva" : "▼ Negativa"}
                </span>
              </div>
            </div>

            {/* Perfil riesgo */}
            <div
              className="kpi-card card-enter card-enter-4"
              style={{ borderColor: "rgba(99,102,241,0.15)", background: "linear-gradient(135deg, rgba(99,102,241,0.05) 0%, #fff 60%)" }}
            >
              <p style={S.label}>Perfil de riesgo</p>
              <p className="animate-count" style={{ ...S.bigNum, textTransform: "capitalize" }}>
                {RISK_LABELS[portfolio.risk_profile] || portfolio.risk_profile}
              </p>
              <span className="badge badge-accent" style={{ fontSize: 10, marginTop: 4, display: "inline-flex" }}>
                Revisado con tu asesor
              </span>
            </div>
          </div>

          {/* Distribucion + posiciones */}
          {positions.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 14,
              }}
            >
              {/* Distribucion */}
              <div className="card card-enter card-enter-3" style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", margin: 0 }}>
                    Distribución
                  </h3>
                  <span className="badge badge-accent">{positions.length} posiciones</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {positions.map((pos: any) => (
                    <div key={pos.id}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            style={{
                              width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                              background: ASSET_COLORS[pos.asset_type] || "#6366f1",
                              display: "block",
                              boxShadow: `0 0 5px ${ASSET_COLORS[pos.asset_type] || "#6366f1"}60`,
                            }}
                          />
                          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                            {pos.asset_name}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: pos.return_pct >= 0 ? "var(--green)" : "var(--red)", fontFamily: "DM Mono, monospace" }}>
                            {pos.return_pct >= 0 ? "+" : ""}{pos.return_pct}%
                          </span>
                          <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "DM Mono, monospace", width: 30, textAlign: "right" }}>
                            {pos.weight_pct}%
                          </span>
                        </div>
                      </div>
                      <div style={{ height: 6, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
                        <div
                          style={{
                            width: `${pos.weight_pct}%`, height: "100%", borderRadius: 4,
                            background: `linear-gradient(90deg, ${ASSET_COLORS[pos.asset_type] || "#6366f1"}, ${ASSET_COLORS[pos.asset_type] || "#6366f1"}bb)`,
                            transition: "width 1s cubic-bezier(0.22,1,0.36,1)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Posiciones */}
              <div className="card card-enter card-enter-4" style={{ overflow: "hidden", padding: 0 }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", margin: 0 }}>Posiciones</h3>
                </div>
                <div>
                  {positions.map((pos: any, i: number) => (
                    <div
                      key={pos.id}
                      style={{
                        padding: "12px 20px",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        borderBottom: i < positions.length - 1 ? "1px solid var(--border)" : "none",
                        transition: "background 0.15s",
                        cursor: "default",
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--bg-card-2)")}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                            background: ASSET_BG[pos.asset_type] || "var(--accent-light)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 14,
                          }}
                        >
                          {pos.asset_type === "renta_variable" ? "📈"
                           : pos.asset_type === "renta_fija" ? "🏦"
                           : pos.asset_type === "liquidez" ? "💧" : "◆"}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {pos.asset_name}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                            <span
                              style={{
                                fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20,
                                background: ASSET_BG[pos.asset_type] || "var(--accent-light)",
                                color: ASSET_COLORS[pos.asset_type] || "var(--accent)",
                              }}
                            >
                              {ASSET_LABELS[pos.asset_type] || pos.asset_type}
                            </span>
                            {pos.isin && (
                              <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "DM Mono, monospace" }}>
                                {pos.isin}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: 0, fontFamily: "DM Mono, monospace" }}>
                          €{Number(pos.value).toLocaleString("es-ES")}
                        </p>
                        <p style={{ fontSize: 12, fontWeight: 700, color: pos.return_pct >= 0 ? "var(--green)" : "var(--red)", margin: 0, fontFamily: "DM Mono, monospace" }}>
                          {pos.return_pct >= 0 ? "▲" : "▼"} {Math.abs(pos.return_pct)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Nota asesor */}
          {portfolio.notes && (
            <div
              className="card-enter card-enter-5"
              style={{
                background: "linear-gradient(135deg, var(--accent-light) 0%, rgba(129,140,248,0.06) 100%)",
                border: "1px solid rgba(99,102,241,0.15)",
                borderRadius: 20,
                padding: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div
                  style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: "var(--accent-light)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14,
                  }}
                >
                  💬
                </div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.10em", textTransform: "uppercase", margin: 0, fontFamily: "DM Mono, monospace" }}>
                  Nota de tu asesor
                </p>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
                {portfolio.notes}
              </p>
            </div>
          )}

          {/* Ultima actualizacion */}
          <div style={{ display: "flex", justifyContent: "flex-end", fontSize: 11, color: "var(--text-muted)", fontFamily: "DM Mono, monospace", gap: 6 }}>
            <span>Última actualización:</span>
            <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
              {new Date(portfolio.last_updated).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </>
      )}
    </div>
  )
}