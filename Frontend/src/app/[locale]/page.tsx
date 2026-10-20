import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Landing')
  return { title: { absolute: `Kolavo — ${t('title')}` }, description: t('description') }
}

/**
 * Public landing page: fully static HTML for search engines and link previews.
 * Placeholder hero; the full landing design lives in Redesign/ (scrBeranda).
 */
export default function LandingPage() {
  const t = useTranslations()

  return (
    <div className='min-h-svh'>
      <header className='mx-auto flex h-16 max-w-6xl items-center justify-between px-4'>
        <span className='text-lg font-semibold'>Kolavo</span>
        <Button asChild variant='outline'>
          <Link href='/masuk'>{t('Landing.signIn')}</Link>
        </Button>
      </header>
      <main className='mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20'>
        <p className='text-sm font-medium tracking-wide text-primary uppercase'>{t('Common.brandLine')}</p>
        <h1 className='max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl'>{t('Landing.title')}</h1>
        <p className='max-w-xl text-lg text-muted-foreground'>{t('Landing.description')}</p>
        <Button asChild size='lg'>
          <Link href='/masuk'>{t('Landing.cta')}</Link>
        </Button>
      </main>
    </div>
  )
}
