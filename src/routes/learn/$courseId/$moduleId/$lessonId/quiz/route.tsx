import { CourseQuizLearningProvider } from '@/contexts/course'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/learn/$courseId/$moduleId/$lessonId/quiz',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <CourseQuizLearningProvider>
    <Outlet />
  </CourseQuizLearningProvider>
}
