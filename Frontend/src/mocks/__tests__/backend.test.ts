import { handleMockRequest } from '../backend'

const request = (method: string, path: string, token?: string, body?: unknown) =>
  new Request(`http://mock${path}`, {
    method,
    headers: token ? { authorization: `Bearer ${token}`, 'content-type': 'application/json' } : {},
    body: body === undefined ? undefined : JSON.stringify(body)
  })

describe('mock backend', () => {
  it('rejects requests without a token', async () => {
    const response = await handleMockRequest(request('GET', '/members'), '/members')
    expect(response.status).toBe(401)
  })

  it('exchanges a code for a token', async () => {
    const response = await handleMockRequest(
      request('POST', '/auth/token', undefined, { code: 'mock-code-member' }),
      '/auth/token'
    )
    expect(await response.json()).toMatchObject({ accessToken: 'mock-token-member' })
  })

  it('forbids a member from creating members (the backend is the boundary)', async () => {
    const response = await handleMockRequest(
      request('POST', '/members', 'mock-token-member', { name: 'X', email: 'x@contoh.id', status: 'active' }),
      '/members'
    )
    expect(response.status).toBe(403)
  })
})
