import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "@/services/course/wishlist-service";
import type { UUID } from "@/types";

export const wishlistQueryKeys = {
  allWishlist: ["wishlist"] as const,
  wishlistLists: () => [...wishlistQueryKeys.allWishlist, "list"] as const,
};

export const useGetWishlist = () => {
  return useQuery({
    queryKey: wishlistQueryKeys.wishlistLists(),
    queryFn: wishlistService.getWishlist,
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: UUID) => wishlistService.addToWishlist(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wishlistQueryKeys.allWishlist,
      });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: UUID) =>
      wishlistService.removeFromWishlist(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wishlistQueryKeys.allWishlist,
      });
    },
  });
};
