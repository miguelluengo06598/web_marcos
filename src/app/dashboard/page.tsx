import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

const ASSET_LABELS: Record<string, string> = {
  renta_variable: "Renta variable",
  renta_fija: "Renta fija",
  liquidez: "Liquidez",
  alternativo: "Alternativo",
}

const ASSET_COLORS: Record<string, string> = {
  renta_variable: "#00d4ff",
  renta_fija: "#10d67e",
  liquidez: "#f0b429",
  alternativo: "#a78bfa",
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
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div
        className="card-enter card-enter-1"
        style={{ display: "flex", flexDirection: "column", gap: 4, paddingBottom: 8 }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "var(--accent)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            margin: 0,
            fontFamily: "DM Mono, monospace",
          }}
        >
          Area privada
        </p>
        <h1
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(24px, 5vw, 36px)",
            color: "var(--text-primary)",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Hola, {firstName} 👋
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>{now}</p>
      </div>

      {!portfolio || portfolio.total_value === 0 ? (
        <div
          className="glass-card card-enter card-enter-2"
          style={{ padding: "64px 24px", textAlign: "center" }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "rgba(0,212,255,0.1)",
              border: "1px solid rgba(0,212,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: 24,
            }}
          >
            ◎
          </div>
          <p
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 600,
              fontSize: 16,
              color: "var(--text-primary)",
              margin: "0 0 8px",
            }}
          >
            Tu cartera esta en preparacion
          </p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 280, margin: "0 auto" }}>
            Tu asesor configurara tu cartera en breve. Pronto estara disponible aqui.
          </p>
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {/* Valor total */}
            <div
              className="kpi-card card-enter card-enter-2"
              style={{
                background: "linear-gradient(135deg, rgba(0,212,255,0.12) 0%, rgba(0,100,160,0.08) 100%)",
                borderColor: "rgba(0,212,255,0.2)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "var(--accent)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  margin: "0 0 12px",
                  fontFamily: "DM Mono, monospace",
                }}
              >
                Valor total
              </p>
              <p
                className="animate-count"
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(24px, 4vw, 32px)",
                  color: "var(--text-primary)",
                  margin: "0 0 4px",
                  lineHeight: 1,
                }}
              >
                €{Number(portfolio.total_value).toLocaleString("es-ES")}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
                EUR · Valor de mercado
              </p>
            </div>

            {/* Rentabilidad */}
            <div
              className={`kpi-card card-enter card-enter-3`}
              style={{
                background: portfolio.ytd_return >= 0
                  ? "linear-gradient(135deg, rgba(16,214,126,0.12) 0%, rgba(0,100,60,0.08) 100%)"
                  : "linear-gradient(135deg, rgba(255,77,106,0.12) 0%, rgba(120,0,30,0.08) 100%)",
                borderColor: portfolio.ytd_return >= 0
                  ? "rgba(16,214,126,0.2)"
                  : "rgba(255,77,106,0.2)",
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: portfolio.ytd_return >= 0 ? "var(--green)" : "var(--red)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  margin: "0 0 12px",
                  fontFamily: "DM Mono, monospace",
                }}
              >
                Rentabilidad YTD
              </p>
              <p
                className="animate-count"
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(24px, 4vw, 32px)",
                  color: portfolio.ytd_return >= 0 ? "var(--green)" : "var(--red)",
                  margin: "0 0 4px",
                  lineHeight: 1,
                }}
              >
                {portfolio.ytd_return >= 0 ? "+" : ""}{portfolio.ytd_return}%
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
                {portfolio.ytd_return >= 0 ? "Rentabilidad positiva" : "Rentabilidad negativa"}
              </p>
            </div>

            {/* Perfil riesgo */}
            <div
              className="kpi-card card-enter card-enter-4"
              style={{
                background: "linear-gradient(135deg, rgba(167,139,250,0.12) 0%, rgba(80,40,160,0.08) 100%)",
                borderColor: "rgba(167,139,250,0.2)",
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#a78bfa",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  margin: "0 0 12px",
                  fontFamily: "DM Mono, monospace",
                }}
              >
                Perfil de riesgo
              </p>
              <p
                className="animate-count"
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(24px, 4vw, 32px)",
                  color: "var(--text-primary)",
                  margin: "0 0 4px",
                  lineHeight: 1,
                  textTransform: "capitalize",
                }}
              >
                {RISK_LABELS[portfolio.risk_profile] || portfolio.risk_profile}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
                Perfil revisado con tu asesor
              </p>
            </div>
          </div>

          {/* Distribucion + posiciones */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {/* Distribucion */}
            {positions.length > 0 && (
              <div className="glass-card card-enter card-enter-3" style={{ padding: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontWeight: 600,
                      fontSize: 14,
                      color: "var(--text-primary)",
                      margin: 0,
                    }}
                  >
                    Distribucion
                  </h3>
                  <span className="badge-accent">{positions.length} posiciones</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {positions.map((pos: any) => (
                    <div key={pos.id}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 6,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              flexShrink: 0,
                              background: ASSET_COLORS[pos.asset_type] || "#888",
                              boxShadow: `0 0 6px ${ASSET_COLORS[pos.asset_type] || "#888"}80`,
                              display: "block",
                            }}
                          />
                          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                            {pos.asset_name}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: pos.return_pct >= 0 ? "var(--green)" : "var(--red)",
                              fontFamily: "DM Mono, monospace",
                            }}
                          >
                            {pos.return_pct >= 0 ? "+" : ""}{pos.return_pct}%
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              color: "var(--text-muted)",
                              fontFamily: "DM Mono, monospace",
                              width: 32,
                              textAlign: "right",
                            }}
                          >
                            {pos.weight_pct}%
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          height: 3,
                          background: "rgba(255,255,255,0.06)",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${pos.weight_pct}%`,
                            height: "100%",
                            borderRadius: 2,
                            background: ASSET_COLORS[pos.asset_type] || "#888",
                            boxShadow: `0 0 8px ${ASSET_COLORS[pos.asset_type] || "#888"}60`,
                            transition: "width 1s ease",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Posiciones tabla */}
            {positions.length > 0 && (
              <div
                className="glass-card card-enter card-enter-4"
                style={{ overflow: "hidden", padding: 0 }}
              >
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontWeight: 600,
                      fontSize: 14,
                      color: "var(--text-primary)",
                      margin: 0,
                    }}
                  >
                    Posiciones
                  </h3>
                </div>
                <div>
                  {positions.map((pos: any, i: number) => (
                    <div
                      key={pos.id}
                      style={{
                        padding: "12px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: i < positions.length - 1 ? "1px solid var(--border)" : "none",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "var(--text-primary)",
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {pos.asset_name}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginTop: 3,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              padding: "2px 7px",
                              borderRadius: 20,
                              background: `${ASSET_COLORS[pos.asset_type] || "#888"}18`,
                              color: ASSET_COLORS[pos.asset_type] || "#888",
                              letterSpacing: "0.02em",
                            }}
                          >
                            {ASSET_LABELS[pos.asset_type] || pos.asset_type}
                          </span>
                          {pos.isin && (
                            <span
                              style={{
                                fontSize: 10,
                                color: "var(--text-muted)",
                                fontFamily: "DM Mono, monospace",
                              }}
                            >
                              {pos.isin}
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            margin: 0,
                            fontFamily: "DM Mono, monospace",
                          }}
                        >
                          €{Number(pos.value).toLocaleString("es-ES")}
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: pos.return_pct >= 0 ? "var(--green)" : "var(--red)",
                            margin: 0,
                            fontFamily: "DM Mono, monospace",
                          }}
                        >
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
            <div
              className="card-enter card-enter-5"
              style={{
                background: "rgba(0,212,255,0.05)",
                border: "1px solid rgba(0,212,255,0.15)",
                borderRadius: 16,
                padding: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "rgba(0,212,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: "var(--accent)",
                  }}
                >
                  ◎
                </div>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--accent)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    margin: 0,
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  Nota de tu asesor
                </p>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                {portfolio.notes}
              </p>
            </div>
          )}

          {/* Ultima actualizacion */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              color: "var(--text-muted)",
              fontFamily: "DM Mono, monospace",
            }}
          >
            <span>Ultima actualizacion:</span>
            <span style={{ color: "var(--text-secondary)" }}>
              {new Date(portfolio.last_updated).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </>
      )}
    </div>
  )
}