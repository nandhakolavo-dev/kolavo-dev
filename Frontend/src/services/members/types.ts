import type { ApiList, ApiListParams } from '@/types/api'

export type MemberStatus = 'active' | 'pending'

export interface Member {
  id: string
  name: string
  email: string
  status: MemberStatus
  joinedAt: string
}

export interface FetchMembersParams extends ApiListParams {
  status?: MemberStatus
}

export type MemberList = ApiList<Member>

export interface CreateMemberPayload {
  name: string
  email: string
  status: MemberStatus
}
