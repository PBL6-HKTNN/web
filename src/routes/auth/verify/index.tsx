import { createFileRoute, useSearch } from '@tanstack/react-router'
import { VerifyEmailForm } from '@/components/auth/forms/verify-email'

export const Route = createFileRoute('/auth/verify/')({
  component: RouteComponent,
  validateSearch: (search) => ({
    token: (search.token as string) || '',
    email: (search.email as string) || '',
  }),
})

function RouteComponent() {
  const search = useSearch({ from: '/auth/verify/' })

  return (
    <VerifyEmailForm 
      initialEmail={search.email} 
      initialToken={search.token}
    />
  )
}
