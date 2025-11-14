import { CourseTable } from '@/components/course'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import type { Course } from '@/types/db/course'

export const Route = createFileRoute('/lecturing-tool/course/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const handleCourseClick = (course: Course) => {
    navigate({
      to: '/lecturing-tool/course/$courseId',
      params: { courseId: course.id }
    })
  }

  return (
    <div className="w-full min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Courses</h1>
          <p className="text-muted-foreground">
            Manage and view your lecturing courses
          </p>
        </div>

        <CourseTable onCourseClick={handleCourseClick} />
      </div>
    </div>
  )
}
