import type { ReactNode } from 'react'

import { MainNav } from './main-nav'
import { ThemeToggle } from './theme-toggle'
import { UserMenu } from './user-menu'

/** Static shell: no session read here (Cache Components). Nav and user menu read `/me` on the client. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-svh'>
      <header className='border-b'>
        <div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-4'>
          <MainNav />
          <div className='flex items-center gap-1'>
            <UserMenu />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className='mx-auto max-w-6xl px-4 py-8'>{children}</main>
    </div>
  )
}
