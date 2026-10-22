import { BadgeCheck, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import type { CommunityProfile } from '@/services/communities'

import { BoardList } from './BoardList'
import { MemberSpread } from './MemberSpread'
import { ProfileStats } from './ProfileStats'

export function CommunityProfileView({ community }: { community: CommunityProfile }) {
  const t = useTranslations('CommunityProfile')

  return (
    <>
      <nav aria-label={t('breadcrumb.label')}>
        <ol className='flex items-center gap-1.5 text-[13px] text-muted-foreground'>
          <li>
            <Link href='/#etalase' className='hover:text-foreground'>
              {t('breadcrumb.home')}
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className='size-3.5' />
          </li>
          <li aria-current='page' className='truncate font-medium text-foreground'>
            {community.alias ?? community.name}
          </li>
        </ol>
      </nav>

      <div className='mt-6 flex flex-wrap items-center gap-5'>
        <Image
          src={community.logoUrl}
          alt={t('logo', { name: community.name })}
          width={96}
          height={96}
          priority
          className='size-24 shrink-0 rounded-[20px] object-contain'
        />
        <div className='flex min-w-[min(100%,260px)] flex-1 flex-col gap-2'>
          {community.alias && (
            <p className='text-[15px] font-medium text-muted-foreground'>{community.alias}</p>
          )}
          <h1 className='text-[clamp(22px,2.9vw,30px)] leading-tight font-semibold tracking-tight'>
            {community.name}
            {community.verified && (
              <BadgeCheck
                className='ml-1.5 inline size-5 fill-primary align-[-2px] text-card'
                aria-label={t('verified')}
                role='img'
              />
            )}
          </h1>
          <p className='flex flex-wrap items-center gap-x-2 text-[13px] text-muted-foreground'>
            <span>{community.type}</span>
            <span aria-hidden className='opacity-50'>
              ·
            </span>
            <span>{community.location}</span>
            <span aria-hidden className='opacity-50'>
              ·
            </span>
            <span>{t('members', { count: community.memberCount })}</span>
          </p>
          <p className='max-w-[60ch] text-[15px] leading-relaxed text-muted-foreground'>
            {community.description}
          </p>
        </div>
        <div className='flex w-full flex-col gap-2.5 sm:w-auto sm:min-w-[212px]'>
          {/* Signed-out visitors sign in first; the invite variant of /masuk comes later. */}
          <Button asChild size='xl'>
            <Link href='/masuk'>{t('join')}</Link>
          </Button>
          <p className='text-center text-xs text-muted-foreground'>{t('joinNote')}</p>
        </div>
      </div>

      <ProfileStats community={community} />
      <MemberSpread community={community} />
      <BoardList board={community.board} />
    </>
  )
}
