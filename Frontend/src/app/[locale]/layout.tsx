import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import './../globals.css'

// Mono ships inside the `geist` package and Poppins inside @fontsource: builds never depend
// on reaching Google Fonts (matters for CI behind a proxy and on-premise builds).
import { GeistMono } from 'geist/font/mono'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { locale as rootLocale } from 'next/root-params'

import { Providers } from '@/components/providers'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata')
  return {
    title: { default: t('title'), template: `%s | ${t('title')}` },
    description: t('description')
  }
}

export default async function RootLayout({ children }: LayoutProps<'/[locale]'>) {
  const locale = await rootLocale()

  return (
    <html lang={locale} suppressHydrationWarning className={`${GeistMono.variable} font-sans antialiased`}>
      <body>
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
