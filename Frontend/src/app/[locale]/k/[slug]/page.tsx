import type { Metadata } from 'next'
import { io } from 'next/cache'
import { notFound } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { cache, Suspense } from 'react'

import { env } from '@/env'
import { HttpError } from '@/lib/http'
import { publicServerHttp } from '@/lib/http.server'
import { fetchCommunityProfile } from '@/services/communities'

import { CommunityProfileSkeleton } from './_components/CommunityProfileSkeleton'
import { CommunityProfileView } from './_components/CommunityProfileView'
import { ProfileHeader } from './_components/ProfileHeader'

/** One request per render: metadata and the page share it. `null` means the slug does not exist. */
const getCommunity = cache(async (slug: string) => {
  try {
    return await fetchCommunityProfile(publicServerHttp, slug)
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) return null
    throw error
  }
})

export async function generateMetadata({ params }: PageProps<'/[locale]/k/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const t = await getTranslations('CommunityProfile')

  let community
  try {
    community = await getCommunity(slug)
  } catch {
    // The page's error boundary reports the failure; metadata falls back to the site defaults.
    return {}
  }
  if (!community) return { title: t('notFound.title'), robots: { index: false } }

  const title = t('metaTitle', { name: community.name })
  const description = t('metaDescription', {
    description: community.description,
    type: community.type,
    location: community.location,
    count: community.memberCount
  })
  return {
    // Link previews (WhatsApp, Facebook) need absolute image URLs.
    metadataBase: new URL(env.APP_URL),
    title,
    description,
    alternates: { canonical: `/k/${community.slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'id_ID',
      url: `/k/${community.slug}`,
      images: [{ url: community.logoUrl, alt: t('logo', { name: community.name }) }]
    }
  }
}

/**
 * Public community profile (prototype scrKomunitas, signed-out view). No app nav; shows who runs
 * the community and its members in aggregate, never member names or contacts. Server-rendered
 * so crawlers and link previews get the content; the data streams in inside Suspense.
 */
export default function CommunityProfilePage({ params }: PageProps<'/[locale]/k/[slug]'>) {
  const t = useTranslations('CommunityProfile')

  return (
    <>
      <ProfileHeader />
      <main className='mx-auto max-w-[1160px] px-[22px] pt-6 pb-20'>
        <Suspense fallback={<CommunityProfileSkeleton label={t('loading')} />}>
          <CommunityProfileContent params={params} />
        </Suspense>
      </main>
    </>
  )
}

async function CommunityProfileContent({ params }: Pick<PageProps<'/[locale]/k/[slug]'>, 'params'>) {
  // Request-time data: fetched per request, never during prerender.
  await io()
  const { slug } = await params
  const community = await getCommunity(slug)
  if (!community) notFound()

  return <CommunityProfileView community={community} />
}
