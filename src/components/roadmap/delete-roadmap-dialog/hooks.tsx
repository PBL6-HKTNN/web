import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useDeleteRoadmap } from '@/hooks/queries/roadmap-hooks'
import type { UUID } from '@/types'
import { toast } from 'sonner'

export const useDeleteRoadmapDialog = (roadmapId: UUID) => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const deleteMutation = useDeleteRoadmap()

  const handleDelete = () => {
    setIsOpen(true)
  }

  const confirmDeleteRoadmap = async () => {
    try {
      await deleteMutation.mutateAsync(roadmapId)
      navigate({ to: '/roadmap' })
    } catch (error) {
      toast.error('Failed to delete roadmap: ' + (error as Error).message)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return {
    isOpen,
    setIsOpen,
    handleDelete,
    confirmDeleteRoadmap,
    handleClose,
    isLoading: deleteMutation.isPending,
  }
}

