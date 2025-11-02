import { createFileRoute } from '@tanstack/react-router'
import { NavBar } from '@/components/layout/nav-bar'
import { Outlet } from '@tanstack/react-router'
export const Route = createFileRoute('/your-courses')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
  <NavBar />
  <Outlet />
  </>
}
