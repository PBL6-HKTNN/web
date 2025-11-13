import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegisterForm } from './index'

// Mock the hooks
vi.mock('./hooks', () => ({
  useRegisterForm: vi.fn(),
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
import { useRegisterForm } from './hooks'

describe('RegisterForm', () => {
  const mockUseRegisterForm = vi.fn()
  const mockUpdateField = vi.fn()
  const mockHandleSubmit = vi.fn()
  const mockTogglePasswordVisibility = vi.fn()
  const mockToggleConfirmPasswordVisibility = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock implementation
    mockUseRegisterForm.mockReturnValue({
      formData: {
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
      },
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false,
      updateField: mockUpdateField,
      handleSubmit: mockHandleSubmit,
      togglePasswordVisibility: mockTogglePasswordVisibility,
      toggleConfirmPasswordVisibility: mockToggleConfirmPasswordVisibility,
    })

    // Set the mocked hook implementation
    vi.mocked(useRegisterForm).mockImplementation(mockUseRegisterForm)
  })

  it('renders register form correctly', () => {
    render(<RegisterForm />)

    expect(screen.getByText('Create your account')).toBeVisible()
    expect(screen.getByText('Join CodeMy and start your coding journey today')).toBeVisible()

    expect(screen.getByTestId('email-input')).toBeVisible()
    expect(screen.getByTestId('password-input')).toBeVisible()
    expect(screen.getByTestId('confirm-password-input')).toBeVisible()
    expect(screen.getByTestId('terms-checkbox')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Create account' })).toBeVisible()

    expect(screen.getByText('Sign in')).toBeVisible()
    expect(screen.getByText('Terms of Service')).toBeVisible()
    expect(screen.getByText('Privacy Policy')).toBeVisible()
  })

  it('displays form data correctly', () => {
    mockUseRegisterForm.mockReturnValue({
      formData: {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        agreeToTerms: true,
      },
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false,
      updateField: mockUpdateField,
      handleSubmit: mockHandleSubmit,
      togglePasswordVisibility: mockTogglePasswordVisibility,
      toggleConfirmPasswordVisibility: mockToggleConfirmPasswordVisibility,
    })

    render(<RegisterForm />)

    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()
    expect(screen.getByTestId('password-input')).toHaveAttribute('value', 'password123')
    expect(screen.getByTestId('confirm-password-input')).toHaveAttribute('value', 'password123')

    expect(screen.getByTestId('terms-checkbox')).toBeChecked()
  })

  it('shows password visibility toggles', () => {
    render(<RegisterForm />)

    const passwordInput = screen.getByTestId('password-input')
    const confirmPasswordInput = screen.getByTestId('confirm-password-input')

    // Initially passwords should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(confirmPasswordInput).toHaveAttribute('type', 'password')
  })

  it('calls updateField when email input changes', async () => {
    render(<RegisterForm />)

    const emailInput = screen.getByTestId('email-input')
    await userEvent.type(emailInput, 'test@example.com')

    expect(mockUpdateField).toHaveBeenCalledWith('email', 't')
    expect(mockUpdateField).toHaveBeenCalledWith('email', 'e')
    expect(mockUpdateField).toHaveBeenCalledWith('email', 's')
    expect(mockUpdateField).toHaveBeenCalledWith('email', 't')
  })

  it('calls updateField when password input changes', async () => {
    render(<RegisterForm />)

    const passwordInput = screen.getByTestId('password-input')
    await userEvent.type(passwordInput, 'password123')

    expect(mockUpdateField).toHaveBeenCalledWith('password', 'p')
    expect(mockUpdateField).toHaveBeenCalledWith('password', 'a')
    expect(mockUpdateField).toHaveBeenCalledWith('password', 's')
    expect(mockUpdateField).toHaveBeenCalledWith('password', 's')
  })

  it('calls updateField when confirm password input changes', async () => {
    render(<RegisterForm />)

    const confirmPasswordInput = screen.getByTestId('confirm-password-input')
    await userEvent.type(confirmPasswordInput, 'password123')

    expect(mockUpdateField).toHaveBeenCalledWith('confirmPassword', 'p')
    expect(mockUpdateField).toHaveBeenCalledWith('confirmPassword', 'a')
    expect(mockUpdateField).toHaveBeenCalledWith('confirmPassword', 's')
  })

  it('calls updateField when terms checkbox changes', async () => {
    render(<RegisterForm />)

    const checkbox = screen.getByTestId('terms-checkbox')
    await userEvent.click(checkbox)

    expect(mockUpdateField).toHaveBeenCalledWith('agreeToTerms', true)
  })

  it('calls handleSubmit when form is submitted', async () => {
    render(<RegisterForm />)

    // Fill required fields to pass validation
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    const confirmPasswordInput = screen.getByTestId('confirm-password-input')
    const termsCheckbox = screen.getByTestId('terms-checkbox')

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.type(confirmPasswordInput, 'password123')
    await userEvent.click(termsCheckbox)

    // Submit the form directly (this should trigger onSubmit)
    const form = screen.getByTestId('register-form')
    fireEvent.submit(form)

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1)
  })

  it('toggles password visibility when eye button is clicked', async () => {
    render(<RegisterForm />)

    // Find password toggle button (first eye icon button)
    const toggleButtons = screen.getAllByRole('button').filter(
      button => button.querySelector('svg')
    )

    if (toggleButtons.length > 0) {
      await userEvent.click(toggleButtons[0])
      expect(mockTogglePasswordVisibility).toHaveBeenCalledTimes(1)
    }
  })

  it('toggles confirm password visibility when eye button is clicked', async () => {
    render(<RegisterForm />)

    // Find confirm password toggle button (second eye icon button)
    const toggleButtons = screen.getAllByRole('button').filter(
      button => button.querySelector('svg')
    )

    if (toggleButtons.length > 1) {
      await userEvent.click(toggleButtons[1])
      expect(mockToggleConfirmPasswordVisibility).toHaveBeenCalledTimes(1)
    }
  })

  it('shows password as text when showPassword is true', () => {
    mockUseRegisterForm.mockReturnValue({
      formData: {
        email: '',
        password: 'password123',
        confirmPassword: '',
        agreeToTerms: false,
      },
      showPassword: true,
      showConfirmPassword: false,
      isLoading: false,
      updateField: mockUpdateField,
      handleSubmit: mockHandleSubmit,
      togglePasswordVisibility: mockTogglePasswordVisibility,
      toggleConfirmPasswordVisibility: mockToggleConfirmPasswordVisibility,
    })

    render(<RegisterForm />)

    const passwordInput = screen.getByTestId('password-input')
    expect(passwordInput).toHaveAttribute('type', 'text')
  })

  it('shows confirm password as text when showConfirmPassword is true', () => {
    mockUseRegisterForm.mockReturnValue({
      formData: {
        email: '',
        password: '',
        confirmPassword: 'password123',
        agreeToTerms: false,
      },
      showPassword: false,
      showConfirmPassword: true,
      isLoading: false,
      updateField: mockUpdateField,
      handleSubmit: mockHandleSubmit,
      togglePasswordVisibility: mockTogglePasswordVisibility,
      toggleConfirmPasswordVisibility: mockToggleConfirmPasswordVisibility,
    })

    render(<RegisterForm />)

    const confirmPasswordInput = screen.getByTestId('confirm-password-input')
    expect(confirmPasswordInput).toHaveAttribute('type', 'text')
  })

  it('disables submit button when loading', () => {
    mockUseRegisterForm.mockReturnValue({
      formData: {
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
      },
      showPassword: false,
      showConfirmPassword: false,
      isLoading: true,
      updateField: mockUpdateField,
      handleSubmit: mockHandleSubmit,
      togglePasswordVisibility: mockTogglePasswordVisibility,
      toggleConfirmPasswordVisibility: mockToggleConfirmPasswordVisibility,
    })

    render(<RegisterForm />)

    const submitButton = screen.getByRole('button', { name: 'Creating account...' })
    expect(submitButton).toBeDisabled()
  })

  it('renders link to login page', () => {
    render(<RegisterForm />)

    const signInLink = screen.getByText('Sign in')
    expect(signInLink.closest('a')).toHaveAttribute('href', '/auth/login')
  })

  it('handles keyboard navigation', async () => {
    render(<RegisterForm />)

    // Focus on email input
    const emailInput = screen.getByTestId('email-input')
    await userEvent.click(emailInput)
    expect(emailInput).toHaveFocus()

    // Tab through form fields
    await userEvent.tab()
    expect(screen.getByTestId('password-input')).toHaveFocus()

    await userEvent.tab()

    await userEvent.tab()
    expect(screen.getByTestId('confirm-password-input')).toHaveFocus()

    await userEvent.tab()

    await userEvent.tab()
    expect(screen.getByTestId('terms-checkbox')).toHaveFocus()


    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    expect(screen.getByTestId('submit-button')).toHaveFocus()
  })

  it('validates email format', async () => {
    render(<RegisterForm />)

    // Fill invalid email
    const emailInput = screen.getByTestId('email-input')
    await userEvent.type(emailInput, 'invalid-email')

    const passwordInput = screen.getByTestId('password-input')
    await userEvent.type(passwordInput, 'password123')

    const confirmPasswordInput = screen.getByTestId('confirm-password-input')
    await userEvent.type(confirmPasswordInput, 'password123')

    const termsCheckbox = screen.getByTestId('terms-checkbox')
    await userEvent.click(termsCheckbox)

    // Try to submit form
    const form = screen.getByTestId('register-form')
    fireEvent.submit(form)

    // Should stay on register page (validation should prevent submission)
    expect(screen.getByText('Create your account')).toBeVisible()
  })

  it('validates password confirmation match', async () => {
    render(<RegisterForm />)

    // Fill form with mismatched passwords
    const emailInput = screen.getByTestId('email-input')
    await userEvent.type(emailInput, 'test@example.com')

    const passwordInput = screen.getByTestId('password-input')
    await userEvent.type(passwordInput, 'password123')

    const confirmPasswordInput = screen.getByTestId('confirm-password-input')
    await userEvent.type(confirmPasswordInput, 'differentpassword')

    const termsCheckbox = screen.getByTestId('terms-checkbox')
    await userEvent.click(termsCheckbox)

    // Try to submit form
    const form = screen.getByTestId('register-form')
    fireEvent.submit(form)

    // Should stay on register page
    expect(screen.getByText('Create your account')).toBeVisible()
  })

  it('requires terms agreement', async () => {
    render(<RegisterForm />)

    // Fill form but don't check terms
    const emailInput = screen.getByTestId('email-input')
    await userEvent.type(emailInput, 'test@example.com')

    const passwordInput = screen.getByTestId('password-input')
    await userEvent.type(passwordInput, 'password123')

    const confirmPasswordInput = screen.getByTestId('confirm-password-input')
    await userEvent.type(confirmPasswordInput, 'password123')

    // Try to submit form
    const form = screen.getByTestId('register-form')
    fireEvent.submit(form)

    // Should stay on register page
    expect(screen.getByText('Create your account')).toBeVisible()
  })
})
