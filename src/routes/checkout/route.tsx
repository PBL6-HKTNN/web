import { NavBar } from '@/components/layout'
import { authGuard } from '@/utils/auth-guard'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/checkout')({
  component: RouteComponent,
  beforeLoad: authGuard,
})

function RouteComponent() {
  return <>
    <NavBar />
    <Outlet />
  </>
}
