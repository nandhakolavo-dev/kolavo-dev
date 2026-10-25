import { type NextRequest, NextResponse } from 'next/server'

import { env } from '@/env'
import { AUTH_COOKIE, authCookieOptions } from '@/lib/auth-cookie'
import { publicServerHttp } from '@/lib/http.server'
import { DEFAULT_RETURN_TO, RETURN_TO_COOKIE, safeReturnTo, signInHref } from '@/lib/return-to'
import { exchangeCode } from '@/services/auth'

/**
 * Exchanges the one-time code for a token server-to-server, stores it in an httpOnly cookie,
 * then returns the user to the page they came from (set by /api/auth/google), or /members.
 */
export async function GET(request: NextRequest) {
  const returnTo = safeReturnTo(request.cookies.get(RETURN_TO_COOKIE)?.value)
  // On failure, keep `next` so trying again still returns the user to the same page.
  const failed = () => {
    const href = signInHref(returnTo)
    return NextResponse.redirect(`${env.APP_URL}${href}${href.includes('?') ? '&' : '?'}error=1`)
  }

  const code = request.nextUrl.searchParams.get('code')
  if (!code) return failed()

  try {
    const { accessToken, expiresIn } = await exchangeCode(
      publicServerHttp,
      code,
      `${env.APP_URL}/api/auth/callback`
    )
    const response = NextResponse.redirect(`${env.APP_URL}${returnTo ?? DEFAULT_RETURN_TO}`)
    response.cookies.set(AUTH_COOKIE, accessToken, authCookieOptions(expiresIn))
    response.cookies.delete(RETURN_TO_COOKIE)
    return response
  } catch {
    return failed()
  }
}
