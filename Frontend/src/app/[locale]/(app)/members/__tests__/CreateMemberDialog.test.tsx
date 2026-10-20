import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { mockDb } from '@/mocks/data'
import { renderWithProviders } from '@/test/render'

import { CreateMemberDialog } from '../_components/CreateMemberDialog'

vi.mock('next-themes', () => ({ useTheme: () => ({ theme: 'light' }) }))

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>, email: string) {
  await user.click(screen.getByRole('button', { name: 'Tambah anggota' }))
  const dialog = await screen.findByRole('dialog')
  await user.type(within(dialog).getByLabelText('Nama'), 'Ana Putri')
  await user.type(within(dialog).getByLabelText('Email'), email)
  await user.click(within(dialog).getByRole('button', { name: 'Simpan anggota' }))
}

describe('CreateMemberDialog', () => {
  it('validates before calling the API', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CreateMemberDialog />)
    await user.click(screen.getByRole('button', { name: 'Tambah anggota' }))
    await user.click(
      within(await screen.findByRole('dialog')).getByRole('button', { name: 'Simpan anggota' })
    )
    expect(await screen.findByText('Nama wajib diisi')).toBeInTheDocument()
    expect(mockDb.members.some(member => member.name === 'Ana Putri')).toBe(false)
  })

  it('creates the member and toasts success', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CreateMemberDialog />)
    await fillAndSubmit(user, 'ana@contoh.id')
    expect(await screen.findByText('Anggota ditambahkan.')).toBeInTheDocument()
    expect(mockDb.members[0]).toMatchObject({ name: 'Ana Putri', email: 'ana@contoh.id' })
  })

  it('toasts the backend error message', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CreateMemberDialog />)
    await fillAndSubmit(user, 'anggota1@contoh.id')
    expect(await screen.findByText('Email sudah terdaftar.')).toBeInTheDocument()
  })
})
