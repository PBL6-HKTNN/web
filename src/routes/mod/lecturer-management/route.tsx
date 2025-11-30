import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
export const Route = createFileRoute('/mod/lecturer-management')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
