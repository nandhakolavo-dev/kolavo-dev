import type { CommunityProfile } from '@/services/communities'

import { handleMockRequest } from '../backend'

const request = (method: string, path: string, token?: string, body?: unknown) =>
  new Request(`http://mock${path}`, {
    method,
    headers: token ? { authorization: `Bearer ${token}`, 'content-type': 'application/json' } : {},
    body: body === undefined ? undefined : JSON.stringify(body)
  })

describe('mock backend', () => {
  it('serves featured communities without a token', async () => {
    const response = await handleMockRequest(request('GET', '/communities/featured'), '/communities/featured')
    expect(response.status).toBe(200)
    const body = (await response.json()) as { items: { slug: string }[] }
    expect(body.items.map(item => item.slug)).toContain('sman52')
  })

  it('serves a public community profile without names or contacts of members', async () => {
    const response = await handleMockRequest(request('GET', '/communities/sman52'), '/communities/sman52')
    expect(response.status).toBe(200)
    const body = (await response.json()) as CommunityProfile
    expect(body).toMatchObject({ slug: 'sman52', name: 'Ikatan Alumni SMAN 52', verified: true })
    expect(body.board.map(member => member.role)).toEqual(['Ketua', 'Bendahara'])
    expect(body).not.toHaveProperty('memberInitials')
    for (const dimension of body.spread) {
      const total = dimension.buckets.reduce((sum, bucket) => sum + bucket.count, dimension.otherCount)
      expect(total).toBe(body.memberCount)
    }
  })

  it('shows only the creator of an Esensial community', async () => {
    const response = await handleMockRequest(request('GET', '/communities/ppiju'), '/communities/ppiju')
    const body = (await response.json()) as CommunityProfile
    expect(body.board).toEqual([{ name: 'Dedi Kurniawan', role: 'Community Creator', photoUrl: null }])
  })

  it('answers 404 for an unknown community', async () => {
    const response = await handleMockRequest(
      request('GET', '/communities/tidak-ada'),
      '/communities/tidak-ada'
    )
    expect(response.status).toBe(404)
    expect(await response.json()).toMatchObject({ error: { code: 'not_found' } })
  })

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
