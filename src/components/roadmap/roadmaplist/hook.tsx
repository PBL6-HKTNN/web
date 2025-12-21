import { useState, useMemo } from 'react'
import { useGetCourses } from '@/hooks/queries/course/course-hooks'
import type { CreateRoadmapReq, Roadmap } from '@/types/db/roadmap'
import type { GetCoursesFilterReq } from '@/types/db/course'
import { CourseStatus } from '@/types/db/course'
import { toast } from 'sonner'
import type { UseMutationResult } from '@tanstack/react-query'
import type { DeleteRoadmapResponse } from '@/types/db/roadmap'
import type { UUID } from '@/types'

export const useRoadmapList = (
  deleteRoadmapMutation: UseMutationResult<DeleteRoadmapResponse, Error, UUID>,
  roadmaps: Roadmap[]
) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCourseSelectDialogOpen, setIsCourseSelectDialogOpen] = useState(false)
  const [courseSearchTerm, setCourseSearchTerm] = useState('')
  const [createForm, setCreateForm] = useState<CreateRoadmapReq>({
    title: '',
    description: '',
    courseIds: [],
  })
  const [isDeleteRoadmapDialogOpen, setIsDeleteRoadmapDialogOpen] = useState(false)
  const [roadmapToDelete, setRoadmapToDelete] = useState<Roadmap | null>(null)

  // Fetch courses for selection
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
  const courses = useMemo(() => {
    return coursesData?.pages.flatMap((page) => page.data || []) || []
  }, [coursesData])

  // Filter courses by search term
  const filteredCourses = useMemo(() => {
    if (!courseSearchTerm.trim()) return courses
    const searchLower = courseSearchTerm.toLowerCase()
    return courses.filter(
      (course) =>
        course.title?.toLowerCase().includes(searchLower) ||
        course.description?.toLowerCase().includes(searchLower)
    )
  }, [courses, courseSearchTerm])

  const handleSelectCourse = (courseId: string) => {
    if (createForm.courseIds.includes(courseId)) {
      setCreateForm({
        ...createForm,
        courseIds: createForm.courseIds.filter((id) => id !== courseId),
      })
    } else {
      setCreateForm({
        ...createForm,
        courseIds: [...createForm.courseIds, courseId],
      })
    }
  }

  const handleRemoveCourse = (courseId: string) => {
    setCreateForm({
      ...createForm,
      courseIds: createForm.courseIds.filter((id) => id !== courseId),
    })
  }

  const handleCreateRoadmap = async (
    onCreate: (form: CreateRoadmapReq) => Promise<void>
  ) => {
    if (!createForm.title.trim() || !createForm.description.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate description must be > 10 characters
    if (createForm.description.trim().length <= 10) {
      toast.error('Description must be more than 10 characters')
      return
    }

    if (createForm.courseIds.length === 0) {
      toast.error('Please add at least one course')
      return
    }

    try {
      await onCreate(createForm)
      setIsCreateDialogOpen(false)
      setCreateForm({
        title: '',
        description: '',
        courseIds: [],
      })
    } catch (error) {
      toast.error('Failed to create roadmap: ' + (error as Error).message)
    }
  }

  const handleOpenCourseSelect = () => {
    setIsCourseSelectDialogOpen(true)
  }

  const handleCloseCourseSelect = () => {
    setIsCourseSelectDialogOpen(false)
    setCourseSearchTerm('')
  }

  const handleDoneCourseSelect = () => {
    setIsCourseSelectDialogOpen(false)
    setCourseSearchTerm('')
  }

  const handleDeleteRoadmap = (roadmapId: string) => {
    const roadmap = roadmaps?.find((r) => r.roadmapId === roadmapId) || null
    setRoadmapToDelete(roadmap)
    setIsDeleteRoadmapDialogOpen(true)
  }

  const confirmDeleteRoadmap = async () => {
    if (!roadmapToDelete) return

    try {
      await deleteRoadmapMutation.mutateAsync(roadmapToDelete.roadmapId)
      setIsDeleteRoadmapDialogOpen(false)
      setRoadmapToDelete(null)
    } catch (error) {
      toast.error('Failed to delete roadmap: ' + (error as Error).message)
    }
  }

  return {
    // State
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isCourseSelectDialogOpen,
    courseSearchTerm,
    setCourseSearchTerm,
    createForm,
    setCreateForm,

    // Data
    courses,
    filteredCourses,
    isLoadingCourses,

    // Handlers
    handleSelectCourse,
    handleRemoveCourse,
    handleCreateRoadmap,
    handleOpenCourseSelect,
    handleCloseCourseSelect,
    handleDoneCourseSelect,
    handleDeleteRoadmap,
    confirmDeleteRoadmap,
    
    // Delete roadmap dialog
    isDeleteRoadmapDialogOpen,
    setIsDeleteRoadmapDialogOpen,
    roadmapToDelete,
  }
}

