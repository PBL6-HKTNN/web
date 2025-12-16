import { useState } from "react";
import { useSubmitQuizInVideo } from "@/hooks/queries/course/quiz-hooks";
import { useToast } from "@/hooks/use-toast";
import type { QuizInVideo } from "@/types/db/course/quiz-question";

interface UseQuizInVideoModalProps {
  quiz: QuizInVideo;
  onSuccess?: () => void;
}

export function useQuizInVideoModal({
  quiz,
  onSuccess,
}: UseQuizInVideoModalProps) {
  const { success, error } = useToast();
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const submitMutation = useSubmitQuizInVideo();

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) {
      error("Please select an answer");
      return;
    }

    try {
      const res = await submitMutation.mutateAsync({
        videoCheckpointId: quiz.id,
        answer: selectedAnswer,
      });

      if (res.data?.success) {
        success("Correct answer!");
      } else {
        error("Incorrect answer.");
      }

      setSelectedAnswer("");
      onSuccess?.();
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to submit answer");
    }
  };

  return {
    selectedAnswer,
    setSelectedAnswer,
    handleSubmitAnswer,
    isLoading: submitMutation.isPending,
  };
}
