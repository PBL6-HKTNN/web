import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/request-history')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <Outlet />
  </>
}
