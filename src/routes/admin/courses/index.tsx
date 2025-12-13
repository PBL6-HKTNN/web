import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useGetCourses } from '@/hooks/queries/course/course-hooks'
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
  Search,
  Filter,
  BookOpen,
  Users,
  CheckCircle,
  Clock,
  Star,
  Loader2
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { CourseStatus } from '@/types/db/course'
import type { GetCoursesFilterReq } from '@/types/db/course'

export const Route = createFileRoute('/admin/courses/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<CourseStatus | 'all'>('all')

  // Build filter params for API
  const filterParams: GetCoursesFilterReq = useMemo(() => {
    const params: GetCoursesFilterReq = {
      Page: 1,
      PageSize: 100, // Get more courses for admin view
    }

    if (statusFilter !== 'all') {
      // Note: API might not support status filter directly, we'll filter client-side
    }

    return params
  }, [statusFilter])

  // Fetch courses from API
  const {
    data,
    isLoading,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCourses(filterParams)

  // Flatten the infinite query data
  const courses = useMemo(() => {
    return data?.pages.flatMap(page => page.data || []) || []
  }, [data])

  // Filter courses client-side based on search and status
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = 
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.language?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || course.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [courses, searchTerm, statusFilter])

  const getStatusBadge = (status: CourseStatus) => {
    const statusLabels = {
      [CourseStatus.DRAFT]: 'Draft',
      [CourseStatus.PUBLISHED]: 'Published',
      [CourseStatus.ARCHIVED]: 'Archived',
    } as const

    const variants = {
      [CourseStatus.DRAFT]: 'outline',
      [CourseStatus.PUBLISHED]: 'default',
      [CourseStatus.ARCHIVED]: 'secondary',
    } as const

    const icons = {
      [CourseStatus.DRAFT]: <Clock className="w-3 h-3" />,
      [CourseStatus.PUBLISHED]: <CheckCircle className="w-3 h-3" />,
      [CourseStatus.ARCHIVED]: <Clock className="w-3 h-3" />,
    }

    return (
      <Badge variant={variants[status] || 'secondary'} className="flex items-center gap-1">
        {icons[status]}
        {statusLabels[status] || 'Unknown'}
      </Badge>
    )
  }

  const publishedCourses = courses.filter(c => c.status === CourseStatus.PUBLISHED).length
  const totalCourses = courses.length

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Course Management</h1>
        {/* <Button>
          <BookOpen className="w-4 h-4 mr-2" />
          Add New Course
        </Button> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{isLoading ? '...' : totalCourses}</div>
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
                <div className="text-2xl font-bold">{isLoading ? '...' : publishedCourses}</div>
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
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : courses.filter(c => c.status === CourseStatus.DRAFT).length}
                </div>
                <p className="text-sm text-muted-foreground">Draft Courses</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Course Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search courses by title, instructor, or category..."
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
                  Status: {statusFilter === 'all' 
                    ? 'All' 
                    : statusFilter === CourseStatus.PUBLISHED 
                    ? 'Published' 
                    : statusFilter === CourseStatus.DRAFT 
                    ? 'Draft' 
                    : 'Archived'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter(CourseStatus.PUBLISHED)}>Published</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter(CourseStatus.DRAFT)}>Draft</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter(CourseStatus.ARCHIVED)}>Archived</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Courses Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Instructor ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Modules</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Reviews</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading courses...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-red-600">
                      Error loading courses: {error instanceof Error ? error.message : 'Unknown error'}
                    </TableCell>
                  </TableRow>
                ) : filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No courses found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{course.title || 'Untitled'}</div>
                          {course.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {course.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-mono text-muted-foreground">
                        {course.instructorId.substring(0, 8)}...
                      </TableCell>
                      <TableCell>{getStatusBadge(course.status)}</TableCell>
                      <TableCell>${course.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {course.level === 0 ? 'Beginner' : course.level === 1 ? 'Intermediate' : 'Advanced'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm uppercase">{course.language}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{course.numberOfModules}</Badge>
                      </TableCell>
                      <TableCell>
                        {course.averageRating > 0 ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {course.averageRating.toFixed(1)}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {course.numberOfReviews}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

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
                  'Load More Courses'
                )}
              </Button>
            </div>
          )}

          {/* Loading overlay for filter changes */}
          {isFetching && !isLoading && (
            <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading courses...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}