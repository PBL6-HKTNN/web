

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
    }
}

export default API_ROUTES;