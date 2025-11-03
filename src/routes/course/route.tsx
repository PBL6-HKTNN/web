import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/course')({
  component: RouteComponent,
})

// Pathless layout route - wraps child routes
function RouteComponent() {
  return <>
  <Outlet />
  </>
}