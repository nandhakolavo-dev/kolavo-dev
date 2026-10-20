import { BadgeCheck, MapPin } from 'lucide-react'
import { io } from 'next/cache'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@/i18n/navigation'
import { publicServerHttp } from '@/lib/http.server'
import { fetchFeaturedCommunities, type FeaturedCommunity } from '@/services/communities'

const STACK_COLORS = [
  'bg-brand-wash text-primary',
  'bg-accent-wash text-accent-ink',
  'bg-success-wash text-success'
] as const

/**
 * Curated communities (`#etalase`). Display-only server data: rendered directly in this Server
 * Component through the service, no client cache needed (playbook §5). Streams inside Suspense.
 */
export async function Showcase() {
  // Request-time data: keep it out of the static shell instead of fetching during prerender.
  await io()
  const t = await getTranslations('Landing.showcase')

  let communities: FeaturedCommunity[]
  try {
    communities = (await fetchFeaturedCommunities(publicServerHttp)).items
  } catch (error) {
    console.error(error)
    return <p className='mt-11 text-center text-sm text-muted-foreground'>{t('failed')}</p>
  }

  if (communities.length === 0) {
    return <p className='mt-11 text-center text-sm text-muted-foreground'>{t('empty')}</p>
  }

  return (
    <ul className='mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
      {communities.map(community => (
        <li key={community.slug}>
          <CommunityCard community={community} t={t} />
        </li>
      ))}
    </ul>
  )
}

function CommunityCard({
  community,
  t
}: {
  community: FeaturedCommunity
  t: Awaited<ReturnType<typeof getTranslations<'Landing.showcase'>>>
}) {
  const more = Math.max(0, community.memberCount - community.memberInitials.length)

  return (
    <article className='flex h-full flex-col rounded-[13px] border bg-card p-[18px] shadow-xs'>
      <p className='flex items-center gap-1 text-xs text-muted-foreground'>
        <MapPin className='size-3.5' aria-hidden />
        {community.location}
      </p>
      <Image
        src={community.logoUrl}
        alt={t('logo', { name: community.name })}
        width={46}
        height={46}
        className='mt-3 size-[46px] rounded-[13px]'
      />
      {community.alias && <p className='mt-3 text-xs font-medium text-primary'>{community.alias}</p>}
      <h3 className={`text-[15px] leading-snug font-semibold ${community.alias ? 'mt-0.5' : 'mt-3'}`}>
        {community.name}
        {community.verified && (
          <BadgeCheck
            className='ml-1 inline size-[15px] fill-primary align-[-2px] text-card'
            aria-label={t('verified')}
            role='img'
          />
        )}
      </h3>
      <p className='mt-1.5 mb-4 line-clamp-2 text-[13px] text-muted-foreground'>{community.description}</p>
      <div className='mt-auto flex items-end justify-between gap-3'>
        <div>
          <p className='text-xs text-muted-foreground'>{t('members', { count: community.memberCount })}</p>
          <div className='mt-1.5 flex -space-x-1.5' aria-hidden>
            {community.memberInitials.map((initials, index) => (
              <span
                key={initials}
                className={`flex size-7 items-center justify-center rounded-full border-2 border-card text-[10px] font-semibold ${STACK_COLORS[index % STACK_COLORS.length]}`}
              >
                {initials}
              </span>
            ))}
            {more > 0 && (
              <span className='flex size-7 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-semibold text-muted-foreground'>
                {t('more', { count: more })}
              </span>
            )}
          </div>
        </div>
        <Button asChild size='sm' className='h-8 px-3.5'>
          <Link href={`/k/${community.slug}`}>{t('view')}</Link>
        </Button>
      </div>
    </article>
  )
}

export function ShowcaseSkeleton({ label }: { label: string }) {
  return (
    <div className='mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4' aria-busy='true' aria-label={label}>
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} className='h-[248px] rounded-[13px]' />
      ))}
    </div>
  )
}
