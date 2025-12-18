import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/requests-reports')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
