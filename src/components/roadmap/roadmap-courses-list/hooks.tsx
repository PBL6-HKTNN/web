import { useState, useEffect } from 'react'
import { useReorderRoadmapCourses } from '@/hooks/queries/roadmap-hooks'
import type { UUID } from '@/types'
import type { RoadmapDetail } from '@/types/db/roadmap'
import { toast } from 'sonner'

export const useRoadmapCoursesList = (
  roadmapId: UUID,
  roadmap: RoadmapDetail | undefined
) => {
  const [courseIds, setCourseIds] = useState<UUID[]>([])
  const reorderCoursesMutation = useReorderRoadmapCourses()

  // Update courseIds when roadmap data changes
  useEffect(() => {
    if (roadmap?.courseIds) {
      setCourseIds(roadmap.courseIds)
    }
  }, [roadmap?.courseIds])

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newCourseIds = [...courseIds]
    const temp = newCourseIds[index]
    newCourseIds[index] = newCourseIds[index - 1]
    newCourseIds[index - 1] = temp
    setCourseIds(newCourseIds)
    handleReorderCourses(newCourseIds)
  }

  const handleMoveDown = (index: number) => {
    if (index === courseIds.length - 1) return
    const newCourseIds = [...courseIds]
    const temp = newCourseIds[index]
    newCourseIds[index] = newCourseIds[index + 1]
    newCourseIds[index + 1] = temp
    setCourseIds(newCourseIds)
    handleReorderCourses(newCourseIds)
  }

  const handleReorderCourses = async (newCourseIds: UUID[]) => {
    try {
      await reorderCoursesMutation.mutateAsync({
        id: roadmapId,
        data: { courseIds: newCourseIds },
      })
    } catch (error) {
      toast.error('Failed to reorder courses: ' + (error as Error).message)
    }
  }

  return {
    courseIds,
    setCourseIds,
    handleMoveUp,
    handleMoveDown,
  }
}

