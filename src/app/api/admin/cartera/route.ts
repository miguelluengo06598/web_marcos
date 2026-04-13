import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { portfolioId, clienteId, totalValue, ytdReturn, riskProfile, notes, positions } = await request.json()

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  if (portfolioId) {
    await adminSupabase.from("portfolios").update({
      total_value: totalValue,
      ytd_return: ytdReturn,
      risk_profile: riskProfile,
      notes,
      last_updated: new Date().toISOString(),
    }).eq("id", portfolioId)

    await adminSupabase.from("portfolio_positions").delete().eq("portfolio_id", portfolioId)

    if (positions.length > 0) {
      await adminSupabase.from("portfolio_positions").insert(
        positions.filter((p: any) => p.asset_name).map((p: any) => ({ ...p, portfolio_id: portfolioId }))
      )
    }
  } else {
    const { data: newPortfolio } = await adminSupabase.from("portfolios").insert({
      client_id: clienteId,
      total_value: totalValue,
      ytd_return: ytdReturn,
      risk_profile: riskProfile,
      notes,
    }).select().single()

    if (newPortfolio && positions.length > 0) {
      await adminSupabase.from("portfolio_positions").insert(
        positions.filter((p: any) => p.asset_name).map((p: any) => ({ ...p, portfolio_id: newPortfolio.id }))
      )
    }
  }

  return NextResponse.json({ ok: true })
}
