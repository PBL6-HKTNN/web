import { useRoadmapDetail } from "@/hooks/queries/roadmap-hooks";
import { useGetCourses } from "@/hooks/queries/course/course-hooks";
import type { UUID } from "@/types";
import type { Course } from "@/types/db/course";

export const useRoadmapDetailComponent = (
  roadmapId: UUID,
  options?: { maxSlices?: number }
) => {
  // Data fetching for roadmap
  const {
    data: roadmapData,
    isLoading: isLoadingRoadmap,
    error,
  } = useRoadmapDetail(roadmapId);
  const roadmap = roadmapData?.data?.roadmap;

  // Fetch courses (paginated). Use a large PageSize to reduce pages if possible.
  const { data: coursePages, isLoading: isLoadingCourses } = useGetCourses({
    PageSize: 100,
  });

  // Flatten courses returned by pages
  const pages = (coursePages?.pages ?? []) as Array<{ data?: Course[] }>;
  const courses: Course[] = pages.flatMap((p) => p.data ?? []);

  const maxSlices = options?.maxSlices ?? 6;

  // Preserve roadmap order: map roadmap.courseIds -> find course -> take thumbnail if any
  const imageUrls: string[] = (roadmap?.courseIds ?? [])
    .map((id) => courses.find((c: Course) => c.id === id)?.thumbnail)
    .filter((t): t is string => !!t)
    .slice(0, maxSlices);

  return {
    // Data
    roadmap,
    isLoading: isLoadingRoadmap || isLoadingCourses,
    error,
    imageUrls,
    isLoadingCourses,
  };
};
