import { expect, test } from '@playwright/test'

// Runs against `next start` with API_MOCKING=true: the app's own /api/mock is the backend.

test('landing page is public and server-rendered', async ({ request }) => {
  const response = await request.get('/')
  expect(response.status()).toBe(200)
  expect(await response.text()).toContain('Kenali anggotamu. Kenalkan komunitasmu.')
})

test('app pages redirect to sign-in without a session', async ({ page }) => {
  await page.goto('/members')
  await expect(page).toHaveURL(/\/masuk$/)
})

test('an admin signs in and creates a member', async ({ page }) => {
  await page.goto('/masuk')
  await page.getByRole('link', { name: 'Masuk sebagai Pengurus' }).click()
  await expect(page).toHaveURL(/\/members$/)
  await expect(page).toHaveTitle('Anggota | Kolavo')
  await expect(page.getByRole('cell', { name: 'Anggota 1', exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Tambah anggota' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Nama').fill('Ana Putri')
  await dialog.getByLabel('Email').fill(`ana-${Date.now()}@contoh.id`)
  await dialog.getByRole('button', { name: 'Simpan anggota' }).click()

  await expect(page.getByText('Anggota ditambahkan.')).toBeVisible()
  await expect(page.getByRole('cell', { name: 'Ana Putri', exact: true }).first()).toBeVisible()
})

test('filters are kept in the URL', async ({ page }) => {
  await page.goto('/masuk')
  await page.getByRole('link', { name: 'Masuk sebagai Pengurus' }).click()
  await page.goto('/members?status=pending')
  await expect(page.getByRole('cell', { name: 'Anggota 1', exact: true })).toBeVisible()
  await expect(page.getByRole('cell', { name: 'Anggota 2', exact: true })).toHaveCount(0)
})

test('a member can read but not create or delete', async ({ page }) => {
  await page.goto('/masuk')
  await page.getByRole('link', { name: 'Masuk sebagai Anggota' }).click()
  await expect(page.getByRole('cell', { name: 'Anggota 1', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Tambah anggota' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /^Hapus / })).toHaveCount(0)
})
