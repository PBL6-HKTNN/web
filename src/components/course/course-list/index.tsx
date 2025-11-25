import { CourseCard, CourseFilters } from "@/components/course";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import type { GetCoursesFilterReq } from "@/types/db/course";
import type { Course } from "@/types/db/course";

const ITEMS_PER_PAGE = 12;

interface CourseListProps {
  courses: Course[];
  isLoading: boolean;
  error: Error | null;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  filters: GetCoursesFilterReq;
  onFiltersChange: (filters: Partial<GetCoursesFilterReq>) => void;
  onLoadMore: () => void;
}

export function CourseList({
  courses,
  isLoading,
  error,
  isFetching,
  isFetchingNextPage,
  hasNextPage,
  filters,
  onFiltersChange,
  onLoadMore,
}: CourseListProps) {
  const renderCourses = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="aspect-video w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load courses. Please try again later.
          </AlertDescription>
        </Alert>
      );
    }

    if (!courses || courses.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <h3 className="text-lg font-medium mb-2">No courses found</h3>
            <p>Try adjusting your filters or search terms.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <CourseFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        totalResults={courses?.length || 0}
      />

      {renderCourses()}

      {/* Load More Button */}
      {hasNextPage && !isLoading && (
        <div className="flex justify-center mt-8">
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading courses...</p>
          </div>
        </div>
      )}
    </div>
  );
}
