import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { VerifyEmailForm } from './index'

// Create mock functions
const mockHandleSubmit = vi.fn()
const mockUpdateField = vi.fn()

// Mock hook
vi.mock('./hooks', () => ({
  useVerifyEmailForm: () => ({
    formData: { email: 'test@gmail.com', token: '123456' },
    isLoading: false,
    updateField: mockUpdateField,
    handleSubmit: mockHandleSubmit,
  }),
}))

describe('VerifyEmailForm Component', () => {
  it('submit calls handleSubmit', () => {
    render(<VerifyEmailForm />)

    const form = screen.getByTestId('verify-form')

    fireEvent.submit(form)

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1)
  })

  it('renders input and button correctly', () => {
    render(<VerifyEmailForm />)

    const input = screen.getByTestId('verification-code-input')
    const button = screen.getByRole('button', { name: /verify email/i })

    expect(input).toBeInTheDocument()
    expect(button).toBeInTheDocument()
  })
})
