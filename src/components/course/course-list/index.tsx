import { CourseCard, CourseFilters } from "@/components/course";
import { Button } from "@/components/ui/button";
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <div
              key={index}
              className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-muted animate-pulse"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                <div className="h-6 bg-white/20 rounded-md w-3/4" />
                <div className="h-4 bg-white/20 rounded-md w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-8 bg-white/20 rounded-md w-1/4" />
                  <div className="h-8 bg-white/20 rounded-md w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Alert
          variant="destructive"
          className="max-w-2xl mx-auto border-none bg-destructive/10 text-destructive shadow-lg"
        >
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="font-medium">
            We encountered an error while loading the courses. Please try
            refreshing the page.
          </AlertDescription>
        </Alert>
      );
    }

    if (!courses || courses.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
          <div className="bg-muted/50 p-6 rounded-full mb-6">
            <AlertCircle className="w-12 h-12 text-muted-foreground opacity-50" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No courses found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            We couldn't find any courses matching your current filters. Try
            adjusting your search or clearing the filters.
          </p>
          <Button
            variant="outline"
            onClick={() => onFiltersChange({})}
            className="font-semibold"
          >
            Clear all filters
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Explore Courses
          </h2>
          <p className="text-muted-foreground">
            Discover your next learning adventure
          </p>
        </div>
        <CourseFilters
          filters={filters}
          onFiltersChange={onFiltersChange}
          totalResults={courses?.length || 0}
        />
      </div>

      {renderCourses()}

      {/* Load More Button */}
      {hasNextPage && !isLoading && (
        <div className="flex justify-center pt-12">
          <Button
            onClick={onLoadMore}
            variant="outline"
            size="lg"
            disabled={isFetchingNextPage}
            className="min-w-[200px] font-bold border-2 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading more...
              </>
            ) : (
              "Load More Courses"
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
