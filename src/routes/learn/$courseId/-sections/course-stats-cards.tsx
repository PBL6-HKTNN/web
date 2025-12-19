import { Card, CardContent } from "@/components/ui/card";
import { useGetAverageRatingByCourse } from "@/hooks/queries/review-hooks";
import type { Course } from "@/types/db/course";

interface CourseStatsCardsProps {
  course: Course;
  modulesCount: number;
  totalLessons: number;
}

export function CourseStatsCards({
  course,
  modulesCount,
  totalLessons,
}: CourseStatsCardsProps) {
  const { data: averageData, isLoading: averageLoading } =
    useGetAverageRatingByCourse(course.id);

  const averageRating =
    averageData?.data?.averageRating ?? course.averageRating ?? null;

  const ratingDisplay = averageLoading
    ? "Loading..."
    : averageRating !== null
      ? Number(averageRating).toFixed(1)
      : "—";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {modulesCount}
          </div>
          <div className="text-sm text-muted-foreground">Modules</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {totalLessons}
          </div>
          <div className="text-sm text-muted-foreground">Lessons</div>
        </CardContent>
      </Card>
      <Card className="sm:col-span-2 lg:col-span-1">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {ratingDisplay}
          </div>
          <div className="text-sm text-muted-foreground">Rating</div>
        </CardContent>
      </Card>
    </div>
  );
}
