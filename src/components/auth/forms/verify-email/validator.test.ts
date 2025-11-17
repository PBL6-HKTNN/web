import { describe, expect, test } from 'vitest'
import { verifyEmailSchema } from './validator'

describe('verifyEmailSchema', () => {
  test('valid data → pass', () => {
    const data = {
      email: 'test@gmail.com',
      token: '123456'
    }

    expect(() => verifyEmailSchema.parse(data)).not.toThrow()
  })

  test('email empty → error "Email is required"', () => {
    expect(() =>
      verifyEmailSchema.parse({
        email: '',
        token: '123456'
      })
    ).toThrow(/Email is required/)
  })

  test('email invalid format → error "Please enter a valid email address"', () => {
    expect(() =>
      verifyEmailSchema.parse({
        email: 'invalid-email',
        token: '123456'
      })
    ).toThrow(/valid email address/)
  })

  test('token empty → error "Verification code is required"', () => {
    expect(() =>
      verifyEmailSchema.parse({
        email: 'a@gmail.com',
        token: ''
      })
    ).toThrow(/Verification code is required/)
  })

  test('token < 6 characters → error "Verification code must be at least 6 characters"', () => {
    expect(() =>
      verifyEmailSchema.parse({
        email: 'a@gmail.com',
        token: '123'
      })
    ).toThrow(/at least 6 characters/)
  })
})
