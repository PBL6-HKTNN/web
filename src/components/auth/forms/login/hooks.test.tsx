import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useLoginForm } from './hooks'
import * as authHooks from '@/hooks/queries/auth-hooks'
import type { AuthRes, LoginReq, GoogleLoginReq } from '@/types/core/auth'
import type { UseMutationResult } from '@tanstack/react-query'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock navigate
const mockNavigate = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}))

// Mock toast
const mockSuccess = vi.fn()
const mockError = vi.fn()
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    success: mockSuccess,
    error: mockError,
    info: vi.fn(),
    warning: vi.fn(),
  }),
}))

// QueryClient wrapper
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
)

// Helper: mock mutation correctly typed
function createMutationMock<TData = AuthRes, TVariables = any>(
  resolve?: TData,
  reject?: Error
): UseMutationResult<TData, Error, TVariables, unknown> {
  return {
    data: resolve,
    error: reject ?? null,
    variables: undefined,
    isError: !!reject,
    isLoading: false,
    isPending: false,
    isSuccess: !!resolve,
    mutate: vi.fn(),
    mutateAsync: vi.fn().mockImplementation(() => {
      if (reject) return Promise.reject(reject)
      return Promise.resolve(resolve)
    }),
    reset: vi.fn(),
    status: resolve ? 'success' : reject ? 'error' : 'idle',
    isIdle: !resolve && !reject,
    isFetched: !!resolve || !!reject,
    isFetchedAfterMount: !!resolve || !!reject,
    refetch: vi.fn(),
    remove: vi.fn(),
  } as unknown as UseMutationResult<TData, Error, TVariables, unknown>
}

describe('useLoginForm', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper })
    expect(result.current.formData).toEqual({ email: '', password: '', rememberMe: false })
    expect(result.current.showPassword).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('should update form fields', () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper })
    act(() => {
      result.current.updateField('email', 'test@example.com')
      result.current.updateField('password', 'Password123')
      result.current.updateField('rememberMe', true)
    })
    expect(result.current.formData).toEqual({
      email: 'test@example.com',
      password: 'Password123',
      rememberMe: true,
    })
  })

  it('should toggle password visibility', () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper })
    act(() => result.current.togglePasswordVisibility())
    expect(result.current.showPassword).toBe(true)
    act(() => result.current.togglePasswordVisibility())
    expect(result.current.showPassword).toBe(false)
  })

  it('should validate form correctly', () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper })
    let validation = result.current.validateForm()
    expect(validation.success).toBe(false)

    act(() => {
      result.current.updateField('email', 'test@example.com')
      result.current.updateField('password', 'Password123')
    })

    validation = result.current.validateForm()
    expect(validation.success).toBe(true)
  })

  it('should handle login submit success', async () => {
    const mockLoginResponse: AuthRes = {
      isSuccess: true,
      status: 200,
      data: { token: 'mock-token', user: { id: '1', email: 'test@example.com' } },
      error: null,
    }

    vi.spyOn(authHooks, 'useLogin').mockReturnValue(createMutationMock(mockLoginResponse))

    const { result } = renderHook(() => useLoginForm(), { wrapper })
    act(() => {
      result.current.updateField('email', 'test@example.com')
      result.current.updateField('password', 'Password123')
    })

    await act(async () => result.current.handleSubmit({ preventDefault: () => {} } as any))

    expect(mockSuccess).toHaveBeenCalledWith('Login successful!')
    expect(mockNavigate).toHaveBeenCalled()
  })

  it('should handle login submit error', async () => {
    vi.spyOn(authHooks, 'useLogin').mockReturnValue(
      createMutationMock<AuthRes, LoginReq>(undefined, new Error('Invalid credentials'))
    )

    const { result } = renderHook(() => useLoginForm(), { wrapper })
    act(() => {
      result.current.updateField('email', 'wrong@example.com')
      result.current.updateField('password', 'wrongpass')
    })

    await act(async () => result.current.handleSubmit({ preventDefault: () => {} } as any))

    expect(mockError).toHaveBeenCalledWith('Login failed. Please try again.')
  })

  it('should handle Google login success', async () => {
    const mockGoogleResponse: AuthRes = {
      isSuccess: true,
      status: 200,
      data: { token: 'mock-google-token', user: { id: '1', email: 'test@example.com' } },
      error: null,
    }

    vi.spyOn(authHooks, 'useGoogleLogin').mockReturnValue(
      createMutationMock<AuthRes, GoogleLoginReq>(mockGoogleResponse)
    )

    const { result } = renderHook(() => useLoginForm(), { wrapper })

    await act(async () => result.current.handleGoogleLogin('google-token'))

    expect(mockSuccess).toHaveBeenCalledWith('Google login successful!')
    expect(mockNavigate).toHaveBeenCalled()
  })

  it('should handle Google login error', async () => {
    const mockGoogleError = new Error('Google login failed')

    vi.spyOn(authHooks, 'useGoogleLogin').mockReturnValue(
      createMutationMock<AuthRes, GoogleLoginReq>(undefined, mockGoogleError)
    )

    const { result } = renderHook(() => useLoginForm(), { wrapper })

    await act(async () => result.current.handleGoogleLogin('bad-token'))

    expect(mockError).toHaveBeenCalledWith('Google login failed. Please try again.')
  })
})
