/** Paginated list envelope returned by the backend (docs/api/openapi.yaml `ListMeta`). */
export interface ApiList<TItem> {
  items: TItem[]
  total: number
  page: number
  pageSize: number
}

export interface ApiListParams {
  page: number
  pageSize: number
  search?: string
}

/** Error envelope returned by the backend for every non-2xx response. */
export interface ApiErrorBody {
  error: { code: string; message: string }
}
