import createIntlMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'

import { routing } from './i18n/routing'
import { AUTH_COOKIE } from './lib/auth-cookie'

const intl = createIntlMiddleware(routing)

/** Paths inside the Kolavo App (behind sign-in), without a locale prefix. */
const APP_PATHS = ['/members']

function stripLocale(pathname: string) {
  const [, first, ...rest] = pathname.split('/')
  return (routing.locales as readonly string[]).includes(first ?? '') ? `/${rest.join('/')}` : pathname
}

/**
 * 1. Optimistic redirect to /masuk when the session cookie is missing. Not the security
 *    boundary: the backend rejects the token, and pages call `requireUser()`.
 * 2. Locale routing (next-intl).
 */
export default function proxy(request: NextRequest) {
  const path = stripLocale(request.nextUrl.pathname)
  const isAppPath = APP_PATHS.some(prefix => path === prefix || path.startsWith(`${prefix}/`))

  if (isAppPath && !request.cookies.has(AUTH_COOKIE)) {
    return NextResponse.redirect(new URL('/masuk', request.url))
  }

  return intl(request)
}

export const config = {
  // Everything except API routes, Next internals and files with an extension.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)'
}
