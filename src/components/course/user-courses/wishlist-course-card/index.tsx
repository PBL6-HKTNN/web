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
  isRemoving = false,
}: WishlistCourseCardProps) {
  const navigate = useNavigate();
  return (
    <Card
      className="group relative cursor-pointer overflow-hidden border-none transition-all duration-500 hover:shadow-2xl hover:ring-1 hover:ring-primary/50 min-h-[180px]"
      onClick={() => navigate({ to: `/course/${wishlistItem.courseId}` })}
    >
      {/* Background Image with Blending */}
      <div className="absolute inset-0 z-0">
        <img
          src={wishlistItem.thumbnail || "/placeholder-course.jpg"}
          alt={wishlistItem.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-900/40" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-primary" />
      </div>

      {/* Course Content */}
      <CardContent className="relative z-10 flex h-full flex-col p-6 text-white">
        <div className="flex flex-1 flex-col">
          <h3 className="mb-2 line-clamp-1 text-2xl font-extrabold tracking-tight group-hover:text-primary-foreground transition-colors">
            {wishlistItem.title}
          </h3>

          <p className="mb-6 line-clamp-2 text-sm text-gray-300 leading-relaxed max-w-2xl font-medium">
            {wishlistItem.description}
          </p>

          <div className="mt-auto flex items-center justify-end gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.(wishlistItem.courseId);
              }}
              disabled={isRemoving}
              className="text-gray-300 hover:bg-white/10 hover:text-white font-bold transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isRemoving ? "Removing..." : "Remove"}
            </Button>

            <Button
              size="sm"
              className="font-bold shadow-2xl bg-white text-black hover:bg-primary hover:text-white transition-all duration-300 transform group-hover:translate-x-1"
            >
              View Course
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
