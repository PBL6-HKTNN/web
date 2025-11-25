import { Star, Clock, Users } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Course } from "@/types/db/course";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: `/course/${course.id}` });
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `$${price}`;
  };

  return (
    <Card
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 py-0"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden aspect-video rounded-t-lg ">
        <img
          src={course.thumbnail || "/placeholder-course.jpg"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {course.price === 0 && (
          <Badge className="absolute top-2 right-2 bg-green-600">
            Free
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          {/* Instructor */}
          {course.instructorId && (
            <p className="text-sm text-muted-foreground">
              By {course.instructorId}
            </p>
          )}

          {/* Rating and Reviews */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-sm">
                {course.averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({course.numberOfReviews} reviews)
            </span>
          </div>

          {/* Course Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{(course.duration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.level}</span>
            </div>
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xl font-bold">
              {formatPrice(course.price)}
            </div>
            {/* <Button
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              View Details
            </Button> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
