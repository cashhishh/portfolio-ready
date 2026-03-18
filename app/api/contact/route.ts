import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { isAuthenticated } from '../../../lib/auth'
import { sendContactEmail } from '../../../lib/email'

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(data.map((m: any) => {
      const { created_at, ...rest } = m
      return { ...rest, createdAt: created_at }
    }))
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, content } = await req.json()

    if (!name || !email || !content) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Save to DB
    const { data: message, error } = await supabase
      .from('messages')
      .insert({ name, email, content })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Send email notification (non-blocking - don't fail if email fails)
    try {
      await sendContactEmail({ name, email, content })
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
    }

    return NextResponse.json(message, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
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

    const { error } = await supabase.from('messages').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, read } = await req.json()
    const { data: message, error } = await supabase
      .from('messages')
      .update({ read })
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(message)
  } catch {
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}
