import { useState, useMemo } from 'react'
import { useCreatePermission, useUpdatePermission, useDeletePermission } from '@/hooks/queries/permission-hooks'
import { toast } from 'sonner'
import type { Permission } from '@/types/db/permission'

export const usePermissionListing = (permissions: Permission[]) => {
  const createPermissionMutation = useCreatePermission()
  const updatePermissionMutation = useUpdatePermission()
  const deletePermissionMutation = useDeletePermission()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null)
  const [deletingPermission, setDeletingPermission] = useState<Permission | null>(null)
  const [newPermissionName, setNewPermissionName] = useState('')
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>([])

  const filteredPermissions = useMemo(() => {
    return permissions.filter(permission =>
      permission.permissionName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [permissions, searchTerm])

  // Get all unique actions from all permissions
  const uniqueActions = useMemo(() => {
    return Array.from(
      new Map(permissions.flatMap(p => p.actions).map(action => [action.id, action])).values()
    )
  }, [permissions])

  const resetForm = () => {
    setEditingPermission(null)
    setNewPermissionName('')
    setSelectedActionIds([])
  }

  const handleActionToggle = (actionId: string) => {
    setSelectedActionIds(prev =>
      prev.includes(actionId)
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    )
  }

  const handleCreatePermission = async () => {
    if (newPermissionName.trim() && selectedActionIds.length > 0) {
      try {
        await createPermissionMutation.mutateAsync({
          name: newPermissionName.trim(),
          actionIds: selectedActionIds
        })

        resetForm()
        setIsCreateModalOpen(false)
        toast.success('Permission created successfully')
      } catch (error) {
        console.error('Failed to create permission:', error)
      }
    }
  }

  const handleEditPermission = (permission: Permission) => {
    setEditingPermission(permission)
    setNewPermissionName(permission.permissionName)
    setSelectedActionIds(permission.actions.map((action) => action.id))
    setIsEditModalOpen(true)
  }

  const handleUpdatePermission = async () => {
    if (editingPermission && newPermissionName.trim() && selectedActionIds.length > 0) {
      try {
        await updatePermissionMutation.mutateAsync({
          permissionId: editingPermission.id,
          data: {
            name: newPermissionName.trim(),
            actionIds: selectedActionIds
          }
        })

        resetForm()
        setIsEditModalOpen(false)
        toast.success('Permission updated successfully')
      } catch (error) {
        console.error('Failed to update permission:', error)
      }
    }
  }

  const handleDeletePermission = (permission: Permission) => {
    setDeletingPermission(permission)
    setIsDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (deletingPermission) {
      try {
        await deletePermissionMutation.mutateAsync(deletingPermission.id)

        setDeletingPermission(null)
        setIsDeleteConfirmOpen(false)
        toast.success('Permission deleted successfully')
      } catch (error) {
        console.error('Failed to delete permission:', error)
      }
    }
  }

  return {
    // State
    searchTerm,
    setSearchTerm,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    editingPermission,
    deletingPermission,
    newPermissionName,
    setNewPermissionName,
    selectedActionIds,
    filteredPermissions,
    uniqueActions,
    
    // Mutations
    createPermissionMutation,
    updatePermissionMutation,
    deletePermissionMutation,
    
    // Handlers
    handleActionToggle,
    handleCreatePermission,
    handleEditPermission,
    handleUpdatePermission,
    handleDeletePermission,
    handleConfirmDelete,
  }
}

