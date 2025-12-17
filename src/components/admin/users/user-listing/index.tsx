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
import {
  Search,
  Filter,
  Mail,
  Loader2,
  Plus
} from 'lucide-react'
import { UserStatus, UserRole } from '@/types/db/user'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import type { User } from '@/types/db/user'
import { useNavigate } from '@tanstack/react-router'
import { useUserListing } from './hooks'

interface UserListingProps {
  users: User[]
  isLoading?: boolean
  error?: Error | null
  isFetching?: boolean
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  onLoadMore?: () => void
}

export function UserListing({
  users,
  isLoading,
  error,
  isFetching,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: UserListingProps) {
  const navigate = useNavigate()
  const {
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    filteredUsers,
    getStatusBadge,
    getRoleBadge,
    isCreateModalOpen,
    setIsCreateModalOpen,
    createForm,
    setCreateForm,
    handleCreateUser,
    resetCreateForm,
    createUserMutation,
  } = useUserListing(users)

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
          setIsCreateModalOpen(open)
          if (!open) {
            resetCreateForm()
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Create a new user account. All fields are required.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="create-email">Email</Label>
                <Input
                  id="create-email"
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create-name">Name</Label>
                <Input
                  id="create-name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter user name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create-password">Password</Label>
                <Input
                  id="create-password"
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create-confirm-password">Confirm Password</Label>
                <Input
                  id="create-confirm-password"
                  type="password"
                  value={createForm.confirmPassword}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm password"
                />
                {createForm.password && createForm.confirmPassword && createForm.password !== createForm.confirmPassword && (
                  <p className="text-sm text-red-600">Passwords do not match</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create-role">Role</Label>
                <Select value={createForm.role} onValueChange={(value) => setCreateForm(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Lecturer">Lecturer</SelectItem>
                    <SelectItem value="Moderator">Moderator</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsCreateModalOpen(false)
                resetCreateForm()
              }}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateUser}
                disabled={
                  !createForm.email ||
                  !createForm.password ||
                  !createForm.name ||
                  !createForm.role ||
                  createForm.password !== createForm.confirmPassword ||
                  createUserMutation.isPending
                }
              >
                {createUserMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {createUserMutation.isPending ? 'Creating...' : 'Create User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{isLoading ? '...' : users.length || 0}</div>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{isLoading ? '...' : users.filter(u => u.status === UserStatus.ACTIVE).length || 0}</div>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{isLoading ? '...' : users.filter(u => u.role === UserRole.INSTRUCTOR).length || 0}</div>
            <p className="text-sm text-muted-foreground">Lecturers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{isLoading ? '...' : users.filter(u => u.role === UserRole.MODERATOR).length || 0}</div>
            <p className="text-sm text-muted-foreground">Mods</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
        </CardHeader>
        <CardContent>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Role: {roleFilter === 'all' ? 'All' : roleFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setRoleFilter('all')}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter('student')}>Students</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter('lecturer')}>Lecturers</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter('mod')}>Mods</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No users found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const statusBadge = getStatusBadge(user.status)
                    const roleBadge = getRoleBadge(user.role)
                    return (
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
                        <TableCell><Badge variant={roleBadge.variant}>{roleBadge.label}</Badge></TableCell>
                        <TableCell><Badge variant={statusBadge.variant}>{statusBadge.label}</Badge></TableCell>
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
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {error && (
            <div className="text-center py-8 text-red-600">
              Error loading users: {error.message}
            </div>
          )}

          {/* Load More Button */}
          {hasNextPage && !isLoading && onLoadMore && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={onLoadMore}
                disabled={isFetchingNextPage}
                variant="outline"
                size="lg"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading more...
                  </>
                ) : (
                  'Load More Users'
                )}
              </Button>
            </div>
          )}

          {/* Loading overlay for filter changes */}
          {isFetching && !isLoading && (
            <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading users...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
