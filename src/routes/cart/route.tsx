import { NavBar } from '@/components/layout'
import { authGuard } from '@/utils'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/cart')({
  component: RouteComponent,
  beforeLoad: authGuard,
})

function RouteComponent() {
  return <>
    <NavBar />
    <Outlet />
  </>
}

