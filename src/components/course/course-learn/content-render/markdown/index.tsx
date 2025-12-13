import type { Lesson } from "@/types/db/course/lesson"
import type { UUID } from "@/types"
import ReactMarkdown from 'react-markdown'
import remarkGfm from "remark-gfm";
import { useEffect } from "react";
import { useCourseProgress } from "@/contexts/course/course-progress";

type MarkdownContentProps = {
  lesson: Lesson
  courseId: UUID
}

export default function MarkdownContent({ lesson, courseId }: MarkdownContentProps) {
  const {
    updateCurrentView
  } = useCourseProgress()
  
  useEffect(() => {
    return () => {
      if (lesson.id && courseId){
        updateCurrentView(courseId, lesson.id)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson, courseId])


  if (!lesson.contentUrl) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No content available for this lesson.</p>
      </div>
    )
  }

  return (
    <div 
      className="prose prose-lg container dark:prose-invert lg:min-w-4xl"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
      >{lesson.contentUrl}</ReactMarkdown>
    </div>
  )
}
