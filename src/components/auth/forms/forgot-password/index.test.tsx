import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ForgotPasswordForm } from './index'

// Mock the hooks
vi.mock('./hooks', () => ({
  useForgotPasswordForm: vi.fn(),
}))

// Mock the router Link component
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, className }: any) => (
    <a href={to} className={className} data-testid="link">
      {children}
    </a>
  ),
}))

// Import the mocked hook
import { useForgotPasswordForm } from './hooks'

describe('ForgotPasswordForm', () => {
  const mockUseForgotPasswordForm = vi.fn()
  const mockUpdateField = vi.fn()
  const mockHandleRequestReset = vi.fn()
  const mockHandleResetPassword = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock implementation
    mockUseForgotPasswordForm.mockReturnValue({
      formData: {
        email: '',
        token: '',
        password: '',
        confirmPassword: '',
      },
      isLoading: false,
      updateField: mockUpdateField,
      handleRequestReset: mockHandleRequestReset,
      handleResetPassword: mockHandleResetPassword,
    })

    // Set the mocked hook implementation
    vi.mocked(useForgotPasswordForm).mockImplementation(mockUseForgotPasswordForm)
  })

  it('renders forgot password form correctly', () => {
    render(<ForgotPasswordForm />)

    expect(screen.getByText('Reset your password')).toBeVisible()
    expect(screen.getByText('Enter your email, get the reset code, and set your new password')).toBeVisible()

    expect(screen.getByTestId('email-input')).toBeVisible()
    expect(screen.getByTestId('reset-code-input')).toBeVisible()
    expect(screen.getByTestId('new-password-input')).toBeVisible()
    expect(screen.getByTestId('confirm-password-input')).toBeVisible()
    expect(screen.getByTestId('reset-password-button')).toBeVisible()
    expect(screen.getByTestId('get-code-button')).toBeVisible()

    expect(screen.getByText('Back to sign in')).toBeVisible()
  })

  it('displays form data correctly', () => {
    mockUseForgotPasswordForm.mockReturnValue({
      formData: {
        email: 'test@example.com',
        token: '123456',
        password: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      },
      isLoading: false,
      updateField: mockUpdateField,
      handleRequestReset: mockHandleRequestReset,
      handleResetPassword: mockHandleResetPassword,
    })

    render(<ForgotPasswordForm />)

    expect(screen.getByTestId('email-input')).toHaveAttribute('value', 'test@example.com')
    expect(screen.getByTestId('reset-code-input')).toHaveAttribute('value', '123456')
    expect(screen.getByTestId('new-password-input')).toHaveAttribute('value', 'NewPassword123')
    expect(screen.getByTestId('confirm-password-input')).toHaveAttribute('value', 'NewPassword123')
  })

  it('calls updateField when email input changes', async () => {
    render(<ForgotPasswordForm />)

    const emailInput = screen.getByTestId('email-input')
    await userEvent.type(emailInput, 'test@example.com')

    expect(mockUpdateField).toHaveBeenCalledWith('email', 't')
    expect(mockUpdateField).toHaveBeenCalledWith('email', 'e')
    expect(mockUpdateField).toHaveBeenCalledWith('email', 's')
    expect(mockUpdateField).toHaveBeenCalledWith('email', 't')
  })

  it('calls updateField when reset code input changes', async () => {
    render(<ForgotPasswordForm />)

    const tokenInput = screen.getByTestId('reset-code-input')
    await userEvent.type(tokenInput, '123456')

    expect(mockUpdateField).toHaveBeenCalledWith('token', '1')
    expect(mockUpdateField).toHaveBeenCalledWith('token', '2')
    expect(mockUpdateField).toHaveBeenCalledWith('token', '3')
  })

  it('calls updateField when new password input changes', async () => {
    render(<ForgotPasswordForm />)

    const passwordInput = screen.getByTestId('new-password-input')
    await userEvent.type(passwordInput, 'NewPassword123')

    expect(mockUpdateField).toHaveBeenCalledWith('password', 'N')
    expect(mockUpdateField).toHaveBeenCalledWith('password', 'e')
    expect(mockUpdateField).toHaveBeenCalledWith('password', 'w')
  })

  it('calls updateField when confirm password input changes', async () => {
    render(<ForgotPasswordForm />)

    const confirmPasswordInput = screen.getByTestId('confirm-password-input')
    await userEvent.type(confirmPasswordInput, 'NewPassword123')

    expect(mockUpdateField).toHaveBeenCalledWith('confirmPassword', 'N')
    expect(mockUpdateField).toHaveBeenCalledWith('confirmPassword', 'e')
  })

  it('calls handleRequestReset when get code button is clicked', async () => {
    // Mock with email filled to enable the button
    mockUseForgotPasswordForm.mockReturnValue({
      formData: {
        email: 'test@example.com',
        token: '',
        password: '',
        confirmPassword: '',
      },
      isLoading: false,
      updateField: mockUpdateField,
      handleRequestReset: mockHandleRequestReset,
      handleResetPassword: mockHandleResetPassword,
    })

    render(<ForgotPasswordForm />)

    const getCodeButton = screen.getByTestId('get-code-button')
    await userEvent.click(getCodeButton)

    expect(mockHandleRequestReset).toHaveBeenCalledTimes(1)
  })

  it('calls handleResetPassword when reset password button is clicked', async () => {
    // Mock with all required fields filled to enable the button
    mockUseForgotPasswordForm.mockReturnValue({
      formData: {
        email: 'test@example.com',
        token: '123456',
        password: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      },
      isLoading: false,
      updateField: mockUpdateField,
      handleRequestReset: mockHandleRequestReset,
      handleResetPassword: mockHandleResetPassword,
    })

    render(<ForgotPasswordForm />)

    const resetButton = screen.getByTestId('reset-password-button')
    await userEvent.click(resetButton)

    expect(mockHandleResetPassword).toHaveBeenCalledTimes(1)
  })

  it('shows password visibility toggles', () => {
    render(<ForgotPasswordForm />)

    // Check that password inputs are initially hidden
    const passwordInput = screen.getByTestId('new-password-input')
    const confirmPasswordInput = screen.getByTestId('confirm-password-input')

    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(confirmPasswordInput).toHaveAttribute('type', 'password')
  })

  it('renders link to login page', () => {
    render(<ForgotPasswordForm />)

    const signInLink = screen.getByText('Back to sign in')
    expect(signInLink.closest('a')).toHaveAttribute('href', '/auth/login')
  })

  it('handles keyboard navigation', async () => {
    render(<ForgotPasswordForm />)

    // Focus on email input
    const emailInput = screen.getByTestId('email-input')
    await userEvent.click(emailInput)
    expect(emailInput).toHaveFocus()

    // Tab through form fields
    await userEvent.tab()
    expect(screen.getByTestId('reset-code-input')).toHaveFocus()

    await userEvent.tab()
    expect(screen.getByTestId('new-password-input')).toHaveFocus()

    await userEvent.tab()
    await userEvent.tab() 
    expect(screen.getByTestId('confirm-password-input')).toHaveFocus()
  })

  it('validates email format', async () => {
    render(<ForgotPasswordForm />)

    // Fill invalid email
    const emailInput = screen.getByTestId('email-input')
    await userEvent.type(emailInput, 'invalid-email')

    const getCodeButton = screen.getByTestId('get-code-button')
    await userEvent.click(getCodeButton)

    // Should stay on form (validation should prevent action)
    expect(screen.getByText('Reset your password')).toBeVisible()
  })

  it('validates reset code requirement', async () => {
    render(<ForgotPasswordForm />)

    // Fill email but leave token empty
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('new-password-input')
    const confirmPasswordInput = screen.getByTestId('confirm-password-input')

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'NewPassword123')
    await userEvent.type(confirmPasswordInput, 'NewPassword123')

    const resetButton = screen.getByTestId('reset-password-button')
    await userEvent.click(resetButton)

    // Should stay on form
    expect(screen.getByText('Reset your password')).toBeVisible()
  })

  it('validates password confirmation match', async () => {
    render(<ForgotPasswordForm />)

    // Fill mismatched passwords
    const emailInput = screen.getByTestId('email-input')
    const tokenInput = screen.getByTestId('reset-code-input')
    const passwordInput = screen.getByTestId('new-password-input')
    const confirmPasswordInput = screen.getByTestId('confirm-password-input')

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(tokenInput, '123456')
    await userEvent.type(passwordInput, 'Password123')
    await userEvent.type(confirmPasswordInput, 'DifferentPassword')

    const resetButton = screen.getByTestId('reset-password-button')
    await userEvent.click(resetButton)

    // Should stay on form
    expect(screen.getByText('Reset your password')).toBeVisible()
  })

  it('disables buttons when loading', () => {
    mockUseForgotPasswordForm.mockReturnValue({
      formData: {
        email: 'test@example.com',
        token: '123456',
        password: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      },
      isLoading: true,
      updateField: mockUpdateField,
      handleRequestReset: mockHandleRequestReset,
      handleResetPassword: mockHandleResetPassword,
    })

    render(<ForgotPasswordForm />)

    const getCodeButton = screen.getByTestId('get-code-button')
    const resetButton = screen.getByTestId('reset-password-button')

    expect(getCodeButton).toBeDisabled()
    expect(resetButton).toBeDisabled()
  })

  it('shows loading text when requesting reset', () => {
    mockUseForgotPasswordForm.mockReturnValue({
      formData: {
        email: '',
        token: '',
        password: '',
        confirmPassword: '',
      },
      isLoading: true,
      updateField: mockUpdateField,
      handleRequestReset: mockHandleRequestReset,
      handleResetPassword: mockHandleResetPassword,
    })

    render(<ForgotPasswordForm />)

    const getCodeButton = screen.getByTestId('get-code-button')
    expect(getCodeButton).toBeDisabled()
  })

  it('shows loading text when resetting password', () => {
    mockUseForgotPasswordForm.mockReturnValue({
      formData: {
        email: 'test@example.com',
        token: '123456',
        password: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      },
      isLoading: true,
      updateField: mockUpdateField,
      handleRequestReset: mockHandleRequestReset,
      handleResetPassword: mockHandleResetPassword,
    })

    render(<ForgotPasswordForm />)

    const resetButton = screen.getByTestId('reset-password-button')
    expect(resetButton).toHaveTextContent('Resetting password...')
  })
})
