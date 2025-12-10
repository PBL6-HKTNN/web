import API_ROUTES from "@/conf/constants/api-routes";
import type {
  CreateCategoryReq,
  CreateCategoryRes,
  GetCategoriesRes,
} from "@/types/db/course/category";
import { createServiceApi, serviceUrls, createApiService } from "@/utils/api";

const api = createServiceApi(serviceUrls.COURSE_SERVICE_URL);

const _categoryService = {
  getCategories: async (): Promise<GetCategoriesRes> => {
    const res = await api.get<GetCategoriesRes>(
      API_ROUTES.CATEGORY.getCategories
    );
    return res.data;
  },
  createCategory: async (
    req: CreateCategoryReq
  ): Promise<CreateCategoryRes> => {
    const res = await api.post(API_ROUTES.CATEGORY.createCategory, req);
    return res.data;
  },
};

// Export service with comprehensive error handling
export const categoryService = createApiService(
  _categoryService,
  "CategoryService"
);
