import { z } from 'zod'

// Schema for requesting reset password (step 1)
export const requestResetSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

// Schema for resetting password (step 2)
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  token: z
    .string()
    .min(1, 'Reset token is required')
    .min(6, 'Token must be at least 6 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type RequestResetFormData = z.infer<typeof requestResetSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

// Union type for the complete form
export type ForgotPasswordFormData = RequestResetFormData & Partial<ResetPasswordFormData>
