/**
 * Permission codes, `<resource>.<action>`. They must match the backend's codes exactly.
 * DRAFT: proposed in docs/api/openapi.yaml until the backend team confirms the list.
 */
export const PERMISSIONS = {
  MEMBERS_READ: 'members.read',
  MEMBERS_CREATE: 'members.create',
  MEMBERS_DELETE: 'members.delete'
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
