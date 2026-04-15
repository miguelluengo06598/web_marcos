"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function ProductoInteresButton({
  productoId,
  interesExpresado,
}: {
  productoId: string
  interesExpresado: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(interesExpresado)
  const supabase = createClient()

  async function handleInteres() {
    if (done) return
    setLoading(true)

    const res = await fetch("/api/productos/interes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productoId }),
    })

    if (res.ok) setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 18px",
        borderRadius: 8,
        background: "var(--green-dim)",
        border: "1px solid rgba(0,201,141,0.2)",
        fontSize: 13,
        color: "var(--green)",
        fontFamily: "var(--font-display)",
        fontWeight: 500,
      }}>
        <span style={{ fontSize: 14 }}>✓</span>
        Tu asesor ha sido notificado
      </div>
    )
  }

  return (
    <button
      onClick={handleInteres}
      disabled={loading}
      style={{
        width: "100%",
        padding: "11px 18px",
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "var(--font-display)",
        background: "var(--cyan)",
        color: "var(--bg)",
        border: "none",
        borderRadius: 8,
        cursor: loading ? "wait" : "pointer",
        opacity: loading ? 0.6 : 1,
        transition: "opacity 0.15s",
        letterSpacing: "-0.01em",
      }}
    >
      {loading ? "Enviando..." : "Estoy interesado — contactar con mi asesor"}
    </button>
  )
}
