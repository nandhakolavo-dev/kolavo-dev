/** Error thrown for any non-2xx response. `status` and `body` come from the server. */
export class HttpError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, body: unknown, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.body = body
  }
}

type Query = Record<string, string | number | boolean | undefined | null>

interface RequestOptions {
  query?: Query
  body?: unknown
  signal?: AbortSignal
}

export interface HttpClientConfig {
  /** Absolute base URL, or a function resolving it per request. */
  baseUrl: () => string
  /** Extra headers per request (the server client adds the bearer token here). */
  headers?: () => Promise<Record<string, string>> | Record<string, string>
}

function buildUrl(baseUrl: string, path: string, query?: Query) {
  const url = new URL(`${baseUrl}${path}`)
  for (const [key, value] of Object.entries(query ?? {})) {
    // Empty values are dropped so UI sentinels never reach the backend.
    if (value === undefined || value === null || value === '') continue
    url.searchParams.set(key, String(value))
  }
  return url
}

/** Reads the backend's error envelope: `{ "error": { "code", "message" } }` (see docs/api/openapi.yaml). */
function errorMessage(data: unknown, status: number) {
  if (typeof data === 'object' && data !== null && 'error' in data) {
    const error = (data as { error: unknown }).error
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      return error.message
    }
  }
  return `Request failed with status ${status}`
}

export function createHttpClient(config: HttpClientConfig) {
  async function request<TResponse>(method: string, path: string, options: RequestOptions = {}) {
    const headers: Record<string, string> = { Accept: 'application/json', ...(await config.headers?.()) }
    if (options.body !== undefined) headers['Content-Type'] = 'application/json'

    const response = await fetch(buildUrl(config.baseUrl(), path, options.query), {
      method,
      signal: options.signal,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      // Server-side reads go through the Next.js Data Cache only when a page opts in with 'use cache'.
      cache: 'no-store'
    })

    const text = await response.text()
    const data: unknown = text ? JSON.parse(text) : null

    if (!response.ok) throw new HttpError(response.status, data, errorMessage(data, response.status))

    return data as TResponse
  }

  return {
    get: <T>(path: string, options?: Omit<RequestOptions, 'body'>) => request<T>('GET', path, options),
    post: <T>(path: string, body: unknown, options?: RequestOptions) =>
      request<T>('POST', path, { ...options, body }),
    put: <T>(path: string, body: unknown, options?: RequestOptions) =>
      request<T>('PUT', path, { ...options, body }),
    delete: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, options)
  }
}

export type HttpClient = ReturnType<typeof createHttpClient>

/**
 * Browser client. It calls our own `/api/backend` proxy, which attaches the token from the
 * httpOnly cookie. Server code must pass `getServerHttp()` from `http.server.ts` instead.
 */
export const http = createHttpClient({
  baseUrl: () => {
    if (typeof window === 'undefined') {
      throw new Error('`http` is the browser client. On the server, pass `await getServerHttp()`.')
    }
    return `${window.location.origin}/api/backend`
  }
})
