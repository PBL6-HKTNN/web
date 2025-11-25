import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useToast } from '@/hooks/use-toast'
import { loginSchema, type LoginFormData } from './validator'
import { useLogin, useGoogleLogin as useGoogleAuthLogin } from '@/hooks/queries/auth-hooks'
export function useLoginForm() {
  const loginMutation = useLogin()
  const googleAuthMutation = useGoogleAuthLogin()

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const { success, error } = useToast()
  const navigate = useNavigate()

  const updateField = <K extends keyof LoginFormData>(
    field: K,
    value: LoginFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    try {
      loginSchema.parse(formData)
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
      const response = await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      })
      console.log('response', response)
      if(response.isSuccess && response.data?.requiresEmailVerification === true) {
        navigate({
          to: '/auth/verify',
          search: { email: formData.email, token: '' }
        })
        return
      }
      success('Login successful!')
      navigate({ to: '/' })
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
            : 'Login failed. Please try again.'

      // Check if email is not verified - redirect to verification page
    
      // if (errorMessage.includes('not verified') || errorMessage.includes('verify')) {
      //   navigate({
      //     to: '/auth/verify',
      //     search: { email: formData.email, token: '' }
      //   })
      //   return
      // }

      error(errorMessage)
    }
  }

  const handleGoogleLogin = async (googleToken: string) => {
    try {
      await googleAuthMutation.mutateAsync({
        token: googleToken,
      })

      success('Google login successful!')
      navigate({ to: '/' })
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
            : 'Google login failed. Please try again.'
      error(errorMessage)
    }
  }


  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  return {
    formData,
    showPassword,
    isLoading: loginMutation.isPending || googleAuthMutation.isPending,
    updateField,
    handleSubmit,
    togglePasswordVisibility,
    validateForm,
    handleGoogleLogin,
  }
}
