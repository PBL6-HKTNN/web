import { useState } from "react";
import { BookOpen, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { EnrolledCourseCard } from "./enrolled-course-card";
import { WishlistCourseCard } from "./wishlist-course-card";
import { useUserCourses } from "./hook";
import { EnrolledCoursesFilter } from './enrolled-courses-filter'
import type { WishlistedCourseItem } from "@/types/db/course/wishlist";
import type { EnrolledCourseItem } from "@/types/db/course/enrollment";

export function UserCourses() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("enrolled");

  const { filters, setFilter, enrolledCourses, enrolledLoading, enrolledHasNextPage, enrolledFetchNextPage, enrolledFetchingNextPage, wishlistItems, wishlistLoading, wishlistError, removeFromWishlist } = useUserCourses();

  const renderEnrolledCourses = () => {
    // Always render the header and filter first so the controls are visible
    // even when the enrolled list is empty or loading.
    if (enrolledLoading) {
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">My Enrolled Courses ({enrolledCourses.length})</h2>
            </div>
            <div>
              <EnrolledCoursesFilter filters={filters} onChange={(f) => setFilter(f)} />
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Don’t early return on enrolled error — always render header and filters.
    // Show an inline alert in the content area so users can adjust filters or retry without losing context.
    // Render header + either placeholder or the list
    return (
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">My Enrolled Courses ({enrolledCourses.length})</h2>
            </div>
            <div>
              <EnrolledCoursesFilter filters={filters} onChange={(f) => setFilter(f)} />
            </div>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No enrolled courses</h3>
              <p className="text-muted-foreground mb-4">
                You haven't enrolled in any courses yet. Browse our course catalog to get started!
              </p>
              <Button onClick={() => navigate({ to: '/course' })}>
                Browse Courses
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6">
                {enrolledCourses.map((course: EnrolledCourseItem) => (
                  <EnrolledCourseCard key={course.id} course={course} />
                ))}
              </div>
              {/* Load More Button */}
              {enrolledHasNextPage && (
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={() => enrolledFetchNextPage?.()}
                    disabled={enrolledFetchingNextPage}
                    variant="outline"
                    size="lg"
                  >
                    {enrolledFetchingNextPage ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading more...
                      </>
                    ) : (
                      'Load More Courses'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const renderWishlist = () => {
    if (wishlistLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      );
    }

    if (wishlistError || wishlistItems.length === 0) {
      return (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-4">
            Save courses you're interested in for later. They'll appear here.
          </p>
          <Button onClick={() => navigate({ to: '/course' })}>
            Browse Courses
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-semibold">My Wishlist ({wishlistItems.length})</h2>
          </div>
        </div>

        <div className="space-y-3">
          {wishlistItems.map((item: WishlistedCourseItem) => (
            <WishlistCourseCard
              key={item.courseId}
              wishlistItem={item}
              onRemove={(courseId) => removeFromWishlist.mutate(courseId)}
              isRemoving={removeFromWishlist.isPending}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Learning</h1>
          <p className="text-muted-foreground">
            Track your progress and manage your courses
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="enrolled" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              My Courses ({enrolledCourses.length})
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Wishlist ({wishlistItems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="enrolled" className="mt-8">
            {renderEnrolledCourses()}
          </TabsContent>

          <TabsContent value="wishlist" className="mt-8">
            {renderWishlist()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
