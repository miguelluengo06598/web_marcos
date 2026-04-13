import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Verificar que quien llama es admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { full_name, email, password, phone } = await request.json()

  // Usar service role para crear usuario sin verificación de email
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: newUser, error: authError } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role: 'client' },
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  // Actualizar teléfono si se proporcionó
  if (phone && newUser.user) {
    await adminSupabase
      .from('profiles')
      .update({ phone })
      .eq('id', newUser.user.id)
  }

  // Crear cartera vacía para el cliente
  if (newUser.user) {
    await adminSupabase.from('portfolios').insert({
      client_id: newUser.user.id,
      total_value: 0,
      ytd_return: 0,
      risk_profile: 'moderado',
    })
  }

  return NextResponse.json({ ok: true, user: newUser.user })
}