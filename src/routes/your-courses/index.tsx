import { createFileRoute } from '@tanstack/react-router'
import { UserCourses } from '@/components/course/user-courses'

export const Route = createFileRoute('/your-courses/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <UserCourses />
}
