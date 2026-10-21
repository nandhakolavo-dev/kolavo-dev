import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('CommunityProfile.notFound')
  return { title: t('title') }
}

/**
 * Static not-found for community URLs. `src/proxy.ts` rewrites an unknown `/k/<slug>` here:
 * the profile page streams (status already 200), while this page throws before rendering, so
 * the response is a real 404 with the same `../not-found.tsx` UI. Also catches `/k/<slug>/<x>`.
 */
export default function MissingCommunity() {
  notFound()
}
