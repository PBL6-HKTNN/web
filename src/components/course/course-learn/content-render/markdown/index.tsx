import type { Lesson } from "@/types/db/course/lesson"
import ReactMarkdown from 'react-markdown'
import remarkGfm from "remark-gfm";
type MarkdownContentProps = {
  lesson: Lesson
}

export default function MarkdownContent({ lesson }: MarkdownContentProps) {
  if (!lesson.rawContent) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No content available for this lesson.</p>
      </div>
    )
  }

  return (
    <div className="prose prose-lg container dark:prose-invert lg:min-w-4xl">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
      >{lesson.rawContent}</ReactMarkdown>
    </div>
  )
}
