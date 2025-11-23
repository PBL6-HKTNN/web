import { useGetCourseContentById } from "@/hooks/queries/course/course-hooks";
import { useAddToWishlist, useIsInWishlist } from "@/hooks/queries/course/wishlist-hooks";
import { useEnroll, useIsEnrolled } from "@/hooks/queries/course/enrollment-hooks";
import { useGetReviewsByCourse, useGetAverageRatingByCourse } from "@/hooks/queries/review-hooks";
import { formatPriceSimple } from "@/utils/format";

export const useCourseDetail = (courseId: string) => {
  const { data, isLoading, error } = useGetCourseContentById(courseId);
  
  // Wishlist hooks
  const { data: isInWishlist } = useIsInWishlist(courseId);
  const addToWishlistMutation = useAddToWishlist();

  // Enrollment hooks
  const enrollMutation = useEnroll();
  const { data: isEnrolledResponse } = useIsEnrolled(courseId);
  const isEnrolled = !!isEnrolledResponse?.data;
  
  // Review hooks
  const { data: reviewsData, isLoading: reviewsLoading } = useGetReviewsByCourse(courseId);
  const { data: averageData, isLoading: averageLoading } = useGetAverageRatingByCourse(courseId);
  
  const handleWishlistClick = () => {
    addToWishlistMutation.mutate(courseId);
  };
  
  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return formatPriceSimple(price);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return {
    course: data?.data?.course,
    modules: data?.data?.module || [],
    isLoading,
    error,
    // Wishlist
    isInWishlist,
    addToWishlistMutation,
    handleWishlistClick,
    // Enrollment
    enrollMutation,
    isEnrolled,
    // Reviews
    reviews: reviewsData?.data || [],
    averageRating: averageData?.data?.averageRating || 0,
    reviewsLoading,
    averageLoading,
    // Utilities
    formatPrice,
    formatNumber,
  };
};