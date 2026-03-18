import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { isAuthenticated } from '../../../lib/auth'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapExpToClient(exp: any) {
  const { start_date, end_date, company_logo, sort_order, projects, ...rest } = exp
  return {
    ...rest,
    startDate: start_date,
    endDate: end_date,
    companyLogo: company_logo,
    order: sort_order,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(projects ? { projects: projects.map((p: any) => mapProjectToClient(p)) } : {}),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProjectToClient(p: any) {
  const { md_content, tech_stack, video_url, github_url, sort_order, experience_id, ...rest } = p
  return {
    ...rest,
    mdContent: md_content,
    techStack: tech_stack,
    videoURL: video_url,
    githubURL: github_url,
    order: sort_order,
    experienceId: experience_id,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapExpToDB(body: any) {
  const mapped: Record<string, unknown> = {}
  const skip = new Set(['startDate', 'endDate', 'companyLogo', 'order', 'projects', 'id', 'created_at', 'updated_at', 'createdAt', 'updatedAt'])
  for (const [k, v] of Object.entries(body)) {
    if (!skip.has(k)) mapped[k] = v
  }
  if (body.startDate !== undefined) mapped.start_date = body.startDate
  if (body.endDate !== undefined) mapped.end_date = body.endDate
  if (body.companyLogo !== undefined) mapped.company_logo = body.companyLogo
  if (body.order !== undefined) mapped.sort_order = body.order
  return mapped
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*, projects(*)')
      .order('sort_order', { ascending: true })

    if (error) return NextResponse.json([])
    return NextResponse.json(data.map(mapExpToClient))
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
      .from('experiences')
      .insert(mapExpToDB(body))
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(mapExpToClient(data), { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, ...body } = await req.json()
    const { data, error } = await supabase
      .from('experiences')
      .update(mapExpToDB(body))
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(mapExpToClient(data))
  } catch {
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 })
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

    const { error } = await supabase.from('experiences').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 })
  }
}
