import { createMemberFormSchema, membersSearchSchema } from '../schema'

describe('membersSearchSchema', () => {
  it('fills every default from an empty query', () => {
    expect(membersSearchSchema.parse({})).toEqual({ search: '', status: 'all', page: 1, pageSize: 10 })
  })

  it('falls back instead of throwing on garbage', () => {
    expect(membersSearchSchema.parse({ page: 'banana', pageSize: '7', status: 'deleted' })).toMatchObject({
      page: 1,
      pageSize: 10,
      status: 'all'
    })
  })
})

describe('createMemberFormSchema', () => {
  const schema = createMemberFormSchema(key => key)

  it('rejects an invalid email with the translated message key', () => {
    const result = schema.safeParse({ name: 'Ana', email: 'nope', status: 'active' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('emailInvalid')
  })
})
