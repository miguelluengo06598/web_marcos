import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CambiarPasswordForm from '@/components/dashboard/CambiarPasswordForm'

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, phone, created_at')
    .eq('id', user.id)
    .single()

  const initials = (profile?.full_name || '')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="space-y-6 max-w-lg">
      {/* Header */}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Area privada</p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">Mi perfil</h1>
      </div>

      {/* Profile info card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">{profile?.full_name}</p>
            <p className="text-sm text-gray-400">{profile?.email}</p>
            {profile?.phone && (
              <p className="text-sm text-gray-400">{profile.phone}</p>
            )}
          </div>
        </div>

        <div className="text-xs text-gray-300">
          Cliente desde{' '}
          {profile?.created_at
            ? new Date(profile.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
            : '—'}
        </div>
      </div>

      {/* Password change card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Cambiar contraseña</h2>
        <p className="text-sm text-gray-400 mb-6">
          Elige una contraseña segura que no uses en otros sitios.
        </p>
        <CambiarPasswordForm email={profile?.email || user.email || ''} />
      </div>
    </div>
  )
}
