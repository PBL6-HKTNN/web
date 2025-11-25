import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Link } from '@tanstack/react-router'
import { Eye, EyeOff } from 'lucide-react'
import { useLoginForm } from './hooks'
import { GoogleLogin } from '@react-oauth/google'

export function LoginForm() {
  const {
    formData,
    showPassword,
    isLoading,
    updateField,
    handleSubmit,
    handleGoogleLogin,
    togglePasswordVisibility,
  } = useLoginForm()

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="space-y-1 px-0">
        <CardTitle className="text-xl text-center">Sign in to your account</CardTitle>
        <CardDescription className="text-center">
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
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
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                required
                data-testid="password-input"
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => updateField('rememberMe', checked as boolean)}
                data-testid="remember-me-checkbox"
              />
              <Label htmlFor="remember" className="text-sm">
                Remember me
              </Label>
            </div>
            <Link
              to="/auth/forgot-password"
              className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading} data-testid="submit-button">
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-6">
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

          <div className="mt-6 grid grid-cols-1">
            {/* <Button
              variant="outline"
              onClick={() => handleSocialLogin('GitHub')}
              className="w-full"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button> */}
            {/* <Button
              variant="outline"
              onClick={handleSocialLogin}
              className="w-full"
            >
              <Mail className="h-4 w-4" />
              Continue with Google
            </Button> */}
              <GoogleLogin 
                onSuccess={credentialResponse => 
                  handleGoogleLogin(credentialResponse.credential ?? '')
                }
              />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link
            to="/auth/register"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
