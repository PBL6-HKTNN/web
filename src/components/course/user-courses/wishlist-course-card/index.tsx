import { Clock, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "@tanstack/react-router";
import type { Course, WishlistItem } from "@/types/db/course/course";

interface WishlistCourseCardProps {
  wishlistItem: WishlistItem;
  onRemove?: (courseId: string) => void;
  isRemoving?: boolean;
}

export function WishlistCourseCard({
  wishlistItem,
  onRemove,
  isRemoving = false
}: WishlistCourseCardProps) {
  const navigate = useNavigate();
  const course = wishlistItem.course;

  if (!course) return null;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <div className="flex">
        {/* Course Thumbnail */}
        <div className="w-32 h-24 flex-shrink-0 relative overflow-hidden rounded-l-lg">
          <img
            src={course.thumbnail || "/placeholder-course.jpg"}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Course Content */}
        <CardContent className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-base mb-1 group-hover:text-primary transition-colors">
                {course.title}
              </h3>

              <div className="flex items-center gap-3 mb-2 text-sm text-muted-foreground">
                <span>by {(course as Course).instructor?.name || 'Unknown'}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{course.averageRating}</span>
                </div>
                <span>({formatNumber((course as Course).reviews?.length || 0)})</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDuration(course.duration)}</span>
                </div>
                <span>{formatNumber((course as Course).totalStudents || 0)} students</span>
                <Badge variant="secondary" className="text-xs">
                  {course.level}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                Added {new Date(wishlistItem.addedDate as string).toLocaleDateString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 ml-4">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate({ to: `/course/${course.id}` });
                }}
              >
                View Course
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.(course.id);
                }}
                disabled={isRemoving}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
