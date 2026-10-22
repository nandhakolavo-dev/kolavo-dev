import type { HttpClient } from '@/lib/http'

import type { CurrentUser, TokenResponse } from './types'

/** Auth endpoints. Framework-agnostic; the caller picks the client (browser or server). */
export const fetchCurrentUser = (client: HttpClient, signal?: AbortSignal) =>
  client.get<CurrentUser>('/me', { signal })

export const exchangeCode = (client: HttpClient, code: string, redirectUri: string) =>
  client.post<TokenResponse>('/auth/token', { code, redirectUri })
