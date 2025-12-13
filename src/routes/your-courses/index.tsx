import { createFileRoute } from '@tanstack/react-router'
import { UserCourses } from '@/components/course/user-courses'
import { authGuard } from '@/utils'

export const Route = createFileRoute('/your-courses/')({
  component: RouteComponent,
  beforeLoad: authGuard,
})

function RouteComponent() {
  return <UserCourses />
}
