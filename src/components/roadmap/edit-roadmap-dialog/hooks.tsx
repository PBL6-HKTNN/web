import { useState, useEffect } from 'react'
import { useUpdateRoadmap } from '@/hooks/queries/roadmap-hooks'
import type { UpdateRoadmapReq, RoadmapDetail } from '@/types/db/roadmap'
import type { UUID } from '@/types'
import { toast } from 'sonner'

export const useEditRoadmapDialog = (
  roadmapId: UUID,
  roadmap: RoadmapDetail | undefined,
  onSuccess?: () => void
) => {
  const [isOpen, setIsOpen] = useState(false)
  const [editForm, setEditForm] = useState<UpdateRoadmapReq>({
    title: '',
    description: '',
  })

  const updateMutation = useUpdateRoadmap()

  // Initialize edit form when roadmap data loads
  useEffect(() => {
    if (roadmap) {
      setEditForm({
        title: roadmap.title,
        description: roadmap.description,
      })
    }
  }, [roadmap?.roadmapId]) // Only re-initialize when roadmap ID changes

  const handleUpdate = async () => {
    if (!editForm.title.trim() || !editForm.description.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate description must be > 10 characters
    if (editForm.description.trim().length <= 10) {
      toast.error('Description must be more than 10 characters')
      return
    }

    try {
      await updateMutation.mutateAsync({ id: roadmapId, data: editForm })
      setIsOpen(false)
      onSuccess?.()
    } catch (error) {
      toast.error('Failed to update roadmap: ' + (error as Error).message)
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return {
    isOpen,
    setIsOpen,
    editForm,
    setEditForm,
    handleUpdate,
    handleOpen,
    handleClose,
    isLoading: updateMutation.isPending,
  }
}

