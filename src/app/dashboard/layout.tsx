import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardNav from "@/components/dashboard/DashboardNav"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  if (profile?.role === "admin") redirect("/admin")

  return (
    <div style={{minHeight: "100vh", background: "#0D0D0D", color: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"}}>
      <DashboardNav fullName={profile?.full_name || ""} />
      <main style={{maxWidth: 1100, margin: "0 auto", padding: "32px 24px"}}>
        {children}
      </main>
    </div>
  )
}
