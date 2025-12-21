import { createFileRoute } from '@tanstack/react-router'
import { authGuard } from '@/utils'
import { Outlet } from '@tanstack/react-router'
export const Route = createFileRoute('/roadmap/$roadmapId')({
  component: RouteComponent,
  beforeLoad: authGuard,
})

function RouteComponent() {
  return <>
  <Outlet />
  </>
}
