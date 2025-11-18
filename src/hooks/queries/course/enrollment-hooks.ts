import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enrollmentService } from "@/services/course/enrollment-service";
import type { UUID } from "@/types";
import type { UpdateEnrollmentReq } from "@/types/db/course/enrollment";

export const enrollmentQueryKeys = {
  allEnrollments: ["enrollments"] as const,
  enrollmentLists: () => [...enrollmentQueryKeys.allEnrollments, "list"] as const,
  enrollmentCheck: (courseId: UUID) =>
    [...enrollmentQueryKeys.allEnrollments, "check", courseId] as const,
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
    mutationFn: (data: UpdateEnrollmentReq) => enrollmentService.updateEnrollment(data),
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
