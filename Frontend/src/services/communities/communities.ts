import type { HttpClient } from '@/lib/http'

import type { FeaturedCommunity } from './types'

/** Public endpoint: callable from Server Components with `publicServerHttp`, no user needed. */
export const fetchFeaturedCommunities = (client: HttpClient) =>
  client.get<{ items: FeaturedCommunity[] }>('/communities/featured')
