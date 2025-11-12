import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { lessonService } from "@/services/course/lesson-service";
import type { UUID } from "@/types";
import type {
  CreateLessonReq,
  UpdateLessonReq,
} from "@/types/db/course/lesson";
import { moduleQueryKeys } from "./module-hooks";

export const lessonQueryKeys = {
  allLessons: ["lessons"] as const,
  lessonLists: () => [...lessonQueryKeys.allLessons, "list"] as const,
  lessonDetails: () => [...lessonQueryKeys.allLessons, "detail"] as const,
  lessonDetail: (id: UUID) => [...lessonQueryKeys.lessonDetails(), id] as const,
};

export const useGetLessons = () => {
  return useQuery({
    queryKey: lessonQueryKeys.lessonLists(),
    queryFn: lessonService.getLessons,
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLessonReq) => lessonService.createLesson(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: lessonQueryKeys.allLessons });
      queryClient.invalidateQueries({
        queryKey: moduleQueryKeys.moduleLessons(res.data?.moduleId as UUID),
      });
      queryClient.invalidateQueries({
        queryKey: ["courses", "detail"],
        refetchType: "active",
      });
    },
  });
};

export const useGetLessonById = (lessonId: UUID) => {
  return useQuery({
    queryKey: lessonQueryKeys.lessonDetail(lessonId),
    queryFn: () => lessonService.getLessonById(lessonId),
    enabled: !!lessonId,
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      data,
    }: {
      lessonId: UUID;
      data: UpdateLessonReq;
    }) => lessonService.updateLesson(lessonId, data),
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({
        queryKey: lessonQueryKeys.lessonDetail(lessonId),
      });
      queryClient.invalidateQueries({
        queryKey: ["courses", "detail"],
        refetchType: "active",
      });
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId: UUID) => lessonService.deleteLesson(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["modules", "lessons"],
      });
      queryClient.invalidateQueries({
        queryKey: ["courses", "detail"],
        refetchType: "active",
      });
    },
  });
};
