import { defineConfig, devices } from '@playwright/test'

const PORT = 3100
const APP_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  // The mock backend keeps data in one server process; keep tests independent of order instead.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: APP_URL,
    trace: 'on-first-retry'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Runs the production build against the built-in mock backend. Run `pnpm build` first.
    command: `pnpm next start -p ${PORT}`,
    url: `${APP_URL}/masuk`,
    reuseExistingServer: !process.env.CI,
    env: { APP_URL, API_BASE_URL: `${APP_URL}/api/mock`, API_MOCKING: 'true' }
  }
})
