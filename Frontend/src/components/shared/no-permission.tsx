import { ShieldX } from 'lucide-react'
import { useTranslations } from 'next-intl'

/** Rendered by gated pages when the user lacks the permission (RBAC screen state). */
export function NoPermission() {
  const t = useTranslations('NoPermission')
  return (
    <div role='alert' className='flex flex-col items-start gap-2 rounded-lg border border-dashed p-10'>
      <ShieldX className='size-6 text-muted-foreground' aria-hidden />
      <p className='font-medium'>{t('title')}</p>
      <p className='text-sm text-muted-foreground'>{t('description')}</p>
    </div>
  )
}
