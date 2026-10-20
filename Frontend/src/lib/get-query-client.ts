import { defaultShouldDehydrateQuery, isServer, QueryClient } from '@tanstack/react-query'

import { HttpError } from './http'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Above zero so the client does not refetch what the server just prefetched.
        staleTime: 60_000,
        retry: (failureCount, error) =>
          !(error instanceof HttpError && error.status < 500) && failureCount < 1
      },
      dehydrate: {
        // Also send queries still pending, so streaming prefetches hydrate too.
        shouldDehydrateQuery: query => defaultShouldDehydrateQuery(query) || query.state.status === 'pending'
      }
    }
  })
}

let browserQueryClient: QueryClient | undefined

/** New client per server request (no data leaks between users); one shared client in the browser. */
export function getQueryClient() {
  if (isServer) return makeQueryClient()
  browserQueryClient ??= makeQueryClient()
  return browserQueryClient
}
