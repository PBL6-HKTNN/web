import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CourseStatus } from "@/types/db/course";
import {
  AlertCircle,
  Clock,
  FileText,
  Heart,
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
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { CourseReportForm } from "@/components/course/course-report-form";
import CourseTabs from "./tabs";
import { cn } from "@/lib/utils";
import { useCourseDetail } from "./hook";
import { renderLevelLabel } from "@/utils/render-utils";
import { useRouter } from "@tanstack/react-router";
import { useUser } from "@/hooks";

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
    // Totals
    totalEnrollments,
    formatPrice,
    formatNumber,
  } = useCourseDetail(courseId);

  const { data: instructorData } = useUser(course?.instructorId as string);

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
              disabled={
                addToWishlistMutation.isPending ||
                removeFromWishlistMutation.isPending
              }
            >
              <Heart
                className={cn(
                  "w-5 h-5",
                  isInWishlist?.isSuccess && "fill-red-500 text-red-500"
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
              onClick={() =>
                router.navigate({
                  to: "/cart",
                })
              }
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
                disabled={
                  addToWishlistMutation.isPending ||
                  removeFromWishlistMutation.isPending
                }
              >
                <Heart
                  className={cn(
                    "w-4 h-4",
                    isInWishlist?.isSuccess && "fill-red-500 text-red-500"
                  )}
                />
                {isInWishlist?.isSuccess
                  ? "Remove from wishlist"
                  : "Add to wishlist"}
              </Button>
            </div>
          </div>
        );
      }

      // Paid course, not in cart
      return (
        <div className="space-y-3">
          <AddToCartButton courseId={courseId} size="lg" className="w-full" />
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
              disabled={
                addToWishlistMutation.isPending ||
                removeFromWishlistMutation.isPending
              }
            >
              <Heart
                className={cn(
                  "w-4 h-4",
                  isInWishlist?.isSuccess && "fill-red-500 text-red-500"
                )}
              />
              {isInWishlist?.isSuccess
                ? "Remove from wishlist"
                : "Add to wishlist"}
            </Button>
          </div>
        </div>
      );
    }

    // No buttons for draft/archived courses or other states
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Immersive Hero Section */}
      <div className="relative w-full overflow-hidden bg-slate-950 py-16 lg:py-24">
        {/* Background Image with Blending */}
        <div className="absolute inset-0 z-0">
          <img
            src={course.thumbnail || "/placeholder-course.jpg"}
            alt=""
            className="h-full w-full object-cover opacity-30 blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            {/* Hero Content */}
            <div className="lg:col-span-2 space-y-6 text-white">
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-primary text-white border-none font-bold px-3 py-1">
                  {renderLevelLabel(course.level)}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-white border-white/20 backdrop-blur-md font-bold px-3 py-1"
                >
                  {course.language}
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                {course.title}
              </h1>

              {course.description && (
                <p className="text-xl text-gray-300 leading-relaxed max-w-3xl font-medium">
                  {course.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-6 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5",
                          i < Math.floor(averageRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-500"
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-yellow-400 text-lg">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-400">
                    ({course.numberOfReviews} ratings)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-bold">
                    {formatNumber(
                      totalEnrollments ?? course.totalEnrollments ?? 0
                    )}{" "}
                    students
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-bold">
                    {course.duration} of content
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Avatar className="w-14 h-14 border-2 border-primary/50 shadow-xl">
                  <AvatarImage
                    src={
                      instructorData?.data?.user?.profilePicture || undefined
                    }
                  />
                  <AvatarFallback className="bg-primary/20 text-primary font-bold">
                    {instructorData?.data?.user?.name
                      ?.substring(0, 2)
                      .toUpperCase() ||
                      course.instructorId.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest font-black">
                    Created by
                  </p>
                  <p className="text-xl font-bold text-white hover:text-primary transition-colors cursor-pointer">
                    {instructorData?.data?.user?.name || course.instructorId}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions Card (Mobile only or integrated) */}
            <div className="lg:hidden">
              <Card className="border-none bg-white/10 backdrop-blur-xl shadow-2xl text-white">
                <CardContent className="p-6 space-y-6">
                  <div className="text-4xl font-black">
                    {formatPrice(course.price)}
                  </div>
                  {renderActionButtons()}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Tabs and Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* Alerts */}
            {(isDraft || isArchived || isBanned) && (
              <div className="space-y-4">
                {isDraft && (
                  <Alert
                    variant="destructive"
                    className="border-none bg-destructive/10 shadow-sm"
                  >
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle className="font-bold">Draft Course</AlertTitle>
                    <AlertDescription>
                      This is a draft course and is not visible to students.
                      Only you can see this page.
                    </AlertDescription>
                  </Alert>
                )}
                {/* ... other alerts ... */}
              </div>
            )}

            <CourseTabs
              course={course}
              modules={modules}
              courseId={courseId}
              reviews={reviews}
              averageRating={averageRating}
              reviewsLoading={reviewsLoading}
              averageRatingLoading={averageLoading}
              totalEnrollments={totalEnrollments}
            />
          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="relative">
            <div className="sticky top-24 space-y-8 lg:-mt-48">
              <Card className="overflow-hidden border-none shadow-2xl bg-card">
                <div className="relative aspect-video group cursor-pointer">
                  <img
                    src={course.thumbnail || "/placeholder-course.jpg"}
                    alt="Course Preview"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm font-bold drop-shadow-lg">
                    Preview this course
                  </div>
                </div>

                <CardContent className="p-8 space-y-8">
                  <div className="space-y-2">
                    <div className="text-4xl font-black tracking-tight">
                      {formatPrice(course.price)}
                    </div>
                    {course.price > 0 && (
                      <p className="text-sm text-muted-foreground font-medium">
                        30-day money-back guarantee
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">{renderActionButtons()}</div>

                  <div className="space-y-6">
                    <h4 className="font-extrabold text-lg tracking-tight">
                      This course includes:
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <Video className="w-4 h-4" />
                        </div>
                        <span>{course.duration} on-demand video</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span>Downloadable resources</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <Trophy className="w-4 h-4" />
                        </div>
                        <span>Full lifetime access</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between gap-4">
                    <Button variant="ghost" className="flex-1 font-bold gap-2">
                      Share
                    </Button>
                    <Button variant="ghost" className="flex-1 font-bold gap-2">
                      Gift
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info or Related Courses could go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
