"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const nav = [
  { href: "/admin", label: "Resumen", icon: "▦" },
  { href: "/admin/clientes", label: "Clientes", icon: "◎" },
  { href: "/admin/posts", label: "Noticias", icon: "◈" },
  { href: "/admin/productos", label: "Productos", icon: "◇" },
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
    <aside style={{position: "fixed", left: 0, top: 0, height: "100vh", width: 220, background: "#0D0D0D", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", zIndex: 40}}>
      <div style={{padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display: "flex", alignItems: "center", gap: 8}}>
          <div style={{width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#000"}}>W</div>
          <div>
            <p style={{fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em"}}>WM Patrimonial</p>
            <p style={{fontSize: 10, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em"}}>Admin</p>
          </div>
        </div>
      </div>

      <nav style={{flex: 1, padding: "12px 8px"}}>
        {nav.map(item => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, fontSize: 13, fontWeight: 500, marginBottom: 2, transition: "all 0.15s",
                background: active ? "rgba(34,197,94,0.1)" : "transparent",
                color: active ? "#22c55e" : "rgba(255,255,255,0.45)",
                border: active ? "1px solid rgba(34,197,94,0.2)" : "1px solid transparent",
              }}
            >
              <span style={{fontSize: 14}}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div style={{padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.06)"}}>
        <button
          onClick={handleLogout}
          style={{width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, fontSize: 13, color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer", transition: "color 0.15s", textAlign: "left"}}
        >
          Cerrar sesion
        </button>
      </div>
    </aside>
  )
}
