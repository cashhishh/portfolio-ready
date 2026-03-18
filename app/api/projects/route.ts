import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { isAuthenticated } from '../../../lib/auth'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToClient(p: any) {
  const { md_content, tech_stack, video_url, github_url, sort_order, experience_id, experience, ...rest } = p
  return {
    ...rest,
    mdContent: md_content,
    techStack: tech_stack,
    videoURL: video_url,
    githubURL: github_url,
    order: sort_order,
    experienceId: experience_id,
    ...(experience ? { experience } : {}),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToDB(body: any) {
  const mapped: Record<string, unknown> = {}
  const skip = new Set(['mdContent', 'techStack', 'videoURL', 'githubURL', 'order', 'experienceId', 'experience', 'id', 'created_at', 'updated_at', 'createdAt', 'updatedAt'])
  for (const [k, v] of Object.entries(body)) {
    if (!skip.has(k)) mapped[k] = v
  }
  if (body.mdContent !== undefined) mapped.md_content = body.mdContent
  if (body.techStack !== undefined) mapped.tech_stack = body.techStack
  if (body.videoURL !== undefined) mapped.video_url = body.videoURL
  if (body.githubURL !== undefined) mapped.github_url = body.githubURL
  if (body.order !== undefined) mapped.sort_order = body.order
  if (body.experienceId !== undefined) mapped.experience_id = body.experienceId || null
  return mapped
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*, experience:experiences(*)')
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
      .from('projects')
      .insert(mapToDB(body))
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(mapToClient(data), { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, ...body } = await req.json()
    const { data, error } = await supabase
      .from('projects')
      .update(mapToDB(body))
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(mapToClient(data))
  } catch {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
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

    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
