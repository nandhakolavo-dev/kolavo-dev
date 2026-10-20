import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import type { ReactNode } from 'react'

import { Toaster } from '@/components/ui/sonner'

import messages from '../../messages/id.json'

/** Renders with the providers the app has: translations, a fresh query cache, toasts. */
export function renderWithProviders(ui: ReactNode) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <NextIntlClientProvider locale='id' messages={messages} timeZone='Asia/Jakarta'>
      <QueryClientProvider client={queryClient}>
        {ui}
        <Toaster />
      </QueryClientProvider>
    </NextIntlClientProvider>
  )
}
