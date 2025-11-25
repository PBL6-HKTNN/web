import type { UUID } from "@/types";
import type { FileType } from "@/types/core/storage";

const API_ROUTES = {
  AUTH: {
    login: "/Auth/login",
    register: "/Auth/register",
    verifyEmail: "/Auth/verify-email",
    googleLogin: "/Auth/google-login",
    requestResetPassword: "/Auth/token-reset-password",
    resetPassword: "/Auth/reset-password",
    logout: "/Auth/logout",
  },
  STORAGE: {
    uploadFile: (type: FileType) => `/api/files/${type}`,
    deleteFile: (publicId: UUID) => `/api/files/${publicId}`,
  },
  CATEGORY: {
    getCategories: "/Category",
    createCategory: "/Category/create",
  },
  COURSE: {
    getCourses: "/Course",
    getCourseById: (courseId: UUID) => `/Course/get/${courseId}`,
    getCourseContentById: (courseId: UUID) => `/Course/getLessons/${courseId}`,
    getModulesByCourse: (courseId: UUID) => `/Course/getModules/${courseId}`,
    createCourse: "/Course/create",
    updateCourse: (courseId: UUID) => `/Course/update/${courseId}`,
    deleteCourse: (courseId: UUID) => `/Course/${courseId}`,
  },
  MODULE: {
    getModules: "/Module",
    createModule: "/Module/create",
    getLessonsByModule: (moduleId: UUID) => `/Module/${moduleId}`,
    getModuleById: (moduleId: UUID) => `/Module/get/${moduleId}`,
    updateModule: (moduleId: UUID) => `/Module/update/${moduleId}`,
    deleteModule: (moduleId: UUID) => `/Module/${moduleId}`,
  },
  LESSON: {
    getLessons: "/Lesson",
    getLessonById: (lessonId: UUID) => `/Lesson/get/${lessonId}`,
    createLesson: "/Lesson/create",
    updateLesson: (lessonId: UUID) => `/Lesson/update/${lessonId}`,
    deleteLesson: (lessonId: UUID) => `/Lesson/${lessonId}`,
  },
  QUIZ: {
    getQuizzes: "/Quiz",
    createQuiz: "/Quiz/create",
    getQuizById: (id: UUID) => `/Quiz/${id}`,
    getQuizByLessonId: (lessonId: UUID) => `/Quiz/lessonId/${lessonId}`,
    submitQuiz: "/Quiz/submit",
    getQuizResults: (lessonId: UUID) => `/Quiz/results/${lessonId}`,
    getQuizAttempts: (quizId: UUID) => `/Quiz/Attempts/${quizId}`,
    updateQuiz: (quizId: UUID) => `/Quiz/update/${quizId}`,
    deleteQuiz: (quizId: UUID) => `/Quiz/${quizId}`,
  },
  WISHLIST: {
    getWishlist: "/Wishlist/get",
    addToWishlist: (courseId: UUID) => `/Wishlist/add/${courseId}`,
    removeFromWishlist: (courseId: UUID) => `/Wishlist/remove/${courseId}`,
  },
  ENROLLMENT: {
    isEnrolled: (courseId: UUID) => `/Enrollment/getCourse/${courseId}`,
    enroll: (courseId: UUID) => `/Enrollment/enroll/${courseId}`,
    updateEnrollment: "/Enrollment/update",
    getEnrolledCourse: "/Enrollment/my-courses",
  },
};

export default API_ROUTES;
