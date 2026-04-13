'use client'

import { useState } from 'react'

export default function ProductoInteresButton({
  productoId,
  interesExpresado,
}: {
  productoId: string
  interesExpresado: boolean
}) {
  const [enviado, setEnviado] = useState(interesExpresado)
  const [loading, setLoading] = useState(false)

  async function handleInteres() {
    if (enviado) return
    setLoading(true)

    await fetch('/api/productos/interes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productoId }),
    })

    setEnviado(true)
    setLoading(false)
  }

  if (enviado) {
    return (
      <div className="text-sm text-green-600 bg-green-50 px-4 py-2.5 rounded-lg inline-block">
        Tu asesor ha sido notificado y se pondrá en contacto contigo
      </div>
    )
  }

  return (
    <button
      onClick={handleInteres}
      disabled={loading}
      className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-40 transition-colors"
    >
      {loading ? 'Enviando...' : 'Estoy interesado — contactar con mi asesor'}
    </button>
  )
}