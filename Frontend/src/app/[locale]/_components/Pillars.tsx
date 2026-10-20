import { Database, Megaphone, UserRound } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { CheckList } from './CheckList'
import { SectionHeading } from './SectionHeading'

type Pillar = { for: string; title: string; text: string; points: string[] }

const ICONS = [Megaphone, Database, UserRound] as const

/** Three pillars, one per role in the board (`#untuk`). */
export function Pillars() {
  const t = useTranslations('Landing.pillars')
  const items = t.raw('items') as Pillar[]

  return (
    <section id='untuk' aria-labelledby='untuk-title' className='bg-surface-alt py-[78px]'>
      <div className='mx-auto max-w-[1160px] px-[22px]'>
        <SectionHeading id='untuk-title' kicker={t('kicker')} title={t('title')} lede={t('lede')} />
        <div className='mt-11 grid gap-5 md:grid-cols-3'>
          {items.map((item, index) => {
            const Icon = ICONS[index] ?? UserRound
            return (
              <article key={item.title} className='rounded-[13px] border bg-card p-7'>
                <span className='flex size-10 items-center justify-center rounded-[13px] bg-brand-wash text-primary'>
                  <Icon className='size-5' aria-hidden />
                </span>
                <p className='mt-5 text-[11.5px] font-semibold tracking-wider text-accent-ink uppercase'>
                  {item.for}
                </p>
                <h3 className='mt-2 text-[17px] leading-[1.35] font-semibold'>{item.title}</h3>
                <p className='mt-2 mb-5 text-sm text-muted-foreground'>{item.text}</p>
                <CheckList items={item.points} />
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
