import type { HttpClient } from '@/lib/http'

import type { CommunityProfile, FeaturedCommunity } from './types'

/** Public endpoint: callable from Server Components with `publicServerHttp`, no user needed. */
export const fetchFeaturedCommunities = (client: HttpClient) =>
  client.get<{ items: FeaturedCommunity[] }>('/communities/featured')

/** Public profile (DRAFT endpoint). Throws `HttpError` with status 404 for an unknown slug. */
export const fetchCommunityProfile = (client: HttpClient, slug: string) =>
  client.get<CommunityProfile>(`/communities/${encodeURIComponent(slug)}`)
