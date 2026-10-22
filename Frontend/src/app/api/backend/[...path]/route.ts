import { cookies } from 'next/headers'

import { env } from '@/env'
import { AUTH_COOKIE } from '@/lib/auth-cookie'

/**
 * Backend-for-frontend proxy. The browser calls `/api/backend/<path>`; this handler adds the
 * bearer token from the httpOnly cookie and forwards to API_BASE_URL. The token never reaches JS.
 */
async function handler(request: Request, { params }: RouteContext<'/api/backend/[...path]'>) {
  const { path } = await params
  const token = (await cookies()).get(AUTH_COOKIE)?.value
  const target = new URL(`${env.API_BASE_URL}/${path.map(encodeURIComponent).join('/')}`)
  target.search = new URL(request.url).search

  const headers = new Headers({ Accept: 'application/json' })
  const contentType = request.headers.get('content-type')
  if (contentType) headers.set('Content-Type', contentType)
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD'
  const response = await fetch(target, {
    method: request.method,
    headers,
    body: hasBody ? await request.text() : undefined,
    cache: 'no-store'
  })

  return new Response(response.body, {
    status: response.status,
    headers: { 'Content-Type': response.headers.get('content-type') ?? 'application/json' }
  })
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE }
