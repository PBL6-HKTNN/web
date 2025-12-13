import { useState, useMemo } from "react";
import { useGetCourses } from "@/hooks/queries/course/course-hooks";
import type { GetCoursesFilterReq } from "@/types/db/course";
import { useAuthState } from "@/hooks";

const ITEMS_PER_PAGE = 12;

export function useCourseTable() {
  const {
    user
  } = useAuthState();
  
  const [filters, setFilters] = useState<GetCoursesFilterReq>({
    Page: 1,
    PageSize: ITEMS_PER_PAGE,
    SortBy: 'rating',
    InstructorId: user?.id,
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
    return data?.pages.flatMap(page => page.data || []).filter(
      (course) => course.instructorId === user?.id
    ) || [];
  }, [data, user]);

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
