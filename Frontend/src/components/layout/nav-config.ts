import { Users } from 'lucide-react'

import { PERMISSIONS, type Permission } from '@/constants/permissions'

/** Menu entries. Each one names the permission that shows it (RBAC place 2 of 4). */
export const NAV_ITEMS = [
  { href: '/members', labelKey: 'members', icon: Users, permission: PERMISSIONS.MEMBERS_READ }
] as const satisfies readonly {
  href: string
  labelKey: 'members'
  icon: typeof Users
  permission: Permission
}[]
