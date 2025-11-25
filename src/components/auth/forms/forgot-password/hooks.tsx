import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useToast } from '@/hooks/use-toast'
import { requestResetSchema, resetPasswordSchema, type ForgotPasswordFormData } from './validator'
import { useRequestResetPassword, useResetPassword } from '@/hooks/queries/auth-hooks'

export function useForgotPasswordForm() {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
    token: '',
    password: '',
    confirmPassword: '',
  })

  const { success, error: showError } = useToast()
  const navigate = useNavigate()

  const requestResetMutation = useRequestResetPassword()
  const resetPasswordMutation = useResetPassword()

  const updateField = <K extends keyof ForgotPasswordFormData>(
    field: K,
    value: ForgotPasswordFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateRequestForm = () => {
    try {
      requestResetSchema.parse({ email: formData.email })
      return { success: true, errors: null }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'issues' in err && Array.isArray(err.issues) && err.issues.length > 0) {
        return { success: false, errors: err.issues[0].message }
      }
      if (err instanceof Error) {
        return { success: false, errors: err.message }
      }
      return { success: false, errors: 'Validation failed' }
    }
  }

  const validateResetForm = () => {
    try {
      resetPasswordSchema.parse(formData)
      return { success: true, errors: null }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'issues' in err && Array.isArray(err.issues) && err.issues.length > 0) {
        return { success: false, errors: err.issues[0].message }
      }
      if (err instanceof Error) {
        return { success: false, errors: err.message }
      }
      return { success: false, errors: 'Validation failed' }
    }
  }

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateRequestForm()
    if (!validation.success) {
      showError(validation.errors || 'Please check your input')
      return
    }

    try {
      await requestResetMutation.mutateAsync({
        email: formData.email,
      })

      success('Password reset token sent! Please check your email and enter the code.')
    } catch (err: unknown) {
      const errorMessage = 
        (err && typeof err === 'object' && 'response' in err && 
         err.response && typeof err.response === 'object' && 'data' in err.response &&
         err.response.data && typeof err.response.data === 'object' && 'error' in err.response.data &&
         err.response.data.error && typeof err.response.data.error === 'object' && 'message' in err.response.data.error)
          ? (err.response.data.error.message as string)
          : (err && typeof err === 'object' && 'response' in err && 
             err.response && typeof err.response === 'object' && 'data' in err.response &&
             err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data)
            ? (err.response.data.message as string)
            : 'Failed to send reset email. Please try again.'
      showError(errorMessage)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateResetForm()
    if (!validation.success) {
      showError(validation.errors || 'Please check your input')
      return
    }

    // console.log('Starting password reset process')
    // console.log('Email:', formData.email)
    // console.log('Token:', formData.token)
    // console.log('New Password length:', formData.password?.length)

    try {
      await resetPasswordMutation.mutateAsync({
        email: formData.email,
        token: formData.token!,
        newPassword: formData.password!,
      })

      success('Password reset successful! You can now login with your new password.')
      navigate({ to: '/auth/login' })
    } catch (err: unknown) {
      // console.error('❌ Password reset failed:', err)
      // console.error('❌ Error response:', err?.response)
      // console.error('❌ Error status:', err?.response?.status)
      // console.error('❌ Error data:', err?.response?.data)

      const errorMessage = 
        (err && typeof err === 'object' && 'response' in err && 
         err.response && typeof err.response === 'object' && 'data' in err.response &&
         err.response.data && typeof err.response.data === 'object' && 'error' in err.response.data &&
         err.response.data.error && typeof err.response.data.error === 'object' && 'message' in err.response.data.error)
          ? (err.response.data.error.message as string)
          : (err && typeof err === 'object' && 'response' in err && 
             err.response && typeof err.response === 'object' && 'data' in err.response &&
             err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data)
            ? (err.response.data.message as string)
            : (err && typeof err === 'object' && 'response' in err && 
               err.response && typeof err.response === 'object' && 'data' in err.response &&
               err.response.data && typeof err.response.data === 'object' && 'error' in err.response.data)
              ? (err.response.data.error as string)
              : 'Failed to reset password. Please try again.'

      // console.error('❌ Final error message:', errorMessage)
      showError(errorMessage)
    }
  }

  return {
    formData,
    isLoading: requestResetMutation.isPending || resetPasswordMutation.isPending,
    updateField,
    handleRequestReset,
    handleResetPassword,
    validateRequestForm,
    validateResetForm,
  }
}
