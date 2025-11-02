import { createFileRoute, Outlet } from '@tanstack/react-router'
import CourseLearnLayout from '@/components/course/course-learn/layout'
import { useCourseLearn } from '@/contexts/course/course-learn'
import { useParams } from '@tanstack/react-router'
import ContentRender from '@/components/course/course-learn/content-render'

export const Route = createFileRoute(
  '/learn/$courseId/$moduleId/$lessonId/',
)({
  component: RouteComponent,
})

function LessonContent() {
  const { courseId, moduleId, lessonId } = useParams({ from: "/learn/$courseId/$moduleId/$lessonId/" })
  const { getLessonContent } = useCourseLearn()

  const lesson = getLessonContent(courseId, moduleId, lessonId)

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">Lesson Not Found</h2>
          <p className="text-muted-foreground">The requested lesson could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 min-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="capitalize">{lesson.lessonType}</span>
          <span>•</span>
          <span>{lesson.duration} minutes</span>
        </div>
      </div>
      <div className="lg:flex lg:justify-center">
        <ContentRender lesson={lesson} />
      </div>
    </div>
  )
}

function RouteComponent() {
  return (
      <CourseLearnLayout>
        <LessonContent />
        <Outlet />
      </CourseLearnLayout>
  )
}
