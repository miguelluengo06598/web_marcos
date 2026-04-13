'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const nav = [
  { href: '/dashboard', label: 'Mi cartera' },
  { href: '/dashboard/noticias', label: 'Noticias' },
  { href: '/dashboard/productos', label: 'Productos' },
  { href: '/dashboard/documentos', label: 'Documentos' },
]

export default function DashboardNav({ fullName }: { fullName: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const initials = fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
        <span className="font-medium text-gray-900 text-sm">Gestión Patrimonial</span>

        <nav className="flex items-center gap-1">
          {nav.map(item => {
            const active = item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  active ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
            {initials}
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-gray-900"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}