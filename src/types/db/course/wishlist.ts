import type { Base, UUID } from "@/types/core";

export type WishlistItem = Base & {
  courseId: UUID;
  userId: UUID;
};

export type GetWishlistResponse = {
  wishlistItems: WishlistItem[];
};
