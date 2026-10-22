import { Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { CommunityProfile } from '@/services/communities'

import { foldRows, spreadRows, type SpreadRow } from '../_utils/profile-stats'

/** Who is inside, as counts only (prototype `#aggWadah`). Folding is native <details>: no JavaScript. */
export function MemberSpread({ community }: { community: CommunityProfile }) {
  const t = useTranslations('CommunityProfile.spread')
  const dimensions = community.spread.filter(
    dimension => dimension.buckets.length > 0 || dimension.otherCount > 0
  )

  return (
    <section aria-labelledby='spread-title' className='mt-10'>
      <h2 id='spread-title' className='text-[17px] font-semibold tracking-tight'>
        {t('title')}
      </h2>
      <p className='mt-1 text-[13.5px] text-muted-foreground'>{t('lede')}</p>
      {dimensions.length === 0 ? (
        <p className='mt-3 rounded-[13px] border p-[18px] text-sm text-muted-foreground'>{t('empty')}</p>
      ) : (
        <div className='mt-3 grid gap-3 md:grid-cols-2 md:gap-[22px]'>
          {dimensions.map(dimension => {
            const { shown, folded } = foldRows(spreadRows(dimension, community.memberCount, t('other')))
            return (
              <div key={dimension.dimension} className='rounded-[13px] border bg-card p-[18px]'>
                <h3 className='mb-3 text-[11px] font-semibold tracking-[.09em] text-muted-foreground uppercase'>
                  {t(dimension.dimension)}
                </h3>
                <ul className='flex flex-col gap-2.5'>
                  {shown.map(row => (
                    <SpreadBar key={row.label} row={row} />
                  ))}
                </ul>
                {folded.length > 0 && (
                  <details className='mt-2.5 [&[open]>summary]:hidden'>
                    <summary className='cursor-pointer text-[12.5px] font-semibold text-primary hover:underline'>
                      {t('showMore', { count: folded.length })}
                    </summary>
                    <ul className='flex flex-col gap-2.5'>
                      {folded.map(row => (
                        <SpreadBar key={row.label} row={row} />
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            )
          })}
        </div>
      )}
      <p className='mt-3 flex items-center gap-1.5 text-xs text-muted-foreground'>
        <Lock className='size-3.5' aria-hidden />
        {t('privacy')}
      </p>
    </section>
  )
}

function SpreadBar({ row }: { row: SpreadRow }) {
  return (
    <li className='flex items-center gap-3 text-[13.5px]'>
      <span className={`max-w-[46%] shrink-0 truncate ${row.isOther ? 'text-muted-foreground' : ''}`}>
        {row.label}
      </span>
      <span className='h-[7px] flex-1 overflow-hidden rounded-full bg-muted' aria-hidden>
        <span
          className={`block h-full rounded-full ${row.isOther ? 'bg-border' : 'bg-primary'}`}
          style={{ width: `${row.percent}%` }}
        />
      </span>
      <span className='w-7 shrink-0 text-right text-[12.5px] text-muted-foreground tabular-nums'>
        {row.count}
      </span>
    </li>
  )
}
