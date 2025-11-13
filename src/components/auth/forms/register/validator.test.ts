import { describe, it, expect } from 'vitest'
import { registerSchema, type RegisterFormData } from './validator'

describe('registerSchema', () => {
  it('validates valid register data', () => {
    const validData: RegisterFormData = {
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      agreeToTerms: true,
    }

    const result = registerSchema.safeParse(validData)
    expect(result.success).toBe(true)
    expect(result.data).toEqual(validData)
  })

  it('rejects empty email', () => {
    const invalidData = {
      email: '',
      password: 'Password123',
      confirmPassword: 'Password123',
      agreeToTerms: true,
    }

    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Email is required')
    }
  })

  it('rejects invalid email format', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'Password123',
      confirmPassword: 'Password123',
      agreeToTerms: true,
    }

    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Please enter a valid email address')
    }
  })

  it('rejects empty password', () => {
    const invalidData = {
      email: 'test@example.com',
      password: '',
      confirmPassword: '',
      agreeToTerms: true,
    }

    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.message === 'Password is required')).toBe(true)
    }
  })

  it('rejects password shorter than 6 characters', () => {
    const invalidData = {
      email: 'test@example.com',
      password: '12345',
      confirmPassword: '12345',
      agreeToTerms: true,
    }

    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password must be at least 6 characters')
    }
  })

  it('rejects password without lowercase letter', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'PASSWORD123',
      confirmPassword: 'PASSWORD123',
      agreeToTerms: true,
    }

    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password must contain at least one lowercase letter, one uppercase letter, and one number')
    }
  })

  it('rejects password without uppercase letter', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      agreeToTerms: true,
    }

    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password must contain at least one lowercase letter, one uppercase letter, and one number')
    }
  })

  it('rejects password without number', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'Password',
      confirmPassword: 'Password',
      agreeToTerms: true,
    }

    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password must contain at least one lowercase letter, one uppercase letter, and one number')
    }
  })

  it('accepts password exactly 6 characters with all requirements', () => {
    const validData = {
      email: 'test@example.com',
      password: 'Passw1',
      confirmPassword: 'Passw1',
      agreeToTerms: true,
    }

    const result = registerSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('accepts password longer than 6 characters', () => {
    const validData = {
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      agreeToTerms: true,
    }

    const result = registerSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('rejects empty confirm password', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: '',
      agreeToTerms: true,
    }

    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.message === 'Please confirm your password')).toBe(true)
    }
  })

  it('rejects mismatched passwords', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'DifferentPassword',
      agreeToTerms: true,
    }

    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.message === "Passwords don't match")).toBe(true)
    }
  })

  it('rejects when terms not agreed', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      agreeToTerms: false,
    }

    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.message === 'You must agree to the terms and conditions')).toBe(true)
    }
  })

  it('accepts when terms are agreed', () => {
    const validData = {
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      agreeToTerms: true,
    }

    const result = registerSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('correctly infers the RegisterFormData type', () => {
    const data: RegisterFormData = {
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      agreeToTerms: true,
    }

    // TypeScript should enforce the correct type
    expect(typeof data.email).toBe('string')
    expect(typeof data.password).toBe('string')
    expect(typeof data.confirmPassword).toBe('string')
    expect(typeof data.agreeToTerms).toBe('boolean')
  })

  it('handles multiple validation errors', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'weak',
      confirmPassword: 'different',
      agreeToTerms: false,
    }

    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(1)
    }
  })

  it('validates complex password requirements', () => {
    // Test various password combinations
    const testCases = [
      { password: 'Password123', expected: true }, // Valid
      { password: 'password123', expected: false }, // No uppercase
      { password: 'PASSWORD123', expected: false }, // No lowercase
      { password: 'Password', expected: false }, // No number
      { password: 'Pass1', expected: false }, // Too short
      { password: 'Pass123', expected: true }, // Valid minimum
    ]

    testCases.forEach(({ password, expected }) => {
      const data = {
        email: 'test@example.com',
        password,
        confirmPassword: password,
        agreeToTerms: true,
      }

      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(expected)
    })
  })
})
