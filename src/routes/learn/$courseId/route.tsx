import { CourseLearnProvider } from '@/contexts/course'
import { authGuard } from '@/utils'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/learn/$courseId')({
  component: RouteComponent,
  beforeLoad: authGuard,
})

function RouteComponent() {
  const { courseId } = Route.useParams()

  return (
    <CourseLearnProvider courseId={courseId}>
      <Outlet />
    </CourseLearnProvider>
  )
}
