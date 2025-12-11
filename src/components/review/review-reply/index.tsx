import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/hooks/queries/user-hooks";
import type { Review } from "@/types/db/review";

interface ReviewReplyProps {
  review: Review;
  instructorId: string;
}

export function ReviewReply({ review, instructorId }: ReviewReplyProps) {
  const { data: instructorData, isLoading: isLoadingInstructor } = useUser(instructorId);
  
  if (!review.replyBy) {
    return null;
  }

  return (
    <div className="ml-8 mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-primary">
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={instructorData?.data?.user?.profilePicture || undefined} />
          <AvatarFallback>
            {isLoadingInstructor 
              ? "..." 
              : (instructorData?.data?.user?.name?.substring(0, 2).toUpperCase() || "I")
            }
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">
              {isLoadingInstructor 
                ? "Loading..." 
                : (instructorData?.data?.user?.name || "Instructor")
              }
            </span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              Instructor
            </span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {review.reply}
          </p>
          {review.replyAt && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {new Date(review.replyAt).toLocaleDateString("en-US", {
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
