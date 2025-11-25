import type { Base } from "@/types/core";
import type { ApiResponse } from "@/types/core/api";

export type Category = Base & {
  name: string;
  description?: string;
};

export type CreateCategoryReq = Omit<Category, keyof Base>;

export type CreateCategoryRes = ApiResponse<Category>;

export type GetCategoriesRes = ApiResponse<Category[]>;
