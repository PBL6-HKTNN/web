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
  BookOpen,
  Users,
  CheckCircle,
  Clock,
  Star,
  Loader2
} from 'lucide-react'
import { CourseStatus } from '@/types/db/course'
import type { Course } from '@/types/db/course'
import { useCourseListing } from './hooks'

interface CourseListingProps {
  courses: Course[]
  isLoading?: boolean
  error?: Error | null
  isFetching?: boolean
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  onLoadMore?: () => void
}

export function CourseListing({
  courses,
  isLoading,
  error,
  isFetching,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: CourseListingProps) {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredCourses,
    getStatusBadge,
    stats,
  } = useCourseListing(courses)

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Course Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalCourses}</div>
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
                <div className="text-2xl font-bold">{isLoading ? '...' : stats.publishedCourses}</div>
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
                <div className="text-2xl font-bold">{isLoading ? '...' : stats.draftCourses}</div>
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
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === CourseStatus.PUBLISHED ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(CourseStatus.PUBLISHED)}
              >
                Published
              </Button>
              <Button
                variant={statusFilter === CourseStatus.DRAFT ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(CourseStatus.DRAFT)}
              >
                Draft
              </Button>
              <Button
                variant={statusFilter === CourseStatus.ARCHIVED ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(CourseStatus.ARCHIVED)}
              >
                Archived
              </Button>
            </div>
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
                  filteredCourses.map((course) => {
                    const statusBadge = getStatusBadge(course.status)
                    return (
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
                        <TableCell>
                          <Badge variant={statusBadge.variant} className="flex items-center gap-1">
                            {statusBadge.icon}
                            {statusBadge.label}
                          </Badge>
                        </TableCell>
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
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

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
