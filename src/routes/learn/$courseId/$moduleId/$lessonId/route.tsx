import { CourseProgressProvider } from '@/contexts/course/course-progress'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/learn/$courseId/$moduleId/$lessonId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { courseId } = Route.useParams()

  return <>
    <CourseProgressProvider courseId={courseId}>
      <Outlet />
    </CourseProgressProvider>
  </>
}
