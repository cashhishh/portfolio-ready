import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { isAuthenticated } from '../../../lib/auth'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single()

    if (error) return NextResponse.json(null)

    // Map snake_case DB columns to camelCase for frontend
    return NextResponse.json({
      ...data,
      resumeURL: data.resume_url,
      avatarURL: data.avatar_url,
      socialLinks: data.social_links,
    })
  } catch {
    return NextResponse.json(null)
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()

    // Map camelCase frontend fields to snake_case DB columns
    const dbBody: Record<string, unknown> = {
      name: body.name,
      title: body.title,
      titles: body.titles,
      bio: body.bio,
      email: body.email,
      phone: body.phone,
      address: body.address,
      resume_url: body.resumeURL ?? body.resume_url,
      avatar_url: body.avatarURL ?? body.avatar_url,
      social_links: body.socialLinks ?? body.social_links,
    }

    // Remove undefined values
    Object.keys(dbBody).forEach(k => dbBody[k] === undefined && delete dbBody[k])

    // Check if profile exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single()

    let result
    if (existing) {
      result = await supabase
        .from('profiles')
        .update(dbBody)
        .eq('id', existing.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from('profiles')
        .insert(dbBody)
        .select()
        .single()
    }

    if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 })
    return NextResponse.json(result.data)
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
