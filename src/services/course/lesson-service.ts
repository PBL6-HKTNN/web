import API_ROUTES from "@/conf/constants/api-routes";
import type { UUID } from "@/types";
import type { ApiResponse } from "@/types/core/api";
import type { CheckLessonLockedRes, Lesson } from "@/types/db/course/lesson";
import type {
  CreateLessonReq,
  CreateLessonRes,
  DeleteLessonRes,
  GetLessonRes,
  UpdateLessonReq,
  UpdateLessonRes,
} from "@/types/db/course/lesson";
import { createServiceApi, serviceUrls } from "@/utils/api";

const api = createServiceApi(serviceUrls.COURSE_SERVICE_URL);

export const lessonService = {
  getLessons: async (): Promise<ApiResponse<Lesson[]>> => {
    const response = await api.get<ApiResponse<Lesson[]>>(
      API_ROUTES.LESSON.getLessons
    );
    return response.data;
  },
  createLesson: async (
    lessonData: CreateLessonReq
  ): Promise<CreateLessonRes> => {
    const response = await api.post<CreateLessonRes>(
      API_ROUTES.LESSON.createLesson,
      lessonData
    );
    return response.data;
  },
  getLessonById: async (lessonId: UUID): Promise<GetLessonRes> => {
    const response = await api.get<GetLessonRes>(
      API_ROUTES.LESSON.getLessonById(lessonId)
    );
    return response.data;
  },
  updateLesson: async (
    lessonId: UUID,
    lessonData: UpdateLessonReq
  ): Promise<UpdateLessonRes> => {
    const response = await api.post<UpdateLessonRes>(
      API_ROUTES.LESSON.updateLesson(lessonId),
      lessonData
    );
    return response.data;
  },
  deleteLesson: async (lessonId: UUID): Promise<DeleteLessonRes> => {
    const response = await api.delete<DeleteLessonRes>(
      API_ROUTES.LESSON.deleteLesson(lessonId)
    );
    return response.data;
  },
  checkLessonLocked: async (lessonId: UUID): Promise<CheckLessonLockedRes> => {
    const response = await api.get<CheckLessonLockedRes>(
      API_ROUTES.LESSON.checkLessonLocked(lessonId)
    );
    return response.data;
  },
};
