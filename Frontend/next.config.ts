import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

// Loads per-request i18n config from src/i18n/request.ts.
const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Docker image (copies only what production needs).
  output: 'standalone',
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css'
      }
    }
  }
}

export default withNextIntl(nextConfig)
