import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '../../../../lib/auth'

export async function GET() {
  const authed = await isAuthenticated()
  return NextResponse.json({ authenticated: authed })
}

// Middleware-style check - reusable
export async function requireAuth(): Promise<NextResponse | null> {
  const authed = await isAuthenticated()
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
