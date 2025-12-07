import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { enrollmentService } from "@/services/course/enrollment-service";
import type { UUID } from "@/types";
import type {
  GetEnrolledCourseFilterReq,
  UpdateCurrentViewReq,
  UpdateEnrollmentReq,
  GetEnrolledCoursesResponse,
} from "@/types/db/course/enrollment";

export const enrollmentQueryKeys = {
  allEnrollments: ["enrollments"] as const,
  enrollmentLists: (filters?: GetEnrolledCourseFilterReq) =>
    [...enrollmentQueryKeys.allEnrollments, "list", filters] as const,
  enrollmentStudents: (courseId?: UUID) =>
    [...enrollmentQueryKeys.allEnrollments, "students", courseId] as const,
  enrollmentLastDate: (courseId?: UUID) =>
    [...enrollmentQueryKeys.allEnrollments, "lastDate", courseId] as const,
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

export const useGetEnrolledCourses = (filter?: GetEnrolledCourseFilterReq) => {
  return useInfiniteQuery({
    queryKey: enrollmentQueryKeys.enrollmentLists(filter),
    queryFn: ({ pageParam = 1 }) =>
      enrollmentService.getEnrolledCourses({ ...filter, Page: pageParam }),
    initialPageParam: 1,
    retry: 1,
    getNextPageParam: (
      lastPage: GetEnrolledCoursesResponse,
      allPages: GetEnrolledCoursesResponse[]
    ) => {
      const hasData =
        lastPage &&
        lastPage.data &&
        Array.isArray(lastPage.data) &&
        lastPage.data.length > 0;
      return hasData ? allPages.length + 1 : undefined;
    },
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

export const useGetCourseEnrolledStudents = (courseId?: UUID) => {
  return useQuery({
    queryKey: enrollmentQueryKeys.enrollmentStudents(courseId),
    queryFn: () => enrollmentService.getCourseEnrolledStudents(courseId || ""),
    enabled: !!courseId,
  });
};

export const useGetLastDateCourse = (courseId?: UUID) => {
  return useQuery({
    queryKey: enrollmentQueryKeys.enrollmentLastDate(courseId),
    queryFn: () => enrollmentService.getLastDateCourse(courseId || ""),
    enabled: !!courseId,
  });
};
