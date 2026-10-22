'use client'

import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState, useTransition } from 'react'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from '@/i18n/navigation'

import { membersHref } from '../_utils/members-search'
import { MEMBER_STATUSES, type MembersSearch } from '../schema'

export function MembersToolbar({ search }: { search: MembersSearch }) {
  const t = useTranslations('Members')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [input, setInput] = useState(search.search)

  const navigate = (overrides: Partial<MembersSearch>) =>
    startTransition(() => router.replace(membersHref(search, { ...overrides, page: 1 }), { scroll: false }))

  // Debounce typing into the URL; the URL is the external store this effect syncs with.
  useEffect(() => {
    if (input.trim() === search.search) return
    const timer = window.setTimeout(() => navigate({ search: input.trim() }), 400)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input])

  return (
    <div className='flex flex-wrap gap-3' aria-busy={isPending}>
      <div className='relative w-full max-w-sm'>
        <Search
          className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground'
          aria-hidden
        />
        <Input
          type='search'
          aria-label={t('searchLabel')}
          placeholder={t('searchPlaceholder')}
          className='pl-9'
          value={input}
          onChange={event => setInput(event.target.value)}
        />
      </div>
      <Select
        value={search.status}
        onValueChange={value => navigate({ status: value as MembersSearch['status'] })}
      >
        <SelectTrigger className='w-40' aria-label={t('filterStatus')}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>{t('status.all')}</SelectItem>
          {MEMBER_STATUSES.map(status => (
            <SelectItem key={status} value={status}>
              {t(`status.${status}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
