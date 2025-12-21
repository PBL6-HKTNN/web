import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Clock, BookOpen, Star } from "lucide-react";
import { parseTimespanToMinutes } from "@/utils/time-utils";
import type { Course } from "@/types/db/course";

interface CourseHeaderProps {
  course: Course;
}

export function CourseHeader({ course }: CourseHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row gap-6 p-6 lg:p-8">
            {/* Course Image */}
            <div className="flex-shrink-0">
              <img
                src={course.thumbnail || "/placeholder-course.jpg"}
                alt={course.title}
                className="w-full h-48 lg:w-48 lg:h-32 object-cover rounded-lg"
              />
            </div>

            {/* Course Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2 break-words">
                    {course.title}
                  </h1>
                  <p className="text-muted-foreground text-sm lg:text-base mb-3 line-clamp-2">
                    {course.description}
                  </p>
                </div>
                <Badge variant="secondary" className="self-start">
                  {course.level}
                </Badge>
              </div>

              {/* Course Stats - Responsive Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">
                    {parseTimespanToMinutes(course.duration)} minutes
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span>{course.numberOfReviews} reviews</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                  <span>{course.averageRating}</span>
                </div>
              </div>

              {/* Price and Status */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">
                    ${course.price}
                  </span>
                  <Badge variant="outline">{course.status}</Badge>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate({ to: `/course/${course.id}` })}
                  >
                    View Course
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
