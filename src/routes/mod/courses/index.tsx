import { createFileRoute } from '@tanstack/react-router'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Search,
  Filter,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MoreHorizontal
} from 'lucide-react'
import { modCourses, courseHideRequests } from '@/mock-data/mod-courses'
import { useState } from 'react'

export const Route = createFileRoute('/mod/courses/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock data - sẽ thay thế bằng API calls
  const courses = modCourses

  // Mock data for course hide requests
  const hideRequests = courseHideRequests


  const getStatusBadge = (status: string) => {
    const variants = {
      'Under Review': 'secondary',
      'Published': 'default',
      'Disabled': 'destructive'
    } as const
    const icons = {
      'Under Review': <Clock className="w-3 h-3" />,
      'Published': <CheckCircle className="w-3 h-3" />,
      'Disabled': <XCircle className="w-3 h-3" />
    }
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'} className="flex items-center gap-1">
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    )
  }

  const getRequestStatusBadge = (status: string) => {
    const variants = {
      'Pending': 'secondary',
      'Approved': 'default',
      'Rejected': 'default'
    } as const
    const icons = {
      'Pending': <Clock className="w-3 h-3" />,
      'Approved': <CheckCircle className="w-3 h-3" />,
      'Rejected': <XCircle className="w-3 h-3" />
    }
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'} className="flex items-center gap-1">
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    )
  }


  const pendingCourses = courses.filter(c => c.status === 'Under Review').length
  const publishedCourses = courses.filter(c => c.status === 'Published').length
  const disabledCourses = courses.filter(c => c.status === 'Disabled').length
  const pendingHideRequests = hideRequests.filter(r => r.status === 'Pending').length

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Course Management</h1>
        {/* <Button>
          <BookOpen className="w-4 h-4 mr-2" />
          Review Queue
        </Button> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{courses.length}</div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">{pendingCourses}</div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{publishedCourses}</div>
                <p className="text-sm text-muted-foreground">Published Courses</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{disabledCourses}</div>
                <p className="text-sm text-muted-foreground">Disabled Courses</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{pendingHideRequests}</div>
                <p className="text-sm text-muted-foreground">Hide Requests</p>
              </div>
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Courses Alert */}
      {/* {pendingCourses > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-800">Courses Awaiting Review</h3>
                <p className="text-sm text-orange-700">
                  {pendingCourses} course{pendingCourses > 1 ? 's' : ''} need{pendingCourses === 1 ? 's' : ''} your review
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* Courses Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            All Courses
            <Badge variant="secondary" className="ml-2">
              {courses.filter(c => c.status !== 'Under Review').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Courses Pending Approval
            <Badge variant="secondary" className="ml-2">
              {pendingCourses}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="hide-requests">
            Course Hide Requests
            <Badge variant="secondary" className="ml-2">
              {pendingHideRequests}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search courses..."
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
                      Status: {statusFilter === 'all' ? 'All' : statusFilter === 'underreview' ? 'Under Review' : statusFilter === 'banned' ? 'Disabled' : statusFilter}
                    </Button>
                  </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('published')}>Published</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('banned')}>Disabled</DropdownMenuItem>
              </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Title</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="w-[150px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.filter(course => {
                      // Exclude "Under Review" courses from All Courses table
                      if (course.status === 'Under Review') return false

                      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                           course.category.toLowerCase().includes(searchTerm.toLowerCase())
                      const matchesStatus = statusFilter === 'all' ||
                                        (statusFilter === 'banned' && course.status === 'Disabled') ||
                                        course.status.toLowerCase().replace(' ', '') === statusFilter
                      return matchesSearch && matchesStatus
                    }).map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{course.title}</div>
                            <div className="text-sm text-muted-foreground">{course.category} • {course.level}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{course.instructor}</div>
                            <div className="text-sm text-muted-foreground">{course.instructorEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(course.status)}</TableCell>
                        <TableCell>${course.price}</TableCell>
                        <TableCell>{course.students}</TableCell>
                        <TableCell className="text-sm">{course.submittedDate}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="w-4 h-4 mr-2" />
                                Disable
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Courses Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Title</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="w-[150px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.filter(course => course.status === 'Under Review').map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{course.title}</div>
                            <div className="text-sm text-muted-foreground">{course.category} • {course.level}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{course.instructor}</div>
                            <div className="text-sm text-muted-foreground">{course.instructorEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>${course.price}</TableCell>
                        <TableCell className="text-sm">{course.submittedDate}</TableCell>
                        <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="w-4 h-4 mr-2" />
                                Disable
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {courses.filter(course => course.status === 'Under Review').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No courses pending approval.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hide-requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Hide Requests</CardTitle>
              <p className="text-sm text-muted-foreground">
                Instructor requests to hide their courses from public view
              </p>
            </CardHeader>
            <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Title</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hideRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.courseTitle}</div>
                        <div className="text-sm text-muted-foreground">{request.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.instructor}</div>
                        <div className="text-sm text-muted-foreground">{request.instructorEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{request.requestDate}</TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="text-sm truncate" title={request.reason}>
                        {request.reason}
                      </div>
                    </TableCell>
                    <TableCell>{getRequestStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {request.status === 'Pending' && (
                            <>
                              <DropdownMenuItem className="text-green-600">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {hideRequests.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No course hide requests at this time.
            </div>
          )}
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}