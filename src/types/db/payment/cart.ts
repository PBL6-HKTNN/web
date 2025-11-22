import type { UUID } from "@/types";
import type { Course } from "@/types/db/course";
import type { Base } from "@/types/core/base";
import type { ApiResponse } from "@/types/core/api";

export interface CartItem extends Base {
  userId: UUID;
  courseId: UUID;
  price: number;
  course?: Course;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

// API Response types using standardized ApiResponse
export type GetCartResponse = ApiResponse<CartItem[]>;
export type AddToCartResponse = ApiResponse<CartItem>;
export type RemoveFromCartResponse = ApiResponse<null>;
