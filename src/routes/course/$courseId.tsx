
import { createFileRoute } from '@tanstack/react-router'
import { CourseDetail } from '@/components/course/course-detail'
import { NavBar } from '@/components/layout'

export const Route = createFileRoute('/course/$courseId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { courseId } = Route.useParams()
  return <>
    <NavBar />
    <CourseDetail courseId={courseId} />
  </>

}
