import { ReviewCard } from "../review-card";
import { ReviewForm } from "../review-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { useState } from "react";
import { useIsEnrolled } from '@/hooks/queries/course/enrollment-hooks'
import type { UUID } from "@/types";
import type { Review } from "@/types/db/review";

interface ReviewListProps {
  courseId: UUID;
  instructorId: UUID;
  reviews: Review[];
  averageRating: number;
  isLoading: boolean;
  showForm?: boolean;
  formatNumber: (num: number) => string;
}

export function ReviewList({ 
  courseId, 
  instructorId,
  reviews, 
  averageRating, 
  isLoading, 
  showForm = true, 
  formatNumber 
}: ReviewListProps) {
  const reviewCount = reviews.length;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: isEnrolledResponse, isLoading: isEnrolledLoading } = useIsEnrolled(courseId)
  const isEnrolled = !!isEnrolledResponse?.data?.enrollment

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Student feedback</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
              <span className="text-gray-600 dark:text-gray-400">
                course rating • {formatNumber(reviewCount)} ratings
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  courseId={courseId}
                  instructorId={instructorId}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No reviews yet. Be the first to review this course!
            </p>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <>
          {isEnrolled ? (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">Write a Review</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                </DialogHeader>
                <ReviewForm 
                  courseId={courseId} 
                  onSuccess={() => setIsDialogOpen(false)} 
                />
              </DialogContent>
            </Dialog>
          ) : (
            <div className="space-y-2">
              <Button className="w-full" disabled={true}>{isEnrolledLoading ? 'Checking enrollment...' : 'Write a Review'}</Button>
              {!isEnrolledLoading && (
                <p className="text-center text-sm text-muted-foreground">You must join the course to submit a review.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
