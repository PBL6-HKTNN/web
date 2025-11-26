import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enrollmentService } from "@/services/course/enrollment-service";
import type { UUID } from "@/types";
import type {
  UpdateCurrentViewReq,
  UpdateEnrollmentReq,
} from "@/types/db/course/enrollment";

export const enrollmentQueryKeys = {
  allEnrollments: ["enrollments"] as const,
  enrollmentLists: () =>
    [...enrollmentQueryKeys.allEnrollments, "list"] as const,
  enrollmentCheck: (courseId: UUID) =>
    [...enrollmentQueryKeys.allEnrollments, "check", courseId] as const,
  enrollmentCompletedLessons: (enrollmentId: UUID) =>
    [
      ...enrollmentQueryKeys.allEnrollments,
      "completedLessons",
      enrollmentId,
    ] as const,
};

export const useIsEnrolled = (courseId: UUID) => {
  return useQuery({
    queryKey: enrollmentQueryKeys.enrollmentCheck(courseId),
    queryFn: () => enrollmentService.isEnrolled(courseId),
    enabled: !!courseId,
  });
};

export const useEnroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: UUID) => enrollmentService.enroll(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: enrollmentQueryKeys.allEnrollments,
      });
    },
  });
};

export const useUpdateEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEnrollmentReq) =>
      enrollmentService.updateEnrollment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: enrollmentQueryKeys.allEnrollments,
      });
    },
  });
};

export const useUpdateEnrollmentProgress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { courseId: UUID; lessonId: UUID }) =>
      enrollmentService.updateEnrollmentProgress(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: enrollmentQueryKeys.allEnrollments,
      });
      queryClient.invalidateQueries({
        queryKey: enrollmentQueryKeys.enrollmentCompletedLessons(
          data.data?.id || ""
        ),
      });
    },
  });
};

export const useUpdateEnrollmentCurrentView = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCurrentViewReq) =>
      enrollmentService.updateEnrollmentCurrentView(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: enrollmentQueryKeys.allEnrollments,
      });
    },
  });
};

export const useGetEnrolledCourses = () => {
  return useQuery({
    queryKey: enrollmentQueryKeys.enrollmentLists(),
    queryFn: enrollmentService.getEnrolledCourses,
  });
};

export const useGetEnrolledCourseCompletedLessons = (enrollmentId: UUID) => {
  return useQuery({
    queryKey: enrollmentQueryKeys.enrollmentCompletedLessons(enrollmentId),
    queryFn: () =>
      enrollmentService.getEnrolledCourseCompletedLessons(enrollmentId),
    enabled: !!enrollmentId,
  });
};
