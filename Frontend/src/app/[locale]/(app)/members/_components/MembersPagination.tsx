import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'

import { membersHref } from '../_utils/members-search'
import { PAGE_SIZES, type MembersSearch } from '../schema'

/** Plain links: works without JavaScript and every page is shareable. */
export function MembersPagination({ search, totalPages }: { search: MembersSearch; totalPages: number }) {
  const t = useTranslations('Members.pagination')
  const { page } = search

  return (
    <nav aria-label={t('label')} className='flex flex-wrap items-center justify-between gap-3'>
      <div className='flex items-center gap-1 text-sm'>
        <span className='mr-1'>{t('rowsPerPage')}</span>
        {PAGE_SIZES.map(size => (
          <Button key={size} asChild size='sm' variant={size === search.pageSize ? 'secondary' : 'ghost'}>
            <Link
              href={membersHref(search, { pageSize: size, page: 1 })}
              aria-current={size === search.pageSize}
            >
              {size}
            </Link>
          </Button>
        ))}
      </div>
      <div className='flex items-center gap-2'>
        <span className='text-sm'>{t('pageOf', { page, total: totalPages })}</span>
        <PageLink href={membersHref(search, { page: page - 1 })} disabled={page <= 1} label={t('previous')}>
          <ChevronLeft aria-hidden />
        </PageLink>
        <PageLink
          href={membersHref(search, { page: page + 1 })}
          disabled={page >= totalPages}
          label={t('next')}
        >
          <ChevronRight aria-hidden />
        </PageLink>
      </div>
    </nav>
  )
}

function PageLink({
  href,
  disabled,
  label,
  children
}: {
  href: string
  disabled: boolean
  label: string
  children: React.ReactNode
}) {
  if (disabled) {
    return (
      <Button variant='outline' size='icon' disabled aria-label={label}>
        {children}
      </Button>
    )
  }
  return (
    <Button asChild variant='outline' size='icon'>
      <Link href={href} aria-label={label} scroll={false}>
        {children}
      </Link>
    </Button>
  )
}
