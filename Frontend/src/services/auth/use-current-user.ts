import { queryOptions, useQuery } from '@tanstack/react-query'

import type { Permission } from '@/constants/permissions'
import { http, type HttpClient } from '@/lib/http'
import { hasPermission } from '@/lib/permissions'

import { fetchCurrentUser } from './auth'

export const authKeys = {
  me: () => ['auth', 'me'] as const
}

/** Shared by server prefetch (pass the server client) and the browser hook. */
export const currentUserQueryOptions = (client: HttpClient = http) =>
  // The client (browser or server) only changes the transport, not the data, so it is not in the key.
  // eslint-disable-next-line @tanstack/query/exhaustive-deps
  queryOptions({
    queryKey: authKeys.me(),
    queryFn: ({ signal }) => fetchCurrentUser(client, signal),
    staleTime: 5 * 60_000
  })

export function useCurrentUser() {
  const query = useQuery(currentUserQueryOptions())
  return { user: query.data, isPending: query.isPending }
}

/** Gate buttons and menu entries: `can(PERMISSIONS.MEMBERS_DELETE) && <DeleteButton />`. */
export function usePermissions() {
  const { user } = useCurrentUser()
  return { can: (permission: Permission) => hasPermission(user?.permissions ?? [], permission) }
}
