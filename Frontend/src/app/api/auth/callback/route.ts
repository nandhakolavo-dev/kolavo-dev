import { type NextRequest, NextResponse } from 'next/server'

import { env } from '@/env'
import { AUTH_COOKIE, authCookieOptions } from '@/lib/auth-cookie'
import { publicServerHttp } from '@/lib/http.server'
import { exchangeCode } from '@/services/auth'

/** Exchanges the one-time code for a token server-to-server, then stores it in an httpOnly cookie. */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  if (!code) return NextResponse.redirect(`${env.APP_URL}/masuk?error=1`)

  try {
    const { accessToken, expiresIn } = await exchangeCode(
      publicServerHttp,
      code,
      `${env.APP_URL}/api/auth/callback`
    )
    const response = NextResponse.redirect(`${env.APP_URL}/members`)
    response.cookies.set(AUTH_COOKIE, accessToken, authCookieOptions(expiresIn))
    return response
  } catch {
    return NextResponse.redirect(`${env.APP_URL}/masuk?error=1`)
  }
}
