import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useToast } from '@/hooks/use-toast'
import { verifyEmailSchema, type VerifyEmailFormData } from './validator'
import { useVerifyEmail } from '@/hooks/queries/auth-hooks'

export function useVerifyEmailForm(initialEmail?: string, initialToken?: string, mockMutation?: any) {
  const [formData, setFormData] = useState<VerifyEmailFormData>({
    email: initialEmail || '',
    token: initialToken || '',
  })

  const { success, error: showError } = useToast()
  const navigate = useNavigate()
  const verifyEmailMutation = useVerifyEmail()

  const updateField = <K extends keyof VerifyEmailFormData>(
    field: K,
    value: VerifyEmailFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    try {
      verifyEmailSchema.parse(formData)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateForm()
    if (!validation.success) {
      showError(validation.errors || 'Please check your input')
      return
    }

    try {
      await verifyEmailMutation.mutateAsync({
        email: formData.email,
        token: formData.token,
      })

      success('Email verified successfully!')

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate({ to: '/auth/login' })
      }, 1000)
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
            : 'Verification failed. Please check your token and try again.'
      showError(errorMessage)
    }
  }

  return {
    formData,
    isLoading: verifyEmailMutation.isPending,
    updateField,
    handleSubmit,
    validateForm,
  }
}
