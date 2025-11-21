import API_ROUTES from "@/conf/constants/api-routes";
import type { UUID } from "@/types";
import type {
  QuizStartAttemptRes,
  QuizSubmissionReq,
  QuizSubmissionRes,
} from "@/types/db/course/quiz";
import type {
  CreateQuizReq,
  CreateQuizRes,
  DeleteQuizRes,
  GetQuizRes,
  UpdateQuizReq,
  UpdateQuizRes,
} from "@/types/db/course/quiz";
import type { GetQuizListResultsRes } from "@/types/db/course/quiz-attempt";
import { createServiceApi, serviceUrls } from "@/utils";

const api = createServiceApi(serviceUrls.COURSE_SERVICE_URL);

export const quizService = {
  createQuiz: async (quizData: CreateQuizReq): Promise<CreateQuizRes> => {
    const response = await api.post<CreateQuizRes>(
      API_ROUTES.QUIZ.createQuiz,
      quizData
    );
    return response.data;
  },
  getQuizById: async (quizId: UUID): Promise<GetQuizRes> => {
    const response = await api.get<GetQuizRes>(
      API_ROUTES.QUIZ.getQuizById(quizId)
    );
    return response.data;
  },
  getQuizByLessonId: async (lessonId: UUID): Promise<GetQuizRes> => {
    const response = await api.get<GetQuizRes>(
      API_ROUTES.QUIZ.getQuizByLessonId(lessonId)
    );
    return response.data;
  },
  updateQuiz: async (
    quizId: UUID,
    quizData: UpdateQuizReq
  ): Promise<UpdateQuizRes> => {
    const response = await api.post<UpdateQuizRes>(
      API_ROUTES.QUIZ.updateQuiz(quizId),
      quizData
    );
    return response.data;
  },
  deleteQuiz: async (quizId: UUID): Promise<DeleteQuizRes> => {
    const response = await api.delete<DeleteQuizRes>(
      API_ROUTES.QUIZ.deleteQuiz(quizId)
    );
    return response.data;
  },
  submitQuiz: async (
    submissionData: QuizSubmissionReq
  ): Promise<QuizSubmissionRes> => {
    const response = await api.post<QuizSubmissionRes>(
      API_ROUTES.QUIZ.submitQuiz,
      submissionData
    );
    return response.data;
  },
  //   getQuizResults: async (lessonId: UUID): Promise<ApiResponse<unknown>> => {
  //     const response = await api.get<ApiResponse<unknown>>(
  //       API_ROUTES.QUIZ.getQuizResults(lessonId)
  //     );
  //     return response.data;
  //   },
  beginQuizAttempt: async (quizId: UUID): Promise<QuizStartAttemptRes> => {
    const response = await api.get<QuizStartAttemptRes>(
      API_ROUTES.QUIZ.getQuizAttempts(quizId)
    );
    return response.data;
  },
  getQuizListResults: async (
    lessonId: UUID
  ): Promise<GetQuizListResultsRes> => {
    const response = await api.get<GetQuizListResultsRes>(
      API_ROUTES.QUIZ.getQuizListResults(lessonId)
    );
    return response.data;
  },
};
