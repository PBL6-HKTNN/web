import { createFileRoute, Outlet } from '@tanstack/react-router'
import CourseLearnLayout from '@/components/course/course-learn/layout'

export const Route = createFileRoute('/learn/$courseId/$moduleId')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <CourseLearnLayout>
      <Outlet />
    </CourseLearnLayout>
  )
}
