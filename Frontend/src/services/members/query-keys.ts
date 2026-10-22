import type { FetchMembersParams } from './types'

/** Cache keys for the member resource. Invalidate everything with `memberKeys.all()`. */
const ROOT = 'members' as const

export const memberKeys = {
  all: () => [ROOT] as const,
  list: (params: FetchMembersParams) => [ROOT, 'list', params] as const,
  detail: (id: string) => [ROOT, 'detail', id] as const
}
