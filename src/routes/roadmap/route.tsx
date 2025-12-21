import { Outlet, createFileRoute } from '@tanstack/react-router'
import { authGuard } from '@/utils'
export const Route = createFileRoute('/roadmap')({
  component: RouteComponent,
  beforeLoad: authGuard,
})

function RouteComponent() {
  return <Outlet />
}

