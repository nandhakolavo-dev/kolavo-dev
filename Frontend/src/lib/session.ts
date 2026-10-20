import 'server-only'

import { getLocale } from 'next-intl/server'
import { cache } from 'react'

import type { Permission } from '@/constants/permissions'
import { redirect } from '@/i18n/navigation'
import { fetchCurrentUser, type CurrentUser } from '@/services/auth'

import { HttpError } from './http'
import { getServerHttp } from './http.server'
import { hasPermission } from './permissions'

/** The signed-in user, or null. Cached per request. Call inside <Suspense> (reads cookies). */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  try {
    return await fetchCurrentUser(await getServerHttp())
  } catch (error) {
    if (error instanceof HttpError && error.status === 401) return null
    throw error
  }
})

/** Redirects to the sign-in page when nobody is signed in. */
export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) redirect({ href: '/masuk', locale: await getLocale() })
  return user as CurrentUser
}

/** `{ user, allowed }`: render the no-permission state when `allowed` is false. */
export async function checkPermission(permission: Permission) {
  const user = await requireUser()
  return { user, allowed: hasPermission(user.permissions, permission) }
}
