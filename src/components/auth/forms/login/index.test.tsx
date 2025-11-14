import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './index'

// Mock the hooks
vi.mock('./hooks', () => ({
  useLoginForm: vi.fn(),
}))

// Mock the router Link component
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, className }: { children: React.ReactNode; to: string; className?: string }) => (
    <a href={to} className={className} data-testid="link">
      {children}
    </a>
  ),
}))

// Mock Google Login component
vi.mock('@react-oauth/google', () => ({
  GoogleLogin: ({ onSuccess }: { onSuccess?: (response: { credential: string }) => void }) => (
    <button
      data-testid="google-login"
      onClick={() => onSuccess?.({ credential: 'mock-credential' })}
    >
      Google Login
    </button>
  ),
}))

// Import the mocked hook
import { useLoginForm } from './hooks'

describe('LoginForm', () => {
  const mockUseLoginForm = vi.fn()
  const mockUpdateField = vi.fn()
  const mockHandleSubmit = vi.fn()
  const mockHandleGoogleLogin = vi.fn()
  const mockTogglePasswordVisibility = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock implementation
    mockUseLoginForm.mockReturnValue({
      formData: {
        email: '',
        password: '',
        rememberMe: false,
      },
      showPassword: false,
      isLoading: false,
      updateField: mockUpdateField,
      handleSubmit: mockHandleSubmit,
      handleGoogleLogin: mockHandleGoogleLogin,
      togglePasswordVisibility: mockTogglePasswordVisibility,
    })

    // Set the mocked hook implementation
    vi.mocked(useLoginForm).mockImplementation(mockUseLoginForm)
  })

  it('displays form data correctly', () => {
    mockUseLoginForm.mockReturnValue({
      formData: {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      },
      showPassword: false,
      isLoading: false,
      updateField: mockUpdateField,
      handleSubmit: mockHandleSubmit,
      handleGoogleLogin: mockHandleGoogleLogin,
      togglePasswordVisibility: mockTogglePasswordVisibility,
    })

    render(<LoginForm />)

    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('password123')).toBeInTheDocument()
    expect(screen.getByLabelText('Remember me')).toBeChecked()
  })

  it('calls updateField when email input changes', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const emailInput = screen.getByLabelText('Email')
    await user.type(emailInput, 'test@example.com')

    expect(mockUpdateField).toHaveBeenCalledWith('email', 't')
    expect(mockUpdateField).toHaveBeenCalledWith('email', 'e')
    expect(mockUpdateField).toHaveBeenCalledWith('email', 's')
    expect(mockUpdateField).toHaveBeenCalledWith('email', 't')
    expect(mockUpdateField).toHaveBeenCalledWith('email', 't')
    expect(mockUpdateField).toHaveBeenCalledWith('email', 'e')
    expect(mockUpdateField).toHaveBeenCalledWith('email', 'x')
    expect(mockUpdateField).toHaveBeenCalledWith('email', 'a')
    expect(mockUpdateField).toHaveBeenCalledWith('email', 'm')
    expect(mockUpdateField).toHaveBeenCalledWith('email', 'p')
    expect(mockUpdateField).toHaveBeenCalledWith('email', 'l')
    expect(mockUpdateField).toHaveBeenCalledWith('email', 'e')
    expect(mockUpdateField).toHaveBeenCalledWith('email', '.')
    expect(mockUpdateField).toHaveBeenCalledWith('email', 'c')
    expect(mockUpdateField).toHaveBeenCalledWith('email', 'o')
    expect(mockUpdateField).toHaveBeenCalledWith('email', 'm')
  })

  it('calls updateField when password input changes', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const passwordInput = screen.getByLabelText('Password')
    await user.type(passwordInput, 'password123')

    expect(mockUpdateField).toHaveBeenCalledWith('password', 'p')
    expect(mockUpdateField).toHaveBeenCalledWith('password', 'a')
    expect(mockUpdateField).toHaveBeenCalledWith('password', 's')
    expect(mockUpdateField).toHaveBeenCalledWith('password', 's')
    expect(mockUpdateField).toHaveBeenCalledWith('password', 'w')
    expect(mockUpdateField).toHaveBeenCalledWith('password', 'o')
    expect(mockUpdateField).toHaveBeenCalledWith('password', 'r')
    expect(mockUpdateField).toHaveBeenCalledWith('password', 'd')
    expect(mockUpdateField).toHaveBeenCalledWith('password', '1')
    expect(mockUpdateField).toHaveBeenCalledWith('password', '2')
    expect(mockUpdateField).toHaveBeenCalledWith('password', '3')
  })

  it('calls updateField when remember me checkbox changes', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const checkbox = screen.getByLabelText('Remember me')
    await user.click(checkbox)

    expect(mockUpdateField).toHaveBeenCalledWith('rememberMe', true)
  })

  it('calls handleSubmit when form is submitted', async () => {
    render(<LoginForm />)
  
    const form = screen.getByTestId('login-form')
    fireEvent.submit(form)
  
    expect(mockHandleSubmit).toHaveBeenCalledTimes(1)
  })
  
  

  it('calls handleGoogleLogin when Google login is clicked', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const googleButton = screen.getByTestId('google-login')
    await user.click(googleButton)

    expect(mockHandleGoogleLogin).toHaveBeenCalledWith('mock-credential')
  })

  it('toggles password visibility when eye button is clicked', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const toggleButton = screen.getByRole('button', { name: '' }) // Eye icon button
    await user.click(toggleButton)

    expect(mockTogglePasswordVisibility).toHaveBeenCalledTimes(1)
  })

  it('shows password as text when showPassword is true', () => {
    mockUseLoginForm.mockReturnValue({
      formData: {
        email: '',
        password: 'password123',
        rememberMe: false,
      },
      showPassword: true,
      isLoading: false,
      updateField: mockUpdateField,
      handleSubmit: mockHandleSubmit,
      handleGoogleLogin: mockHandleGoogleLogin,
      togglePasswordVisibility: mockTogglePasswordVisibility,
    })

    render(<LoginForm />)

    const passwordInput = screen.getByLabelText('Password')
    expect(passwordInput).toHaveAttribute('type', 'text')
  })

  it('shows password as password when showPassword is false', () => {
    render(<LoginForm />)

    const passwordInput = screen.getByLabelText('Password')
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('disables submit button when loading', () => {
    mockUseLoginForm.mockReturnValue({
      formData: {
        email: '',
        password: '',
        rememberMe: false,
      },
      showPassword: false,
      isLoading: true,
      updateField: mockUpdateField,
      handleSubmit: mockHandleSubmit,
      handleGoogleLogin: mockHandleGoogleLogin,
      togglePasswordVisibility: mockTogglePasswordVisibility,
    })

    render(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: 'Signing in...' })
    expect(submitButton).toBeDisabled()
  })

  it('renders links to forgot password and register pages', () => {
    render(<LoginForm />)

    const forgotPasswordLink = screen.getByText('Forgot password?')
    const signUpLink = screen.getByText('Sign up')

    expect(forgotPasswordLink).toBeInTheDocument()
    expect(signUpLink).toBeInTheDocument()
    expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '/auth/forgot-password')
    expect(signUpLink.closest('a')).toHaveAttribute('href', '/auth/register')
  })
})
