import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { quizService } from "@/services/course/quiz-service";
import type { UUID } from "@/types";
import type {
  CreateQuizReq,
  UpdateQuizReq,
  QuizSubmissionReq,
} from "@/types/db/course/quiz";

export const quizQueryKeys = {
  allQuizzes: ["quizzes"] as const,
  quizDetails: () => [...quizQueryKeys.allQuizzes, "detail"] as const,
  quizDetail: (id: UUID) => [...quizQueryKeys.quizDetails(), id] as const,
  quizByLessonId: (lessonId: UUID) =>
    [...quizQueryKeys.allQuizzes, "lesson", lessonId] as const,
  quizAttempts: (quizId: UUID) =>
    [...quizQueryKeys.allQuizzes, "attempts", quizId] as const,
  beginQuizAttempt: ["beginQuizAttempt"] as const,
};

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuizReq) => quizService.createQuiz(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: quizQueryKeys.allQuizzes });
      queryClient.invalidateQueries({
        queryKey: quizQueryKeys.quizByLessonId(variables.lessonId),
      });
      // Also invalidate lesson data in case it affects lesson info
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
};

export const useGetQuizById = (quizId: UUID) => {
  return useQuery({
    queryKey: quizQueryKeys.quizDetail(quizId),
    queryFn: () => quizService.getQuizById(quizId),
    enabled: !!quizId,
  });
};

export const useGetQuizByLessonId = (lessonId: UUID) => {
  return useQuery({
    queryKey: quizQueryKeys.quizByLessonId(lessonId),
    queryFn: () => quizService.getQuizByLessonId(lessonId),
    enabled: !!lessonId,
  });
};

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, data }: { quizId: UUID; data: UpdateQuizReq }) =>
      quizService.updateQuiz(quizId, data),
    onSuccess: (_, { quizId, data }) => {
      queryClient.invalidateQueries({
        queryKey: quizQueryKeys.quizDetail(quizId),
      });
      queryClient.invalidateQueries({ queryKey: quizQueryKeys.allQuizzes });
      queryClient.invalidateQueries({
        queryKey: quizQueryKeys.quizByLessonId(data.lessonId),
      });
      // Also invalidate lesson data in case it affects lesson info
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
};

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizId: UUID) => quizService.deleteQuiz(quizId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizQueryKeys.allQuizzes });
      // Invalidate all quiz-by-lesson queries since we don't know which lesson it belonged to
      queryClient.invalidateQueries({ queryKey: ["quizzes", "lesson"] });
      // Also invalidate lesson data in case it affects lesson info
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
};

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: QuizSubmissionReq) => quizService.submitQuiz(data),
    onSuccess: () => {
      // Invalidate quiz-related queries after submission
      queryClient.invalidateQueries({ queryKey: quizQueryKeys.allQuizzes });
    },
  });
};

export const useBeginQuizAttempt = (quizId: UUID) => {
  return useMutation({
    mutationKey: [...quizQueryKeys.beginQuizAttempt, quizId],
    mutationFn: () => quizService.beginQuizAttempt(quizId),
  });
};
