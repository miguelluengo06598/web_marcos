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
    <header style={{background: "rgba(13,13,13,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 50}}>
      <div style={{maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56}}>
        <div style={{display: "flex", alignItems: "center", gap: 8}}>
          <div style={{width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#000"}}>W</div>
          <span style={{fontSize: 13, fontWeight: 700, color: "#fff"}}>WM Patrimonial</span>
        </div>

        <nav style={{display: "flex", gap: 4}}>
          {nav.map(item => {
            const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, transition: "all 0.15s",
                  background: active ? "rgba(34,197,94,0.1)" : "transparent",
                  color: active ? "#22c55e" : "rgba(255,255,255,0.45)",
                  border: active ? "1px solid rgba(34,197,94,0.2)" : "1px solid transparent",
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div style={{display: "flex", alignItems: "center", gap: 12}}>
          <div style={{width: 30, height: 30, borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#22c55e"}}>
            {initials}
          </div>
          <button
            onClick={handleLogout}
            style={{fontSize: 12, color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer"}}
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}
