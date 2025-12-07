import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { courseService } from "@/services/course/course-service";
import type { UUID } from "@/types";
import type {
  CreateCourseReq,
  GetCoursesFilterReq,
  UpdateCourseReq,
  ValidateCourseReq,
} from "@/types/db/course";
import type {
  ChangeCourseStatusReq,
  ModChangeCourseStatusReq,
  PreSubmitCheckReq,
} from "@/types/db/course";

export const courseQueryKeys = {
  allCourses: ["courses"] as const,
  courseLists: (filters?: GetCoursesFilterReq) =>
    [...courseQueryKeys.allCourses, "list", filters] as const,
  courseDetails: () => [...courseQueryKeys.allCourses, "detail"] as const,
  courseDetail: (id: UUID) => [...courseQueryKeys.courseDetails(), id] as const,
  courseContent: (id: UUID) =>
    [...courseQueryKeys.courseDetail(id), "content"] as const,
  courseModules: (courseId: UUID) =>
    [...courseQueryKeys.allCourses, "modules", courseId] as const,
};

export const useGetCourses = (filters: GetCoursesFilterReq) => {
  return useInfiniteQuery({
    queryKey: courseQueryKeys.courseLists(filters),
    queryFn: ({ pageParam = 1 }) =>
      courseService.getCourses({ ...filters, Page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Stop when the current page has no data
      const hasData =
        lastPage.data &&
        Array.isArray(lastPage.data) &&
        lastPage.data.length > 0;
      return hasData ? allPages.length + 1 : undefined;
    },
  });
};

export const useGetCourseById = (id: UUID) => {
  return useQuery({
    queryKey: courseQueryKeys.courseDetail(id),
    queryFn: () => courseService.getCourseById(id),
    enabled: !!id,
  });
};

export const useGetCourseContentById = (id: UUID) => {
  return useQuery({
    queryKey: courseQueryKeys.courseContent(id),
    queryFn: () => courseService.getCourseContentById(id),
    enabled: !!id,
  });
};

export const useGetModulesByCourse = (courseId: UUID) => {
  return useQuery({
    queryKey: courseQueryKeys.courseModules(courseId),
    queryFn: () => courseService.getModulesByCourse(courseId),
    enabled: !!courseId,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseReq) => courseService.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseQueryKeys.allCourses });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      data,
    }: {
      courseId: UUID;
      data: UpdateCourseReq;
    }) => courseService.updateCourse(courseId, data),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({
        queryKey: courseQueryKeys.courseDetail(courseId),
      });
      queryClient.invalidateQueries({ queryKey: courseQueryKeys.allCourses });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: UUID) => courseService.deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseQueryKeys.allCourses });
    },
  });
};

export const useValidateCourse = () => {
  return useMutation({
    mutationFn: (data: ValidateCourseReq) => courseService.validateCourse(data),
  });
};

export const useChangeCourseStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangeCourseStatusReq) =>
      courseService.changeCourseStatus(data),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({
        queryKey: courseQueryKeys.courseDetail(courseId),
      });
      queryClient.invalidateQueries({ queryKey: courseQueryKeys.allCourses });
    },
  });
};

export const useModChangeCourseStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ModChangeCourseStatusReq) =>
      courseService.modChangeCourseStatus(data),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({
        queryKey: courseQueryKeys.courseDetail(courseId),
      });
      queryClient.invalidateQueries({ queryKey: courseQueryKeys.allCourses });
    },
  });
};

export const useRequestBanCourse = (courseId?: UUID) => {
  return useQuery({
    queryKey: ["course", "requested-ban", courseId],
    queryFn: () => courseService.requestedBanCourse(courseId as UUID),
    enabled: !!courseId,
  });
};

export const usePreSubmitCheck = () => {
  return useMutation({
    mutationFn: (data: PreSubmitCheckReq) => courseService.preSubmitCheck(data),
  });
};
