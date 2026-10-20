import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'

import { KolavoLogo } from './KolavoLogo'

export function LandingFooter() {
  const t = useTranslations('Landing.footer')
  return (
    <footer className='border-t bg-surface-alt pt-10 pb-[52px]'>
      <div className='mx-auto flex max-w-[1160px] flex-wrap items-center gap-x-8 gap-y-4 px-[22px]'>
        <KolavoLogo className='h-7 w-auto' />
        <p className='text-sm text-muted-foreground'>{t('tagline')}</p>
        <nav className='flex flex-wrap gap-5 text-sm text-muted-foreground sm:ml-auto'>
          <a href='#etalase' className='hover:text-foreground'>
            {t('communities')}
          </a>
          <a href='#harga' className='hover:text-foreground'>
            {t('pricing')}
          </a>
          <Link href='/masuk' className='hover:text-foreground'>
            {t('create')}
          </Link>
        </nav>
      </div>
    </footer>
  )
}
