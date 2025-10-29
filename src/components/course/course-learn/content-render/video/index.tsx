import type { Lesson } from "@/types/db/course/lesson"

type VideoContentProps = {
  lesson: Lesson
}

export default function VideoContent({ lesson }: VideoContentProps) {
  if (!lesson.contentUrl) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Video content is not available for this lesson.</p>
      </div>
    )
  }

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <video
        controls
        className="w-full h-full"
        src={lesson.contentUrl}
        poster={lesson.contentUrl ? `${lesson.contentUrl}?poster` : undefined}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
