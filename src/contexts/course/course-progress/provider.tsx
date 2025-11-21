import React, { useCallback, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useUpdateEnrollmentProgress } from '@/hooks/queries/course/enrollment-hooks'
import type { UUID } from '@/types'
import { CourseProgressContext, type CourseProgressContextType } from './context'

interface CourseProgressProviderProps {
  children: ReactNode
}

export const CourseProgressProvider: React.FC<CourseProgressProviderProps> = ({ children }) => {
  const updateProgressMutation = useUpdateEnrollmentProgress()
  
  // Track completion states to prevent duplicate API calls
  const completedLessons = useRef<Set<string>>(new Set())
  const scrollTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map())
  const videoProgressMap = useRef<Map<string, { lastUpdate: number, watchedPercentage: number }>>(new Map())

  // Cleanup timeouts on unmount
  useEffect(() => {
    const timeouts = scrollTimeouts.current
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout))
      timeouts.clear()
    }
  }, [])

  const markLessonComplete = useCallback((courseId: UUID, lessonId: UUID) => {
    const lessonKey = `${courseId}-${lessonId}`
    
    if (completedLessons.current.has(lessonKey)) {
      return // Already completed, don't call API again
    }

    completedLessons.current.add(lessonKey)
    updateProgressMutation.mutate({ courseId, lessonId })
  }, [updateProgressMutation])

  const trackMarkdownScroll = useCallback((element: HTMLElement) => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = element
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight
      
      // Consider "end" as 95% to account for minor scroll variations
      if (scrollPercentage >= 0.95) {
        // Get lesson info from element data attributes or context
        const courseId = element.getAttribute('data-course-id')
        const lessonId = element.getAttribute('data-lesson-id')
        
        if (courseId && lessonId) {
          const scrollKey = `${courseId}-${lessonId}-scroll`
          
          // Clear existing timeout if any
          const existingTimeout = scrollTimeouts.current.get(scrollKey)
          if (existingTimeout) {
            clearTimeout(existingTimeout)
          }
          
          // Set 3-second delay before marking complete
          const timeout = setTimeout(() => {
            markLessonComplete(courseId, lessonId)
            scrollTimeouts.current.delete(scrollKey)
          }, 3000)
          
          scrollTimeouts.current.set(scrollKey, timeout)
        }
      }
    }

    element.addEventListener('scroll', handleScroll)
    
    // Return cleanup function
    return () => {
      element.removeEventListener('scroll', handleScroll)
    }
  }, [markLessonComplete])

  const markMarkdownComplete = useCallback((courseId: UUID, lessonId: UUID) => {
    const scrollKey = `${courseId}-${lessonId}-scroll`
    
    // Clear any pending scroll timeout
    const existingTimeout = scrollTimeouts.current.get(scrollKey)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
      scrollTimeouts.current.delete(scrollKey)
    }
    
    // Set 3-second delay before marking complete
    const timeout = setTimeout(() => {
      markLessonComplete(courseId, lessonId)
    }, 3000)
    
    scrollTimeouts.current.set(scrollKey, timeout)
  }, [markLessonComplete])

  const trackVideoProgress = useCallback((
    currentTime: number, 
    duration: number, 
    courseId: UUID, 
    lessonId: UUID
  ) => {
    if (duration <= 0) return
    
    const watchedPercentage = (currentTime / duration) * 100
    const videoKey = `${courseId}-${lessonId}`
    
    // Update video progress
    const currentProgress = videoProgressMap.current.get(videoKey) || { lastUpdate: 0, watchedPercentage: 0 }
    videoProgressMap.current.set(videoKey, {
      lastUpdate: Date.now(),
      watchedPercentage: Math.max(currentProgress.watchedPercentage, watchedPercentage)
    })
    
    // Check if video is 70% watched and mark complete
    if (watchedPercentage >= 70) {
      markLessonComplete(courseId, lessonId)
    }
  }, [markLessonComplete])

  const markQuizComplete = useCallback((courseId: UUID, lessonId: UUID, passed: boolean) => {
    if (passed) {
      markLessonComplete(courseId, lessonId)
    }
    // If quiz is failed, don't mark as complete - user needs to retake
  }, [markLessonComplete])

  const value: CourseProgressContextType = {
    trackMarkdownScroll,
    markMarkdownComplete,
    trackVideoProgress,
    markQuizComplete,
    markLessonComplete,
  }

  return (
    <CourseProgressContext.Provider value={value}>
      {children}
    </CourseProgressContext.Provider>
  )
}

export default CourseProgressProvider

