import { LogIn, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'

import { KolavoLogo } from './KolavoLogo'

/** Landing nav (prototype A6): sales anchors left-aligned after the logo, actions on the right. */
export function LandingHeader() {
  const t = useTranslations('Landing.nav')

  return (
    <header className='sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80'>
      <div className='mx-auto flex h-[77px] max-w-[1160px] items-center gap-[18px] px-[22px]'>
        <Link href='/' aria-label={t('home')} className='shrink-0'>
          <KolavoLogo className='h-[37px] w-auto' />
        </Link>
        <nav
          aria-label={t('label')}
          className='hidden items-center gap-6 pl-2 text-sm font-medium text-muted-foreground lg:flex'
        >
          <a href='#untuk' className='transition-colors hover:text-foreground'>
            {t('solutions')}
          </a>
          <a href='#pengurus' className='transition-colors hover:text-foreground'>
            {t('workflow')}
          </a>
          <a href='#harga' className='transition-colors hover:text-foreground'>
            {t('pricing')}
          </a>
        </nav>
        <div className='flex-1' />
        <Button
          asChild
          variant='outline'
          className='hidden h-10 border-primary px-5 text-primary hover:bg-brand-wash hover:text-primary sm:inline-flex'
        >
          <Link href='/masuk'>
            <Plus aria-hidden />
            {t('create')}
          </Link>
        </Button>
        <Button asChild className='h-10 px-5'>
          <Link href='/masuk'>
            <LogIn aria-hidden />
            {t('signIn')}
          </Link>
        </Button>
      </div>
    </header>
  )
}
