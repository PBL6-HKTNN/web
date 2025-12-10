import { useRef, useCallback, useEffect } from 'react'
import type { Lesson } from "@/types/db/course/lesson"
import type { UUID } from "@/types"
import { useCourseProgress } from '@/contexts/course/course-progress/hook'
import { isYouTubeUrl, getYouTubeEmbedUrl } from '@/utils/video-utils'

type VideoContentProps = {
  lesson: Lesson
  courseId: UUID
}

export default function VideoContent({ lesson, courseId }: VideoContentProps) {
  const { trackVideoProgress, updateCurrentViewWithWatchedSeconds, getCurrentEnrollment, getWatchedSecondsForCurrentView } = useCourseProgress()
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastTimeRef = useRef<number>(0)

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime
      const duration = videoRef.current.duration
      // Save last seen time
      lastTimeRef.current = currentTime
      trackVideoProgress(currentTime, duration, courseId, lesson.id)
    }
  }, [trackVideoProgress, courseId, lesson.id])

  useEffect(() => {
    const videoEl = videoRef.current
    const watchedSeconds = getWatchedSecondsForCurrentView()
    const enrollment = getCurrentEnrollment()
    if (!videoEl || !watchedSeconds || !enrollment) return
    if (enrollment.currentView !== lesson.id) return
    const setTime = () => {
      try {
        videoEl.currentTime = Math.floor(watchedSeconds)
      } catch {
        // ignore
      }
    }
    if (videoEl.readyState >= 1) {
      setTime()
    } else {
      videoEl.addEventListener('loadedmetadata', setTime)
      return () => videoEl.removeEventListener('loadedmetadata', setTime)
    }
  }, [getWatchedSecondsForCurrentView, getCurrentEnrollment, lesson.id])

  // On unmount, persist the last watched position for this lesson
  useEffect(() => {
    // Copy refs locally to avoid referencing mutated values in the cleanup
    const videoEl = videoRef.current
    return () => {
      const watchedSeconds = Math.floor(lastTimeRef.current || videoEl?.currentTime || 0)
      if (watchedSeconds && courseId && lesson.id) {
        try {
          updateCurrentViewWithWatchedSeconds(courseId, lesson.id, watchedSeconds)
          // Persist to localStorage so next visit can read it
          try {
            localStorage.setItem(`course-watch:${courseId}:${lesson.id}`, String(watchedSeconds))
          } catch {
            // ignore
          }
        } catch (e) {
          // Best-effort; don't block unmount
          // Log for debugging if available
          console.warn('Failed to update current view with watched seconds', e)
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, lesson.id])

  if (!lesson.contentUrl) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Video content is not available for this lesson.</p>
      </div>
    )
  }

  // Check if it's a YouTube URL
  const watchedSecondsForThisView = getWatchedSecondsForCurrentView()
  const enrollment = getCurrentEnrollment()

  if (isYouTubeUrl(lesson.contentUrl)) {
    const embedUrl = getYouTubeEmbedUrl(lesson.contentUrl)
    if (embedUrl) {
      const url = watchedSecondsForThisView && enrollment?.currentView === lesson.id ? `${embedUrl}?start=${Math.floor(watchedSecondsForThisView)}` : embedUrl
      return (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            src={url}
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
