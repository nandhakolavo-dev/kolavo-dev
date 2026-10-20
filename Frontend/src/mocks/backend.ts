import type { Role } from '@/services/auth'
import type { CreateMemberPayload, Member } from '@/services/members'

import { featuredCommunities, mockDb, mockUsers } from './data'

/**
 * A fake backend that follows docs/api/openapi.yaml. Served at /api/mock in development
 * (API_MOCKING=true) and reused by MSW in unit tests. Delete it once the real API exists.
 *
 * Tokens look like `mock-token-<role>`; one-time OAuth codes like `mock-code-<role>`.
 */
const json = (body: unknown, status = 200) => Response.json(body, { status })
const fail = (status: number, code: string, message: string) => json({ error: { code, message } }, status)

const roleFrom = (value: string | undefined | null, prefix: string): Role | null => {
  const role = value?.startsWith(prefix) ? value.slice(prefix.length) : null
  return role === 'admin' || role === 'member' ? role : null
}

function currentUser(request: Request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '')
  const role = roleFrom(token, 'mock-token-')
  return role ? mockUsers[role] : null
}

/** `path` is the API path without the base, e.g. `/members/mem_1`. */
export async function handleMockRequest(request: Request, path: string): Promise<Response> {
  const method = request.method.toUpperCase()

  if (method === 'POST' && path === '/auth/token') {
    const { code } = (await request.json()) as { code?: string }
    const role = roleFrom(code, 'mock-code-')
    if (!role) return fail(400, 'invalid_code', 'Kode masuk tidak valid.')
    return json({ accessToken: `mock-token-${role}`, expiresIn: 60 * 60 * 24 * 7 })
  }

  // Public endpoints: no token required.
  if (method === 'GET' && path === '/communities/featured') return json({ items: featuredCommunities })

  const user = currentUser(request)
  if (!user) return fail(401, 'unauthenticated', 'Silakan masuk terlebih dahulu.')
  const can = (permission: string) => user.permissions.includes(permission)
  const forbidden = () => fail(403, 'forbidden', 'Kamu tidak punya izin untuk tindakan ini.')

  if (method === 'GET' && path === '/me') return json(user)

  if (method === 'GET' && path === '/members') {
    if (!can('members.read')) return forbidden()
    const url = new URL(request.url)
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1))
    const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize') ?? 10)))
    const search = (url.searchParams.get('search') ?? '').toLowerCase()
    const status = url.searchParams.get('status')

    const filtered = mockDb.members.filter(
      member =>
        (!search || member.name.toLowerCase().includes(search) || member.email.includes(search)) &&
        (!status || member.status === status)
    )
    return json({
      items: filtered.slice((page - 1) * pageSize, page * pageSize),
      total: filtered.length,
      page,
      pageSize
    })
  }

  if (method === 'POST' && path === '/members') {
    if (!can('members.create')) return forbidden()
    const payload = (await request.json()) as CreateMemberPayload
    if (mockDb.members.some(member => member.email === payload.email)) {
      return fail(409, 'email_taken', 'Email sudah terdaftar.')
    }
    const member: Member = {
      id: `mem_${crypto.randomUUID()}`,
      name: payload.name,
      email: payload.email,
      status: payload.status,
      joinedAt: new Date().toISOString()
    }
    mockDb.members = [member, ...mockDb.members]
    return json(member, 201)
  }

  const memberId = /^\/members\/([^/]+)$/.exec(path)?.[1]
  if (method === 'DELETE' && memberId) {
    if (!can('members.delete')) return forbidden()
    const before = mockDb.members.length
    mockDb.members = mockDb.members.filter(member => member.id !== decodeURIComponent(memberId))
    if (mockDb.members.length === before) return fail(404, 'not_found', 'Anggota tidak ditemukan.')
    return new Response(null, { status: 204 })
  }

  return fail(404, 'not_found', `No mock for ${method} ${path}`)
}
