import { useState } from 'react'
import { useRemoveCourseFromRoadmap } from '@/hooks/queries/roadmap-hooks'
import type { UUID } from '@/types'
import { toast } from 'sonner'

export const useRemoveCourseDialog = (
  roadmapId: UUID,
  onSuccess?: () => void
) => {
  const [isOpen, setIsOpen] = useState(false)
  const [courseIdToRemove, setCourseIdToRemove] = useState<UUID | null>(null)

  const removeCourseMutation = useRemoveCourseFromRoadmap()

  const handleRemoveCourse = (courseId: UUID) => {
    setCourseIdToRemove(courseId)
    setIsOpen(true)
  }

  const confirmRemoveCourse = async () => {
    if (!courseIdToRemove) return

    try {
      await removeCourseMutation.mutateAsync({
        id: roadmapId,
        courseId: courseIdToRemove,
      })
      setIsOpen(false)
      setCourseIdToRemove(null)
      onSuccess?.()
    } catch (error) {
      toast.error('Failed to remove course: ' + (error as Error).message)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setCourseIdToRemove(null)
  }

  return {
    isOpen,
    setIsOpen,
    courseIdToRemove,
    handleRemoveCourse,
    confirmRemoveCourse,
    handleClose,
    isLoading: removeCourseMutation.isPending,
  }
}

