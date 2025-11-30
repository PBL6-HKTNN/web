import { createFileRoute } from '@tanstack/react-router'
import { LessonContentLoader } from '@/components/course/course-learn/lesson-content-loader'
import { useParams } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useCourseProgress } from '@/contexts/course/course-progress'

export const Route = createFileRoute(
  '/learn/$courseId/$moduleId/$lessonId/',
)({
  component: RouteComponent,
})

function LessonContent() {
  const {courseId, moduleId, lessonId } = useParams({ from: "/learn/$courseId/$moduleId/$lessonId/" })
  const { updateCurrentView } = useCourseProgress()

  // Update current view when lesson is accessed
  useEffect(() => {
    if (courseId && lessonId) {
      updateCurrentView(courseId, lessonId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, lessonId])

  return (
    <LessonContentLoader
      courseId={courseId}
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
