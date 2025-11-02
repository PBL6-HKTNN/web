import api from "@/utils/api";
import API_ROUTES from "@/conf/constants/api_routes";
import type {
  Course,
  GetCoursesRequest,
  GetCoursesResponse,
  GetCategoriesResponse,
  EnrolledCourse,
  WishlistItem,
  GetEnrolledCoursesResponse,
  GetWishlistResponse
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
export const getEnrolledCourses = async (): Promise<GetEnrolledCoursesResponse> => {
  const response = await api.get(API_ROUTES.USER_COURSES.getEnrolledCourses);
  return response.data.data;
};

export const getWishlist = async (): Promise<GetWishlistResponse> => {
  const response = await api.get(API_ROUTES.USER_COURSES.getWishlist);
  return response.data.data;
};

export const enrollCourse = async (courseId: string): Promise<EnrolledCourse> => {
  const response = await api.post(API_ROUTES.USER_COURSES.enrollCourse.replace('{courseId}', courseId));
  return response.data.data;
};

export const addToWishlist = async (courseId: string): Promise<WishlistItem> => {
  const response = await api.post(API_ROUTES.USER_COURSES.addToWishlist.replace('{courseId}', courseId));
  return response.data.data;
};

export const removeFromWishlist = async (courseId: string): Promise<void> => {
  await api.delete(API_ROUTES.USER_COURSES.removeFromWishlist.replace('{courseId}', courseId));
};

export const updateProgress = async (courseId: string, progressData: {
  progressPercentage: number;
  completedLectures: number;
}): Promise<EnrolledCourse> => {
  const response = await api.put(API_ROUTES.USER_COURSES.updateProgress.replace('{courseId}', courseId), progressData);
  return response.data.data;
};