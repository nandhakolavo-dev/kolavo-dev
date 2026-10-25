import { type NextRequest, NextResponse } from 'next/server'

import { env } from '@/env'
import { RETURN_TO_COOKIE, RETURN_TO_PARAM, returnToCookieOptions, safeReturnTo } from '@/lib/return-to'

/**
 * Starts Google sign-in. The backend runs the OAuth flow and redirects back to
 * /api/auth/callback with a one-time `code`. In mock mode, `?role=` picks the fake user.
 * `?next=` (a same-site path) is kept in a cookie so the callback can return the user there.
 */
export function GET(request: NextRequest) {
  const callback = `${env.APP_URL}/api/auth/callback`

  let response: NextResponse
  if (env.API_MOCKING) {
    const role = request.nextUrl.searchParams.get('role') === 'member' ? 'member' : 'admin'
    response = NextResponse.redirect(`${callback}?code=mock-code-${role}`)
  } else {
    const start = new URL(`${env.API_BASE_URL}/auth/google`)
    start.searchParams.set('redirectUri', callback)
    response = NextResponse.redirect(start)
  }

  const returnTo = safeReturnTo(request.nextUrl.searchParams.get(RETURN_TO_PARAM))
  if (returnTo) response.cookies.set(RETURN_TO_COOKIE, returnTo, returnToCookieOptions)
  else response.cookies.delete(RETURN_TO_COOKIE)
  return response
}
