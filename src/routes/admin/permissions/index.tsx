import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Search,
  Filter,
  Shield,
  UserCheck,
  BookOpen,
  Plus,
  AlertTriangle
} from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { groupedPermissions, permissionGroups } from '@/mock-data/permissions'

interface PermissionGroup {
  id: string
  name: string
  description: string
  status: 'Active' | 'Inactive'
  createdAt: string
  userCount: number
  permissions: string[]
}

export const Route = createFileRoute('/admin/permissions/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [deletingGroup, setDeletingGroup] = useState<PermissionGroup | null>(null)
  const [editingGroup, setEditingGroup] = useState<PermissionGroup | null>(null)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDescription, setNewGroupDescription] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [expandedRoles, setExpandedRoles] = useState<string[]>([])

  const filteredPermissionGroups = permissionGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || group.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'default',
      'Inactive': 'secondary',
      'Suspended': 'outline'
    } as const
    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>
  }

  const handleCreatePermissionGroup = () => {
    if (newGroupName.trim() && selectedPermissions.length > 0) {
      const newGroup = {
        id: Date.now().toString(),
        name: newGroupName,
        description: newGroupDescription,
        status: 'Active',
        createdAt: new Date().toISOString().split('T')[0],
        userCount: 0,
        permissions: selectedPermissions
      }
      // In a real app, this would be an API call
      permissionGroups.push(newGroup)

      // Reset form
      resetForm()
      setIsCreateModalOpen(false)
    }
  }

  const handleEditPermissionGroup = (group: PermissionGroup) => {
    setEditingGroup(group)
    setNewGroupName(group.name)
    setNewGroupDescription(group.description)
    setSelectedPermissions([...group.permissions])
    setExpandedRoles(Object.keys(groupedPermissions))
    setIsEditModalOpen(true)
  }

  const handleDeletePermissionGroup = (group: PermissionGroup) => {
    setDeletingGroup(group)
    setIsConfirmDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (deletingGroup) {
      // In a real app, this would call an API to delete the group
      const groupIndex = permissionGroups.findIndex(g => g.id === deletingGroup.id)
      if (groupIndex !== -1) {
        permissionGroups.splice(groupIndex, 1)
      }
      alert(`Permission group "${deletingGroup.name}" has been successfully deleted!`)
      setDeletingGroup(null)
      setIsConfirmDeleteOpen(false)
    }
  }

  const resetForm = () => {
    setEditingGroup(null)
    setNewGroupName('')
    setNewGroupDescription('')
    setSelectedPermissions([])
    setExpandedRoles([])
  }

  const handleUpdatePermissionGroup = () => {
    if (editingGroup && newGroupName.trim() && selectedPermissions.length > 0) {
      // In a real app, this would be an API call
      const groupIndex = permissionGroups.findIndex(g => g.id === editingGroup.id)
      if (groupIndex !== -1) {
        permissionGroups[groupIndex] = {
          ...permissionGroups[groupIndex],
          name: newGroupName,
          description: newGroupDescription,
          permissions: selectedPermissions
        }
      }

      // Reset form
      resetForm()
      setIsEditModalOpen(false)
    }
  }

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    )
  }

  

  const handleAccordionChange = (value: string[]) => {
    setExpandedRoles(value)
  }

  // Auto-expand all roles when modal opens
  useEffect(() => {
    if (isCreateModalOpen || isEditModalOpen) {
      setExpandedRoles(Object.keys(groupedPermissions))
    }
  }, [isCreateModalOpen, isEditModalOpen])


  const activeGroups = permissionGroups.filter(g => g.status === 'Active').length
  const totalUsers = permissionGroups.reduce((sum, g) => sum + g.userCount, 0)

  return (
    <div className="p-6 space-y-6 w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Permission Group Management</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Permission Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Permission Group</DialogTitle>
              <DialogDescription>
                Create a new permission group and assign permissions to it.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Group Name
                </label>
                <Input
                  id="name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter group name"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="Enter group description"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Permissions by Role</label>
                <div className="border rounded-md p-3 max-h-80 overflow-y-auto">
                  <Accordion
                    type="multiple"
                    value={expandedRoles}
                    onValueChange={handleAccordionChange}
                    className="space-y-2"
                  >
                    {Object.entries(groupedPermissions).map(([role, permissions]) => (
                      <AccordionItem key={role} value={role} className="border rounded-md px-3">
                        <AccordionTrigger className="hover:no-underline py-3">
                          <div className="flex items-center space-x-2 flex-1">
                            {/* <Checkbox
                              checked={isRoleFullySelected(role)}
                              onCheckedChange={() => handleRoleToggle(role)}
                              onClick={(e) => e.stopPropagation()}
                            /> */}
                            <span className="font-medium">{role}</span>
                            {/* <Badge variant="outline" className="ml-2">
                              {permissions.length} permissions
                            </Badge> */}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-3">
                          <div className="grid grid-cols-1 gap-2 pl-6">
                            {permissions.map((permission) => (
                              <div key={permission} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${role}-${permission}`}
                                  checked={selectedPermissions.includes(permission)}
                                  onCheckedChange={() => handlePermissionToggle(permission)}
                                />
                                <label
                                  htmlFor={`${role}-${permission}`}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {permission}
                                </label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
                {selectedPermissions.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {selectedPermissions.length} permission{selectedPermissions.length !== 1 ? 's' : ''} selected
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreatePermissionGroup}
                disabled={!newGroupName.trim() || selectedPermissions.length === 0}
              >
                Create Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Permission Group Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Permission Group</DialogTitle>
              <DialogDescription>
                Update the permission group details and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Group Name
                </label>
                <Input
                  id="edit-name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter group name"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="edit-description"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="Enter group description"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Permissions by Role</label>
                <div className="border rounded-md p-3 max-h-80 overflow-y-auto">
                  <Accordion
                    type="multiple"
                    value={expandedRoles}
                    onValueChange={handleAccordionChange}
                    className="space-y-2"
                  >
                    {Object.entries(groupedPermissions).map(([role, permissions]) => (
                      <AccordionItem key={role} value={role} className="border rounded-md px-3">
                        <AccordionTrigger className="hover:no-underline py-3">
                          <div className="flex items-center space-x-2 flex-1">
                            {/* <Checkbox
                              checked={isRoleFullySelected(role)}
                              onCheckedChange={() => handleRoleToggle(role)}
                              onClick={(e) => e.stopPropagation()}
                            /> */}
                            <span className="font-medium">{role}</span>
                            {/* <Badge variant="outline" className="ml-2">
                              {permissions.length} permissions
                            </Badge> */}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-3">
                          <div className="grid grid-cols-1 gap-2 pl-6">
                            {permissions.map((permission) => (
                              <div key={permission} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`edit-${role}-${permission}`}
                                  checked={selectedPermissions.includes(permission)}
                                  onCheckedChange={() => handlePermissionToggle(permission)}
                                />
                                <label
                                  htmlFor={`edit-${role}-${permission}`}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {permission}
                                </label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
                {selectedPermissions.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {selectedPermissions.length} permission{selectedPermissions.length !== 1 ? 's' : ''} selected
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdatePermissionGroup}
                disabled={!newGroupName.trim() || selectedPermissions.length === 0}
              >
                Update Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{activeGroups}</div>
                <p className="text-sm text-muted-foreground">Active Permission Groups</p>
              </div>
              <Shield className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
              <UserCheck className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{permissionGroups.length}</div>
                <p className="text-sm text-muted-foreground">Permission Groups</p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permission Groups List */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Groups</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search permission groups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Status: {statusFilter === 'all' ? 'All' : statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('active')}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>Inactive</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('suspended')}>Suspended</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-4">
              {filteredPermissionGroups.map((group) => (
                <div key={group.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">{group.description}</p>
                      </div>
                    </div>
                    {getStatusBadge(group.status)}
                  </div>

                  <div className="mb-3">
                    <span className="text-sm text-muted-foreground">Permissions:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {group.permissions.map((permission, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Users:</span>
                      <span className="ml-2 font-medium">{group.userCount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <span className="ml-2">{group.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="text-sm text-muted-foreground">
                      {group.permissions.length} permissions assigned
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPermissionGroup(group as PermissionGroup)}
                      >
                        Edit
                      </Button>
                      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeletePermissionGroup(group as PermissionGroup)}
                          >
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Confirm Group Deletion</DialogTitle>
                      
                          </DialogHeader>
                          <div className="grid gap-4 py-2">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                                <div>
                                  <h4 className="font-semibold text-red-800 mb-1">Warning</h4>
                                  <p className="text-red-700 text-sm">
                                  Are you sure you want to delete the permission group "{deletingGroup?.name}"? This action cannot be undone.
                                  
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>
                              Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleConfirmDelete}>
                              Delete Group
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          {filteredPermissionGroups.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No permission groups found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
