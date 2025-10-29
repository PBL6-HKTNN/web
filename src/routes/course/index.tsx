import { createFileRoute } from '@tanstack/react-router'
import { CourseList } from '@/components/course'
import { NavBar } from '@/components/layout'

export const Route = createFileRoute('/course/')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Courses</h1>
            <p className="text-muted-foreground">
              Discover and learn from our comprehensive collection of courses
            </p>
          </div>

          <CourseList />
        </div>
      </div>
    </>
  )
}
