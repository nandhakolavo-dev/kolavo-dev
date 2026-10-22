import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'

import { useAppMutation } from '@/hooks/use-app-mutation'
import { http, type HttpClient } from '@/lib/http'

import { createMember, deleteMember, fetchMembers } from './members'
import { memberKeys } from './query-keys'
import type { CreateMemberPayload, FetchMembersParams, Member } from './types'

/**
 * Shared by the server prefetch (pass `await getServerHttp()`) and the component (browser client),
 * so both hit one cache entry. The client is not part of the key.
 */
export const membersQueryOptions = (params: FetchMembersParams, client: HttpClient = http) =>
  // The client (browser or server) only changes the transport, not the data, so it is not in the key.
  // eslint-disable-next-line @tanstack/query/exhaustive-deps
  queryOptions({
    queryKey: memberKeys.list(params),
    queryFn: ({ signal }) => fetchMembers(params, client, signal),
    placeholderData: keepPreviousData
  })

export function useMembers(params: FetchMembersParams) {
  const query = useQuery(membersQueryOptions(params))

  // Pick fields explicitly: spreading the query result subscribes to every change.
  return {
    isPending: query.isPending,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    members: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    totalPages: query.data ? Math.max(1, Math.ceil(query.data.total / query.data.pageSize)) : 1
  }
}

type MutationToasts = { toastSuccess: string; toastError: string; onSuccess?: () => void }

export const useCreateMember = (options: MutationToasts) =>
  useAppMutation<Member, CreateMemberPayload>(createMember, {
    invalidateKeys: [memberKeys.all()],
    ...options
  })

export const useDeleteMember = (options: MutationToasts) =>
  useAppMutation<null, string>(deleteMember, {
    invalidateKeys: [memberKeys.all()],
    ...options
  })
