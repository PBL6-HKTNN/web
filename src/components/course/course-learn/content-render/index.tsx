import MarkdownContent from "./markdown"
import VideoContent from "./video"
import QuizContent from "./quiz"
import  { type Lesson, LessonType } from "@/types/db/course/lesson"

type ContentRenderProps = {
  lesson: Lesson
}

const contentMapper = {
  [LessonType.MARKDOWN]: MarkdownContent,
  [LessonType.VIDEO]: VideoContent,
  [LessonType.QUIZ]: QuizContent,
} as const

export default function ContentRender({ lesson }: ContentRenderProps) {
  const ContentComponent = contentMapper[lesson.lessonType]

  if (!ContentComponent) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Content type "{lesson.lessonType}" is not supported yet.
        </p>
      </div>
    )
  }

  return (
    <div className="lg:min-h-screen">
        <ContentComponent lesson={lesson} />
    </div>
    )
}
