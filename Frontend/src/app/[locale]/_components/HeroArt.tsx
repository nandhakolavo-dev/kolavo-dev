import { BadgeCheck, Check } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

const FACES = ['fajar', 'ayu', 'rani', 'bagas'] as const

type Row = { label: string; value: number; width: number }

/**
 * Decorative stacked visual (prototype `.hba`): community profile behind, member spread in
 * front, a floating member card and an "introduction accepted" chip. Hidden from assistive
 * tech; the copy beside it says the same thing. People are AI-generated personas.
 */
export function HeroArt() {
  const t = useTranslations('Landing.art')
  const stats = t.raw('stats') as { value: string; label: string }[]
  const careerRows = t.raw('careerRows') as Row[]
  const educationRows = t.raw('educationRows') as Row[]
  const tags = t.raw('personTags') as string[]

  return (
    <div aria-hidden className='relative mx-auto hidden aspect-[526/540] w-full max-w-[526px] md:block'>
      <span className='absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,var(--brand-wash),transparent)] blur-[18px]' />

      {/* Back: the community's public profile */}
      <div className='absolute top-[6%] left-[10%] w-[66%] -rotate-2 overflow-hidden rounded-2xl border bg-card shadow-xs'>
        <div className='h-[46px] bg-[linear-gradient(100deg,var(--primary),var(--brand-accent))]' />
        <div className='flex items-center gap-3 px-4 pt-3'>
          <Image
            src='/images/communities/iasman52.jpg'
            alt=''
            width={46}
            height={46}
            className='-mt-8 size-[46px] rounded-[13px] border-2 border-card'
          />
          <div className='min-w-0'>
            <p className='flex items-center gap-1 truncate text-sm font-semibold'>
              {t('communityName')}
              <BadgeCheck className='size-[15px] shrink-0 fill-primary text-card' />
            </p>
            <p className='text-xs text-muted-foreground'>{t('communityMeta')}</p>
          </div>
        </div>
        <div className='flex items-center gap-2 px-4 pt-3 pb-4'>
          <div className='flex -space-x-2'>
            {FACES.map(face => (
              <Image
                key={face}
                src={`/images/people/${face}.jpg`}
                alt=''
                width={28}
                height={28}
                className='size-7 rounded-full border-2 border-card'
              />
            ))}
          </div>
          <span className='text-[11px] text-muted-foreground'>{t('faces')}</span>
        </div>
      </div>

      {/* Front: who is inside */}
      <div className='absolute top-[27%] left-[24%] w-[72%] rounded-[13px] border bg-card shadow-[0_4px_10px_0_rgb(34_34_34/0.05),0_30px_64px_-30px_color-mix(in_oklch,var(--primary)_50%,transparent)]'>
        <div className='flex items-center justify-between border-b px-4 py-3'>
          <span className='text-sm font-semibold'>{t('panelTitle')}</span>
          <span className='text-[11px] text-muted-foreground'>{t('panelBadge')}</span>
        </div>
        <div className='grid grid-cols-3 border-b'>
          {stats.map(stat => (
            <div key={stat.label} className='px-4 py-3 not-first:border-l'>
              <b className='block text-2xl font-semibold text-primary'>{stat.value}</b>
              <span className='text-[11px] text-muted-foreground'>{stat.label}</span>
            </div>
          ))}
        </div>
        <SpreadBlock label={t('career')} rows={careerRows} barClass='bg-primary' />
        <SpreadBlock label={t('education')} rows={educationRows} barClass='bg-brand-accent' />
      </div>

      {/* Floating: one member's profile */}
      <div className='absolute bottom-[1%] left-0 flex w-[54%] items-center gap-3 rounded-[13px] border bg-card p-3 shadow-md'>
        <Image src='/images/people/rani.jpg' alt='' width={44} height={44} className='size-11 rounded-full' />
        <div className='min-w-0'>
          <p className='text-sm font-semibold'>{t('personName')}</p>
          <div className='mt-1 flex flex-wrap gap-1'>
            {tags.map((tag, index) => (
              <span
                key={tag}
                className={
                  index === 0
                    ? 'rounded-full bg-accent-wash px-2 py-0.5 text-[11px] text-accent-ink'
                    : 'rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground'
                }
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Floating: introduction accepted */}
      <div className='absolute top-0 right-0 flex items-center gap-2 rounded-full border bg-card py-1.5 pr-4 pl-1.5 shadow-[0_2px_6px_0_rgb(34_34_34/0.05),0_14px_30px_-18px_color-mix(in_oklch,var(--primary)_35%,transparent)]'>
        <span className='flex size-6 items-center justify-center rounded-full bg-success-wash text-success'>
          <Check className='size-3.5' strokeWidth={3} />
        </span>
        <span className='flex flex-col leading-tight'>
          <b className='text-xs font-semibold'>{t('chipTitle')}</b>
          <i className='text-[10.5px] text-muted-foreground not-italic'>{t('chipText')}</i>
        </span>
      </div>
    </div>
  )
}

function SpreadBlock({ label, rows, barClass }: { label: string; rows: Row[]; barClass: string }) {
  return (
    <div className='px-4 py-3 not-last:border-b'>
      <p className='mb-2 text-[10.5px] font-semibold tracking-wider text-muted-foreground uppercase'>
        {label}
      </p>
      <div className='flex flex-col gap-1.5'>
        {rows.map(row => (
          <div key={row.label} className='grid grid-cols-[1fr_1.4fr_auto] items-center gap-3 text-xs'>
            <span className='truncate'>{row.label}</span>
            <span className='h-[7px] rounded-full bg-muted'>
              <i
                className={`block h-full rounded-full ${barClass}`}
                style={{ width: `${Math.min(100, row.width * 1.6)}%` }}
              />
            </span>
            <span className='w-5 text-right text-muted-foreground'>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
