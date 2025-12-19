import {
  Star,
  Clock,
  Users,
  ShoppingCart,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/payment/add-to-cart-button";
import type { Course } from "@/types/db/course";
import { CourseStatus } from "@/types/db/course";
import { formatPriceSimple } from "@/utils/format";
import { getAuthState } from "@/hooks";

interface CourseCardProps {
  course: Course & {
    isInCart?: boolean;
  };
}

export function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();
  const { user } = getAuthState();

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) {
      e.stopPropagation();
      return;
    }
    navigate({ to: `/course/${course.id}` });
  };

  const isDraft =
    course?.status === CourseStatus.DRAFT && user?.id === course.instructorId;

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return formatPriceSimple(price);
  };

  return (
    <Card
      className="group relative cursor-pointer overflow-hidden border-none transition-all duration-500 hover:shadow-2xl hover:ring-1 hover:ring-primary/50 min-h-[240px] flex flex-col"
      onClick={handleCardClick}
    >
      {/* Background Image with Blending */}
      <div className="absolute inset-0 z-0">
        <img
          src={course.thumbnail || "/placeholder-course.jpg"}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20 dark:from-slate-950 dark:via-slate-900/80 dark:to-slate-900/30" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-primary" />
      </div>

      {/* Badges Overlay */}
      <div className="relative z-10 p-3 flex justify-between items-start">
        <div className="flex flex-wrap gap-2">
          {course.isEnrolled && (
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 backdrop-blur-md font-bold">
              <CheckCircle className="w-3 h-3 mr-1" />
              Enrolled
            </Badge>
          )}
          {course.isInCart && !course.isEnrolled && (
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 backdrop-blur-md font-bold">
              <ShoppingCart className="w-3 h-3 mr-1" />
              In Cart
            </Badge>
          )}
        </div>
        {course.price === 0 && (
          <Badge className="bg-emerald-500 text-white border-none font-bold shadow-lg">
            Free
          </Badge>
        )}
      </div>

      {/* Course Content */}
      <CardContent className="relative z-10 mt-auto p-4 text-white flex flex-col gap-2">
        <h3 className="font-extrabold text-lg leading-tight line-clamp-2 group-hover:text-primary-foreground transition-colors">
          {course.title}
        </h3>

        <div className="flex items-center gap-3 text-xs font-medium text-gray-300">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-white">
              {course.averageRating.toFixed(1)}
            </span>
            <span className="opacity-70">({course.numberOfReviews})</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{course.level}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 mt-1 border-t border-white/10">
          <div className="text-xl font-black text-white">
            {formatPrice(course.price)}
          </div>

          <div className="flex gap-2">
            {isDraft ? (
              <Button
                size="sm"
                className="bg-white text-black hover:bg-primary hover:text-white font-bold transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate({ to: `/lecturing-tool/course/${course.id}` });
                }}
              >
                Edit
              </Button>
            ) : course.isEnrolled ? (
              <Button
                size="sm"
                className="bg-white text-black hover:bg-primary hover:text-white font-bold transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate({ to: `/learn/${course.id}` });
                }}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Learn
              </Button>
            ) : (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                {course.price > 0 && (
                  <AddToCartButton
                    courseId={course.id}
                    variant="outline"
                    size="sm"
                    showText={false}
                    className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-black"
                  />
                )}
                <Button
                  size="sm"
                  className="bg-white text-black hover:bg-primary hover:text-white font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ to: `/course/${course.id}` });
                  }}
                >
                  Details
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
