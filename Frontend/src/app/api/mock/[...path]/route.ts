import { env } from '@/env'
import { handleMockRequest } from '@/mocks/backend'

/** The development mock backend. 404 unless API_MOCKING=true, so it is inert in production. */
async function handler(request: Request, { params }: RouteContext<'/api/mock/[...path]'>) {
  if (!env.API_MOCKING) return new Response(null, { status: 404 })
  const { path } = await params
  return handleMockRequest(request, `/${path.join('/')}`)
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE }
