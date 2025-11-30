import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/mod/courses')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
  <Outlet />
  </>
}