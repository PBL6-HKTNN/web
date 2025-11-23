import type { User } from "../db/user";
import type { ApiResponse } from "./api";

// Base auth response type - all endpoints return this
export type AuthRes = ApiResponse<{
  token: string;
  user: Partial<User>;
  requiresEmailVerification?: boolean;
}>;

// Request types matching backend DTOs
export type LoginReq = {
  email: string;
  password: string;
};

export type RegisterReq = {
  email: string;
  password: string;
};

export type LogoutRes = ApiResponse<{
  message: string;
}>;

export type GoogleLoginReq = {
  token: string;
};

export type VerifyEmailReq = {
  email: string;
  token: string;
};

export type RequestResetPasswordReq = {
  email: string;
};

export type ResetPasswordReq = {
  email: string;
  token: string;
  newPassword: string;
};

export type ChangePasswordReq = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// Auth state for persistence
export type AuthState = {
  token: string | null;
  user: Partial<User> | null;
  isAuthenticated: boolean;
  requiresEmailVerification: boolean;
};
