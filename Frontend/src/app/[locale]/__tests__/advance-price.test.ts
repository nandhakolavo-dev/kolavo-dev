import { advancePrice } from '../_utils/advance-price'

// Expected values were produced by the prototype's own window.KolavoHarga, so the port matches it.
describe('advancePrice', () => {
  it('prices 200 members, 1 reviewer, monthly', () => {
    const price = advancePrice(200, 1, 1)
    expect(price.rate).toBeCloseTo(196.79, 10)
    expect(price).toMatchObject({ members: 200, membersCost: 39358, reviewersCost: 15000, total: 54358 })
  })

  it('rounds members up to 10 and applies 5% for 6 months', () => {
    const price = advancePrice(35, 3, 6)
    expect(price).toMatchObject({ members: 40, reviewersCost: 21000, discount: 0.05, total: 165042 })
    expect(price.discountAmount).toBeCloseTo(8686.44, 6)
  })

  it('applies 10% for 2 years at the 1,000 cap', () => {
    expect(advancePrice(1000, 2, 24)).toMatchObject({ members: 1000, perMonth: 204390, total: 4414824 })
  })

  it('clamps below 30 and above 1,000', () => {
    expect(advancePrice(5, 1, 1)).toMatchObject({ members: 30, total: 20970 })
    expect(advancePrice(1500, 1, 12)).toMatchObject({ members: 1000, discount: 0.05, total: 2295846 })
  })

  it('treats zero reviewers and months as one', () => {
    expect(advancePrice(201, 0, 0)).toMatchObject({ members: 210, reviewers: 1, months: 1, total: 56299 })
  })
})
