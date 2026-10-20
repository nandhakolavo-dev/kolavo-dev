import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { env } from '@/env'

import { SignInError } from './_components/SignInError'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SignIn')
  return { title: t('metaTitle') }
}

/** Full-page sign-in (scrMasuk). Plain links to Route Handlers: works without JavaScript. */
export default function SignInPage() {
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
          {env.API_MOCKING ? (
            <div className='flex flex-col gap-3'>
              <p className='text-sm font-medium'>{t('mockTitle')}</p>
              <p className='text-sm text-muted-foreground'>{t('mockDescription')}</p>
              {(['admin', 'member'] as const).map(role => (
                <Button key={role} asChild variant={role === 'admin' ? 'default' : 'outline'}>
                  <a href={`/api/auth/google?role=${role}`}>{t('mockAs', { role: t(`roles.${role}`) })}</a>
                </Button>
              ))}
            </div>
          ) : (
            <Button asChild>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a Route Handler, needs a full navigation */}
              <a href='/api/auth/google'>{t('google')}</a>
            </Button>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
