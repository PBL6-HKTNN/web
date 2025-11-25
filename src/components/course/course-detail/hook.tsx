import { useGetCourseContentById } from "@/hooks/queries/course/course-hooks";

export const useCourseDetail = (courseId: string) => {
  const { data, isLoading, error } = useGetCourseContentById(courseId);

  return {
    course: data?.data?.course,
    modules: data?.data?.module || [],
    isLoading,
    error,
  };
};