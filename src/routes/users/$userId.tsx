import { createFileRoute } from '@tanstack/react-router'
import { authGuard } from '@/utils'

export const Route = createFileRoute('/users/$userId')({
  component: RouteComponent,
  beforeLoad: authGuard,
})

function RouteComponent() {
  const { userId } = Route.useParams()
  return <div> Hello "/users/{userId}"! </div>
}
