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
    changePassword: "/Auth/change-password",
    logout: "/Auth/logout",
  },
  USER: {
    changeAvatar: (userId: UUID) => `/User/${userId}/avatar`,
    updateProfile: (userId: UUID) => `/User/${userId}/profile`,
  },
  STORAGE: {
    uploadFile: (type: FileType) => `/api/files/${type}`,
    deleteFile: (publicId: UUID) => `/api/files/${publicId}`,
  },
  CATEGORY: {
    getCategories: "/Category",
    createCategory: "/Category/create",
    getCategoryById: (categoryId: UUID) => `/Category/get/${categoryId}`,
    updateCategory: (categoryId: UUID) => `/Category/update/${categoryId}`,
    deleteCategory: (categoryId: UUID) => `/Category/delete/${categoryId}`,
  },
  COURSE: {
    getCourses: "/Course",
    getCourseById: (courseId: UUID) => `/Course/get/${courseId}`,
    getCourseContentById: (courseId: UUID) => `/Course/getLessons/${courseId}`,
    getModulesByCourse: (courseId: UUID) => `/Course/getModules/${courseId}`,
    createCourse: "/Course/create",
    completeLesson: "/Course/complete-lesson",
    updateCourse: (courseId: UUID) => `/Course/update/${courseId}`,
    deleteCourse: (courseId: UUID) => `/Course/${courseId}`,
    validateCourse: "/Course/validate",
    changeCourseStatus: "/Course/change-status",
    modChangeCourseStatus: "/Course/mod-change-status",
    requestedBanCourse: (courseId: UUID) =>
      `/Course/requested-ban-course/${courseId}`,
    preSubmitCheck: "/Course/auto-check-before-submit",
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
    checkLessonLocked: (lessonId: UUID) => `/Lesson/check-locked/${lessonId}`,
  },
  QUIZ: {
    getQuizzes: "/Quiz",
    createQuiz: "/Quiz/create",
    getQuizById: (id: UUID) => `/Quiz/${id}`,
    getQuizByLessonId: (lessonId: UUID) => `/Quiz/lessonId/${lessonId}`,
    submitQuiz: "/Quiz/submit",
    getQuizResults: (lessonId: UUID) => `/Quiz/results/${lessonId}`,
    getQuizListResults: (lessonId: UUID) => `/Quiz/list-results/${lessonId}`,
    getQuizAttempts: (quizId: UUID) => `/Quiz/Attempts/${quizId}`,
    updateQuiz: (quizId: UUID) => `/Quiz/update/${quizId}`,
    deleteQuiz: (quizId: UUID) => `/Quiz/${quizId}`,
  },
  WISHLIST: {
    getWishlist: "/Wishlist/get",
    addToWishlist: (courseId: UUID) => `/Wishlist/add/${courseId}`,
    removeFromWishlist: (courseId: UUID) => `/Wishlist/remove/${courseId}`,
    wishlistCheck: (courseId: UUID) => `/Wishlist/Check/${courseId}`,
  },
  ENROLLMENT: {
    isEnrolled: (courseId: UUID) => `/Enrollment/getCourse/${courseId}`,
    enroll: (courseId: UUID) => `/Enrollment/enroll/${courseId}`,
    getEnrolledCourseCompletedLessons: (enrollmentId: UUID) =>
      `/Enrollment/lessons-completed/${enrollmentId}`,
    updateEnrollment: "/Enrollment/update",
    updateEnrollmentProgress: "/Enrollment/updateProgress",
    updateEnrollmentCurrentView: "/Enrollment/update-current-view",
    getEnrolledCourse: "/Enrollment/my-courses",
    getLastDateCourse: (courseId: UUID) =>
      `/Enrollment/get-last-date-Course/${courseId}`,
    getListStudentsByCourse: (courseId: UUID) =>
      `/Enrollment/get-list-students/${courseId}`,
  },
  REVIEW: {
    createReview: "/Review",
    getReviewsByCourse: (courseId: UUID) => `/Review/course/${courseId}`,
    checkUserReview: "/Review/check-user-review",
    deleteUserReview: "/Review/user-review",
    getAverageRating: (courseId: UUID) => `/Review/course/${courseId}/average`,
    replyReview: (courseId: UUID, reviewId: UUID) =>
      `/Review/course/${courseId}/reviews/${reviewId}/reply`,
  },
  PAYMENT: {
    getCart: "/Payment/getCart",
    addToCart: (courseId: UUID) => `/Payment/addToCart/${courseId}`,
    removeFromCart: (courseId: UUID) => `/Payment/removeFromCart/${courseId}`,
    createPayment: "/Payment/createPayment",
    getPayment: "/Payment/payment",
    listPayments: "/Payment/list-payments",
    updatePayment: "/Payment/update-payment",
    createPaymentIntent: "/Payment/create-payment-intent",
    webhook: "/Payment/webhook",
  },
  AUTOMATION: {
    generateQuiz: "/Automation/generate-quiz",
    generateContent: "/Automation/generate-content",
  },
  REQUEST: {
    getRequests: "/Request",
    getUserRequest: "/Request/my-request",
    getResolvedRequests: "/Request/request-resolved-by-me",
    getRequestTypes: "/Request/request-type",
    getRequestById: (requestId: UUID) => `/Request/get/${requestId}`,
    createRequest: "/Request/create",
    updateRequest: (requestId: UUID) => `/Request/update/${requestId}`,
    deleteRequest: (requestId: UUID) => `/Request/delete/${requestId}`,
    resolveRequest: "/Request/resolve",
  },
};

export default API_ROUTES;
