import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/course/category-service";
import type { CreateCategoryReq } from "@/types/db/course/category";

export const categoryQueryKeys = {
  allCategories: ["categories"] as const,
  categoryLists: () => [...categoryQueryKeys.allCategories, "list"] as const,
};

export const useGetCategories = () => {
  return useQuery({
    queryKey: categoryQueryKeys.categoryLists(),
    queryFn: categoryService.getCategories,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryReq) =>
      categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.allCategories,
      });
    },
  });
};
