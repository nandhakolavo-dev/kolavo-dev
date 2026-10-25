import { describe, expect, it } from 'vitest'

import { safeReturnTo, signInHref } from '../return-to'

describe('safeReturnTo', () => {
  it.each(['/k/sman52', '/members?status=pending', '/k/sman52#pengurus', '/'])('keeps %s', path => {
    expect(safeReturnTo(path)).toBe(path)
  })

  it.each([
    null,
    '',
    'k/sman52',
    'https://evil.example',
    '//evil.example',
    '/\\evil.example',
    '/ /evil.example',
    '/masuk',
    '/masuk?next=/k/a',
    '/api/auth/google',
    `/${'a'.repeat(600)}`
  ])('rejects %s', value => {
    expect(safeReturnTo(value)).toBeNull()
  })
})

describe('signInHref', () => {
  it('adds next for a safe path', () => {
    expect(signInHref('/k/sman52')).toBe('/masuk?next=%2Fk%2Fsman52')
  })

  it('falls back to plain /masuk', () => {
    expect(signInHref()).toBe('/masuk')
    expect(signInHref('//evil.example')).toBe('/masuk')
  })
})
