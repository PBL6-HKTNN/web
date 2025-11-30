import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/courses')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}