import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/permissions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}