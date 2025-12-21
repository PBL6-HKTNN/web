import { useGetCourseContentById } from "@/hooks/queries/course/course-hooks";
import {
  useAddToWishlist,
  useIsInWishlist,
  useRemoveFromWishlist,
} from "@/hooks/queries/course/wishlist-hooks";
import {
  useEnroll,
  useIsEnrolled,
  useGetTotalEnrollmentsByCourse,
} from "@/hooks/queries/course/enrollment-hooks";
import {
  useGetReviewsByCourse,
  useGetAverageRatingByCourse,
} from "@/hooks/queries/review-hooks";
import { useGetCart, useAddToCart } from "@/hooks/queries/payment-hooks";
import { formatPriceSimple } from "@/utils/format";
import { getAuthState } from "@/hooks/queries/auth-hooks";
import { useCourseReportForm } from "@/components/course/course-report-form/hook";

export const useCourseDetail = (courseId: string) => {
  const { data, isLoading, error } = useGetCourseContentById(courseId);

  // Get current user
  const { user } = getAuthState();

  // Cart hook
  const { data: cartData } = useGetCart();
  const addToCartMutation = useAddToCart();

  // Wishlist hooks
  const { data: isInWishlist } = useIsInWishlist(courseId);
  const addToWishlistMutation = useAddToWishlist(courseId);
  const removeFromWishlistMutation = useRemoveFromWishlist();
  // Enrollment hooks
  const enrollMutation = useEnroll();
  const { data: isEnrolledResponse } = useIsEnrolled(courseId);
  const isEnrolled = !!isEnrolledResponse?.data;
  // Review hooks
  const { data: reviewsData, isLoading: reviewsLoading } =
    useGetReviewsByCourse(courseId);
  const { data: averageData, isLoading: averageLoading } =
    useGetAverageRatingByCourse(courseId);
  // Report hook
  const reportForm = useCourseReportForm(courseId);

  // Total enrollments (API)
  const { data: totalEnrollments } = useGetTotalEnrollmentsByCourse(courseId);

  // Check if course is in cart
  const isInCart =
    cartData?.data?.some((item) => item.courseId === courseId) || false;

  // Check if current user is the instructor
  const isInstructor = user?.id === data?.data?.course?.instructorId;

  const handleWishlistClick = async () => {
    if (
      isInWishlist &&
      isInWishlist.data !== null &&
      isInWishlist?.data?.courseId
    ) {
      await removeFromWishlistMutation.mutateAsync(
        isInWishlist?.data?.courseId
      );
    } else {
      await addToWishlistMutation.mutateAsync();
    }
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
    // Auth
    isInstructor,
    // Cart
    isInCart,
    addToCartMutation,
    // Wishlist
    isInWishlist,
    addToWishlistMutation,
    removeFromWishlistMutation,
    handleWishlistClick,
    // Enrollment
    enrollMutation,
    isEnrolled,
    // Totals
    totalEnrollments,
    // Reviews
    reviews: reviewsData?.data || [],
    averageRating: averageData?.data?.averageRating || 0,
    reviewsLoading,
    averageLoading,
    // Report
    reportForm,
    // Utilities
    formatPrice,
    formatNumber,
  };
};
