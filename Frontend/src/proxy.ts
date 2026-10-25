import createIntlMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'

import { routing } from './i18n/routing'
import { AUTH_COOKIE } from './lib/auth-cookie'
import { HttpError } from './lib/http'
import { publicServerHttp } from './lib/http.server'
import { signInHref } from './lib/return-to'
import { fetchCommunityProfile } from './services/communities'

const intl = createIntlMiddleware(routing)

/** Paths inside the Kolavo App (behind sign-in), without a locale prefix. */
const APP_PATHS = ['/members']

function stripLocale(pathname: string) {
  const [, first, ...rest] = pathname.split('/')
  return (routing.locales as readonly string[]).includes(first ?? '') ? `/${rest.join('/')}` : pathname
}

/** Rewrite target under `k/[slug]/[...missing]`, a static page that answers 404. */
const MISSING_SEGMENT = 'tidak-ditemukan'

/** `/k/<slug>` → the slug; anything else → null. */
function communitySlug(path: string) {
  const slug = /^\/k\/([^/]+)\/?$/.exec(path)?.[1]
  return slug ? decodeURIComponent(slug) : null
}

/**
 * The profile page streams, so its own notFound() can only answer 200 + noindex. Checking the
 * slug here, before rendering starts, lets an unknown community return a real 404. Other API
 * failures pass through to the page's error boundary. Costs one extra API read per profile
 * view until the backend offers something cheaper.
 */
async function isMissingCommunity(slug: string) {
  try {
    await fetchCommunityProfile(publicServerHttp, slug)
    return false
  } catch (error) {
    return error instanceof HttpError && error.status === 404
  }
}

/**
 * 1. Optimistic redirect to /masuk?next=<this page> when the session cookie is missing. Not
 *    the security boundary: the backend rejects the token, and pages call `requireUser()`.
 * 2. Locale routing (next-intl).
 * 3. Unknown community profiles: rewrite to a static not-found page so the status is a real 404.
 */
export default async function proxy(request: NextRequest) {
  const path = stripLocale(request.nextUrl.pathname)
  const isAppPath = APP_PATHS.some(prefix => path === prefix || path.startsWith(`${prefix}/`))

  if (isAppPath && !request.cookies.has(AUTH_COOKIE)) {
    const { pathname, search } = request.nextUrl
    return NextResponse.redirect(new URL(signInHref(`${pathname}${search}`), request.url))
  }

  const response = intl(request)
  const slug = communitySlug(path)
  // Only rewrites (a page will render); next-intl redirects keep their own status.
  const rewrite = response.headers.get('x-middleware-rewrite')
  if (slug && rewrite && (await isMissingCommunity(slug))) {
    const target = new URL(rewrite, request.url)
    target.pathname = `${target.pathname.replace(/\/$/, '')}/${MISSING_SEGMENT}`
    const missing = NextResponse.rewrite(target)
    for (const cookie of response.cookies.getAll()) missing.cookies.set(cookie)
    return missing
  }
  return response
}

export const config = {
  // Everything except API routes, Next internals and files with an extension.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)'
}
