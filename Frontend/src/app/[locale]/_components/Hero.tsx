import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'

import { HeroArt } from './HeroArt'
import { HeroRotatingWord } from './HeroRotatingWord'

export function Hero() {
  const t = useTranslations('Landing.hero')
  const words = t.raw('rotatingWords') as string[]
  const points = t.raw('points') as string[]

  return (
    <section className='bg-gradient-to-b from-brand-tint to-transparent to-72% pt-[66px] pb-[76px]'>
      <div className='mx-auto grid max-w-[1160px] items-center gap-16 px-[22px] lg:grid-cols-2'>
        <div>
          <p className='text-[13px] font-medium tracking-[0.12em] text-brand-accent uppercase'>
            {t('brandLine')}
          </p>
          <h1 className='mt-4 text-[38px] leading-[1.18] font-semibold tracking-[-0.028em] sm:text-[46px]'>
            {t('titleLine1')}
            <br />
            {t('titleLine2')}
            <br />
            <HeroRotatingWord words={words} />.
          </h1>
          <p className='mt-5 max-w-[491px] text-[17px] leading-[1.6] text-muted-foreground'>
            {t('description')}
          </p>
          <div className='mt-8 flex flex-col items-start gap-3'>
            <Button asChild size='hero'>
              <Link href='/masuk'>{t('ctaPrimary')}</Link>
            </Button>
            <Button
              asChild
              variant='outline'
              size='xl'
              className='border-primary font-medium text-primary hover:bg-brand-wash hover:text-primary'
            >
              <a href='#etalase'>{t('ctaSecondary')}</a>
            </Button>
          </div>
          <ul className='mt-8 flex flex-col gap-3'>
            {points.map(point => (
              <li key={point} className='flex items-center gap-2.5 text-sm text-muted-foreground'>
                <span className='flex size-[18px] shrink-0 items-center justify-center rounded-full bg-success-wash text-success'>
                  <Check className='size-3' strokeWidth={3} aria-hidden />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <HeroArt />
      </div>
    </section>
  )
}
