import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useCreateQuizInVideoModal } from "./hook";
import type { UUID } from "@/types/core";
import { useCheckLessonVideo } from "@/hooks";

interface CreateQuizInVideoModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lessonId: UUID;
  onSuccess?: () => void;
}

export default function CreateQuizInVideoModal({
  isOpen,
  onOpenChange,
  lessonId,
  onSuccess,
}: CreateQuizInVideoModalProps) {
  const {
    form,
    optionsList,
    handleAddOption,
    handleRemoveOption,
    handleOptionChange,
    onSubmit,
    isLoading,
  } = useCreateQuizInVideoModal({
    lessonId,
    onSuccess: () => {
      onOpenChange(false);
      onSuccess?.();
    },
  });

  // Check for existing quiz for this lesson and render readonly if present
  const { data: existingQuiz, isLoading: isChecking } =
    useCheckLessonVideo(lessonId);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Quiz in Video</DialogTitle>
          <DialogDescription>
            Add a single-choice question at a specific timestamp in the video
          </DialogDescription>
        </DialogHeader>

        {isChecking ? (
          <div className="p-6 text-center">
            <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
            <p className="text-sm text-muted-foreground">Checking quiz...</p>
          </div>
        ) : existingQuiz?.data ? (
          <div className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              A quiz already exists for this lesson. It is shown below in
              read-only mode.
            </p>

            <div className="border rounded-md p-4 bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Timestamp</p>
                  <p className="font-medium">{existingQuiz.data.time}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Correct Answer
                  </p>
                  <p className="font-medium">
                    {existingQuiz.data.correctAnswer}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium">Question</h4>
                <p className="text-sm text-muted-foreground">
                  {existingQuiz.data.question}
                </p>

                <div className="mt-3 space-y-2">
                  {existingQuiz.data.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-md border flex items-center justify-between ${
                        opt === existingQuiz?.data?.correctAnswer
                          ? "border-green-500 bg-green-50"
                          : "bg-background"
                      }`}
                    >
                      <span>{opt}</span>
                      {opt === existingQuiz?.data?.correctAnswer && (
                        <span className="text-sm text-green-600">Correct</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Time Field */}
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timestamp (mm:ss)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="02:30"
                        pattern="\d{1,2}:\d{2}"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Question Field */}
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter the quiz question..."
                        className="min-h-20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Options */}
              <div className="space-y-3">
                <FormLabel>Options</FormLabel>
                {optionsList.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                    />
                    {optionsList.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveOption(index)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {optionsList.length < 6 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddOption}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                )}
              </div>

              {/* Correct Answer */}
              <FormField
                control={form.control}
                name="correctAnswer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correct Answer</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the correct answer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {optionsList
                          .filter((opt) => opt.trim() !== "")
                          .map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Quiz"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
