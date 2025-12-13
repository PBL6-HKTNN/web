import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquareReply, Send } from "lucide-react";
import { useReplyToReview } from "@/hooks/queries/review-hooks";
import type { Review } from "@/types/db/review";
import type { UUID } from "@/types";

interface ReviewReplyFormProps {
  review: Review;
  courseId: UUID;
  canReply: boolean; // Whether current user is the course instructor
}

export function ReviewReplyForm({ review, courseId, canReply }: ReviewReplyFormProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const replyMutation = useReplyToReview();

  // If user can't reply or review already has a reply, don't show the form
  if (!canReply || review.reply) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyText.trim()) return;

    try {
      await replyMutation.mutateAsync({
        courseId,
        reviewId: review.id,
        data: { reply: replyText.trim() }
      });
      
      // Reset form state
      setReplyText("");
      setIsReplying(false);
    } catch (error) {
      console.error("Failed to submit reply:", error);
    }
  };

  const handleCancel = () => {
    setReplyText("");
    setIsReplying(false);
  };

  if (!isReplying) {
    return (
      <div className="mt-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsReplying(true)}
          className="text-primary hover:text-primary"
        >
          <MessageSquareReply className="w-4 h-4 mr-1" />
          Reply as instructor
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="reply" className="sr-only">
            Reply to review
          </label>
          <Textarea
            id="reply"
            placeholder="Write your response as the instructor..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="min-h-[80px] resize-none"
            disabled={replyMutation.isPending}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Replying as instructor
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={replyMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!replyText.trim() || replyMutation.isPending}
            >
              {replyMutation.isPending ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-3 h-3 mr-1" />
                  Send Reply
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
