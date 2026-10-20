import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'

import { Hero } from './_components/Hero'
import { LandingFooter } from './_components/LandingFooter'
import { LandingHeader } from './_components/LandingHeader'
import { Pillars } from './_components/Pillars'
import { Pricing } from './_components/Pricing'
import { SectionHeading } from './_components/SectionHeading'
import { Showcase, ShowcaseSkeleton } from './_components/Showcase'
import { Steps } from './_components/Steps'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Landing')
  return {
    title: { absolute: t('metaTitle') },
    description: t('metaDescription'),
    openGraph: { title: t('metaTitle'), description: t('metaDescription'), type: 'website', locale: 'id_ID' }
  }
}

/**
 * Public landing page (prototype scrBeranda, V4) for prospective community leaders.
 * Everything is static HTML except the showcase, which streams in from the API.
 */
export default function LandingPage() {
  const t = useTranslations('Landing.showcase')

  return (
    <>
      <LandingHeader />
      <main>
        <Hero />
        <Pillars />
        <section id='etalase' aria-labelledby='etalase-title' className='py-[78px]'>
          <div className='mx-auto max-w-[1160px] px-[22px]'>
            <SectionHeading id='etalase-title' kicker={t('kicker')} title={t('title')} lede={t('lede')} />
            <Suspense fallback={<ShowcaseSkeleton label={t('loading')} />}>
              <Showcase />
            </Suspense>
          </div>
        </section>
        <Steps />
        <Pricing />
      </main>
      <LandingFooter />
    </>
  )
}
