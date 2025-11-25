import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { moduleService } from "@/services/course/module-service";
import type { UUID } from "@/types";
import type {
  CreateModuleReq,
  UpdateModuleReq,
} from "@/types/db/course/module";
import { lessonQueryKeys } from "./lesson-hooks";

export const moduleQueryKeys = {
  allModules: ["modules"] as const,
  moduleLists: () => [...moduleQueryKeys.allModules, "list"] as const,
  moduleDetails: () => [...moduleQueryKeys.allModules, "detail"] as const,
  moduleDetail: (id: UUID) => [...moduleQueryKeys.moduleDetails(), id] as const,
  moduleLessons: (moduleId: UUID) =>
    [...moduleQueryKeys.allModules, "lessons", moduleId] as const,
};

export const useGetModules = () => {
  return useQuery({
    queryKey: moduleQueryKeys.moduleLists(),
    queryFn: moduleService.getModules,
  });
};

export const useCreateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateModuleReq) => moduleService.createModule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: moduleQueryKeys.allModules,
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["courses", "detail"],
        refetchType: "active",
      });
    },
  });
};

export const useGetLessonsByModule = (moduleId: UUID) => {
  return useQuery({
    queryKey: moduleQueryKeys.moduleLessons(moduleId),
    queryFn: () => moduleService.getLessonsByModule(moduleId),
    enabled: !!moduleId,
  });
};

export const useGetModuleById = (moduleId: UUID) => {
  return useQuery({
    queryKey: moduleQueryKeys.moduleDetail(moduleId),
    queryFn: () => moduleService.getModuleById(moduleId),
    enabled: !!moduleId,
  });
};

export const useUpdateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      moduleId,
      data,
    }: {
      moduleId: UUID;
      data: UpdateModuleReq;
    }) => moduleService.updateModule(moduleId, data),
    onSuccess: (_, { moduleId }) => {
      queryClient.invalidateQueries({
        queryKey: moduleQueryKeys.moduleDetail(moduleId),
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: moduleQueryKeys.allModules,
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: lessonQueryKeys.allLessons,
      });
      queryClient.invalidateQueries({
        queryKey: ["courses", "detail"],
        refetchType: "active",
      });
    },
  });
};

export const useDeleteModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (moduleId: UUID) => moduleService.deleteModule(moduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: moduleQueryKeys.allModules,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: lessonQueryKeys.allLessons,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["courses", "detail"],
        refetchType: "active",
      });
    },
  });
};
