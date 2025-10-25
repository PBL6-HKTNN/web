import api from "@/utils/api";
import API_ROUTES from "@/conf/constants/api_routes";
import type {
  Course,
  GetCoursesRequest,
  GetCoursesResponse,
  GetCategoriesResponse
} from "@/types/db/course/course";

export const getCourses = async (params?: GetCoursesRequest): Promise<GetCoursesResponse> => {
  const response = await api.get(API_ROUTES.COURSE.getCourses, { params });
  return response.data.data;
};

export const getCourseById = async (id: string): Promise<Course> => {
  const response = await api.get(API_ROUTES.COURSE.getCourseById.replace('{id}', id));
  return response.data.data;
};

export const getCategories = async (): Promise<GetCategoriesResponse> => {
  const response = await api.get(API_ROUTES.COURSE.getCategories);
  return response.data.data;
};
