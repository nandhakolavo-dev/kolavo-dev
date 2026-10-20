import type { Permission } from '@/constants/permissions'

/** UI convenience only. The backend checks the same permission on every request. */
export const hasPermission = (granted: readonly string[], required: Permission) => granted.includes(required)
