import { NavBar } from '@/components/layout'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/cart')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <NavBar />
    <Outlet />
  </>
}

