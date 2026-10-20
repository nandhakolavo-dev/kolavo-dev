import type messages from '../messages/id.json'

import type { routing } from './i18n/routing'

// Typed translation keys: a typo in `t('...')` fails typecheck instead of rendering the key.
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
  }
}
