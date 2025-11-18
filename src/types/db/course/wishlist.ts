import type { Base, UUID } from "@/types/core";
import type { ApiResponse } from "@/types/core/api";

export type WishlistItem = Base & {
  courseId: UUID;
  userId: UUID;
};

export type WishlistedCourseItem = {
  id: UUID;
  userId: UUID;
  courseId: UUID;
  title: string;
  description: string;
  thumbnail: string | null;
};
export type GetWishlistResponse = ApiResponse<
  WishlistedCourseItem[]>;
