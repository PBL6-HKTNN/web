import { Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ReviewReportForm } from "../review-report-form";
import type { Review } from "@/types/db/review";

interface ReviewCardProps {
  review: Review & {
    user?: {
      name: string;
      profilePicture?: string;
    };
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={review.user?.profilePicture} />
          <AvatarFallback>
            {review.user?.name?.substring(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">{review.user?.name || "Anonymous"}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <ReviewReportForm review={review} />
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {review.comment}
          </p>
          {review.createdAt && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
