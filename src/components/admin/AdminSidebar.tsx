"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

const nav = [
  { href: "/admin", label: "Resumen", icon: "▦", exact: true },
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

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <nav className="space-y-1">
      {nav.map(item => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              active
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <span className="text-base w-4 text-center">{item.icon}</span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 bg-white border-r border-gray-100 flex-col z-40 shadow-sm">
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-black">G</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none">Gestion Patrimonial</p>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Admin</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 p-3 overflow-y-auto">
          <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest px-3 mb-2">Menu</p>
          <NavLinks />
        </div>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
          >
            <span className="text-base w-4 text-center">→</span>
            Cerrar sesion
          </button>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-4 h-14 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-black">G</span>
          </div>
          <p className="text-sm font-bold text-gray-900">Admin</p>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-gray-50 border border-gray-100"
        >
          <span className={`w-4 h-0.5 bg-gray-600 rounded-full transition-all duration-200 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-4 h-0.5 bg-gray-600 rounded-full transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`w-4 h-0.5 bg-gray-600 rounded-full transition-all duration-200 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div className="absolute left-0 top-14 bottom-0 w-72 bg-white border-r border-gray-100 flex flex-col shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex-1 p-4">
              <NavLinks onClick={() => setMobileOpen(false)} />
            </div>
            <div className="p-4 border-t border-gray-100">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-100 transition-all">
                <span>→</span> Cerrar sesion
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
