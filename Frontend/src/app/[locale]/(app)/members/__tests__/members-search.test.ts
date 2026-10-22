import { membersHref, toMemberParams } from '../_utils/members-search'

const defaults = { search: '', status: 'all', page: 1, pageSize: 10 } as const

describe('toMemberParams', () => {
  it('strips the all sentinel and empty search', () => {
    expect(toMemberParams(defaults)).toEqual({ page: 1, pageSize: 10, search: undefined, status: undefined })
  })
})

describe('membersHref', () => {
  it('omits defaults', () => {
    expect(membersHref(defaults)).toBe('/members')
  })

  it('keeps non-default values', () => {
    expect(membersHref(defaults, { status: 'pending', page: 2 })).toBe('/members?status=pending&page=2')
  })
})
