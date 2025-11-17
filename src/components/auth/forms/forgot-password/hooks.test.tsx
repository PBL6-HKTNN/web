import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useForgotPasswordForm } from './hooks'

// ───────────── MOCKS ─────────────
const mockNavigate = vi.fn()
const mockSuccess = vi.fn()
const mockError = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    success: mockSuccess,
    error: mockError,
    info: vi.fn(),
    warning: vi.fn(),
  }),
}))

// Hook mutations: return spy function and isPending state
const mockRequestReset = { mutateAsync: vi.fn(), isPending: false }
const mockResetPassword = { mutateAsync: vi.fn(), isPending: false }

vi.mock('@/hooks/queries/auth-hooks', () => ({
  useRequestResetPassword: () => mockRequestReset,
  useResetPassword: () => mockResetPassword,
}))

describe('useForgotPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle request reset success', async () => {
    mockRequestReset.mutateAsync.mockResolvedValue({ message: 'Token sent' })

    const { result } = renderHook(() => useForgotPasswordForm())

    act(() => result.current.updateField('email', 'test@example.com'))

    await act(async () => {
      await result.current.handleRequestReset({ preventDefault: vi.fn() } as any)
    })

    await waitFor(() => {
      expect(mockRequestReset.mutateAsync).toHaveBeenCalledWith({ email: 'test@example.com' })
    })

    expect(mockSuccess).toHaveBeenCalledWith(expect.stringContaining('token sent'))
  })

  it('should handle request reset error', async () => {
    mockRequestReset.mutateAsync.mockRejectedValue({ response: { data: { message: 'Email not found' } } })

    const { result } = renderHook(() => useForgotPasswordForm())

    act(() => result.current.updateField('email', 'notfound@example.com'))

    await act(async () => {
      await result.current.handleRequestReset({ preventDefault: vi.fn() } as any)
    })

    await waitFor(() => {
      expect(mockError).toHaveBeenCalledWith('Email not found')
    })
  })

  it('should handle reset password success', async () => {
    mockResetPassword.mutateAsync.mockResolvedValue({ message: 'Password updated' })

    const { result } = renderHook(() => useForgotPasswordForm())

    act(() => {
      result.current.updateField('email', 'test@example.com')
      result.current.updateField('token', '123456')
      result.current.updateField('password', 'NewPass123!')
      result.current.updateField('confirmPassword', 'NewPass123!')
    })

    await act(async () => {
      await result.current.handleResetPassword({ preventDefault: vi.fn() } as any)
    })

    await waitFor(() => {
      expect(mockResetPassword.mutateAsync).toHaveBeenCalledWith({
        email: 'test@example.com',
        token: '123456',
        newPassword: 'NewPass123!',
      })
    })

    expect(mockSuccess).toHaveBeenCalledWith(expect.stringContaining('Password reset successful'))
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/auth/login' })
  })

  it('should handle reset password error', async () => {
    mockResetPassword.mutateAsync.mockRejectedValue({
      response: { data: { message: 'Invalid or expired token' } },
    })

    const { result } = renderHook(() => useForgotPasswordForm())

    act(() => {
      result.current.updateField('email', 'test@example.com')
      result.current.updateField('token', '000000')
      result.current.updateField('password', 'NewPass123!')
      result.current.updateField('confirmPassword', 'NewPass123!')
    })

    await act(async () => {
      await result.current.handleResetPassword({ preventDefault: vi.fn() } as any)
    })

    await waitFor(() => {
      expect(mockError).toHaveBeenCalledWith('Invalid or expired token')
    })
  })
})
