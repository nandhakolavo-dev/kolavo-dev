import { defineRouting } from 'next-intl/routing'

/**
 * Indonesian is the only locale today. `as-needed` keeps it unprefixed (`/members`),
 * so adding a locale later (`/en/members`) never changes existing links.
 */
export const routing = defineRouting({
  locales: ['id'],
  defaultLocale: 'id',
  localePrefix: 'as-needed'
})

export type Locale = (typeof routing.locales)[number]
