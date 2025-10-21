import { createFileRoute } from '@tanstack/react-router'
import { RegisterForm } from '@/components/auth/forms/register'

export const Route = createFileRoute('/auth/_mainLayout/register/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RegisterForm />
}
