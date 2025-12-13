import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services";
import type {
  LoginReq,
  RegisterReq,
  LogoutRes,
  GoogleLoginReq,
  VerifyEmailReq,
  RequestResetPasswordReq,
  ResetPasswordReq,
  AuthRes,
  AuthState,
  ChangePasswordReq,
} from "@/types/core/auth";
import type { User } from "@/types/db/user";
import Persistence from "@/utils/persistence";

// Auth persistence keys
const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

// Helper function to save auth data to persistence
const saveAuthData = (authData: AuthRes["data"]) => {
  if (authData) {
    Persistence.setItem(AUTH_TOKEN_KEY, authData.token);
    Persistence.setItem(AUTH_USER_KEY, authData.user);
  }
};

// Helper function to clear auth data from persistence
const clearAuthData = () => {
  Persistence.removeItem(AUTH_TOKEN_KEY);
  Persistence.removeItem(AUTH_USER_KEY);
};

// Helper function to get auth state from persistence
export const getAuthState = (): AuthState => {
  const token = Persistence.getItem<string>(AUTH_TOKEN_KEY);
  const user = Persistence.getItem<Partial<User>>(AUTH_USER_KEY);
  return {
    token,
    user,
    isAuthenticated: !!(token && user),
    requiresEmailVerification: user?.emailVerified === false,
  };
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthRes, Error, LoginReq>({
    mutationFn: authService.login,
    onSuccess: (response) => {
      if (response.isSuccess && response.data) {
        if (response.data.token && response.data.user) {
          saveAuthData(response.data);
          queryClient.invalidateQueries({ queryKey: ["auth"] });
          console.log("Login successful:", response.data.user.email);
        }
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthRes, Error, RegisterReq>({
    mutationFn: authService.register,
    onSuccess: (response) => {
      if (response.isSuccess && response.data) {
        saveAuthData(response.data);
        queryClient.invalidateQueries({ queryKey: ["auth"] });
        console.log("Registration successful:", response.data.user.email);
      }
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
};

/**
 * Register hook that does NOT automatically save auth data
 * Used for registration flow where user needs to verify email first
 */
export const useRegisterNoAuth = () => {
  return useMutation<AuthRes, Error, RegisterReq>({
    mutationFn: authService.register,
    onSuccess: (response) => {
      if (response.isSuccess) {
        console.log("Registration initiated, email verification required");
      }
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<LogoutRes, Error, void>({
    mutationFn: () => authService.logout(),
    onSuccess: (response) => {
      if (response.isSuccess) {
        clearAuthData();
        queryClient.invalidateQueries({ queryKey: ["auth"] });
        console.log("Logout successful");
      }
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Clear auth data anyway on logout error to be safe
      clearAuthData();
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthRes, Error, GoogleLoginReq>({
    mutationFn: authService.googleLogin,
    onSuccess: (response) => {
      if (response.isSuccess && response.data) {
        saveAuthData(response.data);
        queryClient.invalidateQueries({ queryKey: ["auth"] });
        console.log("Google login successful:", response.data.user.email);
      }
    },
    onError: (error) => {
      console.error("Google login failed:", error);
    },
  });
};

// export const useVerifyEmail = () => {
//   const queryClient = useQueryClient();

//   return useMutation<AuthRes, Error, VerifyEmailReq>({
//     mutationFn: authService.verifyEmail,
//     onSuccess: (response) => {
//       if (response.isSuccess && response.data) {
//         saveAuthData(response.data);
//         queryClient.invalidateQueries({ queryKey: ['auth'] });
//         console.log('Email verification successful:', response.data.user.email);
//       }
//     },
//     onError: (error) => {
//       console.error('Email verification failed:', error);
//     },
//   });
// };

/**
 * Verify email hook that does NOT automatically save auth data
 * Used for email verification flow where user needs to login manually after verification
 */
export const useVerifyEmail = () => {
  return useMutation<AuthRes, Error, VerifyEmailReq>({
    mutationFn: authService.verifyEmail,
    onSuccess: (response) => {
      if (response.isSuccess) {
        console.log(
          "Email verification successful, user needs to login manually"
        );
      }
    },
    onError: (error) => {
      console.error("Email verification failed:", error);
    },
  });
};

export const useRequestResetPassword = () => {
  return useMutation<AuthRes, Error, RequestResetPasswordReq>({
    mutationFn: authService.requestResetPassword,
    onSuccess: (response) => {
      if (response.isSuccess) {
        console.log("Reset password request successful");
      }
    },
    onError: (error) => {
      console.error("Reset password request failed:", error);
    },
  });
};

export const useResetPassword = () => {
  return useMutation<AuthRes, Error, ResetPasswordReq>({
    mutationFn: authService.resetPassword,
    onSuccess: (response) => {
      if (response.isSuccess) {
        console.log(
          "Password reset successful, user needs to login with new password"
        );
      }
    },
    onError: (error) => {
      console.error("Password reset failed:", error);
    },
  });
};

export const useChangePassword = () => {
  return useMutation<AuthRes, Error, ChangePasswordReq>({
    mutationFn: authService.changePassword,
    onSuccess: (response) => {
      if (response.isSuccess) {
        console.log("Password change successful");
      }
    },
    onError: (error) => {
      console.error("Password change failed:", error);
    },
  });
};

// Custom hook to manage auth state reactively
export const useAuthState = () => {
  // For now, return the current auth state
  // In a real app, you might want to use a context or more sophisticated state management
  // This hook provides a way to get auth state that can be extended later
  return getAuthState();
};
