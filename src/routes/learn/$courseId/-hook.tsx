import { useParams, useNavigate } from '@tanstack/react-router'
import { useGetCourseContentById } from '@/hooks/queries/course/course-hooks'
import type { Course } from '@/types/db/course'
import type { Module } from '@/types/db/course/module'

export function useCourseOverview() {
  const { courseId } = useParams({ from: '/learn/$courseId/' })
  const navigate = useNavigate()

  const { data: courseData, isLoading: courseLoading, error: courseError } = useGetCourseContentById(courseId)

  const course: Course | undefined = courseData?.data?.course || undefined
  const modules: Module[] = courseData?.data?.module || []

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

  return {
    course,
    modules,
    totalLessons,
    isLoading,
    error,
    handleLessonSelect
  }
}