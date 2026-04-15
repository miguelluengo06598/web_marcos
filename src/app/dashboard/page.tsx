import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

const ASSET_LABELS: Record<string, string> = {
  renta_variable: "Renta variable",
  renta_fija: "Renta fija",
  liquidez: "Liquidez",
  alternativo: "Alternativo",
}

const ASSET_COLORS: Record<string, string> = {
  renta_variable: "#00D4FF",
  renta_fija: "#00C98D",
  liquidez: "#FFB800",
  alternativo: "#a855f7",
}

const RISK_LABEL: Record<string, string> = {
  conservador: "Conservador",
  moderado: "Moderado",
  agresivo: "Agresivo",
}

const RISK_COLOR: Record<string, string> = {
  conservador: "#00C98D",
  moderado: "#FFB800",
  agresivo: "#FF4D6A",
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
  const firstName = profile?.full_name?.split(" ")[0] ?? ""

  return (
    <>
      {/* Responsive styles + cursor fix */}
      <style>{`
        /* Restaurar cursor del sistema en el dashboard */
        .dashboard-root,
        .dashboard-root * {
          cursor: auto !important;
        }
        .dashboard-root a,
        .dashboard-root button {
          cursor: pointer !important;
        }

        .dashboard-root {
          --font-sf: -apple-system, "SF Pro Display", "SF Pro Text", BlinkMacSystemFont, "Helvetica Neue", sans-serif;
        }

        /* Grid de KPIs */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 20px;
        }

        /* Grid de posiciones — scroll en móvil */
        .positions-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        /* Responsive breakpoints */
        @media (max-width: 768px) {
          .kpi-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .kpi-value {
            font-size: 28px !important;
          }
          .page-title {
            font-size: 28px !important;
          }
          .section-title {
            font-size: 17px !important;
          }
          .positions-table td,
          .positions-table th {
            padding: 10px 14px !important;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .kpi-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .kpi-value {
            font-size: 30px !important;
          }
          .page-title {
            font-size: 34px !important;
          }
        }

        /* Hover sutil en filas */
        .position-row {
          transition: background 0.15s ease;
        }
        .position-row:hover {
          background: rgba(0, 212, 255, 0.03) !important;
        }

        /* Fade-in suave (Apple-like) */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeUp 0.5s ease forwards;
        }
        .fade-up:nth-child(1) { animation-delay: 0s; }
        .fade-up:nth-child(2) { animation-delay: 0.07s; }
        .fade-up:nth-child(3) { animation-delay: 0.14s; }
      `}</style>

      <div className="dashboard-root" style={{ fontFamily: "var(--font-sf, -apple-system, sans-serif)" }}>

        {/* ── Cabecera al estilo Apple ── */}
        <div style={{ marginBottom: 40 }} className="fade-up">
          <p style={{
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "var(--cyan, #00D4FF)",
            marginBottom: 10,
          }}>
            Área privada
          </p>
          <h1
            className="page-title"
            style={{
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--text, #F0F6FF)",
              marginBottom: 10,
            }}
          >
            Hola, {firstName} 👋
          </h1>
          <p style={{
            fontSize: 17,
            fontWeight: 400,
            color: "var(--text-muted, rgba(240,246,255,0.5))",
            lineHeight: 1.5,
            maxWidth: 480,
          }}>
            Aquí tienes el estado actual de tu cartera de inversión.
          </p>
        </div>

        {/* ── Sin cartera ── */}
        {!portfolio || portfolio.total_value === 0 ? (
          <div
            className="fade-up"
            style={{
              background: "var(--surface, #0A1628)",
              border: "1px solid var(--border, rgba(0,212,255,0.10))",
              borderRadius: 20,
              padding: "60px 40px",
              textAlign: "center",
            }}
          >
            <div style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: 24,
            }}>
              ◎
            </div>
            <h2 style={{
              fontSize: 22,
              fontWeight: 600,
              color: "var(--text, #F0F6FF)",
              marginBottom: 10,
              letterSpacing: "-0.01em",
            }}>
              Tu cartera está en preparación
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-muted, rgba(240,246,255,0.5))", lineHeight: 1.6, maxWidth: 360, margin: "0 auto" }}>
              Tu asesor configurará tu cartera en breve. Pronto estará disponible aquí.
            </p>
          </div>
        ) : (
          <>
            {/* ── KPI Cards ── */}
            <div className="kpi-grid">
              {/* Valor total — card destacada */}
              <div
                className="fade-up"
                style={{
                  background: "linear-gradient(145deg, rgba(0,40,80,0.9) 0%, rgba(0,20,50,0.95) 100%)",
                  border: "1px solid rgba(0,212,255,0.22)",
                  borderRadius: 20,
                  padding: "26px 24px 22px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Glow decorativo */}
                <div style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: "rgba(0,212,255,0.07)",
                  pointerEvents: "none",
                }} />
                <p style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.10em",
                  color: "rgba(0,212,255,0.6)",
                  marginBottom: 14,
                }}>
                  Valor total
                </p>
                <p
                  className="kpi-value"
                  style={{
                    fontSize: 36,
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: "#00D4FF",
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  €{Number(portfolio.total_value).toLocaleString("es-ES")}
                </p>
                <p style={{ fontSize: 12, color: "rgba(0,212,255,0.45)", fontWeight: 500 }}>
                  EUR · Valor de mercado
                </p>
              </div>

              {/* Rentabilidad */}
              <div
                className="fade-up"
                style={{
                  background: "var(--surface, #0A1628)",
                  border: "1px solid var(--border, rgba(0,212,255,0.10))",
                  borderRadius: 20,
                  padding: "26px 24px 22px",
                }}
              >
                <p style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.10em",
                  color: "var(--text-dim, rgba(240,246,255,0.25))",
                  marginBottom: 14,
                }}>
                  Rentabilidad YTD
                </p>
                <p
                  className="kpi-value"
                  style={{
                    fontSize: 36,
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: portfolio.ytd_return >= 0 ? "#00C98D" : "#FF4D6A",
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {portfolio.ytd_return >= 0 ? "+" : ""}{portfolio.ytd_return}%
                </p>
                <p style={{
                  fontSize: 12,
                  color: portfolio.ytd_return >= 0
                    ? "rgba(0,201,141,0.5)"
                    : "rgba(255,77,106,0.5)",
                  fontWeight: 500,
                }}>
                  {portfolio.ytd_return >= 0 ? "Rentabilidad positiva" : "Rentabilidad negativa"}
                </p>
              </div>

              {/* Perfil de riesgo */}
              <div
                className="fade-up"
                style={{
                  background: "var(--surface, #0A1628)",
                  border: "1px solid var(--border, rgba(0,212,255,0.10))",
                  borderRadius: 20,
                  padding: "26px 24px 22px",
                }}
              >
                <p style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.10em",
                  color: "var(--text-dim, rgba(240,246,255,0.25))",
                  marginBottom: 14,
                }}>
                  Perfil de riesgo
                </p>
                <p
                  className="kpi-value"
                  style={{
                    fontSize: 30,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: RISK_COLOR[portfolio.risk_profile] ?? "#a855f7",
                    lineHeight: 1,
                    marginBottom: 8,
                    textTransform: "capitalize",
                  }}
                >
                  {RISK_LABEL[portfolio.risk_profile] ?? portfolio.risk_profile}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-dim, rgba(240,246,255,0.25))", fontWeight: 500 }}>
                  Perfil revisado con tu asesor
                </p>
              </div>
            </div>

            {/* ── Tabla de posiciones ── */}
            {positions.length > 0 && (
              <div
                className="fade-up"
                style={{
                  background: "var(--surface, #0A1628)",
                  border: "1px solid var(--border, rgba(0,212,255,0.10))",
                  borderRadius: 20,
                  overflow: "hidden",
                  marginBottom: 20,
                }}
              >
                <div style={{
                  padding: "20px 24px 18px",
                  borderBottom: "1px solid var(--border, rgba(0,212,255,0.08))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 8,
                }}>
                  <h2
                    className="section-title"
                    style={{
                      fontSize: 19,
                      fontWeight: 600,
                      color: "var(--text, #F0F6FF)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Posiciones
                  </h2>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--text-dim, rgba(240,246,255,0.25))",
                    background: "rgba(255,255,255,0.04)",
                    padding: "4px 12px",
                    borderRadius: 20,
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    {positions.length} {positions.length === 1 ? "activo" : "activos"}
                  </span>
                </div>

                <div className="positions-table-wrap">
                  <table
                    className="positions-table"
                    style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}
                  >
                    <thead>
                      <tr>
                        {["Activo", "Tipo", "Valor", "Peso", "Rentabilidad"].map(h => (
                          <th
                            key={h}
                            style={{
                              textAlign: "left",
                              padding: "12px 24px",
                              fontSize: 11,
                              textTransform: "uppercase",
                              letterSpacing: "0.09em",
                              color: "var(--text-dim, rgba(240,246,255,0.25))",
                              fontWeight: 600,
                              borderBottom: "1px solid rgba(0,212,255,0.06)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map((pos: any, i: number) => (
                        <tr
                          key={pos.id}
                          className="position-row"
                          style={{
                            borderBottom: i < positions.length - 1
                              ? "1px solid rgba(0,212,255,0.04)"
                              : "none",
                          }}
                        >
                          <td style={{ padding: "16px 24px" }}>
                            <span style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: "var(--text, #F0F6FF)",
                              letterSpacing: "-0.01em",
                            }}>
                              {pos.asset_name}
                            </span>
                            {pos.isin && (
                              <p style={{
                                fontSize: 11,
                                color: "var(--text-dim, rgba(240,246,255,0.25))",
                                marginTop: 2,
                                fontFamily: "monospace",
                              }}>
                                {pos.isin}
                              </p>
                            )}
                          </td>
                          <td style={{ padding: "16px 24px", whiteSpace: "nowrap" }}>
                            <span style={{
                              fontSize: 12,
                              fontWeight: 500,
                              color: ASSET_COLORS[pos.asset_type] ?? "#F0F6FF",
                              background: `${ASSET_COLORS[pos.asset_type] ?? "#F0F6FF"}15`,
                              border: `1px solid ${ASSET_COLORS[pos.asset_type] ?? "#F0F6FF"}22`,
                              padding: "4px 10px",
                              borderRadius: 20,
                            }}>
                              {ASSET_LABELS[pos.asset_type] ?? pos.asset_type}
                            </span>
                          </td>
                          <td style={{ padding: "16px 24px", whiteSpace: "nowrap" }}>
                            <span style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: "var(--text-muted, rgba(240,246,255,0.5))",
                              letterSpacing: "-0.01em",
                            }}>
                              €{Number(pos.value).toLocaleString("es-ES")}
                            </span>
                          </td>
                          <td style={{ padding: "16px 24px", whiteSpace: "nowrap" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              {/* Mini barra de peso */}
                              <div style={{
                                width: 40,
                                height: 3,
                                background: "rgba(255,255,255,0.08)",
                                borderRadius: 2,
                                overflow: "hidden",
                              }}>
                                <div style={{
                                  width: `${Math.min(pos.weight_pct, 100)}%`,
                                  height: "100%",
                                  background: "#00D4FF",
                                  borderRadius: 2,
                                }} />
                              </div>
                              <span style={{
                                fontSize: 13,
                                color: "var(--text-dim, rgba(240,246,255,0.35))",
                              }}>
                                {pos.weight_pct}%
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: "16px 24px", whiteSpace: "nowrap" }}>
                            <span style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: pos.return_pct >= 0 ? "#00C98D" : "#FF4D6A",
                              letterSpacing: "-0.01em",
                            }}>
                              {pos.return_pct >= 0 ? "+" : ""}{pos.return_pct}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Nota del asesor ── */}
            {portfolio.notes && (
              <div
                className="fade-up"
                style={{
                  background: "rgba(0, 212, 255, 0.03)",
                  border: "1px solid rgba(0, 212, 255, 0.12)",
                  borderLeft: "3px solid #00D4FF",
                  borderRadius: 16,
                  padding: "20px 24px",
                }}
              >
                <p style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#00D4FF",
                  marginBottom: 10,
                }}>
                  Nota de tu asesor
                </p>
                <p style={{
                  fontSize: 15,
                  color: "var(--text-muted, rgba(240,246,255,0.55))",
                  lineHeight: 1.65,
                  maxWidth: 700,
                }}>
                  {portfolio.notes}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}