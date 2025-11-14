import { createFileRoute } from '@tanstack/react-router'
import { LessonContentLoader } from '@/components/course/course-learn/lesson-content-loader'
import { useParams } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/learn/$courseId/$moduleId/$lessonId/',
)({
  component: RouteComponent,
})

function LessonContent() {
  const { moduleId, lessonId } = useParams({ from: "/learn/$courseId/$moduleId/$lessonId/" })

  return (
    <LessonContentLoader
      lessonId={lessonId}
      moduleId={moduleId}
    />
  )
}

function RouteComponent() {
  return (
    <>
      <LessonContent />
    </>
  )
}
