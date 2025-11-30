import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/mod/users')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
  <Outlet />
  </>
}