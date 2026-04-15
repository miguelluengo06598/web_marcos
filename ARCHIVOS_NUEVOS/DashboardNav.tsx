"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const nav = [
  { href: "/dashboard", label: "Mi cartera" },
  { href: "/dashboard/noticias", label: "Noticias" },
  { href: "/dashboard/productos", label: "Productos" },
  { href: "/dashboard/documentos", label: "Documentos" },
]

export default function DashboardNav({ fullName }: { fullName: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const initials = fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <header style={{
      background: "rgba(5, 12, 26, 0.92)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(0, 212, 255, 0.10)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 56,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#00D4FF",
            boxShadow: "0 0 10px rgba(0, 212, 255, 0.6)",
          }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#F0F6FF", fontFamily: "var(--font-display)" }}>
            WM Patrimonial
          </span>
        </div>

        {/* Nav links */}
        <nav style={{ display: "flex", gap: 4 }}>
          {nav.map(item => {
            const active = item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: "var(--font-display)",
                  transition: "all 0.15s",
                  background: active ? "rgba(0, 212, 255, 0.08)" : "transparent",
                  color: active ? "#00D4FF" : "rgba(240, 246, 255, 0.40)",
                  border: active ? "1px solid rgba(0, 212, 255, 0.20)" : "1px solid transparent",
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Avatar + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginRight: 4,
          }}>
            <div style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#00C98D",
              boxShadow: "0 0 6px rgba(0, 201, 141, 0.5)",
            }} />
            <span style={{ fontSize: 11, color: "rgba(240,246,255,0.35)" }}>En línea</span>
          </div>
          <div style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "rgba(0, 212, 255, 0.08)",
            border: "1.5px solid rgba(0, 212, 255, 0.30)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            color: "#00D4FF",
            fontFamily: "var(--font-display)",
          }}>
            {initials}
          </div>
          <button
            onClick={handleLogout}
            style={{
              fontSize: 12,
              color: "rgba(240,246,255,0.25)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}
