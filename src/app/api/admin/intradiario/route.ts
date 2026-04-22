import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
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

  const { portfolioId, capitalTotal, inversionInicial } = await request.json()

  if (!portfolioId) {
    return NextResponse.json({ error: 'portfolioId requerido' }, { status: 400 })
  }

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await adminSupabase
    .from('portfolios')
    .update({
      total_value: parseFloat(capitalTotal) || 0,
      initial_investment: parseFloat(inversionInicial) || 0,
      last_updated: new Date().toISOString(),
    })
    .eq('id', portfolioId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
