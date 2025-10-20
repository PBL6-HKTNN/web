import { z } from 'zod'

export const verifyEmailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  token: z
    .string()
    .min(1, 'Verification code is required')
    .min(6, 'Verification code must be at least 6 characters'),
})

export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>
