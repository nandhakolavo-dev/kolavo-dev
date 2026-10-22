import type { SpreadDimension } from '@/services/communities'

import { foldRows, initials, profileStats, spreadRows } from '../_utils/profile-stats'

const occupation: SpreadDimension = {
  dimension: 'occupation',
  buckets: [
    { label: 'Karyawan swasta', count: 7 },
    { label: 'PNS', count: 3 }
  ],
  otherCount: 1
}
const domicile: SpreadDimension = {
  dimension: 'domicile',
  buckets: [{ label: 'Jakarta Utara', count: 11 }],
  otherCount: 0
}

describe('profileStats', () => {
  it('counts listed cities and occupations, marking "+" when some are unlisted', () => {
    expect(
      profileStats({ memberCount: 11, spread: [occupation, domicile], cohortRange: { from: 2015, to: 2022 } })
    ).toEqual({
      members: 11,
      cities: { count: 1, isAtLeast: false },
      occupations: { count: 2, isAtLeast: true },
      cohort: '2015–2022'
    })
  })

  it('returns null for unknown values', () => {
    expect(profileStats({ memberCount: 0, spread: [], cohortRange: null })).toEqual({
      members: 0,
      cities: null,
      occupations: null,
      cohort: null
    })
  })

  it('shows a single cohort year once', () => {
    expect(profileStats({ memberCount: 3, spread: [], cohortRange: { from: 2020, to: 2020 } }).cohort).toBe(
      '2020'
    )
  })
})

describe('spreadRows', () => {
  it('sizes bars against the member count and appends "Lainnya"', () => {
    expect(spreadRows(occupation, 20, 'Lainnya')).toEqual([
      { label: 'Karyawan swasta', count: 7, percent: 35, isOther: false },
      { label: 'PNS', count: 3, percent: 15, isOther: false },
      { label: 'Lainnya', count: 1, percent: 5, isOther: true }
    ])
  })

  it('omits an empty "Lainnya" and survives a zero member count', () => {
    expect(spreadRows(domicile, 0, 'Lainnya')).toEqual([
      { label: 'Jakarta Utara', count: 11, percent: 0, isOther: false }
    ])
  })
})

describe('foldRows', () => {
  it('folds rows past the fifth', () => {
    expect(foldRows([1, 2, 3, 4, 5, 6, 7])).toEqual({ shown: [1, 2, 3, 4, 5], folded: [6, 7] })
  })

  it('never folds a single leftover row', () => {
    expect(foldRows([1, 2, 3, 4, 5, 6])).toEqual({ shown: [1, 2, 3, 4, 5, 6], folded: [] })
  })
})

describe('initials', () => {
  it('takes the first letters of the first two words', () => {
    expect(initials('Dedi Kurniawan')).toBe('DK')
    expect(initials('  rani  setiawati putri ')).toBe('RS')
  })
})
