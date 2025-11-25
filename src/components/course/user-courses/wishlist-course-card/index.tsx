import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import type { WishlistedCourseItem } from "@/types/db/course/wishlist";

interface WishlistCourseCardProps {
  wishlistItem: WishlistedCourseItem;
  onRemove?: (courseId: string) => void;
  isRemoving?: boolean;
}

export function WishlistCourseCard({
  wishlistItem,
  onRemove,
  isRemoving = false
}: WishlistCourseCardProps) {
  const navigate = useNavigate();
  return (
    <Card className="group cursor-pointer py-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50/50 overflow-hidden">
      <div className="flex relative">
        {/* Course Thumbnail */}
        <div className="w-36 h-28 flex-shrink-0 relative overflow-hidden rounded-l-lg">
          <img
            src={wishlistItem.thumbnail || "/placeholder-course.jpg"}
            alt={wishlistItem.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Course Content */}
        <CardContent className="flex-1 p-5">
          <div className="flex items-start justify-between h-full">
            <div className="flex-1 pr-4">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-200 leading-tight">
                {wishlistItem.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {wishlistItem.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 ml-6">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate({ to: `/course/${wishlistItem.courseId}` });
                }}
                className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
              >
                View Course
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.(wishlistItem.courseId);
                }}
                disabled={isRemoving}
                className="border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isRemoving ? "Removing..." : "Remove"}
              </Button>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Subtle bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Card>
  );
}
