import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Loader2 } from 'lucide-react'
import { useVerifyEmailForm } from './hooks'

interface VerifyEmailFormProps {
  initialEmail?: string
  initialToken?: string
}

export function VerifyEmailForm({ initialEmail, initialToken }: VerifyEmailFormProps) {
  const {
    formData,
    isLoading,
    updateField,
    handleSubmit,
  } = useVerifyEmailForm(initialEmail, initialToken)

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="text-center">
        <Mail className="mx-auto h-16 w-16 text-blue-500" />
        <CardTitle className="text-2xl">Verify Your Email</CardTitle>
        <CardDescription className="text-center text-base">
          We sent a verification code to your email <span className="font-bold">{formData.email}</span>. Please enter it below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              required
              disabled={isLoading}
            />
          </div> */}

          <div className="space-y-2">
            <Input
              id="token"
              type="text"
              placeholder="Enter verification code"
              value={formData.token}
              onChange={(e) => updateField('token', e.target.value)}
              required
              disabled={isLoading}
              data-testid="verification-code-input"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !formData.email || !formData.token}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Didn't receive the email? Check your spam folder.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
