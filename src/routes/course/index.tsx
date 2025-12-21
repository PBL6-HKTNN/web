import { createFileRoute } from "@tanstack/react-router";
import { CourseList } from "@/components/course";
import { NavBar } from "@/components/layout";
import { useCourseList } from "./-hook";

export const Route = createFileRoute("/course/")({
  component: RouteComponent,
});

function RouteComponent() {
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
  } = useCourseList();

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl container mx-auto px-4 py-8">
          <CourseList
            courses={courses}
            isLoading={isLoading}
            error={error}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onLoadMore={handleLoadMore}
          />
        </div>
      </div>
    </>
  );
}
