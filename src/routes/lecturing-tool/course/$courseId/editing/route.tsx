import { CourseEditProvider } from '@/contexts/course/course-edit'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/lecturing-tool/course/$courseId/editing',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { courseId } = Route.useParams()
  return <CourseEditProvider courseId={courseId} >
    <Outlet />
  </CourseEditProvider>
}
