import { http } from 'msw'
import { setupServer } from 'msw/node'

import { handleMockRequest } from './backend'

/**
 * Unit tests: the browser client calls `<origin>/api/backend/*`; MSW answers with the same
 * mock backend that dev uses. The test adds the bearer token the real proxy would add.
 */
export const server = setupServer(
  http.all('*/api/backend/*', ({ request }) => {
    const path = new URL(request.url).pathname.replace(/^\/api\/backend/, '')
    const authed = new Request(request, {
      headers: { ...Object.fromEntries(request.headers), authorization: 'Bearer mock-token-admin' }
    })
    return handleMockRequest(authed, path)
  })
)
