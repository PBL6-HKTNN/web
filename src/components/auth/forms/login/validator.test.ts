import { describe, it, expect } from 'vitest'
import { loginSchema, type LoginFormData } from './validator'

describe('loginSchema', () => {
  it('validates valid login data', () => {
    const validData: LoginFormData = {
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true,
    }

    const result = loginSchema.safeParse(validData)
    expect(result.success).toBe(true)
    expect(result.data).toEqual(validData)
  })

  it('validates valid login data without rememberMe', () => {
    const validData: LoginFormData = {
      email: 'test@example.com',
      password: 'password123',
      rememberMe: false,
    }

    const result = loginSchema.safeParse(validData)
    expect(result.success).toBe(true)
    expect(result.data).toEqual({
      ...validData,
      rememberMe: false, // should default to false
    })
  })

  it('rejects empty email', () => {
    const invalidData = {
      email: '',
      password: 'password123',
    }

    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Email is required')
    }
  })

  it('rejects invalid email format', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'password123',
    }

    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Please enter a valid email address')
    }
  })

  it('rejects empty password', () => {
    const invalidData = {
      email: 'test@example.com',
      password: '',
    }

    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password is required')
    }
  })

  it('rejects password shorter than 6 characters', () => {
    const invalidData = {
      email: 'test@example.com',
      password: '12345',
    }

    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password must be at least 6 characters')
    }
  })

  it('accepts password exactly 6 characters', () => {
    const validData = {
      email: 'test@example.com',
      password: '123456',
    }

    const result = loginSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('accepts password longer than 6 characters', () => {
    const validData = {
      email: 'test@example.com',
      password: 'password123',
    }

    const result = loginSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('handles rememberMe as boolean', () => {
    const dataWithRememberMe = {
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true,
    }

    const dataWithoutRememberMe = {
      email: 'test@example.com',
      password: 'password123',
      rememberMe: false,
    }

    const result1 = loginSchema.safeParse(dataWithRememberMe)
    const result2 = loginSchema.safeParse(dataWithoutRememberMe)

    expect(result1.success).toBe(true)
    expect(result2.success).toBe(true)
    expect(result1.data?.rememberMe).toBe(true)
    expect(result2.data?.rememberMe).toBe(false)
  })

  it('correctly infers the LoginFormData type', () => {
    const data: LoginFormData = {
      email: 'test@example.com',
      password: 'password123',
      rememberMe: false,
    }

    // TypeScript should enforce the correct type
    expect(typeof data.email).toBe('string')
    expect(typeof data.password).toBe('string')
    expect(typeof data.rememberMe).toBe('boolean')
  })
})
