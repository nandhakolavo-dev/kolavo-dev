import { NextResponse } from 'next/server'

import { env } from '@/env'
import { AUTH_COOKIE } from '@/lib/auth-cookie'

/** POST only, so a link or prefetch can never sign the user out. */
export function POST() {
  const response = NextResponse.redirect(`${env.APP_URL}/masuk`, 303)
  response.cookies.delete(AUTH_COOKIE)
  return response
}
