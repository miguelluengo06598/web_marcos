import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { productoId } = await request.json()

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Marcar interés en la BD
  const { data: producto } = await adminSupabase
    .from('products')
    .update({
      interest_expressed: true,
      interest_at: new Date().toISOString(),
    })
    .eq('id', productoId)
    .eq('client_id', user.id)
    .select('name')
    .single()

  // Obtener nombre del cliente
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  // Enviar mensaje a Telegram
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (token && chatId && token !== 'pendiente') {
    const mensaje = `💼 *Nuevo interés en producto*\n\n👤 Cliente: ${profile?.full_name}\n📧 Email: ${profile?.email}\n📊 Producto: ${producto?.name}`

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: mensaje,
        parse_mode: 'Markdown',
      }),
    })
  }

  return NextResponse.json({ ok: true })
}