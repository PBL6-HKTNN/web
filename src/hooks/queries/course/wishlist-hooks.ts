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
    retry: 1,
    queryFn: () => {
      return wishlistService.getWishlist();
    },
  });
};

export const useAddToWishlist = (courseId: UUID) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => wishlistService.addToWishlist(courseId),
    onSuccess: () => {
      // Invalidate all wishlist queries including individual checks
      queryClient.invalidateQueries({
        queryKey: wishlistQueryKeys.allWishlist,
      });
    },
    onError: (error) => {
      console.error("Add to wishlist failed:", error);
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: UUID) =>
      wishlistService.removeFromWishlist(courseId),
    onSuccess: (_, variable) => {
      // Invalidate wishlist queries to refresh the list
      queryClient.invalidateQueries({
        queryKey: [...wishlistQueryKeys.allWishlist, "check", variable],
      });
    },
    onError: (error, variable) => {
      console.error("Remove from wishlist failed:", error);
      queryClient.invalidateQueries({
        queryKey: [...wishlistQueryKeys.allWishlist, "check", variable],
      });
    },
  });
};

export const useIsInWishlist = (courseId: UUID) => {
  return useQuery({
    queryKey: [...wishlistQueryKeys.allWishlist, "check", courseId],
    queryFn: () => wishlistService.wishlistCheck(courseId),
    enabled: !!courseId,
  });
};
