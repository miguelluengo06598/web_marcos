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
  renta_fija:     "#00C98D",
  liquidez:       "#FFB800",
  alternativo:    "#a855f7",
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

  return (
    <div>
      {/* Cabecera */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          marginBottom: 4,
          fontFamily: "var(--font-display)",
          color: "var(--text)",
        }}>
          Hola, {profile?.full_name?.split(" ")[0]} 👋
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Aquí tienes el estado actual de tu cartera
        </p>
      </div>

      {!portfolio || portfolio.total_value === 0 ? (
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 48,
          textAlign: "center",
        }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>◎</p>
          <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, fontFamily: "var(--font-display)" }}>
            Tu cartera está en preparación
          </p>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Tu asesor configurará tu cartera en breve. Pronto estará disponible aquí.
          </p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
            {[
              {
                label: "Valor total",
                value: `€${Number(portfolio.total_value).toLocaleString("es-ES")}`,
                color: "#00D4FF",
                sub: "EUR",
                accent: true,
              },
              {
                label: "Rentabilidad YTD",
                value: `${portfolio.ytd_return >= 0 ? "+" : ""}${portfolio.ytd_return}%`,
                color: portfolio.ytd_return >= 0 ? "#00C98D" : "#FF4D6A",
                sub: portfolio.ytd_return >= 0 ? "Positiva" : "Negativa",
              },
              {
                label: "Perfil de riesgo",
                value: portfolio.risk_profile,
                color: "#a855f7",
                sub: "Revisado",
              },
            ].map(s => (
              <div
                key={s.label}
                style={{
                  background: s.accent
                    ? "linear-gradient(135deg, var(--surface) 0%, rgba(0, 84, 160, 0.25) 100%)"
                    : "var(--surface)",
                  border: s.accent
                    ? "1px solid rgba(0, 212, 255, 0.22)"
                    : "1px solid var(--border)",
                  borderRadius: 12,
                  padding: 18,
                }}
              >
                <p style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.10em",
                  color: "var(--text-dim)",
                  marginBottom: 10,
                  fontFamily: "var(--font-display)",
                }}>
                  {s.label}
                </p>
                <p style={{
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: s.color,
                  marginBottom: 4,
                  textTransform: "capitalize",
                  fontFamily: "var(--font-display)",
                }}>
                  {s.value}
                </p>
                <p style={{ fontSize: 11, color: "var(--text-dim)" }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Tabla de posiciones */}
          {positions.length > 0 && (
            <div style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              overflow: "hidden",
              marginBottom: 16,
            }}>
              <div style={{
                padding: "14px 18px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <h3 style={{
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "var(--font-display)",
                  color: "var(--text)",
                }}>
                  Posiciones
                </h3>
                <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
                  {positions.length} activos
                </span>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Activo", "Tipo", "Valor", "Peso", "Rentab."].map(h => (
                      <th key={h} style={{
                        textAlign: "left",
                        padding: "10px 18px",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--text-dim)",
                        fontWeight: 500,
                        fontFamily: "var(--font-display)",
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {positions.map((pos: any) => (
                    <tr
                      key={pos.id}
                      style={{ borderBottom: "1px solid rgba(0, 212, 255, 0.04)" }}
                    >
                      <td style={{
                        padding: "12px 18px",
                        fontSize: 13,
                        fontWeight: 500,
                        fontFamily: "var(--font-display)",
                        color: "var(--text)",
                      }}>
                        {pos.asset_name}
                      </td>
                      <td style={{ padding: "12px 18px" }}>
                        <span style={{
                          fontSize: 11,
                          color: ASSET_COLORS[pos.asset_type] || "var(--text)",
                          background: `${ASSET_COLORS[pos.asset_type]}15`,
                          border: `1px solid ${ASSET_COLORS[pos.asset_type]}25`,
                          padding: "3px 8px",
                          borderRadius: 20,
                          fontFamily: "var(--font-display)",
                          fontWeight: 500,
                        }}>
                          {ASSET_LABELS[pos.asset_type] || pos.asset_type}
                        </span>
                      </td>
                      <td style={{
                        padding: "12px 18px",
                        fontSize: 13,
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-display)",
                      }}>
                        €{Number(pos.value).toLocaleString("es-ES")}
                      </td>
                      <td style={{
                        padding: "12px 18px",
                        fontSize: 13,
                        color: "var(--text-dim)",
                        fontFamily: "var(--font-display)",
                      }}>
                        {pos.weight_pct}%
                      </td>
                      <td style={{ padding: "12px 18px" }}>
                        <span style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: pos.return_pct >= 0 ? "#00C98D" : "#FF4D6A",
                          fontFamily: "var(--font-display)",
                        }}>
                          {pos.return_pct >= 0 ? "+" : ""}{pos.return_pct}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Nota del asesor */}
          {portfolio.notes && (
            <div style={{
              background: "rgba(0, 212, 255, 0.04)",
              border: "1px solid rgba(0, 212, 255, 0.12)",
              borderLeft: "2px solid #00D4FF",
              borderRadius: 12,
              padding: 16,
            }}>
              <p style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.10em",
                color: "#00D4FF",
                marginBottom: 8,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
              }}>
                Nota de tu asesor
              </p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                {portfolio.notes}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
