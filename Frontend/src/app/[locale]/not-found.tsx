import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'

export default function NotFound() {
  const t = useTranslations()
  return (
    <main className='mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-16'>
      <h1 className='text-2xl font-semibold'>{t('NotFound.title')}</h1>
      <p className='text-muted-foreground'>{t('NotFound.description')}</p>
      <Button asChild>
        <Link href='/'>{t('Common.backHome')}</Link>
      </Button>
    </main>
  )
}
