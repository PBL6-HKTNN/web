import { CourseTableFilters } from "./filter-control";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, Loader2, Star, Eye } from "lucide-react";
import { useCourseTable } from "./hook";
import type { Course } from "@/types/db/course";

const ITEMS_PER_PAGE = 12;

interface CourseTableProps {
  onCourseClick?: (course: Course) => void;
}

export function CourseTable({ onCourseClick }: CourseTableProps) {
  const {
    courses,
    isLoading,
    error,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    filters,
    handleFiltersChange,
    handleLoadMore,
  } = useCourseTable();

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableBody>
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-12 h-12 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }

    if (error) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={7}>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load courses. Please try again later.
                </AlertDescription>
              </Alert>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    if (!courses || courses.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={7}>
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <h3 className="text-lg font-medium mb-2">No courses found</h3>
                  <p>Try adjusting your filters or search terms.</p>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
      <TableBody>
        {courses.map((course) => (
          <TableRow
            key={course.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onCourseClick?.(course)}
          >
            <TableCell>
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={course.thumbnail || undefined} alt={course.title} />
                  <AvatarFallback>
                    {course.title.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{course.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Instructor ID: {course.instructorId}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">Category ID: {course.categoryId}</Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  course.level === 0 ? 'default' :
                  course.level === 1 ? 'secondary' : 'destructive'
                }
              >
                {course.level === 0 ? 'Beginner' : course.level === 1 ? 'Intermediate' : 'Advanced'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">
                  {course.averageRating.toFixed(1)} ({course.numberOfReviews})
                </span>
              </div>
            </TableCell>
            <TableCell>
              <span className="font-medium">${course.price}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground">
                {course.numberOfModules} modules
              </span>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCourseClick?.(course);
                }}
                className="h-8 w-8 p-0"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}

        {/* Load More Button */}
        {hasNextPage && (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">
              <Button
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
                variant="outline"
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
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    );
  };

  return (
    <div className="space-y-6">
      <CourseTableFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalResults={courses?.length || 0}
      />

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          {renderTableContent()}
        </Table>
      </div>

      {/* Loading overlay for filter changes */}
      {isFetching && !isLoading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading courses...</p>
          </div>
        </div>
      )}
    </div>
  );
}
