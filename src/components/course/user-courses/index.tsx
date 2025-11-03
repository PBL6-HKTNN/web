import { useState } from "react";
import { BookOpen, Heart, CheckCircle, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEnrolledCourses, useWishlist, useRemoveFromWishlist } from "@/hooks/queries/course-hooks";
import { useNavigate } from "@tanstack/react-router";
import { EnrolledCourseCard } from "./enrolled-course-card";
import { WishlistCourseCard } from "./wishlist-course-card";

export function UserCourses() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("enrolled");

  const { data: enrolledData, isLoading: enrolledLoading, error: enrolledError } = useEnrolledCourses();
  const { data: wishlistData, isLoading: wishlistLoading, error: wishlistError } = useWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const enrolledCourses = (enrolledData as any)?.enrolledCourses || [];
  const wishlistItems = (wishlistData as any)?.wishlistItems || [];

  const renderEnrolledCourses = () => {
    if (enrolledLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      );
    }

    if (enrolledError) {
      return (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load your enrolled courses. Please try again later.
          </AlertDescription>
        </Alert>
      );
    }

    if (enrolledCourses.length === 0) {
      return (
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
      );
    }

    const inProgressCourses = enrolledCourses.filter((c: any) => c.status === 'in_progress');
    const completedCourses = enrolledCourses.filter((c: any) => c.status === 'completed');
    const pausedCourses = enrolledCourses.filter((c: any) => c.status === 'paused');

    return (
      <div className="space-y-8">
        {inProgressCourses.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Continue Learning ({inProgressCourses.length})</h2>
            </div>
            <div className="space-y-4">
              {inProgressCourses.map((course: any) => (
                <EnrolledCourseCard key={course.id} enrolledCourse={course} />
              ))}
            </div>
          </div>
        )}

        {completedCourses.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold">Completed Courses ({completedCourses.length})</h2>
            </div>
            <div className="space-y-4">
              {completedCourses.map((course: any) => (
                <EnrolledCourseCard key={course.id} enrolledCourse={course} />
              ))}
            </div>
          </div>
        )}

        {pausedCourses.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-yellow-600" />
              <h2 className="text-xl font-semibold">Paused Courses ({pausedCourses.length})</h2>
            </div>
            <div className="space-y-4">
              {pausedCourses.map((course: any) => (
                <EnrolledCourseCard key={course.id} enrolledCourse={course} />
              ))}
            </div>
          </div>
        )}
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

    if (wishlistError) {
      return (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load your wishlist. Please try again later.
          </AlertDescription>
        </Alert>
      );
    }

    if (wishlistItems.length === 0) {
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
          {wishlistItems.map((item: any) => (
            <WishlistCourseCard
              key={item.id}
              wishlistItem={item}
              onRemove={(courseId) => removeFromWishlistMutation.mutate(courseId)}
              isRemoving={removeFromWishlistMutation.isPending}
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
