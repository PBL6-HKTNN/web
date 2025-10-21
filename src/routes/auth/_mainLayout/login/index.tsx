import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/components/auth/forms/login'

export const Route = createFileRoute('/auth/_mainLayout/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LoginForm />
}
