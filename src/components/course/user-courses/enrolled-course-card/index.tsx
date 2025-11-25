import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { EnrolledCourseItem } from "@/types/db/course/enrollment";

interface EnrolledCourseCardProps {
  course: EnrolledCourseItem;
}


export function EnrolledCourseCard({ course }: EnrolledCourseCardProps) {
  const navigate = useNavigate();
  return (
    <Card className="group cursor-pointer py-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50/50 overflow-hidden">
      <div className="flex relative">
        {/* Course Thumbnail */}
        <div className="w-36 h-28 flex-shrink-0 relative overflow-hidden rounded-l-lg">
          <img
            src={course.thumbnail || "/placeholder-course.jpg"}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Course Content */}
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between h-full">
            <div className="flex-1 pr-4">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-200 leading-tight">
                {course.title}
              </h3>

              {course.description && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                  {course.description}
                </p>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Instructor:</span>
                <span className="font-medium">{course.instructorId}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 ml-6">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate({ to: `/learn/${course.id}` });
                }}
                className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
              >
                Continue Learning
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Card>
  );
}
