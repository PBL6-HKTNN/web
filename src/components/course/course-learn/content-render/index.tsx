import MarkdownContent from "./markdown"
import VideoContent from "./video"
import QuizContent from "./quiz"
import  { type Lesson, LessonType } from "@/types/db/course/lesson"
import type { UUID } from "@/types"

type ContentRenderProps = {
  lesson: Lesson
  courseId: UUID
}

export default function ContentRender({ lesson, courseId }: ContentRenderProps) {
  if (lesson.lessonType === LessonType.MARKDOWN) {
    return (
      <div className="lg:min-h-screen">
        <MarkdownContent lesson={lesson} courseId={courseId} />
      </div>
    )
  }

  if (lesson.lessonType === LessonType.VIDEO) {
    return (
      <div className="lg:min-h-screen">
        <VideoContent lesson={lesson} courseId={courseId} />
      </div>
    )
  }

  if (lesson.lessonType === LessonType.QUIZ) {
    return (
      <div className="lg:min-h-screen">
        <QuizContent lesson={lesson} courseId={courseId} />
      </div>
    )
  }

  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">
        Content type "{lesson.lessonType}" is not supported yet.
      </p>
    </div>
  )
}
