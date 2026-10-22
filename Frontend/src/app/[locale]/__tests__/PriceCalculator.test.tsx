import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderWithProviders } from '@/test/render'

import { PriceCalculator } from '../_components/PriceCalculator'

const normalize = (text: string | null) => (text ?? '').replace(/\s/g, ' ')

describe('PriceCalculator', () => {
  it('shows the default estimate and applies the 2-year discount', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PriceCalculator label='Simulasi biaya' />)
    await user.click(screen.getByRole('button', { name: 'Simulasi biaya' }))
    const dialog = await screen.findByRole('dialog')

    expect(normalize(within(dialog).getByRole('heading').textContent)).toContain('Rp 54.358')

    await user.click(within(dialog).getByRole('radio', { name: /2 tahun/ }))
    // 200 members, 1 reviewer, 24 months, 10% off: round(54358 × 24 × 0.9) = 1.174.133
    expect(normalize(dialog.textContent)).toContain('Rp 1.174.133')
    expect(normalize(dialog.textContent)).toContain('Diskon 10% · 2 tahun')
  })

  it('limits reviewers to at least one', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PriceCalculator label='Simulasi biaya' />)
    await user.click(screen.getByRole('button', { name: 'Simulasi biaya' }))
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('button', { name: 'Kurangi peninjau' })).toBeDisabled()
    await user.click(within(dialog).getByRole('button', { name: 'Tambah peninjau' }))
    expect(normalize(dialog.textContent)).toContain('2 peninjau')
  })
})
