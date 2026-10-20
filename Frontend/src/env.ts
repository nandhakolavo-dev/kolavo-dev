import 'server-only'

import { z } from 'zod'

/**
 * Server-only variables. Never prefix these with NEXT_PUBLIC_: the API base URL and
 * mock switch stay on the server, the browser only talks to `/api/backend`.
 */
const schema = z.object({
  /** The backend API. Points at the built-in mock (`<APP_URL>/api/mock`) until the real one exists. */
  API_BASE_URL: z.url(),
  /** Public URL of this app, used for OAuth redirect URIs. */
  APP_URL: z.url(),
  /** `true` serves `/api/mock` and the role picker on the sign-in page. Never `true` in production. */
  API_MOCKING: z
    .enum(['true', 'false'])
    .default('false')
    .transform(value => value === 'true'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development')
})

// The Docker build stage sets SKIP_ENV_VALIDATION=1: runtime secrets are absent there by design.
const skip = process.env.SKIP_ENV_VALIDATION === '1'

const parsed = skip
  ? {
      success: true as const,
      data: schema.parse({ API_BASE_URL: 'http://build.invalid', APP_URL: 'http://build.invalid' })
    }
  : schema.safeParse({
      API_BASE_URL: process.env.API_BASE_URL,
      APP_URL: process.env.APP_URL,
      API_MOCKING: process.env.API_MOCKING,
      NODE_ENV: process.env.NODE_ENV
    })

if (!parsed.success) {
  throw new Error(`Invalid environment variables:\n${z.prettifyError(parsed.error)}`)
}

export const env = parsed.data
