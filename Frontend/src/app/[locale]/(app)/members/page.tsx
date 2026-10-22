import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import type { Metadata } from 'next'
import { connection } from 'next/server'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'

import { NoPermission } from '@/components/shared/no-permission'
import { PERMISSIONS } from '@/constants/permissions'
import { getQueryClient } from '@/lib/get-query-client'
import { getServerHttp } from '@/lib/http.server'
import { checkPermission } from '@/lib/session'
import { currentUserQueryOptions } from '@/services/auth'
import { membersQueryOptions } from '@/services/members'

import { MembersSkeleton } from './_components/MembersSkeleton'
import { MembersView } from './_components/MembersView'
import { toMemberParams } from './_utils/members-search'
import { membersSearchSchema } from './schema'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Members')
  return { title: t('metaTitle'), description: t('metaDescription') }
}

export default function MembersPage({ searchParams }: PageProps<'/[locale]/members'>) {
  return (
    <Suspense fallback={<MembersSkeleton />}>
      <MembersPrefetch searchParams={searchParams} />
    </Suspense>
  )
}

/**
 * Route guard (RBAC place 3 of 4), then prefetch on the server so the first HTML already
 * contains the list, then hand the cache to the client. One cache, one service layer.
 */
async function MembersPrefetch({ searchParams }: Pick<PageProps<'/[locale]/members'>, 'searchParams'>) {
  // Per-user data: render only for a real request (TanStack stamps Date.now() while prefetching).
  await connection()
  const { allowed } = await checkPermission(PERMISSIONS.MEMBERS_READ)
  if (!allowed) return <NoPermission />

  const search = membersSearchSchema.parse(await searchParams)
  const client = await getServerHttp()
  const queryClient = getQueryClient()
  await Promise.all([
    queryClient.prefetchQuery(membersQueryOptions(toMemberParams(search), client)),
    // Fills the shell's nav and user menu too: HydrationBoundary hydrates the shared cache.
    queryClient.prefetchQuery(currentUserQueryOptions(client))
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MembersView search={search} />
    </HydrationBoundary>
  )
}
