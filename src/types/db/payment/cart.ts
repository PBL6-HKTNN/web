import type { UUID } from "@/types";
import type { Course } from "@/types/db/course";
import type { ApiResponse } from "@/types/core/api";

export interface CartItem {
  courseId: UUID;
  course?: Course;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

// API Response types using standardized ApiResponse
export type GetCartResponse = ApiResponse<Cart>;
export type AddToCartResponse = ApiResponse<CartItem>;
export type RemoveFromCartResponse = ApiResponse<null>;
