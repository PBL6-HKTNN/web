import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Link } from '@tanstack/react-router'
import { Eye, EyeOff } from 'lucide-react'
import { useRegisterForm } from './hooks'

export function RegisterForm() {
  const {
    formData,
    showPassword,
    showConfirmPassword,
    isLoading,
    updateField,
    handleSubmit,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
  } = useRegisterForm()

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="space-y-1 px-0">
        <CardTitle className="text-xl text-center">Create your account</CardTitle>
        <CardDescription className="text-center">
          Join CodeMy and start your coding journey today
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <form onSubmit={handleSubmit} className="space-y-4" data-testid="register-form">

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              required
              data-testid="email-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                data-testid="password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                required
              />
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                required
                data-testid="confirm-password-input"
              />
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => updateField('agreeToTerms', checked as boolean)}
              data-testid="terms-checkbox"
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{' '}
              <a href="/terms" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                Privacy Policy
              </a>
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading} data-testid="submit-button">
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          {/* <div className="mt-6 grid grid-cols-1">
            <Button
              variant="outline"
              onClick={() => handleSocialRegister('GitHub')}
              className="w-full"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialRegister('Google')}
              className="w-full"
            >
              <Mail className="h-4 w-4" />
              Continue with Google
            </Button>
          </div> */}
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
