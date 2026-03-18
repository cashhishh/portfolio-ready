import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { isAuthenticated } from '../../../lib/auth'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToClient(e: any) {
  const { sort_order, ...rest } = e
  return { ...rest, order: sort_order }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToDB(body: any) {
  const mapped: Record<string, unknown> = {}
  const skip = new Set(['order', 'id', 'created_at', 'updated_at', 'createdAt', 'updatedAt'])
  for (const [k, v] of Object.entries(body)) {
    if (!skip.has(k)) mapped[k] = v
  }
  if (body.order !== undefined) mapped.sort_order = body.order
  return mapped
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) return NextResponse.json([])
    return NextResponse.json(data.map(mapToClient))
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { data, error } = await supabase
      .from('education')
      .insert(mapToDB(body))
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(mapToClient(data), { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create education' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, ...body } = await req.json()
    const { data, error } = await supabase
      .from('education')
      .update(mapToDB(body))
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(mapToClient(data))
  } catch {
    return NextResponse.json({ error: 'Failed to update education' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const { error } = await supabase.from('education').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 })
  }
}
