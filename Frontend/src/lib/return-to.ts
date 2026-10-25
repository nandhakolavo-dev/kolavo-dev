/**
 * Where to go after sign-in. `/masuk?next=/k/sman52` carries the page the user came from;
 * `/api/auth/google` keeps it in a short-lived httpOnly cookie across the Google round trip,
 * and `/api/auth/callback` redirects there. Shared by `proxy.ts` (edge), so no `server-only`.
 */
export const RETURN_TO_PARAM = 'next'
export const RETURN_TO_COOKIE = 'kolavo_return_to'
export const DEFAULT_RETURN_TO = '/members'

/** Long enough to finish the Google consent screen, short enough not to linger. */
const RETURN_TO_MAX_AGE_SECONDS = 10 * 60

export const returnToCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: RETURN_TO_MAX_AGE_SECONDS
}

/** Paths that make no sense to land on after signing in. */
const NEVER_RETURN_TO = ['/masuk', '/api/']

/**
 * The value as a same-site path, or null. Rejects anything that could leave the site
 * (`//evil.com`, `/\evil.com`, `https://…`) and the sign-in flow itself.
 */
export function safeReturnTo(value: string | null | undefined): string | null {
  if (!value || value.length > 512) return null
  if (!value.startsWith('/') || value.startsWith('//') || /[\\\s]/.test(value)) return null
  // Resolve against a dummy origin: a path that still points at it is local.
  let url: URL
  try {
    url = new URL(value, 'http://kolavo.invalid')
  } catch {
    return null
  }
  if (url.origin !== 'http://kolavo.invalid') return null
  const path = `${url.pathname}${url.search}${url.hash}`
  if (NEVER_RETURN_TO.some(prefix => url.pathname === prefix || url.pathname.startsWith(prefix))) {
    return null
  }
  return path
}

/** `/masuk`, with `?next=` when there is a page worth returning to. */
export function signInHref(returnTo?: string | null) {
  const path = safeReturnTo(returnTo)
  return path ? `/masuk?${new URLSearchParams({ [RETURN_TO_PARAM]: path })}` : '/masuk'
}
