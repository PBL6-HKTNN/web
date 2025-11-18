import { CourseTable } from '@/components/course'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import type { Course } from '@/types/db/course'
import { Button } from '@/components/ui/button'

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
        <div className="flex justify-between items-center mb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Courses</h1>
            <p className="text-muted-foreground">
              Manage and view your lecturing courses
            </p>
          </div>
          <Button asChild 
          data-testid="create-course-button">
            <Link to="/lecturing-tool/course/create">
              Create Course
            </Link>
          </Button>
        </div>

        <CourseTable onCourseClick={handleCourseClick} />
      </div>
    </div>
  )
}
