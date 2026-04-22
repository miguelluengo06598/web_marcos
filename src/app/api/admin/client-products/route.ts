import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return user
}

const adminDb = () => createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { clientId, productId, initialInvestment, currentCapital } = await request.json()

  if (!clientId || !productId) {
    return NextResponse.json({ error: 'clientId y productId son obligatorios' }, { status: 400 })
  }

  const { data, error } = await adminDb()
    .from('client_products')
    .insert({
      client_id: clientId,
      product_id: productId,
      initial_investment: parseFloat(initialInvestment) || 0,
      current_capital: parseFloat(currentCapital) || 0,
    })
    .select('*, investment_products(*)')
    .single()

  if (error) {
    const msg = error.code === '23505'
      ? 'Este producto ya está asignado a este cliente'
      : error.message
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  return NextResponse.json(data)
}
