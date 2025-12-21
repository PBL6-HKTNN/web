import React, { useState } from "react";
import { BookOpen, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { EnrolledCourseCard } from "./enrolled-course-card";
import { WishlistCourseCard } from "./wishlist-course-card";
import { useUserCourses } from "./hook";
import { EnrolledCoursesFilter } from "./enrolled-courses-filter";
import type { WishlistedCourseItem } from "@/types/db/course/wishlist";
import type { EnrolledCourseItem } from "@/types/db/course/enrollment";

export function UserCourses() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("enrolled");

  const {
    filters,
    setFilter,
    enrolledCourses,
    enrolledLoading,
    enrolledHasNextPage,
    enrolledFetchNextPage,
    enrolledFetchingNextPage,
    wishlistItems,
    wishlistLoading,
    wishlistError,
    removeFromWishlist,
  } = useUserCourses();

  const RenderEnrolledCourses = React.memo(() => {
    if (enrolledLoading) {
      return (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">
                My Enrolled Courses
              </h2>
              <p className="text-sm text-muted-foreground">
                Continue where you left off
              </p>
            </div>
            <div className="flex items-center gap-2">
              <EnrolledCoursesFilter
                filters={filters}
                onChange={(f) => setFilter(f)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-[180px] w-full animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              My Enrolled Courses ({enrolledCourses.length})
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage and track your learning progress
            </p>
          </div>
          <div className="flex items-center gap-2">
            <EnrolledCoursesFilter
              filters={filters}
              onChange={(f) => setFilter(f)}
            />
          </div>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No enrolled courses yet</h3>
            <p className="mx-auto max-w-[400px] text-muted-foreground mb-8">
              You haven't started any courses. Explore our catalog to find the
              perfect course for you.
            </p>
            <Button
              size="lg"
              onClick={() => navigate({ to: "/course" })}
              className="font-semibold"
            >
              Browse Courses
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {enrolledCourses.map((course: EnrolledCourseItem) => (
                <EnrolledCourseCard key={course.id} course={course} />
              ))}
            </div>

            {enrolledHasNextPage && (
              <div className="flex justify-center pt-8">
                <Button
                  onClick={() => enrolledFetchNextPage?.()}
                  disabled={enrolledFetchingNextPage}
                  variant="outline"
                  size="lg"
                  className="min-w-[200px] font-semibold"
                >
                  {enrolledFetchingNextPage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading more...
                    </>
                  ) : (
                    "Load More Courses"
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  });

  const RenderWishlist = React.memo(() => {
    if (wishlistLoading) {
      return (
        <div className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">My Wishlist</h2>
            <p className="text-sm text-muted-foreground">
              Courses you're interested in
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-[180px] w-full animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
        </div>
      );
    }

    if (wishlistError || wishlistItems.length === 0) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mb-6">
            <Heart className="h-10 w-10 text-destructive" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Your wishlist is empty</h3>
          <p className="mx-auto max-w-[400px] text-muted-foreground mb-8">
            Save courses you're interested in for later. They'll appear here
            when you're ready to enroll.
          </p>
          <Button
            size="lg"
            onClick={() => navigate({ to: "/course" })}
            className="font-semibold"
          >
            Explore Courses
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">
            My Wishlist ({wishlistItems.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            Courses you've saved for later
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
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
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl container mx-auto px-4 py-12">
        <div className="mb-10 space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            My Learning
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your progress and manage your educational journey
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full space-y-8"
        >
          <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground w-full max-w-md">
            <TabsTrigger
              value="enrolled"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-8 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm w-full"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              My Courses
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-8 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm w-full"
            >
              <Heart className="mr-2 h-4 w-4" />
              Wishlist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="enrolled" className="mt-0 outline-none">
            <RenderEnrolledCourses />
          </TabsContent>

          <TabsContent value="wishlist" className="mt-0 outline-none">
            <RenderWishlist />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
