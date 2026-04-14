import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { sendTelegram } from "@/lib/telegram"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { productoId } = await request.json()

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: producto } = await adminSupabase
    .from("products")
    .update({ interest_expressed: true, interest_at: new Date().toISOString() })
    .eq("id", productoId)
    .eq("client_id", user.id)
    .select("name")
    .single()

  const { data: profile } = await adminSupabase
    .from("profiles")
    .select("full_name, email, phone")
    .eq("id", user.id)
    .single()

  await sendTelegram(
    `💼 *Nuevo interes en producto*\n\n` +
    `👤 *Cliente:* ${profile?.full_name}\n` +
    `📧 *Email:* ${profile?.email}\n` +
    `📱 *Telefono:* ${profile?.phone || "no indicado"}\n` +
    `📊 *Producto:* ${producto?.name}`
  )

  return NextResponse.json({ ok: true })
}
