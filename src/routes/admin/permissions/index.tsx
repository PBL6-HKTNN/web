import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, Shield, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { usePermissions, useCreatePermission, useUpdatePermission, useDeletePermission } from '@/hooks/queries/permission-hooks'
import { toast } from 'sonner'
import type { Permission } from '@/types/db/permission'

export const Route = createFileRoute('/admin/permissions/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { data: permissions = [], isLoading: loading } = usePermissions()
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

  const filteredPermissions = permissions.filter(permission =>
    permission.permissionName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreatePermission = async () => {
    if (newPermissionName.trim() && selectedActionIds.length > 0) {
      try {
        await createPermissionMutation.mutateAsync({
          name: newPermissionName.trim(),
          actionIds: selectedActionIds
        })

        // Reset form and close modal
        resetForm()
        setIsCreateModalOpen(false)
        toast.success('Permission created successfully')
      } catch (error) {
        console.error('Failed to create permission:', error)

        // Extract error message from API response
        // let errorMessage = 'Failed to create permission'
        // if (error?.response?.data?.message) {
        //   errorMessage = error.response.data.message
        // } else if (error?.response?.data?.errors) {
        //   // Handle validation errors
        //   const errors = error.response.data.errors
        //   if (Array.isArray(errors)) {
        //     errorMessage = errors.join(', ')
        //   } else if (typeof errors === 'object') {
        //     errorMessage = Object.values(errors).flat().join(', ')
        //   }
        // } else if (error?.message) {
        //   errorMessage = error.message
        // }

        // // Show error alert
        // alert(`Error: ${errorMessage}`)
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

        // Reset form and close modal
        resetForm()
        setIsEditModalOpen(false)
        toast.success('Permission updated successfully')
      } catch (error) {
        console.error('Failed to update permission:', error)

        // Extract error message from API response
        // let errorMessage = 'Failed to update permission'
        // if (error?.response?.data?.message) {
        //   errorMessage = error.response.data.message
        // } else if (error?.response?.data?.errors) {
        //   // Handle validation errors
        //   const errors = error.response.data.errors
        //   if (Array.isArray(errors)) {
        //     errorMessage = errors.join(', ')
        //   } else if (typeof errors === 'object') {
        //     errorMessage = Object.values(errors).flat().join(', ')
        //   }
        // } else if (error?.message) {
        //   errorMessage = error.message
        // }

        // Show error alert
        // alert(`Error: ${errorMessage}`)
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

        // Extract error message from API response
        // let errorMessage = 'Failed to delete permission'
        // if (error?.response?.data?.message) {
        //   errorMessage = error.response.data.message
        // } else if (error?.response?.data?.errors) {
        //   // Handle validation errors
        //   const errors = error.response.data.errors
        //   if (Array.isArray(errors)) {
        //     errorMessage = errors.join(', ')
        //   } else if (typeof errors === 'object') {
        //     errorMessage = Object.values(errors).flat().join(', ')
        //   }

        // Show error alert
        // alert(`Error: ${errorMessage}`)
      }
    }
  }

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

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">Loading permissions...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Permissions</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Permission
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Permission</DialogTitle>
              <DialogDescription>
                Create a new permission and assign actions to it.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Permission Name
                </label>
                <Input
                  id="name"
                  value={newPermissionName}
                  onChange={(e) => setNewPermissionName(e.target.value)}
                  placeholder="Enter permission name"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Actions</label>
                <div className="border rounded-md p-3 max-h-80 overflow-y-auto">
                  <div className="grid grid-cols-1 gap-2">
                    {(() => {
                      // Get all unique actions from all permissions
                      const allActions = permissions.flatMap(p => p.actions)
                      const uniqueActions = Array.from(
                        new Map(allActions.map(action => [action.id, action])).values()
                      )
                      return uniqueActions.map((action) => (
                        <div key={action.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`action-${action.id}`}
                            checked={selectedActionIds.includes(action.id)}
                            onCheckedChange={() => handleActionToggle(action.id)}
                          />
                          <label
                            htmlFor={`action-${action.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {action.description}
                          </label>
                        </div>
                      ))
                    })()}
                  </div>
                </div>
                {selectedActionIds.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {selectedActionIds.length} action{selectedActionIds.length !== 1 ? 's' : ''} selected
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreatePermission}
                disabled={!newPermissionName.trim() || selectedActionIds.length === 0 || createPermissionMutation.isPending}
              >
                {createPermissionMutation.isPending ? 'Creating...' : 'Create Permission'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Permission Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Permission</DialogTitle>
              <DialogDescription>
                Update the permission details and assigned actions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Permission Name
                </label>
                <Input
                  id="edit-name"
                  value={newPermissionName}
                  onChange={(e) => setNewPermissionName(e.target.value)}
                  placeholder="Enter permission name"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Actions</label>
                <div className="border rounded-md p-3 max-h-80 overflow-y-auto">
                  <div className="grid grid-cols-1 gap-2">
                    {(() => {
                      // Get all unique actions from all permissions
                      const allActions = permissions.flatMap(p => p.actions)
                      const uniqueActions = Array.from(
                        new Map(allActions.map(action => [action.id, action])).values()
                      )
                      return uniqueActions.map((action) => (
                        <div key={action.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-action-${action.id}`}
                            checked={selectedActionIds.includes(action.id)}
                            onCheckedChange={() => handleActionToggle(action.id)}
                          />
                          <label
                            htmlFor={`edit-action-${action.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {action.description}
                          </label>
                        </div>
                      ))
                    })()}
                  </div>
                </div>
                {selectedActionIds.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {selectedActionIds.length} action{selectedActionIds.length !== 1 ? 's' : ''} selected
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdatePermission}
                disabled={!newPermissionName.trim() || selectedActionIds.length === 0 || updatePermissionMutation.isPending}
              >
                {updatePermissionMutation.isPending ? 'Updating...' : 'Update Permission'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Permission Deletion</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-1">Warning</h4>
                    <p className="text-red-700 text-sm">
                      Are you sure you want to delete the permission "{deletingPermission?.permissionName}"? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deletePermissionMutation.isPending}
              >
                {deletePermissionMutation.isPending ? 'Deleting...' : 'Delete Permission'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Permissions List */}
      <Card className="">
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6 ">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPermissions.map((permission) => (
              <div key={permission.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{permission.permissionName}</h3>
                      <p className="text-sm text-muted-foreground">{permission.actions.length} actions</p>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-sm text-muted-foreground">Actions:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {permission.actions.map((action) => (
                      <Badge key={action.id} variant="outline" className="text-xs">
                        {action.description}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <Button variant="outline" size="sm"
                  onClick={() => navigate({ to: `/admin/permissions/${permission.id}` })}>
                    View Details
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPermission(permission)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeletePermission(permission)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPermissions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No permissions found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}