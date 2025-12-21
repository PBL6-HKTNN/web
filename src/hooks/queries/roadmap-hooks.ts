import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import roadmapService from "@/services/roadmap-service";
import type {
  CreateRoadmapReq,
  UpdateRoadmapReq,
  AddCourseToRoadmapReq,
  ReorderRoadmapCoursesReq,
} from "@/types/db/roadmap";
import type { UUID } from "@/types";
import { toast } from "sonner";

export const roadmapQueryKeys = {
  all: ["roadmaps"] as const,
  lists: () => [...roadmapQueryKeys.all, "list"] as const,
  details: () => [...roadmapQueryKeys.all, "detail"] as const,
  detail: (id: UUID) => [...roadmapQueryKeys.details(), id] as const,
  my: () => [...roadmapQueryKeys.all, "my"] as const,
};

export const useMyRoadmaps = () => {
  return useQuery({
    queryKey: roadmapQueryKeys.my(),
    queryFn: () => roadmapService.getMy(),
  });
};

export const useRoadmapDetail = (id: UUID | undefined) => {
  return useQuery({
    queryKey: roadmapQueryKeys.detail(id!),
    queryFn: () => roadmapService.getDetail(id!),
    enabled: !!id,
  });
};

export const useCreateRoadmap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRoadmapReq) => roadmapService.create(data),
    onSuccess: (response) => {
      if (response.isSuccess) {
        toast.success("Roadmap created successfully");
        queryClient.invalidateQueries({ queryKey: roadmapQueryKeys.my() });
      } else {
        toast.error("Failed to create roadmap");
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to create roadmap: " + error.message);
    },
  });
};

export const useUpdateRoadmap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: UUID; data: UpdateRoadmapReq }) =>
      roadmapService.update(id, data),
    onSuccess: (response, variables) => {
      if (response.isSuccess) {
        toast.success("Roadmap updated successfully");
        queryClient.invalidateQueries({
          queryKey: roadmapQueryKeys.detail(variables.id),
        });
        queryClient.invalidateQueries({ queryKey: roadmapQueryKeys.my() });
      } else {
        toast.error("Failed to update roadmap");
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to update roadmap: " + error.message);
    },
  });
};

export const useJoinRoadmap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: UUID) => roadmapService.join(id),
    onSuccess: (response, roadmapId) => {
      if (response.isSuccess) {
        toast.success("Joined roadmap successfully");
        queryClient.invalidateQueries({
          queryKey: roadmapQueryKeys.detail(roadmapId),
        });
        queryClient.invalidateQueries({ queryKey: roadmapQueryKeys.my() });
      } else {
        toast.error("Failed to join roadmap");
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to join roadmap: " + error.message);
    },
  });
};

export const useAddCourseToRoadmap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: UUID;
      data: AddCourseToRoadmapReq;
    }) => roadmapService.addCourse(id, data),
    onSuccess: (response, variables) => {
      if (response.isSuccess) {
        toast.success("Course added to roadmap successfully");
        queryClient.invalidateQueries({
          queryKey: roadmapQueryKeys.detail(variables.id),
        });
      } else {
        toast.error("Failed to add course to roadmap");
      }
    },
    onError: (error: Error) => {
      toast.error(
        "Failed to add course to roadmap: " + error.message
      );
    },
  });
};

export const useReorderRoadmapCourses = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: UUID;
      data: ReorderRoadmapCoursesReq;
    }) => roadmapService.reorderCourses(id, data),
    onSuccess: (response, variables) => {
      if (response.isSuccess) {
        toast.success("Courses reordered successfully");
        queryClient.invalidateQueries({
          queryKey: roadmapQueryKeys.detail(variables.id),
        });
      } else {
        toast.error("Failed to reorder courses");
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to reorder courses: " + error.message);
    },
  });
};

export const useRemoveCourseFromRoadmap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, courseId }: { id: UUID; courseId: UUID }) =>
      roadmapService.removeCourse(id, courseId),
    onSuccess: (response, variables) => {
      if (response.isSuccess) {
        toast.success("Course removed from roadmap successfully");
        queryClient.invalidateQueries({
          queryKey: roadmapQueryKeys.detail(variables.id),
        });
      } else {
        toast.error("Failed to remove course from roadmap");
      }
    },
    onError: (error: Error) => {
      toast.error(
        "Failed to remove course from roadmap: " + error.message
      );
    },
  });
};

export const useSyncRoadmapProgress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: UUID) => roadmapService.syncProgress(id),
    onSuccess: (response, roadmapId) => {
      if (response.isSuccess) {
        toast.success("Roadmap progress synced successfully");
        queryClient.invalidateQueries({
          queryKey: roadmapQueryKeys.detail(roadmapId),
        });
        queryClient.invalidateQueries({ queryKey: roadmapQueryKeys.my() });
      } else {
        toast.error("Failed to sync roadmap progress");
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to sync roadmap progress: " + error.message);
    },
  });
};

export const useDeleteRoadmap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: UUID) => roadmapService.delete(id),
    onSuccess: (response) => {
      if (response.isSuccess) {
        toast.success("Roadmap deleted successfully");
        queryClient.invalidateQueries({ queryKey: roadmapQueryKeys.my() });
      } else {
        toast.error("Failed to delete roadmap");
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to delete roadmap: " + error.message);
    },
  });
};

