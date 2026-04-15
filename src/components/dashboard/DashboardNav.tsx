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
  const firstName = fullName.split(" ")[0]

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <>
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100/80 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 leading-none">Gestion Patrimonial</p>
                <p className="text-[10px] text-gray-400 leading-none mt-0.5">Portal privado</p>
              </div>
            </div>

            {/* Desktop nav — pill container */}
            <nav className="hidden sm:flex items-center bg-gray-100/70 rounded-xl p-1 gap-0.5">
              {nav.map(item => {
                const active = item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                      active
                        ? "bg-white text-gray-900 shadow-sm shadow-gray-200/80"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Avatar + nombre */}
              <div className="hidden sm:flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                  {initials}
                </div>
                <span className="text-xs font-medium text-gray-700">{firstName}</span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl px-3 py-2"
              >
                <span>Salir</span>
                <span className="text-gray-300">→</span>
              </button>

              {/* Mobile burger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="sm:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-gray-50 border border-gray-100"
              >
                <span className={`w-4 h-0.5 bg-gray-600 rounded-full transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`w-4 h-0.5 bg-gray-600 rounded-full transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`w-4 h-0.5 bg-gray-600 rounded-full transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl px-4 py-3">
            <div className="flex flex-col gap-1 mb-3">
              {nav.map(item => {
                const active = item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
            <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                  {initials}
                </div>
                <span className="text-sm font-medium text-gray-700">{firstName}</span>
              </div>
              <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
                Cerrar sesion
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
