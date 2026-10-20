'use client'

import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'

// Next.js 16 error boundary props: `error` is unknown, recovery is `retry` (not `reset`).
export default function MembersError({ error, retry }: { error: unknown; retry: () => void }) {
  const t = useTranslations()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div role='alert' className='flex flex-col items-start gap-3 rounded-lg border border-destructive/40 p-6'>
      <p className='font-medium'>{t('Members.loadFailed')}</p>
      <p className='text-sm text-muted-foreground'>{t('Members.loadFailedHint')}</p>
      <Button variant='outline' onClick={() => retry()}>
        {t('Common.retry')}
      </Button>
    </div>
  )
}
