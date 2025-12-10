import React, { useCallback, useRef, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { 
  useUpdateEnrollmentProgress, 
  useUpdateEnrollmentCurrentView, 
  useIsEnrolled, 
  useGetEnrolledCourseCompletedLessons 
} from '@/hooks/queries/course/enrollment-hooks'
import type { UUID } from '@/types'
import { CourseProgressContext, type CourseProgressContextType } from './context'

interface CourseProgressProviderProps {
  children: ReactNode
  courseId?: UUID // Optional courseId for fetching completion data
}

export const CourseProgressProvider: React.FC<CourseProgressProviderProps> = ({ children, courseId }) => {
  const updateProgressMutation = useUpdateEnrollmentProgress()
  const updateCurrentViewMutation = useUpdateEnrollmentCurrentView()
  
  // Get enrollment data to fetch completed lessons
  const { data: enrollmentResponse } = useIsEnrolled(courseId || '')
  const enrollment = enrollmentResponse?.data?.enrollment
  
  // Memoize enrollment ID to prevent unnecessary re-renders
  const enrollmentId = useMemo(() => enrollment?.id || '', [enrollment?.id])
  
  // Memoize enrollment current view data to prevent infinite loops
  const enrollmentCurrentView = useMemo(() => ({
    currentView: enrollment?.currentView || null,
    lessonId: enrollment?.lessonId || null
  }), [enrollment?.currentView, enrollment?.lessonId])
  
  // Get completed lessons from API
  const { data: completedLessonsResponse } = useGetEnrolledCourseCompletedLessons(
    enrollmentId
  )
  const apiCompletedLessons = useMemo(() => {
    return completedLessonsResponse?.data || []
  }, [completedLessonsResponse?.data])
  
  // Convert API completed lessons to Set for faster lookup
  const completedLessonsSet = useMemo(() => {
    return new Set(apiCompletedLessons)
  }, [apiCompletedLessons])
  
  // Track completion states to prevent duplicate API calls
  const localCompletedLessons = useRef<Set<string>>(new Set())
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

  // Ref to store current completed lessons for checking without causing re-renders
  const currentCompletedLessonsRef = useRef<Set<UUID>>(new Set())
  
  // Update the ref when completedLessonsSet changes
  useEffect(() => {
    currentCompletedLessonsRef.current = completedLessonsSet
  }, [completedLessonsSet])

  const markLessonComplete = useCallback((courseId: UUID, lessonId: UUID) => {
    const lessonKey = `${courseId}-${lessonId}`
    
    // Check if lesson is already completed via API or locally tracked
    if (currentCompletedLessonsRef.current.has(lessonId) || localCompletedLessons.current.has(lessonKey)) {
      return // Already completed, don't call API again
    }

    localCompletedLessons.current.add(lessonKey)
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
    
    // Check if video is 90% watched and mark complete
    if (watchedPercentage >= 90) {
      markLessonComplete(courseId, lessonId)
    }
  }, [markLessonComplete])

  const markQuizComplete = useCallback((courseId: UUID, lessonId: UUID, passed: boolean) => {
    if (passed) {
      markLessonComplete(courseId, lessonId)
    }
    // If quiz is failed, don't mark as complete - user needs to retake
  }, [markLessonComplete])

  const updateCurrentView = useCallback((courseId: UUID, currentLessonId: UUID) => {
    updateCurrentViewMutation.mutate({
      courseId,
      currentLessonId
    })
  }, [updateCurrentViewMutation])

  const updateCurrentViewWithWatchedSeconds = useCallback((courseId: UUID, currentLessonId: UUID, watchedSeconds: number) => {
    updateCurrentViewMutation.mutate({
      courseId,
      currentLessonId,
      watchedSeconds
    })
  }, [updateCurrentViewMutation])
  
  const isLessonCompleted = useCallback((lessonId: UUID) => {
    return completedLessonsSet.has(lessonId)
  }, [completedLessonsSet])
  
  const getCompletedLessons = useCallback(() => {
    return apiCompletedLessons
  }, [apiCompletedLessons])

  const getCurrentEnrollment = useCallback(() => {
    if (!enrollmentCurrentView.currentView && !enrollmentCurrentView.lessonId) return null
    return enrollmentCurrentView
  }, [enrollmentCurrentView])

  const getWatchedSecondsForCurrentView = useCallback(() => {
    return typeof enrollment?.watchedSeconds === 'number' ? enrollment.watchedSeconds : null
  }, [enrollment])

  const value: CourseProgressContextType = useMemo(() => ({
    trackMarkdownScroll,
    markMarkdownComplete,
    trackVideoProgress,
    markQuizComplete,
    markLessonComplete,
    updateCurrentView,
    updateCurrentViewWithWatchedSeconds,
    isLessonCompleted,
    getCompletedLessons,
    getCurrentEnrollment,
    getWatchedSecondsForCurrentView,
  }), [
    trackMarkdownScroll,
    markMarkdownComplete,
    trackVideoProgress,
    markQuizComplete,
    markLessonComplete,
    updateCurrentView,
    updateCurrentViewWithWatchedSeconds,
    isLessonCompleted,
    getCompletedLessons,
    getCurrentEnrollment,
    getWatchedSecondsForCurrentView,
  ])

  return (
    <CourseProgressContext.Provider value={value}>
      {children}
    </CourseProgressContext.Provider>
  )
}

export default CourseProgressProvider

