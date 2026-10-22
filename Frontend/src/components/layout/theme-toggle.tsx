'use client'

import { Moon, Sun } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const t = useTranslations('Common')
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <Button
      variant='ghost'
      size='icon'
      aria-label={t('toggleTheme')}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className='dark:hidden' aria-hidden />
      <Moon className='hidden dark:block' aria-hidden />
    </Button>
  )
}
