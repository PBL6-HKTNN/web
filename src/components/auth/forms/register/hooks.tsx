import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useToast } from '@/hooks/use-toast'
import { registerSchema, type RegisterFormData } from './validator'
import { useRegisterNoAuth } from '@/hooks/queries/auth-hooks'

export function useRegisterForm() {
  const registerMutation = useRegisterNoAuth()

  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { success, error } = useToast()
  const navigate = useNavigate()

  const updateField = <K extends keyof RegisterFormData>(
    field: K,
    value: RegisterFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    try {
      registerSchema.parse(formData)
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
      error(validation.errors || 'Please check your input')
      return
    }

    try {
      await registerMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      })

      success('Please check your email for verification to continue!')
      navigate({ to: '/auth/verify', search: { email: formData.email, token: '' } })
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
            : 'Registration failed. Please try again.'
      error(errorMessage)
    }
  }

  // const handleSocialRegister = (provider: string) => {
  //   success(`Register with ${provider} clicked`)
  // }

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev)
  }

  return {
    formData,
    showPassword,
    showConfirmPassword,
    isLoading: registerMutation.isPending,
    updateField,
    handleSubmit,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    validateForm,
  }
}
