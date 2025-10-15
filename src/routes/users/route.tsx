//layout file for /users
import { createFileRoute, Outlet } from '@tanstack/react-router'
export const Route = createFileRoute('/users')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <Outlet />
  </div>
}
