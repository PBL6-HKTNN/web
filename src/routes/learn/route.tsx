import { authGuard } from '@/utils'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/learn')({
  component: RouteComponent,
  beforeLoad: authGuard,
})

function RouteComponent() {
  return <Outlet />
}
