import { expect, test } from '@playwright/test'

// The landing page is public: no sign-in, server-rendered for crawlers and link previews.

test('server HTML carries the hero, metadata and the streamed showcase', async ({ request }) => {
  const response = await request.get('/')
  expect(response.status()).toBe(200)
  const html = await response.text()
  expect(html).toContain('Kenali anggotamu.')
  expect(html).toContain('komunitasmu')
  expect(html).toContain('<title>Kolavo — Basecamp digital komunitasmu</title>')
  expect(html).toContain('property="og:title"')
  // Streamed from the API (mock) in the same response, so crawlers see the communities.
  expect(html).toContain('Ikatan Alumni SMAN 52')
  expect(html).toContain('href="/k/sman52"')
})

test('the showcase streams in and links to community profiles', async ({ page }) => {
  await page.goto('/')
  const showcase = page.locator('#etalase')
  await expect(showcase.getByRole('link', { name: 'Lihat profil' })).toHaveCount(4)
  await expect(showcase.getByRole('heading', { name: /Ikatan Alumni SMAN 52/ })).toBeVisible()
  await expect(showcase.getByRole('link', { name: 'Lihat profil' }).nth(2)).toHaveAttribute(
    'href',
    '/k/sman52'
  )
})

test('nav anchors jump to their sections', async ({ page }) => {
  await page.goto('/')
  await page
    .getByRole('navigation', { name: 'Navigasi beranda' })
    .getByRole('link', { name: 'Paket Harga' })
    .click()
  await expect(page).toHaveURL(/#harga$/)
  await expect(
    page.getByRole('heading', { name: 'Mulai gratis, naik paket saat komunitasmu tumbuh.' })
  ).toBeInViewport()
})

test('the calculator prices Advance like the prototype', async ({ page }) => {
  await page.goto('/#harga')
  await page.getByRole('button', { name: 'Simulasi biaya' }).click()
  const dialog = page.getByRole('dialog')
  // 200 members, 1 reviewer, monthly = Rp 54.358 (prototype KolavoHarga(200, 1, 1)).
  await expect(dialog.getByRole('heading')).toContainText('Rp 54.358')
  await dialog.getByRole('radio', { name: /2 tahun/ }).click()
  await dialog.getByRole('button', { name: '1.000', exact: true }).click()
  await dialog.getByRole('button', { name: 'Kurangi peninjau' }).isDisabled()
  await dialog.getByRole('button', { name: 'Tambah peninjau' }).click()
  // 1,000 members, 2 reviewers, 24 months = Rp 4.414.824 (prototype KolavoHarga(1000, 2, 24)).
  await expect(dialog).toContainText('Rp 4.414.824')
})

test('primary CTA leads to sign-in', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Buat Halaman Komunitas' }).first().click()
  await expect(page).toHaveURL(/\/masuk$/)
})
