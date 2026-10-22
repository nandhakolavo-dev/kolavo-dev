import { useTranslations } from 'next-intl'

import { Skeleton } from '@/components/ui/skeleton'

export function MembersSkeleton() {
  const t = useTranslations('Members')
  return (
    <div className='flex flex-col gap-6' aria-busy='true' aria-label={t('loading')}>
      <Skeleton className='h-8 w-48' />
      <Skeleton className='h-9 w-full max-w-sm' />
      <div className='flex flex-col gap-2'>
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className='h-10 w-full' />
        ))}
      </div>
    </div>
  )
}
