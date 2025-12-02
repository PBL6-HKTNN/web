import { useRef, useCallback } from 'react'
import type { Lesson } from "@/types/db/course/lesson"
import type { UUID } from "@/types"
import { useCourseProgress } from '@/contexts/course/course-progress/hook'
import { isYouTubeUrl, getYouTubeEmbedUrl } from '@/utils/video-utils'

type VideoContentProps = {
  lesson: Lesson
  courseId: UUID
}

export default function VideoContent({ lesson, courseId }: VideoContentProps) {
  const { trackVideoProgress } = useCourseProgress()
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime
      const duration = videoRef.current.duration
      trackVideoProgress(currentTime, duration, courseId, lesson.id)
    }
  }, [trackVideoProgress, courseId, lesson.id])

  if (!lesson.contentUrl) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Video content is not available for this lesson.</p>
      </div>
    )
  }

  // Check if it's a YouTube URL
  if (isYouTubeUrl(lesson.contentUrl)) {
    const embedUrl = getYouTubeEmbedUrl(lesson.contentUrl)
    if (embedUrl) {
      return (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            src={embedUrl}
            title={lesson.title || "YouTube Video"}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
    }
  }

  // Default to HTML5 video for direct video URLs
  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        controls
        className="w-full h-full"
        src={lesson.contentUrl}
        poster={lesson.contentUrl ? `${lesson.contentUrl}?poster` : undefined}
        onTimeUpdate={handleTimeUpdate}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
