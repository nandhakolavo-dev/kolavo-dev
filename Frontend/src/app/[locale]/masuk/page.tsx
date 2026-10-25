import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { env } from '@/env'
import { RETURN_TO_PARAM, safeReturnTo } from '@/lib/return-to'

import { SignInError } from './_components/SignInError'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SignIn')
  return { title: t('metaTitle') }
}

/**
 * Full-page sign-in (scrMasuk). Plain links to Route Handlers: works without JavaScript.
 * `?next=` (the page the user came from) is forwarded so sign-in returns there.
 */
export default function SignInPage({ searchParams }: PageProps<'/[locale]/masuk'>) {
  const t = useTranslations('SignIn')

  return (
    <main className='flex min-h-svh items-center justify-center px-4'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-xl'>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <Suspense>
            <SignInError message={t('failed')} />
          </Suspense>
          <Suspense fallback={<SignInLinks pending />}>
            <ReturningSignInLinks searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  )
}

async function ReturningSignInLinks({ searchParams }: Pick<PageProps<'/[locale]/masuk'>, 'searchParams'>) {
  const next = (await searchParams)[RETURN_TO_PARAM]
  return <SignInLinks returnTo={safeReturnTo(typeof next === 'string' ? next : null)} />
}

/**
 * Links to /api/auth/google, carrying `next` when there is a page to return to. `pending`
 * renders disabled buttons while `next` streams in, so an early click cannot drop it.
 */
function SignInLinks({ returnTo = null, pending = false }: { returnTo?: string | null; pending?: boolean }) {
  const t = useTranslations('SignIn')
  const href = (query: Record<string, string>) => {
    const params = new URLSearchParams(returnTo ? { ...query, [RETURN_TO_PARAM]: returnTo } : query)
    const search = params.toString()
    return search ? `/api/auth/google?${search}` : '/api/auth/google'
  }

  return env.API_MOCKING ? (
    <div className='flex flex-col gap-3'>
      <p className='text-sm font-medium'>{t('mockTitle')}</p>
      <p className='text-sm text-muted-foreground'>{t('mockDescription')}</p>
      {(['admin', 'member'] as const).map(role => (
        <Button
          key={role}
          asChild={!pending}
          disabled={pending}
          variant={role === 'admin' ? 'default' : 'outline'}
        >
          {pending ? (
            <span>{t('mockAs', { role: t(`roles.${role}`) })}</span>
          ) : (
            <a href={href({ role })}>{t('mockAs', { role: t(`roles.${role}`) })}</a>
          )}
        </Button>
      ))}
    </div>
  ) : (
    <Button asChild={!pending} disabled={pending}>
      {pending ? <span>{t('google')}</span> : <a href={href({})}>{t('google')}</a>}
    </Button>
  )
}
