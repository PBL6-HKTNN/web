import { createFileRoute } from '@tanstack/react-router'
import { CourseForm } from '@/components/course/course-edit/general-info'
import { useCourseCreatePage } from './-hook'
import { authGuard } from '@/utils'

export const Route = createFileRoute('/lecturing-tool/course/create/')({
  component: RouteComponent,
  beforeLoad: authGuard,
})

function RouteComponent() {
  const { instructorId, handleCourseCreated, handleCourseCreateError } = useCourseCreatePage();

  if (!instructorId) {
    return <div>Please log in to create a course.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <CourseForm
          instructorId={instructorId}
          onSuccess={handleCourseCreated}
          onError={handleCourseCreateError}
        />
      </div>
    </div>
  );
}
