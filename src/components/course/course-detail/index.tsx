
import { Star, Clock, Users, Play, BookOpen, Video, FileText, Trophy, Heart, MoreVertical, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddToCartButton } from "@/components/payment/add-to-cart-button";
import { useCourseDetail } from "./hook";
import ModuleAccordion from "@/components/course/module-accordion";
import { renderLevelLabel } from "@/utils/render-utils";
import { ReviewList } from "@/components/review";
import { formatDate } from "@/utils/format";
import { CourseReportForm } from "@/components/course/course-report-form";

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
    handleWishlistClick,
    enrollMutation,
    isEnrolled,
    reviews,
    averageRating,
    reviewsLoading,
    averageLoading,
    formatPrice,
    formatNumber
  } = useCourseDetail(courseId);

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
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>About this course</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {course.description}
                    </p>
                  </CardContent>
                </Card>

                {/* What you'll learn */}
                {/* {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>What you'll learn</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {course.whatYouWillLearn.map((item, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )} */}

                {/* Requirements */}
                {/* {course.requirements && course.requirements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        {course.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )} */}

                {/* Target Audience */}
                {/* {course.targetAudience && course.targetAudience.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Who this course is for</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        {course.targetAudience.map((audience, index) => (
                          <li key={index}>{audience}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )} */}
              </TabsContent>

              <TabsContent value="curriculum" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Course content
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {modules.length} modules • {modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)} lessons
                    </p>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        <div className="animate-pulse">
                          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    ) : modules.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <BookOpen className="size-12 mx-auto mb-4 opacity-50" />
                        <p>No modules found for this course.</p>
                      </div>
                    ) : (
                      <div>
                        {modules.map((module) => (
                          <ModuleAccordion
                            key={module.id}
                            data={module}
                            defaultExpanded={false}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor" className="mt-6">
                {/* <Card>
                  <CardHeader>
                    <CardTitle>Your instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={course.instructor?.profilePicture} />
                        <AvatarFallback className="text-lg">
                          {course.instructor?.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{course.instructor?.name}</h3>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{course.instructor?.rating}</span>
                            <span className="text-gray-600 dark:text-gray-400">Instructor Rating</span>
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            {formatNumber(course.instructor?.studentsCount || 0)} students
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            {course.instructor?.coursesCount} courses
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {course.instructor?.bio}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card> */}
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <ReviewList 
                  courseId={courseId}
                  reviews={reviews}
                  averageRating={averageRating}
                  isLoading={reviewsLoading || averageLoading}
                  formatNumber={formatNumber}
                />
              </TabsContent>
            </Tabs>
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
                  {isInstructor && (
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
                  )}
                  {course.price === 0 ? (
                    /* Free Course - Direct Enrollment */
                    <div className="flex gap-3">
                      <Button
                        className="flex-1"
                        size="lg"
                        onClick={() => {
                          if (!isEnrolled) {
                            enrollMutation.mutate(courseId);
                          }
                        }}
                        disabled={enrollMutation.isPending || isEnrolled}
                      >
                        {isEnrolled
                          ? "Enrolled"
                          : enrollMutation.isPending
                          ? "Enrolling..."
                          : "Enroll for Free"}
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className={`w-12 h-12 p-0 border-2 transition-all duration-200 ${
                          isInWishlist
                            ? 'border-red-500 bg-red-50 text-red-500 hover:bg-red-100'
                            : 'border-gray-300 text-gray-400 hover:border-red-300 hover:text-red-400 hover:bg-red-50'
                        }`}
                        onClick={handleWishlistClick}
                        disabled={addToWishlistMutation.isPending}
                        title={isInWishlist ? 'Already in wishlist' : 'Add to wishlist'}
                      >
                        {addToWishlistMutation.isPending ? (
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Heart
                            className={`w-5 h-5 transition-all duration-200 ${
                              isInWishlist ? 'fill-current' : ''
                            }`}
                          />
                        )}
                      </Button>
                    </div>
                  ) : isEnrolled ? (
                    /* Paid Course - Already Enrolled */
                    <div className="space-y-3">
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => {
                          // Navigate to learning page
                          window.location.href = `/learn/${courseId}`;
                        }}
                      >
                        Continue Learning
                      </Button>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="lg"
                          className={`w-12 h-12 p-0 border-2 transition-all duration-200 ${
                            isInWishlist
                              ? 'border-red-500 bg-red-50 text-red-500 hover:bg-red-100'
                              : 'border-gray-300 text-gray-400 hover:border-red-300 hover:text-red-400 hover:bg-red-50'
                          }`}
                          onClick={handleWishlistClick}
                          disabled={addToWishlistMutation.isPending}
                          title={isInWishlist ? 'Already in wishlist' : 'Add to wishlist'}
                        >
                          {addToWishlistMutation.isPending ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Heart
                              className={`w-5 h-5 transition-all duration-200 ${
                                isInWishlist ? 'fill-current' : ''
                              }`}
                            />
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : isInCart ? (
                    /* Paid Course - Already in Cart */
                    <div className="space-y-3">
                      <Button
                        className="w-full"
                        size="lg"
                        variant="outline"
                        onClick={() => {
                          // Navigate to cart
                          window.location.href = '/cart';
                        }}
                      >
                        View Cart
                      </Button>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1"
                          size="lg"
                          onClick={() => {
                            // Navigate to cart (already in cart)
                            window.location.href = '/cart';
                          }}
                        >
                          Buy Now
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          className={`w-12 h-12 p-0 border-2 transition-all duration-200 ${
                            isInWishlist
                              ? 'border-red-500 bg-red-50 text-red-500 hover:bg-red-100'
                              : 'border-gray-300 text-gray-400 hover:border-red-300 hover:text-red-400 hover:bg-red-50'
                          }`}
                          onClick={handleWishlistClick}
                          disabled={addToWishlistMutation.isPending}
                          title={isInWishlist ? 'Already in wishlist' : 'Add to wishlist'}
                        >
                          {addToWishlistMutation.isPending ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Heart
                              className={`w-5 h-5 transition-all duration-200 ${
                                isInWishlist ? 'fill-current' : ''
                              }`}
                            />
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Paid Course - Cart and Wishlist */
                    <div className="space-y-3">
                      <AddToCartButton
                        courseId={courseId}
                        size="lg"
                        className="w-full"
                      />
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1"
                          size="lg"
                          onClick={() => {
                            addToCartMutation.mutate(courseId, {
                              onSuccess: () => {
                                // Navigate to cart after adding to cart
                                window.location.href = '/cart';
                              }
                            });
                          }}
                          disabled={addToCartMutation.isPending}
                        >
                          {addToCartMutation.isPending ? 'Adding...' : 'Buy Now'}
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          className={`w-12 h-12 p-0 border-2 transition-all duration-200 ${
                            isInWishlist
                              ? 'border-red-500 bg-red-50 text-red-500 hover:bg-red-100'
                              : 'border-gray-300 text-gray-400 hover:border-red-300 hover:text-red-400 hover:bg-red-50'
                          }`}
                          onClick={handleWishlistClick}
                          disabled={addToWishlistMutation.isPending}
                          title={isInWishlist ? 'Already in wishlist' : 'Add to wishlist'}
                        >
                          {addToWishlistMutation.isPending ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Heart
                              className={`w-5 h-5 transition-all duration-200 ${
                                isInWishlist ? 'fill-current' : ''
                              }`}
                            />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
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
