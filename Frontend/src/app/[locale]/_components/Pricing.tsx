import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

import { CheckList } from './CheckList'
import { PriceCalculator } from './PriceCalculator'
import { SectionHeading } from './SectionHeading'

type Plan = { name: string; price: string; limit: string; text: string; points: string[]; cta: string }

/**
 * Plans (`#harga`). Rules: Redesign/PROMPT-HARGA.md. "FREE" (not "Gratis") is only for the
 * Esensial limits; the section title keeps "Mulai gratis" (decision 17 Oct 2026).
 * Introduction credits are deliberately not shown here.
 */
export function Pricing() {
  const t = useTranslations('Landing.pricing')
  const plan = (key: 'essential' | 'advance' | 'big'): Plan => ({
    name: t(`${key}.name`),
    price: t(`${key}.price`),
    limit: t(`${key}.limit`),
    text: t(`${key}.text`),
    points: t.raw(`${key}.points`) as string[],
    cta: t(`${key}.cta`)
  })
  const essential = plan('essential')
  const advance = plan('advance')
  const big = plan('big')

  return (
    <section id='harga' aria-labelledby='harga-title' className='py-[78px]'>
      <div className='mx-auto max-w-[1160px] px-[22px]'>
        <SectionHeading id='harga-title' kicker={t('kicker')} title={t('title')} lede={t('lede')} />
        <div className='mt-11 grid items-start gap-4 lg:grid-cols-[1fr_1.05fr_1fr]'>
          <PlanCard plan={essential}>
            <Button asChild variant='outline' size='xl' className={OUTLINE}>
              <Link href='/masuk'>{essential.cta}</Link>
            </Button>
          </PlanCard>
          <PlanCard plan={advance} per={t('advance.per')} featured>
            <div className='flex gap-2'>
              <Button asChild size='xl' className='flex-1'>
                <Link href='/masuk'>{advance.cta}</Link>
              </Button>
              <PriceCalculator label={t('advance.calculator')} />
            </div>
          </PlanCard>
          <PlanCard plan={big}>
            <Button asChild variant='outline' size='xl' className={OUTLINE}>
              {/* No address is configured yet: opens a new email with the subject filled in. */}
              <a href={`mailto:?subject=${encodeURIComponent(t('big.emailSubject'))}`}>{big.cta}</a>
            </Button>
          </PlanCard>
        </div>
      </div>
    </section>
  )
}

const OUTLINE = 'w-full border-primary font-medium text-primary hover:bg-brand-wash hover:text-primary'

function PlanCard({
  plan,
  per,
  featured = false,
  children
}: {
  plan: Plan
  per?: string
  featured?: boolean
  children: React.ReactNode
}) {
  return (
    <article
      className={cn(
        'flex h-full flex-col rounded-[13px] border p-[26px]',
        featured
          ? 'border-primary bg-brand-tint shadow-[0_2px_6px_0_rgb(34_34_34/0.05),0_14px_30px_-18px_color-mix(in_oklch,var(--primary)_35%,transparent)]'
          : 'bg-card'
      )}
    >
      <p className='text-xs font-semibold tracking-wider text-success uppercase'>{plan.name}</p>
      <p className='mt-2'>
        <b className='text-[26px] font-bold'>{plan.price}</b>
        {per && <span className='ml-1 text-sm text-muted-foreground'>{per}</span>}
      </p>
      <p className='mt-1 text-sm font-medium'>{plan.limit}</p>
      <p className='mt-3 mb-5 text-sm text-muted-foreground'>{plan.text}</p>
      <CheckList items={plan.points} />
      <div className='mt-auto pt-6'>{children}</div>
    </article>
  )
}
