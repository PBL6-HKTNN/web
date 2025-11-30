import { Star, Clock, Users, ShoppingCart, BookOpen, CheckCircle } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/payment/add-to-cart-button";
import type { Course } from "@/types/db/course";
import { formatPriceSimple } from "@/utils/format";

interface CourseCardProps {
  course: Course & {
    isInCart?: boolean;
    isEnrolled?: boolean;
  };
}

export function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();

  // const handleClick = () => {
  //   navigate({ to: `/course/${course.id}` });
  // };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      e.stopPropagation();
      return;
    }
    navigate({ to: `/course/${course.id}` });
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return formatPriceSimple(price);
  };

  return (
    <Card
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 py-0"
      onClick={handleCardClick}
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
        {course.isEnrolled && (
          <Badge className="absolute top-2 left-2 bg-blue-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Enrolled
          </Badge>
        )}
        {course.isInCart && !course.isEnrolled && (
          <Badge className="absolute top-2 left-2 bg-orange-600">
            <ShoppingCart className="w-3 h-3 mr-1" />
            In Cart
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
            <div className="flex gap-2">
              {course.isEnrolled ? (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ to: `/learn/${course.id}` });
                  }}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
              ) : course.isInCart ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({ to: `/cart` });
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    View Cart
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({ to: `/course/${course.id}` });
                    }}
                  >
                    View Details
                  </Button>
                </>
              ) : (
                <>
                  {course.price > 0 && (
                    <AddToCartButton
                      courseId={course.id}
                      variant="outline"
                      size="sm"
                      showText={false}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  )}
                  <Button
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({ to: `/course/${course.id}` });
                    }}
                  >
                    View Details
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
