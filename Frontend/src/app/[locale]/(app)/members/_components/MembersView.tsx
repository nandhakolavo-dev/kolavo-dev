'use client'

import { useTranslations } from 'next-intl'

import { PERMISSIONS } from '@/constants/permissions'
import { usePermissions } from '@/services/auth'
import { useMembers } from '@/services/members'

import { toMemberParams } from '../_utils/members-search'
import type { MembersSearch } from '../schema'
import { CreateMemberDialog } from './CreateMemberDialog'
import { MembersPagination } from './MembersPagination'
import { MembersTable } from './MembersTable'
import { MembersToolbar } from './MembersToolbar'

/** Reads the cache the server just filled: renders immediately, refetches when the URL changes. */
export function MembersView({ search }: { search: MembersSearch }) {
  const t = useTranslations('Members')
  const { can } = usePermissions()
  const { members, total, totalPages, isFetching } = useMembers(toMemberParams(search))
  const hasFilters = Boolean(search.search) || search.status !== 'all'

  return (
    <section className='flex flex-col gap-6' aria-busy={isFetching}>
      <div className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>{t('title')}</h1>
          <p className='text-sm text-muted-foreground'>{t('count', { count: total })}</p>
        </div>
        {/* Action gating (RBAC place 4 of 4): read access does not imply write. */}
        {can(PERMISSIONS.MEMBERS_CREATE) && <CreateMemberDialog />}
      </div>
      <MembersToolbar search={search} />
      <MembersTable members={members} hasFilters={hasFilters} canDelete={can(PERMISSIONS.MEMBERS_DELETE)} />
      {total > 0 && <MembersPagination search={search} totalPages={totalPages} />}
    </section>
  )
}
