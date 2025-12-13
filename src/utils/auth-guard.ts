import { redirect } from "@tanstack/react-router";
import { getAuthState } from "@/hooks/queries/auth-hooks";
import type { UserRole } from "@/types/db";

/**
 * Auth guard utility for TanStack Router
 * Checks if user is authenticated and redirects to login if not
 */
export const authGuard = () => {
  const { isAuthenticated } = getAuthState();

  if (!isAuthenticated) {
    throw redirect({
      to: "/auth/login",
    });
  }
};

/**
 * Auth guard that redirects authenticated users away from auth pages
 * Useful for login/register pages - redirects to home if already logged in
 */
export const guestGuard = () => {
  const { isAuthenticated } = getAuthState();

  if (isAuthenticated) {
    throw redirect({
      to: "/",
      replace: true,
    });
  }
};

/**
 * Higher-order auth guard with custom redirect logic
 */
export const createAuthGuard = (options?: {
  redirectTo?: string;
  requireAuth?: boolean;
}) => {
  const { redirectTo = "/auth/login", requireAuth = true } = options || {};

  return () => {
    const { isAuthenticated } = getAuthState();

    if (requireAuth && !isAuthenticated) {
      throw redirect({
        to: redirectTo,
      });
    }

    if (!requireAuth && isAuthenticated) {
      throw redirect({
        to: "/",
        replace: true,
      });
    }
  };
};

/**
 * Check auth status without throwing redirects
 * Useful for conditional rendering or other logic
 */
export const checkAuthStatus = () => {
  return getAuthState();
};

export const roleGuard = (allowedRoles: UserRole[]) => {
  const { user, isAuthenticated } = getAuthState();
  if (!user || !isAuthenticated) {
    throw redirect({
      to: "/auth/login",
    });
  }
  if (!allowedRoles.includes(user?.role as UserRole)) {
    throw redirect({
      to: "/404",
      replace: true,
    });
  }
};
