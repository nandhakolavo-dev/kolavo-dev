import { Link2, Lock } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'

import { SectionHeading } from './SectionHeading'

type Step = { title: string; text: string }

/** How to start (`#pengurus`): four step cards, each with a small decorative UI mock. */
export function Steps() {
  const t = useTranslations('Landing.steps')
  const items = t.raw('items') as Step[]
  const pictures = [<FormArt key='1' />, <LinkArt key='2' />, <ApproveArt key='3' />, <ProfileArt key='4' />]

  return (
    <section id='pengurus' aria-labelledby='pengurus-title' className='bg-surface-alt py-[78px]'>
      <div className='mx-auto max-w-[1160px] px-[22px]'>
        <SectionHeading id='pengurus-title' kicker={t('kicker')} title={t('title')} lede={t('lede')} />
        <ol className='mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {items.map((item, index) => (
            <li key={item.title} className='rounded-[13px] border bg-card px-3.5 pt-3.5 pb-[22px]'>
              <div
                aria-hidden
                className='flex h-[150px] items-center justify-center rounded-[9px] bg-surface-alt p-3.5'
              >
                {pictures[index]}
              </div>
              <div className='px-2'>
                <span className='mt-4 flex size-[30px] items-center justify-center rounded-full bg-brand-wash text-[13.5px] font-semibold text-primary'>
                  {index + 1}
                </span>
                <h3 className='mt-3 text-base font-semibold'>{item.title}</h3>
                <p className='mt-1 text-sm text-muted-foreground'>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className='mt-10 flex flex-wrap justify-center gap-3'>
          <Button asChild size='xl'>
            <Link href='/masuk'>{t('ctaPrimary')}</Link>
          </Button>
          <Button
            asChild
            variant='outline'
            size='xl'
            className='border-primary font-medium text-primary hover:bg-brand-wash hover:text-primary'
          >
            <Link href='/k/sman52'>{t('ctaSecondary')}</Link>
          </Button>
        </div>
        <p className='mt-5 flex items-center justify-center gap-2 text-center text-[13px] text-muted-foreground'>
          <Lock className='size-4 shrink-0' aria-hidden />
          {t('privacy')}
        </p>
      </div>
    </section>
  )
}

function FormArt() {
  const t = useTranslations('Landing.steps')
  return (
    <div className='flex w-full flex-col gap-2 rounded-lg border bg-card p-3 text-[11px]'>
      <span className='text-muted-foreground'>{t('art.nameLabel')}</span>
      <span className='rounded-md border px-2 py-1.5 font-medium'>{t('art.nameValue')}</span>
      <span className='flex gap-1.5'>
        <i className='rounded-full bg-primary px-2 py-0.5 text-primary-foreground not-italic'>
          {t('art.typeOn')}
        </i>
        <i className='rounded-full border px-2 py-0.5 text-muted-foreground not-italic'>{t('art.typeOff')}</i>
      </span>
    </div>
  )
}

function LinkArt() {
  const t = useTranslations('Landing.steps')
  return (
    <div className='flex w-full flex-col items-center gap-2.5 text-[11px]'>
      <span className='flex w-full items-center gap-1.5 rounded-full border bg-card px-3 py-2 font-medium'>
        <Link2 className='size-3.5 text-primary' />
        {t('art.url')}
      </span>
      <span className='rounded-full bg-success-wash px-2.5 py-1 font-medium text-success'>
        {t('art.copied')}
      </span>
    </div>
  )
}

function ApproveArt() {
  const t = useTranslations('Landing.steps')
  return (
    <div className='flex w-full flex-col gap-2.5 rounded-lg border bg-card p-3 text-[11px]'>
      <span className='flex items-center gap-2'>
        <Image src='/images/people/rani.jpg' alt='' width={28} height={28} className='size-7 rounded-full' />
        <span className='flex flex-col leading-tight'>
          <b className='font-semibold'>{t('art.applicant')}</b>
          <i className='text-muted-foreground not-italic'>{t('art.applicantMeta')}</i>
        </span>
      </span>
      <span className='flex gap-1.5'>
        <i className='flex-1 rounded-full bg-primary py-1 text-center text-primary-foreground not-italic'>
          {t('art.approve')}
        </i>
        <i className='flex-1 rounded-full border py-1 text-center text-muted-foreground not-italic'>
          {t('art.reject')}
        </i>
      </span>
    </div>
  )
}

function ProfileArt() {
  const t = useTranslations('Landing.steps')
  return (
    <div className='flex w-full flex-col gap-2 rounded-lg border bg-card p-3 text-[11px]'>
      <span className='font-medium'>{t('art.stats')}</span>
      {[
        ['bg-primary', '78%'],
        ['bg-brand-accent', '55%'],
        ['bg-success', '36%']
      ].map(([color, width]) => (
        <span key={color} className='h-[7px] rounded-full bg-muted'>
          <i className={`block h-full rounded-full ${color}`} style={{ width }} />
        </span>
      ))}
    </div>
  )
}
