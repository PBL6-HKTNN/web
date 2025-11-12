import { useGetCourseContentById} from '@/hooks/queries/course/course-hooks';
import { useGetLessonsByModule } from '@/hooks/queries/course/module-hooks';

export function useCourseDetailPage(courseId: string) {
  // Get course basic information
  const {
    data: courseData,
    isLoading: isLoadingCourse,
    error: courseError
  } = useGetCourseContentById(courseId);

  const course = courseData?.data?.course;
  const modules = courseData?.data?.module || [];

  return {
    course,
    modules,
    isLoading: isLoadingCourse,
    error: courseError,
  };
}

export function useModuleLessons(moduleId: string) {
  const {
    data: lessonsData,
    isLoading: isLoadingLessons,
    error: lessonsError
  } = useGetLessonsByModule(moduleId);

  return {
    lessons: lessonsData?.data || [],
    isLoading: isLoadingLessons,
    error: lessonsError,
  };
}