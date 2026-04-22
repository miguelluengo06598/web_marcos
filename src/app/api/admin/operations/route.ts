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

export async function GET(request: Request) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const clientProductId = searchParams.get('clientProductId')
  if (!clientProductId) return NextResponse.json({ error: 'clientProductId requerido' }, { status: 400 })

  const { data, error } = await adminDb()
    .from('operations')
    .select('*')
    .eq('client_product_id', clientProductId)
    .order('operated_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { clientProductId, type, points, actionPrice, result, notes, operatedAt } = await request.json()

  if (!clientProductId || !type || points == null || actionPrice == null) {
    return NextResponse.json({ error: 'clientProductId, type, points y actionPrice son obligatorios' }, { status: 400 })
  }

  const parsedPoints = parseFloat(points)
  const computedResult: 'win' | 'loss' = result ?? (parsedPoints >= 0 ? 'win' : 'loss')

  const { data, error } = await adminDb()
    .from('operations')
    .insert({
      client_product_id: clientProductId,
      type,
      points: parsedPoints,
      action_price: parseFloat(actionPrice),
      result: computedResult,
      notes: notes || null,
      operated_at: operatedAt ? new Date(operatedAt).toISOString() : new Date().toISOString(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
