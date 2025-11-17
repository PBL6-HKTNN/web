import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRegisterForm } from './hooks' 
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from '@tanstack/react-router'
import { useRegisterNoAuth } from '@/hooks/queries/auth-hooks'

// ─────────────── Mock hooks ───────────────
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}))

vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
}))

vi.mock('@/hooks/queries/auth-hooks', () => ({
  useRegisterNoAuth: vi.fn(),
}))

// ─────────────── Mock validator ───────────────
vi.mock('./validator', () => {
  const { z } = require('zod')
  const registerSchema = z
    .object({
      email: z.string().email('Invalid email'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string(),
      agreeToTerms: z.boolean().refine((val: boolean) => val === true, 'You must agree to terms'),
    })
    .refine((data: { password: any; confirmPassword: any }) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    })
  return { registerSchema }
})

describe('useRegisterForm', () => {
  const mockSuccess = vi.fn()
  const mockError = vi.fn()
  const mockNavigate = vi.fn()
  const mockMutateAsync = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock useToast
    ;(useToast as any).mockReturnValue({
      success: mockSuccess,
      error: mockError,
    })

    // Mock useNavigate
    ;(useNavigate as any).mockReturnValue(mockNavigate)

    // Mock mutation
    ;(useRegisterNoAuth as any).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    })
  })

  it('should initialize with default form values', () => {
    const { result } = renderHook(() => useRegisterForm())

    expect(result.current.formData).toEqual({
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    })
    expect(result.current.showPassword).toBe(false)
    expect(result.current.showConfirmPassword).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('should update field values correctly', () => {
    const { result } = renderHook(() => useRegisterForm())

    act(() => {
      result.current.updateField('email', 'test@example.com')
    })
    act(() => {
      result.current.updateField('agreeToTerms', true)
    })

    expect(result.current.formData.email).toBe('test@example.com')
    expect(result.current.formData.agreeToTerms).toBe(true)
  })

  it('should toggle password visibility', () => {
    const { result } = renderHook(() => useRegisterForm())

    act(() => {
      result.current.togglePasswordVisibility()
    })
    expect(result.current.showPassword).toBe(true)

    act(() => {
      result.current.togglePasswordVisibility()
    })
    expect(result.current.showPassword).toBe(false)
  })

  it('should validate form successfully with valid data', () => {
    const { result } = renderHook(() => useRegisterForm())

    act(() => {
      result.current.updateField('email', 'valid@example.com')
      result.current.updateField('password', 'password123')
      result.current.updateField('confirmPassword', 'password123')
      result.current.updateField('agreeToTerms', true)
    })

    const validation = result.current.validateForm()
    expect(validation.success).toBe(true)
    expect(validation.errors).toBe(null)
  })

  it('should fail validation when passwords do not match', () => {
    const { result } = renderHook(() => useRegisterForm())

    act(() => {
      result.current.updateField('email', 'test@example.com')
      result.current.updateField('password', 'password123')
      result.current.updateField('confirmPassword', 'different')
      result.current.updateField('agreeToTerms', true)
    })

    const validation = result.current.validateForm()
    expect(validation.success).toBe(false)
    expect(validation.errors).toBe("Passwords don't match")
  })

  it('should fail validation when agreeToTerms is false', () => {
    const { result } = renderHook(() => useRegisterForm())

    act(() => {
      result.current.updateField('email', 'test@example.com')
      result.current.updateField('password', 'password123')
      result.current.updateField('confirmPassword', 'password123')
      result.current.updateField('agreeToTerms', false)
    })

    const validation = result.current.validateForm()
    expect(validation.success).toBe(false)
    expect(validation.errors).toBe('You must agree to terms')
  })

  it('should show error toast on validation failure during submit', async () => {
    const { result } = renderHook(() => useRegisterForm())

    // Set form data with agreeToTerms false to trigger validation error
    act(() => {
      result.current.updateField('email', 'valid@example.com')
      result.current.updateField('password', 'password123')
      result.current.updateField('confirmPassword', 'password123')
      result.current.updateField('agreeToTerms', false) // Will cause validation error
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    expect(mockError).toHaveBeenCalledWith('You must agree to terms')
    expect(mockMutateAsync).not.toHaveBeenCalled()
  })

  it('should call mutateAsync and navigate on successful registration', async () => {
    mockMutateAsync.mockResolvedValueOnce({})

    const { result } = renderHook(() => useRegisterForm())

    act(() => {
      result.current.updateField('email', 'valid@example.com')
      result.current.updateField('password', 'password123')
      result.current.updateField('confirmPassword', 'password123')
      result.current.updateField('agreeToTerms', true)
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    expect(mockMutateAsync).toHaveBeenCalledWith({
      email: 'valid@example.com',
      password: 'password123',
    })
    expect(mockSuccess).toHaveBeenCalledWith('Please check your email for verification to continue!')
    expect(mockNavigate).toHaveBeenCalledWith({
      to: '/auth/verify',
      search: { email: 'valid@example.com', token: '' },
    })
  })

  it('should handle API error with nested response.data.error.message', async () => {
    const apiError = {
      response: {
        data: {
          error: { message: 'Email already exists' },
        },
      },
    }
    mockMutateAsync.mockRejectedValueOnce(apiError)

    const { result } = renderHook(() => useRegisterForm())

    act(() => {
      result.current.updateField('email', 'taken@example.com')
      result.current.updateField('password', 'password123')
      result.current.updateField('confirmPassword', 'password123')
      result.current.updateField('agreeToTerms', true)
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    expect(mockError).toHaveBeenCalledWith('Email already exists')
  })

  it('should handle API error with response.data.message', async () => {
    const apiError = {
      response: {
        data: { message: 'Server error' },
      },
    }
    mockMutateAsync.mockRejectedValueOnce(apiError)

    const { result } = renderHook(() => useRegisterForm())

    act(() => {
      result.current.updateField('email', 'test@example.com')
      result.current.updateField('password', 'password123')
      result.current.updateField('confirmPassword', 'password123')
      result.current.updateField('agreeToTerms', true)
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    expect(mockError).toHaveBeenCalledWith('Server error')
  })

  it('should fallback to default error message when error structure is unknown', async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useRegisterForm())

    act(() => {
      result.current.updateField('email', 'test@example.com')
      result.current.updateField('password', 'password123')
      result.current.updateField('confirmPassword', 'password123')
      result.current.updateField('agreeToTerms', true)
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    expect(mockError).toHaveBeenCalledWith('Registration failed. Please try again.')
  })

  it('should show isLoading true when mutation is pending', () => {
    ;(useRegisterNoAuth as any).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
    })

    const { result } = renderHook(() => useRegisterForm())

    expect(result.current.isLoading).toBe(true)
  })
})
