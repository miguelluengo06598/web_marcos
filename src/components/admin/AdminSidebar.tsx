"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
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
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const NavLinks = () => (
    <>
      {nav.map(item => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
        return (
          <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}>
            <span>{item.icon}</span>{item.label}
          </Link>
        )
      })}
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-56 bg-white border-r border-gray-200 flex-col z-40">
        <div className="p-5 border-b border-gray-100">
          <p className="font-semibold text-gray-900 text-sm">Gestion Patrimonial</p>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">Panel admin</span>
        </div>
        <nav className="flex-1 p-3 space-y-1"><NavLinks /></nav>
        <div className="p-3 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-100 transition-colors">
            Cerrar sesion
          </button>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-4 h-14">
        <p className="font-semibold text-gray-900 text-sm">Gestion Patrimonial</p>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
          <div className="w-5 h-0.5 bg-gray-600 mb-1" />
          <div className="w-5 h-0.5 bg-gray-600 mb-1" />
          <div className="w-5 h-0.5 bg-gray-600" />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/20" onClick={() => setMobileOpen(false)}>
          <div className="absolute left-0 top-14 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col" onClick={e => e.stopPropagation()}>
            <nav className="flex-1 p-3 space-y-1"><NavLinks /></nav>
            <div className="p-3 border-t border-gray-100">
              <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-400">Cerrar sesion</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
