import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, MessageCircle } from "lucide-react";
import { useQuizInVideoModal } from "./hook";
import type { QuizInVideo } from "@/types/db/course/quiz-question";

interface QuizInVideoModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: QuizInVideo;
  onSuccess?: () => void;
}

export default function QuizInVideoModal({
  isOpen,
  onOpenChange,
  quiz,
  onSuccess,
}: QuizInVideoModalProps) {
  const { selectedAnswer, setSelectedAnswer, handleSubmitAnswer, isLoading } =
    useQuizInVideoModal({
      quiz,
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
      },
    });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Prevent closing the quiz modal using outside click or escape.
        // Only allow opening via parent; closing happens after an answer is submitted.
        if (open) onOpenChange(true);
      }}
    >
      <DialogContent
        className="max-w-2xl quiz-modal-content"
        aria-live="polite"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Quiz Question at {quiz.time}
          </DialogTitle>
          <DialogDescription>
            Answer the following question to continue learning
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Question */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{quiz.question}</h3>

            {/* Options */}
            <RadioGroup
              value={selectedAnswer}
              onValueChange={setSelectedAnswer}
            >
              <div className="space-y-3">
                {quiz.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="cursor-pointer flex-1 font-normal"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              onClick={handleSubmitAnswer}
              disabled={isLoading || !selectedAnswer}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Answer"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
