import { LogIn } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Suspense } from 'react'

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { signInHref } from '@/lib/return-to'

import { KolavoLogo } from '../../../_components/KolavoLogo'

type Params = PageProps<'/[locale]/k/[slug]'>['params']

/** Public view: logo and sign-in only, no Kolavo App nav (prototype decision 15 Oct 2026). Sign-in returns here. */
export function ProfileHeader({ params }: { params: Params }) {
  const t = useTranslations('CommunityProfile.nav')
  const label = (
    <>
      <LogIn aria-hidden />
      {t('signIn')}
    </>
  )

  return (
    <header className='border-b bg-background'>
      <div className='mx-auto flex h-[77px] max-w-[1160px] items-center justify-between gap-4 px-[22px]'>
        <Link href='/' aria-label={t('home')} className='shrink-0'>
          <KolavoLogo className='h-[29px]' />
        </Link>
        {/* The slug is request data: a disabled button until it resolves, so no click loses it. */}
        <Suspense fallback={<SignInButton>{label}</SignInButton>}>
          <ReturningSignInButton params={params}>{label}</ReturningSignInButton>
        </Suspense>
      </div>
    </header>
  )
}

async function ReturningSignInButton({ params, children }: { params: Params; children: React.ReactNode }) {
  const { slug } = await params
  return <SignInButton href={signInHref(`/k/${slug}`)}>{children}</SignInButton>
}

function SignInButton({ href, children }: { href?: string; children: React.ReactNode }) {
  return (
    <Button
      asChild={Boolean(href)}
      disabled={!href}
      variant='outline'
      className='h-10 border-primary px-5 text-primary hover:bg-brand-wash hover:text-primary'
    >
      {href ? <Link href={href}>{children}</Link> : children}
    </Button>
  )
}
