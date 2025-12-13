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
import {
  Search,
  Filter,
  Shield,
  Mail,
  Loader2
} from 'lucide-react'
import { useUsers } from '@/hooks/queries/user-hooks'
import { UserStatus, UserRole } from '@/types/db/user'
import { useState, useMemo } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const Route = createFileRoute('/admin/users/')({
  component: RouteComponent,
})

const ITEMS_PER_PAGE = 10;

function RouteComponent() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  // Build filter params for API
  const roleFilterMap = {
    'all': undefined,
    'student': 'student',
    'lecturer': 'instructor',
    'mod': 'moderator',
    'admin': 'admin'
  } as const

  const filterParams = useMemo(() => {
    const params: {
      Name?: string;
      Email?: string;
      Role?: string;
      PageSize?: number;
    } = {
      PageSize: ITEMS_PER_PAGE,
    };

    if (searchTerm) {
      // If search term contains @, treat as email, otherwise as name
      if (searchTerm.includes('@')) {
        params.Email = searchTerm;
      } else {
        params.Name = searchTerm;
      }
    }

    if (roleFilter !== 'all') {
      params.Role = roleFilterMap[roleFilter as keyof typeof roleFilterMap];
    }

    return params;
  }, [searchTerm, roleFilter]);

  // API data with infinite query
  const {
    data,
    isLoading,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUsers(filterParams);

  // Flatten the infinite query data
  const users = useMemo(() => {
    return data?.pages.flatMap(page => page.data || []) || [];
  }, [data]);

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

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button>
          <Shield className="w-4 h-4 mr-2" />
          Add New User
        </Button>
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
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No users found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
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

          {error && (
            <div className="text-center py-8 text-red-600">
              Error loading users: {error.message}
            </div>
          )}

          {/* Load More Button */}
          {hasNextPage && !isLoading && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={() => fetchNextPage()}
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