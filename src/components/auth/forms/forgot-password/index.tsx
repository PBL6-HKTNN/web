import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from '@tanstack/react-router'
import { Mail, Lock, Eye, EyeOff, Send } from 'lucide-react'
import { useState } from 'react'
import { useForgotPasswordForm } from './hooks'

export function ForgotPasswordForm() {
  const {
    formData,
    isLoading,
    updateField,
    handleRequestReset,
    handleResetPassword,
  } = useForgotPasswordForm()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="space-y-1 px-0">
        <CardTitle className="text-xl text-center">Reset your password</CardTitle>
        <CardDescription className="text-center">
          Enter your email, get the reset code, and set your new password
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-4">
          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                required
                className="pl-10"
              />
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Reset code field */}
          <div className="space-y-2">
            <Label htmlFor="token">Reset Code</Label>
            <div className="relative grid grid-cols-2">
              <Input
                id="token"
                type="text"
                placeholder="Enter the code from your email"
                value={formData.token}
                onChange={(e) => updateField('token', e.target.value)}
                className="pr-24"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  handleRequestReset(e)
                }}
                disabled={isLoading || !formData.email}
                className="absolute right-1 top-1 h-8 px-2"
              >
                <Send className="h-3 w-3 mr-1" />
                Get Code
              </Button>
            </div>
          </div>

          {/* New password field */}
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                className="pl-10 pr-10"
              />
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Confirm password field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                className="pl-10 pr-10"
              />
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Reset password button */}
          <Button
            onClick={(e) => handleResetPassword(e)}
            className="w-full"
            disabled={isLoading || !formData.token || !formData.password || !formData.confirmPassword}
          >
            {isLoading ? 'Resetting password...' : 'Reset Password'}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link
              to="/auth/login"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
