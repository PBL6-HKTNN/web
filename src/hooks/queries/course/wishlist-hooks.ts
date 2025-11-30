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
    queryFn: () => {
      return wishlistService.getWishlist();
    },
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: UUID) => wishlistService.addToWishlist(courseId),
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
    onSuccess: () => {
      // Invalidate wishlist queries to refresh the list
      queryClient.invalidateQueries({
        queryKey: wishlistQueryKeys.allWishlist,
      });
    },
    onError: (error) => {
      console.error("Remove from wishlist failed:", error);
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
