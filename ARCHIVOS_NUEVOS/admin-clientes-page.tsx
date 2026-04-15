import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ClientesPage() {
  const supabase = await createClient()

  const { data: clientes } = await supabase
    .from('profiles')
    .select('*, portfolios(total_value, ytd_return)')
    .eq('role', 'client')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4 }}>
            Clientes
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-dim)" }}>
            {clientes?.length ?? 0} clientes registrados
          </p>
        </div>
        <Link href="/admin/clientes/nuevo" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "9px 18px",
          background: "var(--cyan)",
          color: "var(--bg)",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "var(--font-display)",
          textDecoration: "none",
          transition: "opacity 0.15s",
        }}>
          + Nuevo cliente
        </Link>
      </div>

      <div style={{
        background: "var(--surface2)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        overflow: "hidden",
      }}>
        {!clientes || clientes.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", fontSize: 13, color: "var(--text-dim)" }}>
            No hay clientes todavía. Crea el primero.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Cliente", "Email", "Valor cartera", "Rentab. YTD", ""].map(h => (
                  <th key={h} style={{
                    textAlign: "left",
                    padding: "12px 20px",
                    fontSize: 10,
                    fontWeight: 600,
                    fontFamily: "var(--font-display)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--text-dim)",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientes.map((c: any) => {
                const portfolio = c.portfolios?.[0]
                const initials = c.full_name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
                return (
                  <tr key={c.id} style={{ borderBottom: "1px solid rgba(0,212,255,0.04)" }}>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 32, height: 32,
                          borderRadius: "50%",
                          background: "var(--cyan-dim)",
                          border: "1px solid var(--border-hover)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 700,
                          color: "var(--cyan)",
                          fontFamily: "var(--font-display)",
                          flexShrink: 0,
                        }}>
                          {initials}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500, fontFamily: "var(--font-display)" }}>
                          {c.full_name}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text-muted)" }}>
                      {c.email}
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 13, fontFamily: "var(--font-display)", fontWeight: 500 }}>
                      {portfolio ? `€${Number(portfolio.total_value).toLocaleString('es-ES')}` : '—'}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      {portfolio ? (
                        <span style={{
                          fontSize: 13,
                          fontWeight: 600,
                          fontFamily: "var(--font-display)",
                          color: portfolio.ytd_return >= 0 ? "var(--green)" : "var(--red)",
                        }}>
                          {portfolio.ytd_return >= 0 ? '+' : ''}{portfolio.ytd_return}%
                        </span>
                      ) : '—'}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <Link href={`/admin/clientes/${c.id}`} style={{
                        fontSize: 12,
                        color: "var(--text-dim)",
                        fontFamily: "var(--font-display)",
                        textDecoration: "none",
                        transition: "color 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--cyan)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}
                      >
                        Gestionar →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
