import CourseProgressProvider from '@/contexts/course/course-progress/provider'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/learn/$courseId/$moduleId/$lessonId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
  <CourseProgressProvider>
    <Outlet />
  </CourseProgressProvider>
  </>
}
