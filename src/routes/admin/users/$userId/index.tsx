import { createFileRoute, useParams, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import {
  ArrowLeft,
  Mail,
  Calendar,
  Clock,
  UserCheck,
  UserX,
  AlertTriangle
} from 'lucide-react'

export const Route = createFileRoute('/admin/users/$userId/')({
  component: RouteComponent,
})

import { usersData } from '@/mock-data/admin-users'

interface EnrolledCourse {
  id: string
  title: string
  progress: number
  enrolledDate: string
  status: 'In Progress' | 'Completed' | 'Dropped'
}

interface CreatedCourse {
  id: string
  title: string
  status: 'Published' | 'Under Review' | 'Rejected' | 'Draft'
  students: number
  rating: number
  revenue: number
  createdDate: string
}

interface ModeratedCourse {
  id: string
  title: string
  status: 'Published' | 'Under Review' | 'Rejected'
  instructor: string
  submittedDate: string
  reviewedDate?: string
}

interface UserDetail {
  id: string
  name: string
  email: string
  role: 'Student' | 'Lecturer' | 'Mod' | 'Admin'
  status: 'Active' | 'Suspended' | 'Inactive'
  joinDate: string
  lastLogin: string
  avatar: string
  bio: string
  location: string
  coursesEnrolled: number
  coursesCompleted: number
  totalSpent: number
  suspensionReason: string
  averageRating: number
  specialization: string
  coursesCreated: number
  totalEarnings: number
  studentsTaught: number
  coursesReviewed: number
  enrolledCourses?: EnrolledCourse[]
  createdCourses?: CreatedCourse[]
  coursesBeingModerated?: ModeratedCourse[]
  recentActivity: {
    id: number
    action: string
    details: string
    time: string
    type: string
  }[]
}

function RouteComponent() {
  const { userId } = useParams({ from: '/admin/users/$userId/' })
  const navigate = useNavigate()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isConfirmSuspendOpen, setIsConfirmSuspendOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  })

  const user: UserDetail = usersData[userId as keyof typeof usersData] as UserDetail

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">User Not Found</h2>
          <p className="text-muted-foreground">The requested user could not be found.</p>
          <Button onClick={() => navigate({ to: '/admin/users' })} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'default',
      'Suspended': 'destructive',
      'Inactive': 'secondary'
    } as const
    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>
  }

  const getRoleBadge = (role: string) => {
    const variants = {
      'Student': 'secondary',
      'Lecturer': 'default',
      'Mod': 'outline'
    } as const
    return <Badge variant={variants[role as keyof typeof variants] || 'secondary'}>{role}</Badge>
  }

  const handleSuspendUser = () => {
    // In a real app, this would call an API to suspend the user
    alert(`User ${user.name} has been successfully suspended!`)
    setIsConfirmSuspendOpen(false)
    // Optionally refresh the page or update user status
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
                setEditForm({
                  email: user.email,
                  password: '',
                  confirmPassword: '',
                  role: user.role
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
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                    className="col-span-3"
                    placeholder="Enter new password"
                  
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
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Lecturer">Lecturer</SelectItem>
                      <SelectItem value="Mod">Moderator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  // Handle save logic here
                  console.log('Saving user data:', editForm)
                  setIsEditModalOpen(false)
                  // Show success message
                }}>
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isConfirmSuspendOpen} onOpenChange={setIsConfirmSuspendOpen}>
            <DialogTrigger asChild>
              {user.status === 'Active' ? (
                <Button variant="outline">
                  <UserX className="w-4 h-4 mr-2" />
                  Suspend User
                </Button>
              ) : (
                <Button variant="outline">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Activate User
                </Button>
              )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirm User Suspension</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-800 mb-1">Warning</h4>
                      <p className="text-red-700 text-sm">
                      Are you sure you want to suspend {user.name}? This action will restrict their access to the platform.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsConfirmSuspendOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleSuspendUser}>
                  <UserX className="w-4 h-4 mr-2" />
                  Confirm Suspension
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
                  src={user.avatar}
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
                      <Calendar className="w-4 h-4" />
                      Joined {user.joinDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Last login {user.lastLogin}
                    </div>
                  </div>
                  {user.bio && (
                    <p className="text-muted-foreground mb-3">{user.bio}</p>
                  )}
                  {user.suspensionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-red-800">Suspension Reason</h4>
                          <p className="text-red-700 text-sm">{user.suspensionReason}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {user.role === 'Student' ? (
              <>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{user.coursesEnrolled || 0}</div>
                    <p className="text-sm text-muted-foreground">Courses Enrolled</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{user.coursesCompleted || 0}</div>
                    <p className="text-sm text-muted-foreground">Courses Completed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">${user.totalSpent || 0}</div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{user.averageRating || 0}/5.0</div>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                  </CardContent>
                </Card>
              </>
            ) : user.role === 'Lecturer' ? (
              <>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{user.coursesCreated || 0}</div>
                    <p className="text-sm text-muted-foreground">Courses Created</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">${user.totalEarnings || 0}</div>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{user.studentsTaught || 0}</div>
                    <p className="text-sm text-muted-foreground">Students Taught</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{user.averageRating || 0}/5.0</div>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{user.coursesReviewed || 0}</div>
                    <p className="text-sm text-muted-foreground">Courses Reviewed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{user.coursesBeingModerated?.length || 0}</div>
                    <p className="text-sm text-muted-foreground">Courses Moderating</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{user.specialization || 'N/A'}</div>
                    <p className="text-sm text-muted-foreground">Specialization</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{user.averageRating || 0}/5.0</div>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Courses Section */}
        <div className="space-y-6">
          {user.role === 'Student' ? (
            /* Student: Only Enrolled Courses */
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.enrolledCourses?.map((course) => (
                    <div key={course.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{course.title}</h3>
                        <Badge variant={course.status === 'Completed' ? 'default' : 'secondary'}>
                          {course.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Progress: {course.progress}%</span>
                        <span>Enrolled: {course.enrolledDate}</span>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-muted-foreground">
                      No enrolled courses found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Lecturer/Mod: Use nested tabs for courses */
            <Tabs defaultValue="enrolled" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
                <TabsTrigger value={user.role === 'Lecturer' ? 'created' : 'managed'}>
                  {user.role === 'Lecturer' ? 'Created Courses' : 'Managed Courses'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="enrolled" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Enrolled Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {user.enrolledCourses?.map((course) => (
                        <div key={course.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{course.title}</h3>
                            <Badge variant={course.status === 'Completed' ? 'default' : 'secondary'}>
                              {course.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Progress: {course.progress}%</span>
                            <span>Enrolled: {course.enrolledDate}</span>
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-8 text-muted-foreground">
                          No enrolled courses found.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value={user.role === 'Lecturer' ? 'created' : 'managed'} className="space-y-6">
                {user.role === 'Lecturer' ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Created Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {user.createdCourses?.map((course) => (
                          <div key={course.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{course.title}</h3>
                              <Badge variant={course.status === 'Published' ? 'default' : 'secondary'}>
                                {course.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{course.students} students</span>
                              <span>Rating: {course.rating}/5.0</span>
                              <span>Revenue: ${course.revenue}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Courses Being Managed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {user.coursesBeingModerated?.map((course) => (
                          <div key={course.id} className="border rounded-lg p-4">
                            <div className="mb-2">
                              <h3 className="font-semibold">{course.title}</h3>
                              <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
    </div>
  )
}
