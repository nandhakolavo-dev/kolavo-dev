'use client'

import { Calculator, Calendar, Eye, Info, Minus, Plus, Users } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Link } from '@/i18n/navigation'

import { ADVANCE, advancePrice } from '../_utils/advance-price'

const PRESETS = [50, 100, 250, 500, 1000] as const

type Duration = { months: number; label: string; note: string }

/** "Simulasi biaya" dialog on the Advance card. All numbers come from `advancePrice`. */
export function PriceCalculator({ label }: { label: string }) {
  const t = useTranslations('Landing.calculator')
  const format = useFormatter()
  const durations = t.raw('durations') as Duration[]
  const [members, setMembers] = useState(200)
  const [reviewers, setReviewers] = useState(1)
  const [months, setMonths] = useState(1)

  const price = advancePrice(members, reviewers, months)
  const rupiah = (value: number) => `Rp ${format.number(Math.round(value))}`
  const rate = `Rp ${format.number(price.rate, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const count = (value: number) => format.number(value)
  const duration = (value: number) =>
    value >= 24 && value % 12 === 0 ? t('years', { count: value / 12 }) : t('monthsShort', { count: value })
  const percent = Math.round(price.discount * 100)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='secondary'
          size='icon'
          className='size-[52px] shrink-0'
          aria-label={label}
          title={label}
        >
          <Calculator className='size-5' aria-hidden />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[92svh] overflow-y-auto rounded-[32px] p-7 sm:max-w-[760px]'>
        <div>
          <p className='flex items-center gap-2 text-sm text-muted-foreground'>
            <span className='text-xs font-semibold tracking-wider text-success uppercase'>Advance</span>
            {t('eyebrow')}
          </p>
          <DialogTitle className='mt-2 text-4xl font-bold tracking-tight'>
            {rupiah(price.total / price.months)}
            <span className='ml-1 text-base font-normal text-muted-foreground'>{t('perMonth')}</span>
          </DialogTitle>
          <DialogDescription className='mt-1'>
            {price.discount
              ? t('heroDiscount', { percent, duration: duration(price.months), total: rupiah(price.total) })
              : t('heroMonthly', { members: count(price.members), reviewers: price.reviewers })}
          </DialogDescription>
        </div>

        <div className='mt-6 grid gap-6 md:grid-cols-[1.2fr_1fr]'>
          <div className='flex flex-col gap-6'>
            <div>
              <div className='flex items-center justify-between text-sm font-medium'>
                <span id='calc-members' className='flex items-center gap-2'>
                  <Users className='size-4 text-muted-foreground' aria-hidden />
                  {t('members')}
                </span>
                <b>{count(price.members)}</b>
              </div>
              <Slider
                className='mt-4'
                min={ADVANCE.minMembers}
                max={ADVANCE.maxMembers}
                step={10}
                value={[members]}
                onValueChange={([value]) => value !== undefined && setMembers(value)}
                aria-labelledby='calc-members'
              />
              <div className='mt-2 flex justify-between text-xs text-muted-foreground'>
                <span>{count(ADVANCE.minMembers)}</span>
                <span>{count(ADVANCE.maxMembers)}</span>
              </div>
              <div role='group' aria-label={t('membersQuick')} className='mt-3 flex flex-wrap gap-2'>
                {PRESETS.map(preset => (
                  <Button
                    key={preset}
                    type='button'
                    size='sm'
                    variant={price.members === preset ? 'default' : 'outline'}
                    aria-pressed={price.members === preset}
                    onClick={() => setMembers(preset)}
                  >
                    {count(preset)}
                  </Button>
                ))}
              </div>
            </div>

            <div className='grid gap-6 sm:grid-cols-[auto_1fr]'>
              <div>
                <span className='flex items-center gap-2 text-sm font-medium'>
                  <Eye className='size-4 text-muted-foreground' aria-hidden />
                  <span id='calc-reviewers'>{t('reviewers')}</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant='ghost' size='icon-xs' aria-label={t('reviewersInfo')}>
                        <Info aria-hidden />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='text-sm'>{t('reviewersTip')}</PopoverContent>
                  </Popover>
                </span>
                <div role='group' aria-labelledby='calc-reviewers' className='mt-3 flex items-center gap-3'>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    aria-label={t('reviewersLess')}
                    disabled={price.reviewers <= 1}
                    onClick={() => setReviewers(value => Math.max(1, value - 1))}
                  >
                    <Minus aria-hidden />
                  </Button>
                  <b className='w-6 text-center' aria-live='polite'>
                    {price.reviewers}
                  </b>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    aria-label={t('reviewersMore')}
                    disabled={price.reviewers >= ADVANCE.maxReviewers}
                    onClick={() => setReviewers(value => Math.min(ADVANCE.maxReviewers, value + 1))}
                  >
                    <Plus aria-hidden />
                  </Button>
                </div>
              </div>
              <div>
                <span id='calc-duration' className='flex items-center gap-2 text-sm font-medium'>
                  <Calendar className='size-4 text-muted-foreground' aria-hidden />
                  {t('duration')}
                </span>
                <ToggleGroup
                  type='single'
                  value={String(months)}
                  onValueChange={value => value && setMonths(Number(value))}
                  aria-labelledby='calc-duration'
                  className='mt-3 grid w-full grid-cols-2 gap-2'
                >
                  {durations.map(option => (
                    <ToggleGroupItem
                      key={option.months}
                      value={String(option.months)}
                      variant='outline'
                      className='flex h-auto flex-col items-start rounded-[13px] px-3 py-2 text-left data-[state=on]:border-primary data-[state=on]:bg-brand-wash'
                    >
                      <span className='text-sm font-medium'>{option.label}</span>
                      <small className='text-xs text-muted-foreground'>{option.note}</small>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </div>
            <p className='text-xs text-muted-foreground'>{t('discountNote')}</p>
          </div>

          <div className='rounded-[13px] bg-surface-alt p-5' aria-live='polite'>
            <p className='text-sm font-semibold'>{t('estimate')}</p>
            <dl className='mt-4 flex flex-col gap-3 text-sm'>
              <Line
                label={t('membersLine', { members: count(price.members), rate })}
                value={rupiah(price.membersCost)}
              />
              <Line
                label={t('reviewersLine', { count: price.reviewers })}
                value={rupiah(price.reviewersCost)}
              />
              <div className='border-t pt-3'>
                <Line label={t('monthly')} value={rupiah(price.perMonth)} strong />
              </div>
              {price.discount > 0 && (
                <Line
                  label={t('discountLine', { percent, duration: duration(price.months) })}
                  value={`− ${rupiah(price.discountAmount)}`}
                  className='text-success'
                />
              )}
            </dl>
            <p className='mt-4 flex items-baseline justify-between border-t pt-4'>
              <span className='text-sm'>{t('total', { duration: duration(price.months) })}</span>
              <b className='text-xl'>{rupiah(price.total)}</b>
            </p>
            {price.members >= ADVANCE.maxMembers && (
              <p className='mt-3 text-xs text-muted-foreground'>{t('big')}</p>
            )}
          </div>
        </div>

        <div className='mt-6 flex justify-end'>
          <Button asChild size='xl'>
            <Link href='/masuk'>{t('cta')}</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Line({
  label,
  value,
  strong = false,
  className
}: {
  label: string
  value: string
  strong?: boolean
  className?: string
}) {
  return (
    <div className={`flex justify-between gap-4 ${className ?? ''}`}>
      <dt className='text-muted-foreground'>{label}</dt>
      <dd className={strong ? 'font-semibold' : undefined}>{value}</dd>
    </div>
  )
}
