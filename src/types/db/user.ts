import { type Base } from "../core";

export const UserRole = {
  ADMIN: 0,
  INSTRUCTOR: 1,
  STUDENT: 2,
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
