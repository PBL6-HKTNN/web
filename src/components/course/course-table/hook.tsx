import { useState, useMemo } from "react";
import { useGetCourses } from "@/hooks/queries/course/course-hooks";
import type { GetCoursesFilterReq } from "@/types/db/course";

const ITEMS_PER_PAGE = 12;

export function useCourseTable() {
  const [filters, setFilters] = useState<GetCoursesFilterReq>({
    Page: 1,
    PageSize: ITEMS_PER_PAGE,
    SortBy: 'name',
  });

  const {
    data,
    isLoading,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetCourses(filters);

  // Flatten the infinite query data
  const courses = useMemo(() => {
    return data?.pages.flatMap(page => page.data || []) || [];
  }, [data]);

  const handleFiltersChange = (newFilters: Partial<GetCoursesFilterReq>) => {
    setFilters(prev => ({ ...prev, ...newFilters, Page: 1 })); // Reset to page 1 when filters change
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return {
    courses,
    isLoading,
    error,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    filters,
    handleFiltersChange,
    handleLoadMore,
  };
}
