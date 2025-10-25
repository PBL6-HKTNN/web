import { useState } from "react";
import { useCourses } from "@/hooks/queries";
import { CourseCard, CourseFilters } from "@/components/course";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import type { GetCoursesRequest } from "@/types/db/course/course";

const ITEMS_PER_PAGE = 12;



export function CourseList() {
  const [filters, setFilters] = useState<GetCoursesRequest>({
    page: 1,
    pageSize: ITEMS_PER_PAGE,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data, isLoading, error, isFetching } = useCourses(filters);

  const handleFiltersChange = (newFilters: GetCoursesRequest) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (!data || data.totalPages <= 1) return null;

    const { page, totalPages } = data;
    const pages = [];

    // Always show first page
    if (totalPages > 1) {
      pages.push(1);
    }

    // Calculate range around current page
    const start = Math.max(2, page - 2);
    const end = Math.min(totalPages - 1, page + 2);

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('...');
    }

    // Add pages in range
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1 || isFetching}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {pages.map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-muted-foreground">
                  ...
                </span>
              );
            }

            const isActive = pageNum === page;
            return (
              <Button
                key={pageNum}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum as number)}
                disabled={isFetching}
                className="w-10 h-10"
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages || isFetching}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  };

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

    if (!data || !data.courses || data.courses.length === 0) {
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
        {data.courses.map((course) => (
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
        onFiltersChange={handleFiltersChange}
        totalResults={data?.totalCount}
      />

      {renderCourses()}

      {renderPagination()}

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
