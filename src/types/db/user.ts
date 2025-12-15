import { type Base } from "../core";
import type { UserPermission } from "@/types/db/permission";
import type { ApiResponse } from "../core/api";
export const UserRole = {
  ADMIN: 0,
  MODERATOR: 1,
  INSTRUCTOR: 2,
  STUDENT: 3,
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: 0,
  INACTIVE: 1,
  PENDING: 2,
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export type User = Base & {
  name: string;
  email: string;
  googleId: string;
  role: UserRole;
  status: UserStatus;
  profilePicture: string | null;
  bio: string | null;
  emailVerified: boolean;
  emailVerificationToken: string | null;
  resetPasswordToken: string | null;
  resetPasswordTokenExpiry: Date | null;
  totalCourses: number;
  rating: number | null;
  totalLoginFailures: number;
};

export type ChangeAvatarReq = {
  file: File;
};

export type UpdateProfileReq = Partial<Pick<User, "name" | "bio">>;

export type UserDetailResponse = ApiResponse<{
  success: boolean;
  message: string | null;
  user: User;
  permissions: UserPermission[];
}>;

export type GetRefreshTokenQuery = {
  returnUrl: string;
};
export type GetRefreshTokenResponse = ApiResponse<string>;

export type ExchangeCodeForTokenReq = {
  code: string;
};

export type ExchangeCodeForTokenResponse = ApiResponse<{
  success: boolean;
  message: string | null;
}>;
