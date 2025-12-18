import { createFileRoute, useParams, useNavigate } from '@tanstack/react-router'
import  { useState, useEffect, useMemo, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ArrowLeft,
  Mail,
  Shield,
  Loader2
} from 'lucide-react'

export const Route = createFileRoute('/admin/users/$userId/')({
  component: RouteComponent,
})

import { useUser, useEditUserByAdmin } from '@/hooks/queries/user-hooks'
import { UserRole, UserStatus } from '@/types/db/user'
import type { UserPermission } from '@/types/db/permission'
import type { Permission } from '@/types/db/permission'
import { usePermissions, useAssignPermissionToUser, useRemoveUserPermission, useUserPermissions } from '@/hooks/queries/permission-hooks'
import { toast } from 'sonner'
import type { EditUserByAdminReq } from '@/types/db/user'


function RouteComponent() {
  const { userId } = useParams({ from: '/admin/users/$userId/' })
  const navigate = useNavigate()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    password: '',
    confirmPassword: '',
    role: '',
    isActive: true
  })
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set())
  const [isSaving, setIsSaving] = useState(false)
  const hasInitializedPermissions = useRef(false)

  const { data: apiResponse, isLoading, error } = useUser(userId)
  const userResponse = apiResponse?.data
  const user = userResponse?.user || null

  const { data: userPermissionsRaw = [], isLoading: permissionsLoading } = useUserPermissions(userId)
  const { data: allPermissionsResponse } = usePermissions()
  const allPermissions = allPermissionsResponse || []

  // Map userPermissionsRaw to include permissionName from allPermissions
  // Use useMemo to prevent recreating array on every render
  const permissions = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return userPermissionsRaw.map((up: any) => {
      const permission = allPermissions.find((p: Permission) => p.id === up.permissionId)
      return {
        ...up,
        permissionName: permission?.permissionName || '',
      } as UserPermission & { permissionId: string }
    })
  }, [userPermissionsRaw, allPermissions])

  // Mutations for permission management
  const assignPermissionMutation = useAssignPermissionToUser()
  const removePermissionMutation = useRemoveUserPermission()
  const editUserMutation = useEditUserByAdmin()

  // Initialize selected permissions when edit modal opens for the first time
  useEffect(() => {
    if (isEditModalOpen && permissions.length > 0 && allPermissions.length > 0 && !hasInitializedPermissions.current) {
      // Use permissionId for comparison, not userPermission id
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const permissionIds = new Set(permissions.map((p: any) => p.permissionId || p.id))
      setSelectedPermissions(permissionIds)
      hasInitializedPermissions.current = true
    } else if (!isEditModalOpen) {
      // Reset when modal closes
      hasInitializedPermissions.current = false
      setSelectedPermissions(new Set())
    }
  }, [isEditModalOpen, permissions, allPermissions])

  // Handle permission checkbox changes (only update local state)
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setSelectedPermissions(prev => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(permissionId)
      } else {
        newSet.delete(permissionId)
      }
      return newSet
    })
  }

  // Calculate permissions to assign and remove
  const getPermissionChanges = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentPermissionIds = new Set(permissions.map((p: any) => p.permissionId || p.id))
    const selectedPermissionIds = selectedPermissions

    const toAssign = Array.from(selectedPermissionIds).filter(id => !currentPermissionIds.has(id))
    const toRemove = Array.from(currentPermissionIds).filter(id => !selectedPermissionIds.has(id))

    return { toAssign, toRemove }
  }

  // Map role string to UserRole enum
  const getRoleFromString = (roleString: string): UserRole => {
    switch (roleString) {
      case 'Student':
        return UserRole.STUDENT
      case 'Lecturer':
        return UserRole.INSTRUCTOR
      case 'Moderator':
      case 'Mod':
        return UserRole.MODERATOR
      case 'Admin':
        return UserRole.ADMIN
      default:
        return UserRole.STUDENT
    }
  }

  const handleSaveChanges = async () => {
    // Validate password if provided
    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsSaving(true)
    try {
      // First, update user information using admin edit API
      const roleValue = getRoleFromString(editForm.role)
      const editUserData: EditUserByAdminReq = {
        id: userId,
        name: editForm.name,
        isActive: editForm.isActive,
        role: roleValue,
      }

      // Only include password if it's provided
      if (editForm.password && editForm.password.trim() !== '') {
        editUserData.password = editForm.password
      }

      await editUserMutation.mutateAsync(editUserData)

      // Then, update permissions
      const { toAssign, toRemove } = getPermissionChanges()
      
      if (toAssign.length > 0 || toRemove.length > 0) {
        // Perform assign operations
        const assignPromises = toAssign.map(permissionId =>
          assignPermissionMutation.mutateAsync({
            userId: userId,
            permissionId: permissionId
          })
        )

        const removePromises = toRemove.map(permissionId => {
          // Find userPermission by permissionId (not by userPermission id)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const userPermission = permissions.find((p: any) => (p.permissionId || p.id) === permissionId)
          // Use userPermission.id (which is UserPermissionGroup ID) for removal
          return userPermission ? removePermissionMutation.mutateAsync(userPermission.id) : Promise.resolve()
        })
        await Promise.all([...assignPromises, ...removePromises])
      }

      setIsEditModalOpen(false)
    } catch (error) {
      console.error('Failed to update user:', error)
      toast.error('Failed to update user')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || permissionsLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">Loading User...</h2>
          <p className="text-muted-foreground">Please wait while we fetch user data.</p>
        </div>
      </div>
    )
  }

  if (error || !apiResponse || !apiResponse.isSuccess || !user) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">User Not Found</h2>
          <p className="text-muted-foreground">
            {error ? `Error loading user: ${error.message}` :
             userResponse?.message || 'The requested user could not be found.'}
          </p>
          <Button onClick={() => navigate({ to: '/admin/users' })} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: UserStatus) => {
    const statusLabels = {
      [UserStatus.ACTIVE]: 'Active',
      [UserStatus.INACTIVE]: 'Inactive',
      [UserStatus.PENDING]: 'Pending'
    } as const

    const statusColors = {
      [UserStatus.ACTIVE]: 'default',
      [UserStatus.INACTIVE]: 'secondary',
      [UserStatus.PENDING]: 'outline'
    } as const

    return <Badge variant={statusColors[status] || 'secondary'}>{statusLabels[status] || 'Unknown'}</Badge>
  }

  const getRoleBadge = (role: UserRole) => {
    const roleLabels = {
      [UserRole.STUDENT]: 'Student',
      [UserRole.INSTRUCTOR]: 'Lecturer',
      [UserRole.MODERATOR]: 'Mod',
      [UserRole.ADMIN]: 'Admin'
    } as const

    const roleColors = {
      [UserRole.STUDENT]: 'secondary',
      [UserRole.INSTRUCTOR]: 'default',
      [UserRole.MODERATOR]: 'outline',
      [UserRole.ADMIN]: 'destructive'
    } as const

    return <Badge variant={roleColors[role] || 'secondary'}>{roleLabels[role] || 'Unknown'}</Badge>
  }


  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate({ to: '/admin/users' })}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </Button>
        <div className="flex gap-2">
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => {
                const roleLabel = user.role === UserRole.STUDENT ? 'Student' :
                                 user.role === UserRole.INSTRUCTOR ? 'Lecturer' :
                                 user.role === UserRole.MODERATOR ? 'Moderator' :
                                 user.role === UserRole.ADMIN ? 'Admin' : 'Student'
                setEditForm({
                  name: user.name,
                  password: '',
                  confirmPassword: '',
                  role: roleLabel,
                  isActive: user.status === UserStatus.ACTIVE
                })
              }}>
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit User Information</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email 
                  </Label>
                  <p className="col-span-3 text-muted-foreground">{user.email}</p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="col-span-3"
                    placeholder="Enter user name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                    className="col-span-3"
                    placeholder="Enter new password (optional)"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="confirmPassword">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={editForm.confirmPassword}
                    onChange={(e) => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="col-span-3"
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select value={editForm.role} onValueChange={(value) => setEditForm(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a role"  />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Lecturer">Lecturer</SelectItem>
                      <SelectItem value="Moderator">Moderator</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isActive" className="text-right">
                    Status
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Checkbox
                      id="isActive"
                      checked={editForm.isActive}
                      onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isActive: checked as boolean }))}
                    />
                    <Label htmlFor="isActive" className="text-sm font-normal cursor-pointer">
                      Active
                    </Label>
                  </div>
                </div>

                {/* Permissions Section */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">
                    Permissions
                  </Label>
                  <div className="col-span-3 space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                    {allPermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`permission-${permission.id}`}
                          checked={selectedPermissions.has(permission.id)}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(permission.id, checked as boolean)
                          }
                          disabled={isSaving}
                        />
                        <Label
                          htmlFor={`permission-${permission.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {permission.permissionName}
                        </Label>
                      </div>
                    ))}
                    {allPermissions.length === 0 && (
                      <p className="text-sm text-muted-foreground">Loading permissions...</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                >
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
    
        </div>
      </div>

      {/* Overview Section */}
      <div className="space-y-6">
          {/* User Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <img
                  src={user.profilePicture || '/placeholder-avatar.png'}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    {getRoleBadge(user.role)}
                    {getStatusBadge(user.status)}
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant={user.emailVerified ? "default" : "outline"}>
                        {user.emailVerified ? "Email Verified" : "Email Not Verified"}
                      </Badge>
                    </div>
                  </div>
                  {user.bio && (
                    <p className="text-muted-foreground mb-3">{user.bio}</p>
                  )}
                  {/* Suspension reason not available in API */}
                  {/* {user.suspensionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-red-800">Suspension Reason</h4>
                          <p className="text-red-700 text-sm">{user.suspensionReason}</p>
                        </div>
                      </div>
                    </div>
                  )} */}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{user.totalCourses}</div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{user.rating ? user.rating.toFixed(1) : 'N/A'}</div>
                <p className="text-sm text-muted-foreground">Rating</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{user.emailVerified ? 'Yes' : 'No'}</div>
                <p className="text-sm text-muted-foreground">Email Verified</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{getRoleBadge(user.role).props.children}</div>
                <p className="text-sm text-muted-foreground">Role</p>
              </CardContent>
            </Card>
          </div>

          {/* Permissions Section */}
          {permissions.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Permissions</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {permissions.map((permission: UserPermission) => (
                    <div
                      key={permission.id}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{permission.permissionName}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Total permissions: {permissions.length}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

    </div>
  )
}
