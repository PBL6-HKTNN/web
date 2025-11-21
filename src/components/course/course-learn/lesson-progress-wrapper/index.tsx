import React, { useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { UUID } from '@/types'
import { LessonType } from '@/types/db/course/lesson'
import { useCourseProgress } from '@/contexts/course/course-progress/hook'

// Higher-order component for lesson-specific progress tracking
interface LessonProgressWrapperProps {
  courseId: UUID
  lessonId: UUID
  lessonType: LessonType
  children: ReactNode
}

export const LessonProgressWrapper: React.FC<LessonProgressWrapperProps> = ({
  courseId,
  lessonId,
  lessonType,
  children
}) => {
  const { trackMarkdownScroll } = useCourseProgress()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (lessonType === LessonType.MARKDOWN && contentRef.current) {
      // Set data attributes for scroll tracking
      contentRef.current.setAttribute('data-course-id', courseId)
      contentRef.current.setAttribute('data-lesson-id', lessonId)
      
      // Start tracking scroll
      const cleanup = trackMarkdownScroll(contentRef.current)
      return cleanup
    }
  }, [courseId, lessonId, lessonType, trackMarkdownScroll])

  return (
    <div 
      ref={contentRef}
      className={lessonType === LessonType.MARKDOWN ? 'w-full max-h-[calc(100vh-200px)] overflow-y-auto' : undefined}
    >
      {children}
    </div>
  )
}

export default LessonProgressWrapper