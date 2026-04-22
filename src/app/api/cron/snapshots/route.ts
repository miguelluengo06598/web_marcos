import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Protect this route with a secret so only your cron service can call it.
// Set CRON_SECRET in your environment variables.
// Call with: POST /api/cron/snapshots  Authorization: Bearer <CRON_SECRET>
export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch all client portfolios
  const { data: portfolios, error: fetchError } = await adminSupabase
    .from('portfolios')
    .select('client_id, total_value')

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  if (!portfolios || portfolios.length === 0) {
    return NextResponse.json({ ok: true, inserted: 0 })
  }

  const now = new Date().toISOString()
  const snapshots = portfolios.map((p: any) => ({
    client_id: p.client_id,
    capital_total: p.total_value,
    recorded_at: now,
  }))

  const { error: insertError } = await adminSupabase
    .from('portfolio_snapshots')
    .insert(snapshots)

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, inserted: snapshots.length })
}
