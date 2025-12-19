import { useState } from "react";
import { useGetEnrolledCourses } from "@/hooks/queries/course/enrollment-hooks";
import {
  useGetWishlist,
  useRemoveFromWishlist,
} from "@/hooks/queries/course/wishlist-hooks";
import type { GetEnrolledCourseFilterReq } from "@/types/db/course/enrollment";

export const useUserCourses = () => {
  const [filters, setFilters] = useState<
    GetEnrolledCourseFilterReq | undefined
  >(undefined);

  const enrollQuery = useGetEnrolledCourses(filters);
  const wishlistQuery = useGetWishlist();

  const enrolledCourses =
    enrollQuery.data?.pages?.flatMap((p) => p.data || []) || [];
  const removeFromWishlist = useRemoveFromWishlist();
  const fetchNextPage = enrollQuery.fetchNextPage;
  const hasNextPage = enrollQuery.hasNextPage;
  const isFetchingNextPage = enrollQuery.isFetchingNextPage;
  const wishlistItems = wishlistQuery.data?.data || [];

  // Derived states
  const isLoading = enrollQuery.isLoading || wishlistQuery.isLoading;
  const error = enrollQuery.error || wishlistQuery.error;

  const setFilter = (next: Partial<GetEnrolledCourseFilterReq> | undefined) => {
    if (!next) {
      setFilters(undefined);
      return;
    }
    setFilters((prev) => ({ ...(prev || {}), ...(next || {}) }));
  };

  const resetFilters = () => setFilters(undefined);

  return {
    filters,
    setFilter,
    resetFilters,
    enrolledCourses,
    enrolledLoading: enrollQuery.isLoading,
    enrolledError: enrollQuery.error,
    enrolledHasNextPage: hasNextPage,
    enrolledFetchNextPage: fetchNextPage,
    enrolledFetchingNextPage: isFetchingNextPage,
    wishlistItems,
    wishlistLoading: wishlistQuery.isLoading,
    wishlistError: wishlistQuery.error,
    removeFromWishlist,
    isLoading,
    error,
  };
};
