import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locale as rootLocale } from 'next/root-params'

import { routing } from './routing'

export default getRequestConfig(async ({ locale }) => {
  // Server Components pass no locale; read it from the `[locale]` root segment.
  const requested = locale ?? (await rootLocale())
  if (!hasLocale(routing.locales, requested)) notFound()

  return {
    locale: requested,
    messages: (await import(`../../messages/${requested}.json`)).default,
    timeZone: 'Asia/Jakarta'
  }
})
