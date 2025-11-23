import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/payment')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <Outlet />
  </>
}
