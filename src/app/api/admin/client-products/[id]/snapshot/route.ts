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

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params

  // Fetch current_capital from the client_product
  const { data: cp, error: fetchError } = await adminDb()
    .from('client_products')
    .select('current_capital')
    .eq('id', id)
    .single()

  if (fetchError || !cp) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
  }

  const { error } = await adminDb()
    .from('client_product_snapshots')
    .insert({
      client_product_id: id,
      capital_total: cp.current_capital,
      recorded_at: new Date().toISOString(),
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
