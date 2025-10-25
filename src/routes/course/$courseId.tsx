
import { createFileRoute } from '@tanstack/react-router'
import { CourseDetail } from '@/components/course/course-detail'

export const Route = createFileRoute('/course/$courseId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { courseId } = Route.useParams()
  return <CourseDetail courseId={courseId} />
}
