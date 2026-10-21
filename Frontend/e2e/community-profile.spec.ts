import { expect, test } from '@playwright/test'

// The community profile is public: no sign-in, server-rendered for crawlers and link previews.

test('server HTML carries the profile and its link-preview metadata', async ({ request }) => {
  const response = await request.get('/k/sman52')
  expect(response.status()).toBe(200)
  const html = await response.text()
  expect(html).toContain('<title>Ikatan Alumni SMAN 52 | Kolavo</title>')
  expect(html).toMatch(/property="og:title" content="Ikatan Alumni SMAN 52"/)
  expect(html).toMatch(
    /property="og:image" content="http:\/\/localhost:\d+\/images\/communities\/iasman52\.jpg"/
  )
  // Streamed from the API (mock) in the same response.
  expect(html).toContain('Fajar Nugroho')
  expect(html).toContain('Karyawan swasta')
})

test('/k/sman52 shows the header, board and member spread, without member names', async ({ page }) => {
  await page.goto('/k/sman52')
  await expect(page.getByRole('heading', { level: 1, name: /Ikatan Alumni SMAN 52/ })).toBeVisible()
  await expect(page.getByRole('img', { name: 'Komunitas terverifikasi' })).toBeVisible()

  const stats = page.getByRole('definition')
  await expect(stats.first()).toHaveText('86')
  await expect(page.getByText('1999–2016')).toBeVisible()

  const board = page.getByRole('region', { name: 'Pengurus' })
  await expect(board.getByText('Fajar Nugroho')).toBeVisible()
  await expect(board.getByText('Bendahara')).toBeVisible()

  const spread = page.getByRole('region', { name: 'Siapa saja yang ada di dalam' })
  await expect(spread.getByRole('heading', { name: 'Pekerjaan & keahlian' })).toBeVisible()
  await spread.getByText('Tampilkan 3 lainnya').click()
  await expect(spread.getByText('Apoteker')).toBeVisible()
})

test('breadcrumb returns to the landing showcase and Gabung leads to sign-in', async ({ page }) => {
  await page.goto('/k/sman52')
  await expect(
    page.getByRole('navigation', { name: 'Remah navigasi' }).getByRole('link', { name: 'Beranda' })
  ).toHaveAttribute('href', '/#etalase')
  await page.getByRole('link', { name: 'Gabung' }).click()
  await expect(page).toHaveURL(/\/masuk$/)
})

test('an Esensial community shows only its creator', async ({ page }) => {
  await page.goto('/k/ppiju')
  const board = page.getByRole('region', { name: 'Pengurus' })
  await expect(board.getByRole('listitem')).toHaveCount(1)
  await expect(board.getByText('Community Creator')).toBeVisible()
})

test('an unknown slug renders not-found and is never indexed', async ({ page }) => {
  await page.goto('/k/tidak-ada')
  await expect(page.getByRole('heading', { name: 'Komunitas tidak ditemukan' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Lihat komunitas lain' })).toHaveAttribute('href', '/#etalase')
  // notFound() runs inside Suspense after the shell has streamed, so the HTTP status stays 200;
  // Next.js marks the page noindex instead (docs: not-found, "Status codes").
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute('content', /noindex/)
})
