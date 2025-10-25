import { createFileRoute, Outlet } from '@tanstack/react-router'
import { NavBar } from '@/components/layout/nav-bar'

export const Route = createFileRoute('/course')({
  component: RouteComponent,
})

// Pathless layout route - wraps child routes
function RouteComponent() {
  return <>
  <NavBar />
  <Outlet />
  </>
}