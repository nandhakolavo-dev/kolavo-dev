import { useTranslations } from 'next-intl'

import type { CommunityProfile } from '@/services/communities'

import { profileStats, type StatCount } from '../_utils/profile-stats'

export function ProfileStats({ community }: { community: CommunityProfile }) {
  const t = useTranslations('CommunityProfile.stats')
  const stats = profileStats(community)
  const count = (value: StatCount | null) =>
    !value ? t('unknown') : value.isAtLeast ? t('atLeast', { count: value.count }) : String(value.count)

  const items = [
    { key: 'members', value: String(stats.members), label: t('members') },
    { key: 'cities', value: count(stats.cities), label: t('cities') },
    { key: 'occupations', value: count(stats.occupations), label: t('occupations') },
    { key: 'cohort', value: stats.cohort ?? t('unknown'), label: t('cohort') }
  ]

  return (
    <dl
      aria-label={t('label')}
      className='mt-[18px] grid grid-cols-2 gap-px overflow-hidden rounded-[13px] border bg-border md:grid-cols-4'
    >
      {items.map(item => (
        <div key={item.key} className='flex flex-col-reverse gap-0.5 bg-brand-wash px-[18px] py-[17px]'>
          <dt className='text-xs text-muted-foreground'>{item.label}</dt>
          <dd className='text-[21px] font-semibold tracking-tight text-primary tabular-nums'>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
