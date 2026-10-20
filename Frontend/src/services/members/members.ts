import { http, type HttpClient } from '@/lib/http'

import type { CreateMemberPayload, FetchMembersParams, Member, MemberList } from './types'

/** Member endpoints. Framework-agnostic; see `use-members.ts` for the React adapter. */
const SOURCE = {
  root: '/members',
  detail: (id: string) => `/members/${encodeURIComponent(id)}`
}

export const fetchMembers = (params: FetchMembersParams, client: HttpClient = http, signal?: AbortSignal) =>
  client.get<MemberList>(SOURCE.root, {
    signal,
    query: {
      page: params.page,
      pageSize: params.pageSize,
      search: params.search,
      status: params.status
    }
  })

export const createMember = (payload: CreateMemberPayload) => http.post<Member>(SOURCE.root, payload)

export const deleteMember = (id: string) => http.delete<null>(SOURCE.detail(id))
