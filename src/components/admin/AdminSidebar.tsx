'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const nav = [
  { href: '/admin', label: 'Resumen', icon: '▦' },
  { href: '/admin/clientes', label: 'Clientes', icon: '◎' },
  { href: '/admin/posts', label: 'Noticias', icon: '◈' },
  { href: '/admin/productos', label: 'Productos', icon: '◇' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="font-medium text-gray-900">Gestión Patrimonial</h1>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">
          Panel admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(item => {
          const active = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}