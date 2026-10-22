import 'server-only'

import { cookies } from 'next/headers'

import { env } from '@/env'

import { AUTH_COOKIE } from './auth-cookie'
import { createHttpClient } from './http'

/**
 * Server client: calls the backend directly with the user's bearer token.
 * Reads cookies, so call it only inside a <Suspense> boundary (Cache Components).
 */
export async function getServerHttp() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value
  return createHttpClient({
    baseUrl: () => env.API_BASE_URL,
    headers: (): Record<string, string> => (token ? { Authorization: `Bearer ${token}` } : {})
  })
}

/** Server client without a user, for public endpoints and the token exchange. */
export const publicServerHttp = createHttpClient({ baseUrl: () => env.API_BASE_URL })
