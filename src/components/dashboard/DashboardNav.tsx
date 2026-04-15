"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
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
  const [menuOpen, setMenuOpen] = useState(false)

  const initials = fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <span className="font-semibold text-gray-900 text-sm">Gestion Patrimonial</span>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {nav.map(item => {
            const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${active ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700 hidden sm:flex">
            {initials}
          </div>
          <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-gray-900 hidden sm:block">Salir</button>

          {/* Mobile menu button */}
          <button className="sm:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-5 h-0.5 bg-gray-600 mb-1" />
            <div className="w-5 h-0.5 bg-gray-600 mb-1" />
            <div className="w-5 h-0.5 bg-gray-600" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 px-4 py-3 flex flex-col gap-2">
          {nav.map(item => {
            const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm ${active ? "bg-gray-900 text-white" : "text-gray-500"}`}>
                {item.label}
              </Link>
            )
          })}
          <button onClick={handleLogout} className="text-xs text-gray-400 text-left px-3 py-2 mt-1 border-t border-gray-100 pt-3">
            Cerrar sesion
          </button>
        </div>
      )}
    </header>
  )
}
