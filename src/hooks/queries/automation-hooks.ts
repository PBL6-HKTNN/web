import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  ContentGenerationReq,
  ContentGenerationRes,
  QuizGenerationReq,
  QuizGenerationRes,
} from "@/types/ai";
import { automationService } from "@/services/automation-service";

export const useGenerateQuiz = () => {
  return useMutation({
    mutationFn: (data: QuizGenerationReq) =>
      automationService.generateQuiz(data),
    onSuccess: (data: QuizGenerationRes) => {
      if (data.isSuccess) {
        toast.success("Quiz generated successfully");
      } else {
        toast.error("Failed to generate quiz");
      }
    },
    onError: () => {
      toast.error("Failed to generate quiz");
    },
  });
};

export const useGenerateContent = () => {
  return useMutation({
    mutationFn: (data: ContentGenerationReq) =>
      automationService.generateContent(data),
    onSuccess: (data: ContentGenerationRes) => {
      if (data.isSuccess) {
        toast.success("Content generated successfully");
      } else {
        toast.error("Failed to generate content");
      }
    },
    onError: () => {
      toast.error("Failed to generate content");
    },
  });
};
