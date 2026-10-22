import type { FetchMembersParams } from '@/services/members'

import type { MembersSearch } from '../schema'

/** Maps URL state to API params. The UI-only `'all'` sentinel never reaches the backend. */
export function toMemberParams(search: MembersSearch): FetchMembersParams {
  return {
    page: search.page,
    pageSize: search.pageSize,
    search: search.search || undefined,
    status: search.status === 'all' ? undefined : search.status
  }
}

/** Builds a /members href, dropping values that equal their defaults to keep URLs short. */
export function membersHref(search: MembersSearch, overrides: Partial<MembersSearch> = {}) {
  const next = { ...search, ...overrides }
  const params = new URLSearchParams()
  if (next.search) params.set('search', next.search)
  if (next.status !== 'all') params.set('status', next.status)
  if (next.page !== 1) params.set('page', String(next.page))
  if (next.pageSize !== 10) params.set('pageSize', String(next.pageSize))
  const query = params.toString()
  return query ? `/members?${query}` : '/members'
}
