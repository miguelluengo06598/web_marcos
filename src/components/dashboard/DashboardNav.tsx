"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

const nav = [
  { href: "/dashboard",             label: "Mi cartera",  icon: "◈" },
  { href: "/dashboard/intradiario", label: "Intradiario", icon: "◉" },
  { href: "/dashboard/noticias",    label: "Noticias",    icon: "◎" },
  { href: "/dashboard/productos",   label: "Productos",   icon: "◆" },
  { href: "/dashboard/documentos",  label: "Documentos",  icon: "◇" },
]

export default function DashboardNav({ fullName }: { fullName: string }) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()
  const [menuOpen, setMenuOpen] = useState(false)

  const initials  = fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
  const firstName = fullName.split(" ")[0]

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
          boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

            {/* Logo */}
            <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, var(--accent) 0%, #818cf8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 10px rgba(99,102,241,0.3)",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontWeight: 800, fontSize: 15, color: "#fff", fontFamily: "Plus Jakarta Sans, sans-serif" }}>G</span>
              </div>
              <div className="hidden sm:block">
                <p style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", lineHeight: 1, margin: 0 }}>
                  Gestion Patrimonial
                </p>
                <p style={{ fontSize: 10, color: "var(--text-muted)", lineHeight: 1, marginTop: 3, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Portal privado
                </p>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav
              className="hidden sm:flex items-center gap-1"
              style={{
                background: "var(--bg-card-2)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 4,
              }}
            >
              {nav.map(item => {
                const active = item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      padding: "7px 14px",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      textDecoration: "none",
                      transition: "all 0.15s",
                      ...(active
                        ? {
                            background: "var(--accent)",
                            color: "#fff",
                            boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
                          }
                        : {
                            color: "var(--text-secondary)",
                          }),
                    }}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Right side */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

              {/* Active badge */}
              <div
                className="hidden sm:flex items-center gap-1.5"
                style={{
                  background: "var(--green-light)",
                  border: "1px solid rgba(18,183,106,0.2)",
                  borderRadius: 20,
                  padding: "5px 12px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--green)",
                }}
              >
                <span
                  className="pulse-dot"
                  style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "block" }}
                />
                Activo
              </div>

              {/* Avatar */}
              <Link
                href="/dashboard/perfil"
                className="hidden sm:flex items-center gap-2"
                style={{
                  background: "var(--bg-card-2)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "6px 12px 6px 6px",
                  textDecoration: "none",
                  transition: "box-shadow 0.15s, border-color 0.15s",
                  boxShadow: "var(--shadow-sm)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)"
                  ;(e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)"
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)"
                  ;(e.currentTarget as HTMLElement).style.borderColor = "var(--border)"
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--accent) 0%, #818cf8 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {initials}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{firstName}</span>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1"
                style={{
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "7px 12px",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  transition: "color 0.15s, border-color 0.15s, background 0.15s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = "var(--red)"
                  ;(e.currentTarget as HTMLElement).style.borderColor = "rgba(240,68,56,0.3)"
                  ;(e.currentTarget as HTMLElement).style.background = "var(--red-light)"
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"
                  ;(e.currentTarget as HTMLElement).style.borderColor = "var(--border)"
                  ;(e.currentTarget as HTMLElement).style.background = "transparent"
                }}
              >
                Salir →
              </button>

              {/* Mobile burger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="sm:hidden"
                style={{
                  width: 36, height: 36,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 5,
                  borderRadius: 10,
                  background: "var(--bg-card-2)",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                }}
              >
                {[0,1,2].map(i => (
                  <span
                    key={i}
                    style={{
                      width: 16, height: 1.5,
                      background: "var(--text-secondary)",
                      borderRadius: 2, display: "block",
                      transition: "all 0.2s",
                      opacity: menuOpen && i === 1 ? 0 : 1,
                      transform: menuOpen && i === 0 ? "rotate(45deg) translate(4px, 4px)"
                               : menuOpen && i === 2 ? "rotate(-45deg) translate(4px, -4px)"
                               : "none",
                    }}
                  />
                ))}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="sm:hidden"
            style={{
              borderTop: "1px solid var(--border)",
              background: "rgba(255,255,255,0.97)",
              padding: "12px 16px 16px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
              {[...nav, { href: "/dashboard/perfil", label: "Mi perfil", icon: "◎" }].map(item => {
                const active = item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "all 0.15s",
                      ...(active
                        ? { background: "var(--accent)", color: "#fff" }
                        : { color: "var(--text-secondary)" }),
                    }}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--accent), #818cf8)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, color: "#fff",
                  }}
                >
                  {initials}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{firstName}</span>
              </div>
              <button
                onClick={handleLogout}
                style={{ background: "transparent", border: "none", fontSize: 12, color: "var(--red)", cursor: "pointer", fontWeight: 600 }}
              >
                Cerrar sesion
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  )
}