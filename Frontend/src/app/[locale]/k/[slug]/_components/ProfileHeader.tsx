import { LogIn } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'

import { KolavoLogo } from '../../../_components/KolavoLogo'

/** Public view: logo and sign-in only, no Kolavo App nav (prototype decision 15 Oct 2026). */
export function ProfileHeader() {
  const t = useTranslations('CommunityProfile.nav')

  return (
    <header className='border-b bg-background'>
      <div className='mx-auto flex h-[77px] max-w-[1160px] items-center justify-between gap-4 px-[22px]'>
        <Link href='/' aria-label={t('home')} className='shrink-0'>
          <KolavoLogo className='h-[29px]' />
        </Link>
        <Button
          asChild
          variant='outline'
          className='h-10 border-primary px-5 text-primary hover:bg-brand-wash hover:text-primary'
        >
          <Link href='/masuk'>
            <LogIn aria-hidden />
            {t('signIn')}
          </Link>
        </Button>
      </div>
    </header>
  )
}
