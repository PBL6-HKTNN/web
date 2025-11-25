import { describe, it, expect } from 'vitest'
import { requestResetSchema, resetPasswordSchema, type RequestResetFormData, type ResetPasswordFormData } from './validator'

describe('requestResetSchema', () => {
  it('validates valid request reset data', () => {
    const validData: RequestResetFormData = {
      email: 'test@example.com',
    }

    const result = requestResetSchema.safeParse(validData)
    expect(result.success).toBe(true)
    expect(result.data).toEqual(validData)
  })

  it('rejects empty email', () => {
    const invalidData = {
      email: '',
    }

    const result = requestResetSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Email is required')
    }
  })

  it('rejects invalid email format', () => {
    const invalidData = {
      email: 'invalid-email',
    }

    const result = requestResetSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Please enter a valid email address')
    }
  })

  it('correctly infers the RequestResetFormData type', () => {
    const data: RequestResetFormData = {
      email: 'test@example.com',
    }

    expect(typeof data.email).toBe('string')
  })
})

describe('resetPasswordSchema', () => {
  it('validates valid reset password data', () => {
    const validData: ResetPasswordFormData = {
      email: 'test@example.com',
      token: '123456',
      password: 'Password123',
      confirmPassword: 'Password123',
    }

    const result = resetPasswordSchema.safeParse(validData)
    expect(result.success).toBe(true)
    expect(result.data).toEqual(validData)
  })

  it('rejects empty email', () => {
    const invalidData = {
      email: '',
      token: '123456',
      password: 'Password123',
      confirmPassword: 'Password123',
    }

    const result = resetPasswordSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.message === 'Email is required')).toBe(true)
    }
  })

  it('rejects invalid email format', () => {
    const invalidData = {
      email: 'invalid-email',
      token: '123456',
      password: 'Password123',
      confirmPassword: 'Password123',
    }

    const result = resetPasswordSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.message === 'Please enter a valid email address')).toBe(true)
    }
  })

  it('rejects empty token', () => {
    const invalidData = {
      email: 'test@example.com',
      token: '',
      password: 'Password123',
      confirmPassword: 'Password123',
    }

    const result = resetPasswordSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.message === 'Reset token is required')).toBe(true)
    }
  })

  it('rejects token shorter than 6 characters', () => {
    const invalidData = {
      email: 'test@example.com',
      token: '12345',
      password: 'Password123',
      confirmPassword: 'Password123',
    }

    const result = resetPasswordSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.message === 'Token must be at least 6 characters')).toBe(true)
    }
  })

  it('accepts token exactly 6 characters', () => {
    const validData = {
      email: 'test@example.com',
      token: '123456',
      password: 'Password123',
      confirmPassword: 'Password123',
    }

    const result = resetPasswordSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('rejects empty password', () => {
    const invalidData = {
      email: 'test@example.com',
      token: '123456',
      password: '',
      confirmPassword: '',
    }

    const result = resetPasswordSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.message === 'Password is required')).toBe(true)
    }
  })

  it('rejects password shorter than 8 characters', () => {
    const invalidData = {
      email: 'test@example.com',
      token: '123456',
      password: 'Pass123',
      confirmPassword: 'Pass123',
    }

    const result = resetPasswordSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.message === 'Password must be at least 8 characters')).toBe(true)
    }
  })

  it('rejects password without lowercase letter', () => {
    const invalidData = {
      email: 'test@example.com',
      token: '123456',
      password: 'PASSWORD123',
      confirmPassword: 'PASSWORD123',
    }

    const result = resetPasswordSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password must contain at least one lowercase letter, one uppercase letter, and one number')
    }
  })

  it('rejects password without uppercase letter', () => {
    const invalidData = {
      email: 'test@example.com',
      token: '123456',
      password: 'password123',
      confirmPassword: 'password123',
    }

    const result = resetPasswordSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password must contain at least one lowercase letter, one uppercase letter, and one number')
    }
  })

  it('rejects password without number', () => {
    const invalidData = {
      email: 'test@example.com',
      token: '123456',
      password: 'Password',
      confirmPassword: 'Password',
    }

    const result = resetPasswordSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password must contain at least one lowercase letter, one uppercase letter, and one number')
    }
  })

  it('accepts password exactly 8 characters with all requirements', () => {
    const validData = {
      email: 'test@example.com',
      token: '123456',
      password: 'Passw123',
      confirmPassword: 'Passw123',
    }

    const result = resetPasswordSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('accepts password longer than 8 characters', () => {
    const validData = {
      email: 'test@example.com',
      token: '123456',
      password: 'Password123',
      confirmPassword: 'Password123',
    }

    const result = resetPasswordSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('rejects empty confirm password', () => {
    const invalidData = {
      email: 'test@example.com',
      token: '123456',
      password: 'Password123',
      confirmPassword: '',
    }

    const result = resetPasswordSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.message === 'Please confirm your password')).toBe(true)
    }
  })

  it('rejects mismatched passwords', () => {
    const invalidData = {
      email: 'test@example.com',
      token: '123456',
      password: 'Password123',
      confirmPassword: 'DifferentPassword',
    }

    const result = resetPasswordSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.message === "Passwords don't match")).toBe(true)
    }
  })

  it('correctly infers the ResetPasswordFormData type', () => {
    const data: ResetPasswordFormData = {
      email: 'test@example.com',
      token: '123456',
      password: 'Password123',
      confirmPassword: 'Password123',
    }

    expect(typeof data.email).toBe('string')
    expect(typeof data.token).toBe('string')
    expect(typeof data.password).toBe('string')
    expect(typeof data.confirmPassword).toBe('string')
  })

  it('handles multiple validation errors', () => {
    const invalidData = {
      email: 'invalid-email',
      token: '123',
      password: 'weak',
      confirmPassword: 'different',
    }

    const result = resetPasswordSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(1)
    }
  })

  it('validates complex password requirements', () => {
    const testCases = [
      { password: 'Password123', expected: true }, // Valid
      { password: 'password123', expected: false }, // No uppercase
      { password: 'PASSWORD123', expected: false }, // No lowercase
      { password: 'Password', expected: false }, // No number
      { password: 'Pass1234', expected: true }, // Valid minimum
      { password: 'Pass123', expected: false }, // Too short
    ]

    testCases.forEach(({ password, expected }) => {
      const data = {
        email: 'test@example.com',
        token: '123456',
        password,
        confirmPassword: password,
      }

      const result = resetPasswordSchema.safeParse(data)
      expect(result.success).toBe(expected)
    })
  })
})
