import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'

/** Unknown slug: points back to the landing showcase instead of a dead end. */
export default function CommunityNotFound() {
  const t = useTranslations('CommunityProfile.notFound')
  return (
    <main className='mx-auto flex max-w-[1160px] flex-col items-start gap-4 px-[22px] py-16'>
      <h1 className='text-2xl font-semibold'>{t('title')}</h1>
      <p className='text-muted-foreground'>{t('description')}</p>
      <Button asChild>
        <Link href='/#etalase'>{t('back')}</Link>
      </Button>
    </main>
  )
}
