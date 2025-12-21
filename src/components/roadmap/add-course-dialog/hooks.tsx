import { useState, useMemo } from 'react'
import { useAddCourseToRoadmap } from '@/hooks/queries/roadmap-hooks'
import { useGetCourses } from '@/hooks/queries/course/course-hooks'
import type { AddCourseToRoadmapReq } from '@/types/db/roadmap'
import type { UUID } from '@/types'
import type { GetCoursesFilterReq } from '@/types/db/course'
import { CourseStatus } from '@/types/db/course'
import { toast } from 'sonner'
import type { RoadmapDetail } from '@/types/db/roadmap'

export const useAddCourseDialog = (
  roadmapId: UUID,
  roadmap: RoadmapDetail | undefined,
  onSuccess?: () => void
) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCourseIds, setSelectedCourseIds] = useState<UUID[]>([])
  const [courseSearchTerm, setCourseSearchTerm] = useState('')

  const addCourseMutation = useAddCourseToRoadmap()

  // Fetch published courses for selection
  const courseFilters: GetCoursesFilterReq = useMemo(
    () => ({
      Page: 1,
      PageSize: 100,
      Status: CourseStatus.PUBLISHED,
    }),
    []
  )

  const { data: coursesData, isLoading: isLoadingCourses } =
    useGetCourses(courseFilters)
  const allCourses = useMemo(() => {
    return coursesData?.pages.flatMap((page) => page.data || []) || []
  }, [coursesData])

  // Filter out courses that are already in the roadmap
  const availableCourses = useMemo(() => {
    if (!roadmap) return allCourses
    return allCourses.filter((course) => !roadmap.courseIds.includes(course.id))
  }, [allCourses, roadmap?.courseIds])

  // Filter courses by search term
  const filteredCourses = useMemo(() => {
    if (!courseSearchTerm.trim()) return availableCourses
    const searchLower = courseSearchTerm.toLowerCase()
    return availableCourses.filter(
      (course) =>
        course.title?.toLowerCase().includes(searchLower) ||
        course.description?.toLowerCase().includes(searchLower)
    )
  }, [availableCourses, courseSearchTerm])

  const handleSelectCourse = (courseId: UUID) => {
    setSelectedCourseIds((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId)
      } else {
        return [...prev, courseId]
      }
    })
  }

  const handleAddCourse = async () => {
    if (selectedCourseIds.length === 0) {
      toast.error('Please select at least one course')
      return
    }

    try {
      // Add courses one by one
      for (const courseId of selectedCourseIds) {
        await addCourseMutation.mutateAsync({
          id: roadmapId,
          data: { courseId } as AddCourseToRoadmapReq,
        })
      }
      setIsOpen(false)
      setSelectedCourseIds([])
      setCourseSearchTerm('')
      onSuccess?.()
    } catch (error) {
      toast.error('Failed to add course: ' + (error as Error).message)
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setSelectedCourseIds([])
    setCourseSearchTerm('')
  }

  return {
    isOpen,
    setIsOpen,
    selectedCourseIds,
    courseSearchTerm,
    setCourseSearchTerm,
    filteredCourses,
    isLoadingCourses,
    handleSelectCourse,
    handleAddCourse,
    handleOpen,
    handleClose,
    isAdding: addCourseMutation.isPending,
  }
}

