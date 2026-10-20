'use client'

import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import { usePermissions } from '@/services/auth'

import { NAV_ITEMS } from './nav-config'

export function MainNav() {
  const t = useTranslations('Shell')
  const { can } = usePermissions()

  return (
    <nav aria-label={t('mainNav')} className='flex items-center gap-4 text-sm'>
      <Link href='/' className='font-semibold'>
        Kolavo
      </Link>
      {NAV_ITEMS.filter(item => can(item.permission)).map(item => (
        <Link key={item.href} href={item.href} className='flex items-center gap-2 font-medium'>
          <item.icon className='size-4' aria-hidden />
          {t(item.labelKey)}
        </Link>
      ))}
    </nav>
  )
}
