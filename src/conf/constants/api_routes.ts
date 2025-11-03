

const API_ROUTES = {
    AUTH: {
        login: '/Auth/login',
        register: '/Auth/register',
        verifyEmail: '/Auth/verify-email',
        googleLogin: '/Auth/google-login',
        requestResetPassword: '/Auth/token-reset-password',
        resetPassword: '/Auth/reset-password',
        logout: '/Auth/logout',
    },
    COURSE: {
        getCourses: '/Course',
        getCategories: '/Course/categories',
        getCourseById: '/Course/{id}',
    },
    USER_COURSES: {
        getEnrolledCourses: '/UserCourses/enrolled',
        getWishlist: '/UserCourses/wishlist',
        enrollCourse: '/UserCourses/enroll/{courseId}',
        addToWishlist: '/UserCourses/wishlist/{courseId}',
        removeFromWishlist: '/UserCourses/wishlist/{courseId}',
        updateProgress: '/UserCourses/progress/{courseId}',
    }
}

export default API_ROUTES;