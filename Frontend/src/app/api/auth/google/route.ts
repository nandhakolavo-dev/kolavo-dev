import { type NextRequest, NextResponse } from 'next/server'

import { env } from '@/env'

/**
 * Starts Google sign-in. The backend runs the OAuth flow and redirects back to
 * /api/auth/callback with a one-time `code`. In mock mode, `?role=` picks the fake user.
 */
export function GET(request: NextRequest) {
  const callback = `${env.APP_URL}/api/auth/callback`

  if (env.API_MOCKING) {
    const role = request.nextUrl.searchParams.get('role') === 'member' ? 'member' : 'admin'
    return NextResponse.redirect(`${callback}?code=mock-code-${role}`)
  }

  const start = new URL(`${env.API_BASE_URL}/auth/google`)
  start.searchParams.set('redirectUri', callback)
  return NextResponse.redirect(start)
}
