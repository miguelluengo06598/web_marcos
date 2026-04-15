"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function LoginClient() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPass, setShowPass] = useState(false)

  async function handleLogin() {
    if (!email || !password) return
    setLoading(true)
    setError("")

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError("Email o contrasena incorrectos")
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
    <div className="min-h-screen bg-white flex">

      {/* Left panel - decorativo, solo desktop */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gray-950 p-12 relative overflow-hidden">

        {/* Fondo decorativo */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        </div>

        {/* Grid decorativo */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px"}} />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-gray-900 text-sm font-black">G</span>
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">Gestion Patrimonial</span>
        </div>

        {/* Preview card central */}
        <div className="relative flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm">

            {/* Card principal */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm mb-3">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Valor total</p>
                  <p className="text-white text-3xl font-bold tracking-tight">124.850</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-1.5">
                  <span className="text-emerald-400 text-xs font-semibold">+7.4%</span>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "Renta variable", pct: 45, color: "#3b82f6" },
                  { label: "Renta fija", pct: 35, color: "#10b981" },
                  { label: "Liquidez", pct: 12, color: "#f59e0b" },
                  { label: "Alternativos", pct: 8, color: "#8b5cf6" },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/40">{item.label}</span>
                      <span className="text-white/60 font-medium">{item.pct}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-1 rounded-full" style={{width: `${item.pct}%`, background: item.color}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cards pequenas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-500/10 border border-emerald-500/15 rounded-xl p-3.5">
                <p className="text-white/30 text-xs mb-1">Rentabilidad YTD</p>
                <p className="text-emerald-400 text-lg font-bold">+7.4%</p>
              </div>
              <div className="bg-violet-500/10 border border-violet-500/15 rounded-xl p-3.5">
                <p className="text-white/30 text-xs mb-1">Perfil de riesgo</p>
                <p className="text-violet-400 text-lg font-bold">Moderado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quote bottom */}
        <div className="relative">
          <p className="text-white/30 text-sm leading-relaxed italic max-w-xs">
            "Tu patrimonio, gestionado con criterio y total transparencia."
          </p>
          <p className="text-white/15 text-xs mt-2">Gestion Patrimonial Independiente</p>
        </div>
      </div>

      {/* Right panel - formulario */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 py-12 bg-gray-50 lg:bg-white">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-black">G</span>
          </div>
          <span className="text-gray-900 font-semibold text-sm">Gestion Patrimonial</span>
        </div>

        <div className="w-full max-w-sm">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Bienvenido de nuevo</h1>
            <p className="text-sm text-gray-400">Accede a tu area privada de gestion patrimonial</p>
          </div>

          {/* Form */}
          <div className="space-y-4">

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="tu@email.com"
                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Contrasena</label>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  placeholder="••••••••••"
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors text-xs"
                >
                  {showPass ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <span className="text-red-400 text-sm">✕</span>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="w-full h-12 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-300">
              Problemas para acceder?{" "}
              <Link href="/#contacto" className="text-gray-500 hover:text-gray-900 transition-colors font-medium">
                Contacta con tu asesor
              </Link>
            </p>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex items-center justify-center gap-6">
            {["Cifrado SSL", "Datos privados", "Acceso seguro"].map(badge => (
              <div key={badge} className="flex items-center gap-1.5">
                <span className="text-emerald-400 text-xs">✓</span>
                <span className="text-xs text-gray-300">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
