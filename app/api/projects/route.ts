import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { isAuthenticated } from '../../../lib/auth'

// ---------------- TYPES ----------------
interface ProjectDB {
  id?: string
  name?: string
  description?: string
  featured?: boolean
  links?: unknown[]
  md_content?: string
  tech_stack?: string[]
  video_url?: string
  github_url?: string
  sort_order?: number
  experience_id?: string | null
  experience?: unknown
  images?: string[]
  [key: string]: unknown
}

// ---------------- MAP DB → CLIENT ----------------
function mapToClient(p: ProjectDB) {
  const {
    md_content,
    tech_stack,
    video_url,
    github_url,
    sort_order,
    experience_id,
    experience,
    images,
    ...rest
  } = p

  return {
    ...rest,
    mdContent: md_content,
    techStack: tech_stack || [],
    videoURL: video_url,
    githubURL: github_url,
    order: sort_order,
    experienceId: experience_id,
    images: images || [],
    ...(experience ? { experience } : {}),
  }
}

// ---------------- MAP CLIENT → DB ----------------
type ProjectInput = {
  name?: string
  description?: string
  featured?: boolean
  links?: unknown[]
  mdContent?: string
  techStack?: string[]
  videoURL?: string
  githubURL?: string
  order?: number
  experienceId?: string | null
  images?: string[]
}

function mapToDB(body: ProjectInput) {
  return {
    name: body.name,
    description: body.description,
    featured: body.featured,
    links: body.links,
    md_content: body.mdContent,
    tech_stack: body.techStack,
    video_url: body.videoURL,
    github_url: body.githubURL,
    sort_order: body.order,
    experience_id: body.experienceId || null,
    images: body.images ?? [],
  }
}

// ---------------- GET ----------------
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

// ---------------- POST ----------------
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

// ---------------- PUT ----------------
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

// ---------------- DELETE ----------------
export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const { error } = await supabase.from('projects').delete().eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}