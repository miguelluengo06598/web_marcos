"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function LoginClient() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleLogin() {
    setLoading(true)
    setError("")

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError("Email o contraseña incorrectos")
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single()

    router.push(profile?.role === "admin" ? "/admin" : "/dashboard")
    router.refresh()
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      fontFamily: "var(--font-body)",
    }}>
      <div style={{ width: "100%", maxWidth: 380 }}>

        {/* Logo / cabecera */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "var(--surface2)",
            border: "1px solid var(--border-hover)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <div style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#00D4FF",
              boxShadow: "0 0 14px rgba(0, 212, 255, 0.7)",
            }} />
          </div>
          <h1 style={{
            fontSize: 22,
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: 6,
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.02em",
          }}>
            Gestión Patrimonial
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Accede a tu área privada
          </p>
        </div>

        {/* Card formulario */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 28,
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Email */}
            <div>
              <label style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-muted)",
                marginBottom: 8,
                fontFamily: "var(--font-display)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="tu@email.com"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 9,
                  fontSize: 13,
                  color: "var(--text)",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                  transition: "border-color 0.15s",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(0,212,255,0.45)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-muted)",
                marginBottom: 8,
                fontFamily: "var(--font-display)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 9,
                  fontSize: 13,
                  color: "var(--text)",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                  transition: "border-color 0.15s",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(0,212,255,0.45)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                fontSize: 13,
                color: "#FF4D6A",
                background: "rgba(255, 77, 106, 0.08)",
                border: "1px solid rgba(255, 77, 106, 0.20)",
                padding: "10px 14px",
                borderRadius: 8,
              }}>
                {error}
              </div>
            )}

            {/* Botón */}
            <button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              style={{
                width: "100%",
                padding: "11px 0",
                background: loading || !email || !password
                  ? "var(--surface2)"
                  : "#00D4FF",
                color: loading || !email || !password
                  ? "var(--text-dim)"
                  : "#050C1A",
                border: "none",
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                cursor: loading || !email || !password ? "not-allowed" : "pointer",
                transition: "all 0.15s",
                letterSpacing: "0.02em",
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </div>

        <p style={{
          textAlign: "center",
          fontSize: 12,
          color: "var(--text-dim)",
          marginTop: 20,
        }}>
          ¿Problemas para acceder? Contacta con tu asesor.
        </p>
      </div>
    </div>
  )
}
