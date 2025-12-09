import API_ROUTES from "@/conf/constants/api-routes";
import type { UUID } from "@/types";
import type {
  GetWishlistResponse,
  WishlistCheckResponse,
  WishlistItem,
} from "@/types/db/course/wishlist";
import { createServiceApi, serviceUrls } from "@/utils/api";

const api = createServiceApi(serviceUrls.COURSE_SERVICE_URL);

export const wishlistService = {
  getWishlist: async (): Promise<GetWishlistResponse> => {
    const response = await api.get(API_ROUTES.WISHLIST.getWishlist);
    return response.data;
  },
  addToWishlist: async (courseId: UUID): Promise<WishlistItem> => {
    const response = await api.post(
      API_ROUTES.WISHLIST.addToWishlist(courseId)
    );
    return response.data;
  },
  removeFromWishlist: async (courseId: UUID): Promise<string> => {
    const response = await api.delete(
      API_ROUTES.WISHLIST.removeFromWishlist(courseId)
    );
    return response.data;
  },
  wishlistCheck: async (courseId: UUID): Promise<WishlistCheckResponse> => {
    const response = await api.get(API_ROUTES.WISHLIST.wishlistCheck(courseId));
    return response.data;
  },
};
