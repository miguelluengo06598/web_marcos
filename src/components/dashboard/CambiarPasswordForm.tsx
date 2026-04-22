'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  email: string
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'Al menos 8 caracteres', ok: password.length >= 8 },
    { label: 'Mayúscula', ok: /[A-Z]/.test(password) },
    { label: 'Número', ok: /[0-9]/.test(password) },
    { label: 'Carácter especial', ok: /[^a-zA-Z0-9]/.test(password) },
  ]
  const passed = checks.filter(c => c.ok).length
  const color = passed <= 1 ? 'bg-red-400' : passed <= 2 ? 'bg-orange-400' : passed <= 3 ? 'bg-yellow-400' : 'bg-emerald-400'
  const label = passed <= 1 ? 'Débil' : passed <= 2 ? 'Regular' : passed <= 3 ? 'Buena' : 'Fuerte'

  if (!password) return null

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1 h-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`flex-1 rounded-full ${i <= passed ? color : 'bg-gray-100'} transition-colors`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${passed <= 1 ? 'text-red-500' : passed <= 2 ? 'text-orange-500' : passed <= 3 ? 'text-yellow-600' : 'text-emerald-600'}`}>
        {label}
      </p>
    </div>
  )
}

export default function CambiarPasswordForm({ email }: Props) {
  const [current, setCurrent] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!current || !newPass || !confirm) {
      setError('Rellena todos los campos')
      return
    }
    if (newPass !== confirm) {
      setError('La nueva contraseña y la confirmación no coinciden')
      return
    }
    if (newPass.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres')
      return
    }
    if (newPass === current) {
      setError('La nueva contraseña debe ser diferente a la actual')
      return
    }

    setLoading(true)
    const supabase = createClient()

    // Verify current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: current,
    })

    if (signInError) {
      setError('La contraseña actual es incorrecta')
      setLoading(false)
      return
    }

    // Update to new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPass,
    })

    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess(true)
      setCurrent('')
      setNewPass('')
      setConfirm('')
    }

    setLoading(false)
  }

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl font-medium">
          ✓ Contraseña actualizada correctamente
        </div>
      )}

      <div>
        <label className={labelClass}>Contraseña actual</label>
        <input
          type="password"
          value={current}
          onChange={e => setCurrent(e.target.value)}
          autoComplete="current-password"
          className={inputClass}
          placeholder="Tu contraseña actual"
        />
      </div>

      <div>
        <label className={labelClass}>Nueva contraseña</label>
        <input
          type="password"
          value={newPass}
          onChange={e => setNewPass(e.target.value)}
          autoComplete="new-password"
          className={inputClass}
          placeholder="Mínimo 8 caracteres"
        />
        <PasswordStrength password={newPass} />
      </div>

      <div>
        <label className={labelClass}>Confirmar nueva contraseña</label>
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          autoComplete="new-password"
          className={inputClass}
          placeholder="Repite la nueva contraseña"
        />
        {confirm && newPass !== confirm && (
          <p className="text-xs text-red-500 mt-1.5">Las contraseñas no coinciden</p>
        )}
        {confirm && newPass === confirm && newPass.length >= 8 && (
          <p className="text-xs text-emerald-600 mt-1.5">✓ Las contraseñas coinciden</p>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Actualizando...' : 'Cambiar contraseña'}
      </button>
    </form>
  )
}
