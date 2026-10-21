'use client'

import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'

// Next.js 16 error boundary props: `error` is unknown, recovery is `retry` (not `reset`).
export default function CommunityProfileError({ error, retry }: { error: unknown; retry: () => void }) {
  const t = useTranslations()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className='mx-auto max-w-[1160px] px-[22px] py-16'>
      <div
        role='alert'
        className='flex flex-col items-start gap-3 rounded-[13px] border border-destructive/40 p-6'
      >
        <p className='font-medium'>{t('CommunityProfile.error.title')}</p>
        <p className='text-sm text-muted-foreground'>{t('CommunityProfile.error.description')}</p>
        <Button variant='outline' onClick={() => retry()}>
          {t('Common.retry')}
        </Button>
      </div>
    </main>
  )
}
