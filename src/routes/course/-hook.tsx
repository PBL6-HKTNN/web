import { useState, useMemo } from "react";
import { useGetCourses } from "@/hooks/queries/course/course-hooks";
import { useGetCart } from "@/hooks/queries/payment-hooks";
import { useGetEnrolledCourses } from "@/hooks/queries/course/enrollment-hooks";
import type { GetCoursesFilterReq } from "@/types/db/course";

const ITEMS_PER_PAGE = 12;

export function useCourseList() {
  const [filters, setFilters] = useState<GetCoursesFilterReq>({
    Page: 1,
    PageSize: ITEMS_PER_PAGE,
    SortBy: 'price',
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

  // Get cart data
  const { data: cartData } = useGetCart();

  // Get enrolled courses (paginated)
  const { data: enrolledCoursesData } = useGetEnrolledCourses();

  // Flatten the infinite query data
  const courses = useMemo(() => {
    return data?.pages.flatMap(page => page.data || []) || [];
  }, [data]);

  // Create sets for quick lookup
  const cartCourseIds = useMemo(() => {
    return new Set(cartData?.data?.map(item => item.courseId) || []);
  }, [cartData]);

  const enrolledCourseIds = useMemo(() => {
    const pages = enrolledCoursesData?.pages || [];
    const items = pages.flatMap((p) => p.data || []);
    return new Set(items.map(item => item.id));
  }, [enrolledCoursesData]);

  // Enhance courses with cart/enrollment status
  const coursesWithStatus = useMemo(() => {
    return courses.map(course => ({
      ...course,
      isInCart: cartCourseIds.has(course.id),
      isEnrolled: enrolledCourseIds.has(course.id),
    }));
  }, [courses, cartCourseIds, enrolledCourseIds]);

  const handleFiltersChange = (newFilters: Partial<GetCoursesFilterReq>) => {
    setFilters(prev => ({ ...prev, ...newFilters, Page: 1 })); // Reset to page 1 when filters change
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return {
    courses: coursesWithStatus,
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