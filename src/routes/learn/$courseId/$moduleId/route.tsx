import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/learn/$courseId/$moduleId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
