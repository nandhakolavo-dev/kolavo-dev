import { Skeleton } from '@/components/ui/skeleton'

/** Matches the real layout: breadcrumb, header, stats, spread and board. */
export function CommunityProfileSkeleton({ label }: { label: string }) {
  return (
    <div aria-busy='true' aria-label={label}>
      <Skeleton className='h-4 w-40' />
      <div className='mt-6 flex flex-wrap items-center gap-5'>
        <Skeleton className='size-24 rounded-[20px]' />
        <div className='flex min-w-[min(100%,260px)] flex-1 flex-col gap-2.5'>
          <Skeleton className='h-8 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
          <Skeleton className='h-4 w-2/3' />
        </div>
        <Skeleton className='h-[52px] w-full rounded-full sm:w-[212px]' />
      </div>
      <Skeleton className='mt-[18px] h-[150px] rounded-[13px] md:h-[76px]' />
      <div className='mt-10 grid gap-3 md:grid-cols-2 md:gap-[22px]'>
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className='h-[200px] rounded-[13px]' />
        ))}
      </div>
    </div>
  )
}
