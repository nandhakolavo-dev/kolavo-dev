'use client'

import { LogOut } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/services/auth'

export function UserMenu() {
  const t = useTranslations('Shell')
  const { user } = useCurrentUser()

  return (
    <div className='flex items-center gap-3'>
      {user && <span className='hidden text-sm text-muted-foreground sm:inline'>{user.name}</span>}
      {/* A form POST, so prefetching or a stray link can never sign the user out. */}
      <form action='/api/auth/sign-out' method='post'>
        <Button type='submit' variant='ghost' size='sm'>
          <LogOut aria-hidden />
          {t('signOut')}
        </Button>
      </form>
    </div>
  )
}
