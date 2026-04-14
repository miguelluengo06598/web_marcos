import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function AdminPage() {
  const supabase = await createClient()

  const { count: totalClientes } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "client")
  const { count: totalPosts } = await supabase.from("posts").select("*", { count: "exact", head: true }).eq("published", true)
  const { count: productosConInteres } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("interest_expressed", true)
  const { data: intereses } = await supabase.from("products").select("*, profiles(full_name, email)").eq("interest_expressed", true).order("interest_at", { ascending: false }).limit(5)

  const stats = [
    { label: "Clientes activos", value: totalClientes ?? 0, color: "#22c55e", icon: "◎" },
    { label: "Posts publicados", value: totalPosts ?? 0, color: "#3b82f6", icon: "◈" },
    { label: "Intereses pendientes", value: productosConInteres ?? 0, color: "#f97316", icon: "◇" },
  ]

  return (
    <div>
      <div style={{marginBottom: 32}}>
        <h1 style={{fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4}}>Resumen</h1>
        <p style={{fontSize: 13, color: "rgba(255,255,255,0.35)"}}>Panel de administracion de WM Patrimonial</p>
      </div>

      <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28}}>
        {stats.map(s => (
          <div key={s.label} style={{background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 20}}>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12}}>
              <span style={{fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)"}}>{s.label}</span>
              <span style={{fontSize: 16, color: s.color}}>{s.icon}</span>
            </div>
            <p style={{fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", color: s.color}}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden"}}>
        <div style={{padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
          <h3 style={{fontSize: 14, fontWeight: 600}}>Ultimos intereses en productos</h3>
          <Link href="/admin/clientes" style={{fontSize: 12, color: "rgba(255,255,255,0.35)"}}>Ver todos →</Link>
        </div>
        {!intereses || intereses.length === 0 ? (
          <div style={{padding: "40px 20px", textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.25)"}}>
            Ningun cliente ha expresado interes todavia
          </div>
        ) : (
          <div>
            {intereses.map((p: any) => (
              <div key={p.id} style={{padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <div>
                  <p style={{fontSize: 14, fontWeight: 500}}>{(p.profiles as any)?.full_name}</p>
                  <p style={{fontSize: 12, color: "rgba(255,255,255,0.3)"}}>{p.name}</p>
                </div>
                <span style={{fontSize: 11, color: "#f97316", background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", padding: "4px 10px", borderRadius: 20}}>Interesado</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
