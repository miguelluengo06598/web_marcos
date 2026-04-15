"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const nav = [
  { href: "/admin", label: "Resumen", exact: true },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/productos", label: "Productos" },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <aside style={{
      width: 220,
      minHeight: "100vh",
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      position: "sticky",
      top: 0,
      height: "100vh",
      overflowY: "auto",
    }}>
      {/* Logo */}
      <div style={{
        padding: "20px 20px 16px",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#00D4FF",
            boxShadow: "0 0 10px rgba(0, 212, 255, 0.6)",
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--text)",
            fontFamily: "var(--font-display)",
          }}>
            WM Admin
          </span>
        </div>
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "2px 8px",
          background: "rgba(0,212,255,0.08)",
          border: "1px solid rgba(0,212,255,0.18)",
          borderRadius: 4,
          fontSize: 10,
          fontWeight: 600,
          color: "#00D4FF",
          fontFamily: "var(--font-display)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}>
          Panel admin
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        {nav.map(item => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: 8,
                marginBottom: 2,
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                fontFamily: "var(--font-display)",
                color: active ? "#00D4FF" : "var(--text-muted)",
                background: active ? "rgba(0, 212, 255, 0.07)" : "transparent",
                borderLeft: active ? "2px solid #00D4FF" : "2px solid transparent",
                transition: "all 0.12s",
                textDecoration: "none",
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: "16px 20px",
        borderTop: "1px solid var(--border)",
      }}>
        <button
          onClick={handleLogout}
          style={{
            fontSize: 12,
            color: "var(--text-dim)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            padding: 0,
          }}
        >
          Cerrar sesión →
        </button>
      </div>
    </aside>
  )
}
