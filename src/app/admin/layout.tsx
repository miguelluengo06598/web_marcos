import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  if (profile?.role !== "admin") redirect("/dashboard")

  return (
    <div style={{minHeight: "100vh", background: "#0D0D0D", color: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"}}>
      <AdminSidebar />
      <main style={{marginLeft: 220, padding: "32px 40px", minHeight: "100vh"}}>
        {children}
      </main>
    </div>
  )
}
