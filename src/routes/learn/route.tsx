import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/learn')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
