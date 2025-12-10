import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { CourseStatus } from "@/types/db/course";
import {
  AlertCircle,
  Clock,
  FileText,
  Flag,
  Heart,
  MoreVertical,
  Play,
  ShoppingCart,
  Star,
  Trophy,
  Users,
  Video,
} from "lucide-react";
import { AddToCartButton } from "@/components/payment/add-to-cart-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CourseReportForm } from "@/components/course/course-report-form";
import CourseTabs from "./tabs";
import { cn } from "@/lib/utils";
import { useCourseDetail } from "./hook";
import { renderLevelLabel } from "@/utils/render-utils";
import { formatDate } from "@/utils/format";
import { useRouter } from "@tanstack/react-router";

interface CourseDetailProps {
  courseId: string;
}

export function CourseDetail({ courseId }: CourseDetailProps) {
  const { 
    course, 
    modules, 
    isLoading, 
    error,
    isInstructor,
    isInCart,
    addToCartMutation,
    isInWishlist,
    addToWishlistMutation,
    removeFromWishlistMutation,
    handleWishlistClick,
    enrollMutation,
    isEnrolled,
    reviews,
    averageRating,
    reviewsLoading,
    averageLoading,
    formatPrice
  } = useCourseDetail(courseId);

  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-300 dark:bg-gray-700"></div>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Course not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The course you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const isDraft = course.status === CourseStatus.DRAFT;
  const isArchived = course.status === CourseStatus.ARCHIVED;
  const isBanned = course.isRequestedBanned;

  const renderActionButtons = () => {
    // Instructor view
    if (isInstructor) {
      return (
        <Button
          className="w-full"
          size="lg"
          variant="outline"
          onClick={() => {
            window.location.href = `/lecturing-tool/course/${courseId}`;
          }}
        >
          Edit Course
        </Button>
      );
    }

    // Enrolled user view (except draft courses)
    if (isEnrolled && !isDraft) {
      return (
        <Button
          className="w-full"
          size="lg"
          onClick={() => {
            window.location.href = `/learn/${courseId}`;
          }}
        >
          Go to course
        </Button>
      );
    }

    // Non-enrolled, non-instructor view (only for published courses)
    if (!isEnrolled && !isInstructor && !isDraft && !isArchived) {
      if (course.price === 0) {
        // Free course
        return (
          <div className="flex gap-3">
            <Button
              className="flex-1"
              size="lg"
              onClick={() => enrollMutation.mutate(courseId)}
              disabled={enrollMutation.isPending}
            >
              {enrollMutation.isPending ? "Enrolling..." : "Enroll for free"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-auto"
              onClick={handleWishlistClick}
              disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
            >
              <Heart
                className={cn(
                  "w-5 h-5",  
                  isInWishlist?.isSuccess && "fill-red-500 text-red-500",
                )}
              />
            </Button>
          </div>
        );
      }

      // Paid course
      if (isInCart) {
        return (
          <div className="space-y-3">
            <Button
              className="w-full"
              size="lg"
              variant="outline"
              onClick={() => router.navigate({
                to: "/cart",
              })}
            >
              Go to cart
            </Button>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="link"
                className="p-0 h-auto gap-2"
                onClick={() => addToCartMutation.mutate(courseId)}
                disabled={addToCartMutation.isPending}
              >
                Remove from cart
              </Button>
              <Separator orientation="vertical" className="h-4" />
              <Button
                variant="link"
                className="p-0 h-auto gap-2"
                onClick={handleWishlistClick}
                disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
              >
                <Heart
                  className={cn(
                    "w-4 h-4",
                    isInWishlist?.isSuccess && "fill-red-500 text-red-500",
                  )}
                />
                {isInWishlist?.isSuccess ? "Remove from wishlist" : "Add to wishlist"}
              </Button>
            </div>
          </div>
        );
      }

      // Paid course, not in cart
      return (
        <div className="space-y-3">
          <AddToCartButton
            courseId={courseId}
            size="lg"
            className="w-full"
          />
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="link"
              className="p-0 h-auto gap-2"
              onClick={() => {
                /* Implement Buy Now */
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              Buy now
            </Button>
            <Separator orientation="vertical" className="h-4" />
             <Button
                variant="link"
                className="p-0 h-auto gap-2"
                onClick={handleWishlistClick}
                disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
              >
                <Heart
                  className={cn(
                    "w-4 h-4",
                    isInWishlist?.isSuccess && "fill-red-500 text-red-500",
                  )}
                />
                {isInWishlist?.isSuccess ? "Remove from wishlist" : "Add to wishlist"}
              </Button>
          </div>
        </div>
      );
    }

    // No buttons for draft/archived courses or other states
    return null;
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header with Video/Thumbnail */}
      <div className="relative bg-black">
        <div className="aspect-video max-w-6xl mx-auto relative">
          {course.thumbnail ? (
            <img
              className="w-full h-full object-cover"
              src={course.thumbnail}
              alt="Course Thumbnail"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-75" />
                <p className="text-lg">Preview not available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Alerts */}
              {(isDraft || isArchived || isBanned) && (
                <div className="mb-6 space-y-4">
                  {isDraft && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Draft Course</AlertTitle>
                      <AlertDescription>
                        This is a draft course and is not visible to students. Only
                        you can see this page.
                      </AlertDescription>
                    </Alert>
                  )}
                  {isArchived && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Archived Course</AlertTitle>
                      <AlertDescription>
                        This course is archived and can no longer be purchased.
                      </AlertDescription>
                    </Alert>
                  )}
                  {isBanned && !isArchived && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Under Review</AlertTitle>
                      <AlertDescription>
                        This course is under review due to reports and may be
                        archived soon.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            {/* Course Title and Basic Info */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {course.title}
                </h1>
                {!isInstructor && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <CourseReportForm 
                          courseId={courseId} 
                          course={course}
                          trigger={
                            <div className="flex items-center cursor-pointer w-full">
                              <Flag className="w-4 h-4 mr-2" />
                              Report Course
                            </div>
                          }
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              {course.description && (
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                  {course.description}
                </p>
              )}

              {/* Rating and Stats */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-lg">{averageRating}</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    ({course.numberOfReviews} ratings)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  {/* <span>{formatNumber(course.totalStudents || 0)} students</span> */}
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{(course.duration)} of content</span>
                </div>
                <Badge variant="secondary">{renderLevelLabel(course.level)}</Badge>
                <Badge variant="secondary">{course.language}</Badge>
                {course.updatedAt && (
                  <span className="text-gray-600 dark:text-gray-400">
                    Last updated {formatDate(course.updatedAt)}
                  </span>
                )}
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={course.instructorId} />
                  <AvatarFallback>
                    {course.instructorId}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Created by {course.instructorId}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {course.instructorId} courses
                  </p>
                </div>
              </div>
            </div>

            {/* Course Content Tabs */}
            <CourseTabs
              course={course}
              modules={modules}
              courseId={courseId}
              reviews={reviews}
              averageRating={averageRating}
              reviewsLoading={reviewsLoading}
              averageRatingLoading={averageLoading}
            />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6 lg:-mt-36">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {/* Video Preview */}
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                  <Play className="w-12 h-12 text-gray-500" />
                </div>

                {/* Price */}
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(course.price)}
                  </div>
                  {course.price > 0 && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      30-day money-back guarantee
                    </div>
                  )}
                </div>

                {/* Enroll, Cart, and Wishlist Buttons */}
                <div className="space-y-3 mb-4">
                  {renderActionButtons()}
                </div>

                {/* Course includes */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white">This course includes:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-gray-600" />
                      <span>{(course.duration)} on-demand video</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span>Downloadable resources</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-gray-600" />
                      <span>Full lifetime access</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Share */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Share this course
                  </p>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm">Share</Button>
                    <Button variant="outline" size="sm">Gift</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
