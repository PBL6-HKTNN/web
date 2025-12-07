import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, ArrowLeft, Mail, Shield, Users } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useUsersByPermission, usePermission } from '@/hooks/queries/permission-hooks'
import { UserStatus, UserRole } from '@/types/db/user'

export const Route = createFileRoute('/admin/permissions/$permissionId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { permissionId } = Route.useParams()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  // Fetch permission details
  const { data: permission, isLoading: permissionLoading } = usePermission(permissionId)
  
  // Fetch users by permission
  const { data: users = [], isLoading: usersLoading } = useUsersByPermission(permissionId)

  // Filter users based on search and role
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRole = roleFilter === 'all' || 
        (roleFilter === 'student' && user.role === UserRole.STUDENT) ||
        (roleFilter === 'lecturer' && user.role === UserRole.INSTRUCTOR) ||
        (roleFilter === 'mod' && user.role === UserRole.MODERATOR) ||
        (roleFilter === 'admin' && user.role === UserRole.ADMIN)
      
      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, roleFilter])

  const getStatusBadge = (status: UserStatus) => {
    const statusLabels = {
      [UserStatus.ACTIVE]: 'Active',
      [UserStatus.INACTIVE]: 'Inactive',
      [UserStatus.PENDING]: 'Pending'
    } as const

    const statusColors = {
      [UserStatus.ACTIVE]: 'default',
      [UserStatus.INACTIVE]: 'outline',
      [UserStatus.PENDING]: 'secondary'
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
      [UserRole.INSTRUCTOR]: 'secondary',
      [UserRole.MODERATOR]: 'outline',
      [UserRole.ADMIN]: 'default'
    } as const

    return <Badge variant={roleColors[role] || 'secondary'}>{roleLabels[role] || 'Unknown'}</Badge>
  }

  if (permissionLoading || usersLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">Loading...</h2>
        </div>
      </div>
    )
  }

  // Only show error for actual errors, not for "no users found" case
  // The service already handles "no users found" case and returns empty array
  // if (error) {
  //   const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
  //   return (
  //     <div className="p-6">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
  //         <p className="text-muted-foreground">Failed to load users: {errorMessage}</p>
  //         <Button onClick={() => navigate({ to: '/admin/permissions' })} className="mt-4">
  //           <ArrowLeft className="w-4 h-4 mr-2" />
  //           Back to Permissions
  //         </Button>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/admin/permissions' })}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Users with Permission</h1>
            {permission && (
              <div className="flex items-center gap-2 mt-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-semibold text-muted-foreground">
                  {permission.permissionName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {users.filter(u => u.status === UserStatus.ACTIVE).length}
            </div>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === UserRole.INSTRUCTOR).length}
            </div>
            <p className="text-sm text-muted-foreground">Lecturers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === UserRole.MODERATOR).length}
            </div>
            <p className="text-sm text-muted-foreground">Mods</p>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Users List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={roleFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRoleFilter('all')}
              >
                All
              </Button>
              <Button
                variant={roleFilter === 'student' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRoleFilter('student')}
              >
                Students
              </Button>
              <Button
                variant={roleFilter === 'lecturer' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRoleFilter('lecturer')}
              >
                Lecturers
              </Button>
              <Button
                variant={roleFilter === 'mod' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRoleFilter('mod')}
              >
                Mods
              </Button>
              <Button
                variant={roleFilter === 'admin' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRoleFilter('admin')}
              >
                Admins
              </Button>
            </div>
          </div>

          {/* Users Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Courses</TableHead>
                  <TableHead>Email Verified</TableHead>
                  <TableHead className="w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {users.length === 0 
                        ? 'No users found for this permission.'
                        : 'No users found matching your criteria.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-sm">{user.totalCourses}</TableCell>
                      <TableCell>
                        <Badge variant={user.emailVerified ? "default" : "outline"}>
                          {user.emailVerified ? "Verified" : "Not Verified"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate({ to: `/admin/users/${user.id}` })}
                        >
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
