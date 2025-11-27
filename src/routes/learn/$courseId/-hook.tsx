import { useParams, useNavigate } from '@tanstack/react-router'
import { useGetCourseContentById } from '@/hooks/queries/course/course-hooks'
import { useIsEnrolled, useGetEnrolledCourseCompletedLessons } from '@/hooks/queries/course/enrollment-hooks'
import { useGetLessonById } from '@/hooks/queries/course/lesson-hooks'
import type { Course } from '@/types/db/course'
import type { Module } from '@/types/db/course/module'

export function useCourseOverview() {
  const { courseId } = useParams({ from: '/learn/$courseId/' })
  const navigate = useNavigate()

  const { data: courseData, isLoading: courseLoading, error: courseError } = useGetCourseContentById(courseId)

  const course: Course | undefined = courseData?.data?.course || undefined
  const modules: Module[] = courseData?.data?.module || []
  
  // Get enrollment data to check current view
  const { data: enrollmentResponse } = useIsEnrolled(courseId)
  const enrollment = enrollmentResponse?.data?.enrollment
  const currentViewLessonId = enrollment?.currentView
  
  // Get completed lessons from API
  const { data: completedLessonsResponse } = useGetEnrolledCourseCompletedLessons(
    enrollment?.id || ''
  )
  const completedLessons = completedLessonsResponse?.data || []
  
  // Get current view lesson details if available
  const { data: currentLessonResponse } = useGetLessonById(currentViewLessonId || '')
  const currentLesson = currentLessonResponse?.data

  const handleLessonSelect = (moduleId: string, lessonId: string) => {
      navigate({
        to: '/learn/$courseId/$moduleId/$lessonId',
        params: {
          courseId,
          moduleId,
          lessonId
        }
    })
  }

  const totalLessons = modules.reduce((total: number, module) => total + (module.lessons?.length || 0), 0)

  const isLoading = courseLoading
  const error = courseError

  const handleContinueLearning = () => {
    if (currentLesson) {
      // Find the module that contains this lesson
      const moduleId = currentLesson.moduleId
      navigate({
        to: '/learn/$courseId/$moduleId/$lessonId',
        params: {
          courseId,
          moduleId: moduleId,
          lessonId: currentLesson.id
        }
      })
    }
  }

  return {
    course,
    modules,
    totalLessons,
    isLoading,
    error,
    handleLessonSelect,
    currentLesson,
    handleContinueLearning,
    hasCurrentLesson: !!currentLesson,
    completedLessons,
    enrollmentProgressStatus: enrollment?.progressStatus
  }
}