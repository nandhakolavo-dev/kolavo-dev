/**
 * The backend's access token lives only in this httpOnly cookie, set by our Route Handlers
 * (backend-for-frontend). Browser JavaScript never sees the token.
 * Shared by `proxy.ts` (edge) and server code, so it must not import `server-only`.
 */
export const AUTH_COOKIE = 'kolavo_session'

export const authCookieOptions = (maxAgeSeconds: number) => ({
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: maxAgeSeconds
})
