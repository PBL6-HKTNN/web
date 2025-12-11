import axios, { type AxiosInstance, type AxiosError } from "axios";
import Persistence from "@/utils/persistence";
import type { ServiceUrls } from "@/types/core/api";
import {
  apiServiceUrlsKey,
  apiUrl,
  automationApiUrl,
  reviewApiUrl,
  separatedServiceFlag,
  storageApiUrl,
} from "@/conf";
import { toast } from "sonner";

// filepath: src/utils/api.ts

/**
 * Standard API error interface for consistent error handling
 */
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
  originalError?: unknown;
}

/**
 * Type guard for API response data with error object
 */
interface ErrorResponse {
  error?:
    | {
        message?: string;
        code?: string;
      }
    | string;
  message?: string;
  code?: string;
}

/**
 * Extracts a user-friendly error message from various error structures
 * Handles common API error response patterns:
 * - error.response.data.error.message (nested error object)
 * - error.response.data.message (direct message)
 * - error.response.data.error (string error)
 * - error.message (axios error message)
 * - fallback message
 */
export function extractErrorMessage(
  error: unknown,
  fallbackMessage = "An unexpected error occurred"
): string {
  if (!error) return fallbackMessage;

  // Handle axios error response structure
  if (typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const responseData = axiosError.response?.data;

    if (responseData && typeof responseData === "object") {
      // Pattern: { error: { message: "string" } }
      if ("error" in responseData && responseData.error) {
        if (
          typeof responseData.error === "object" &&
          "message" in responseData.error &&
          responseData.error.message
        ) {
          return String(responseData.error.message);
        }
        // Pattern: { error: "string" }
        if (typeof responseData.error === "string") {
          return responseData.error;
        }
      }

      // Pattern: { message: "string" }
      if ("message" in responseData && responseData.message) {
        return String(responseData.message);
      }
    }
  }

  // Handle Error objects with message
  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  return fallbackMessage;
}

/**
 * Normalizes API errors into a consistent ApiError structure
 * This is particularly useful for TanStack Query error handling
 */
export function normalizeApiError(error: unknown, context?: string): ApiError {
  const message = extractErrorMessage(
    error,
    context || "An unexpected error occurred"
  );

  let status: number | undefined;
  let code: string | undefined;

  // Extract status code and error code if available
  if (typeof error === "object" && error && "response" in error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    status = axiosError.response?.status;

    // Try to extract error code from response
    const responseData = axiosError.response?.data;
    if (responseData && typeof responseData === "object") {
      if ("code" in responseData && responseData.code) {
        code = String(responseData.code);
      } else if (
        "error" in responseData &&
        responseData.error &&
        typeof responseData.error === "object" &&
        "code" in responseData.error
      ) {
        code = responseData.error.code
          ? String(responseData.error.code)
          : undefined;
      }
    }
  }

  return {
    message,
    status,
    code,
    details: typeof error === "object" ? error : undefined,
    originalError: error,
  };
}

/**
 * Enhanced error interface for API errors with normalization
 */
interface EnhancedError {
  normalized?: ApiError;
  message?: string;
  [key: string]: unknown;
}

/**
 * Type for async service methods
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ServiceMethod = (...args: any[]) => Promise<any>;

/**
 * Higher-order function that wraps API service methods with consistent error handling
 * This ensures all service methods throw normalized errors that work well with TanStack Query
 */
export function withApiErrorHandling<T extends ServiceMethod>(
  serviceMethod: T,
  context?: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await serviceMethod(...args);
    } catch (error) {
      // Normalize the error and re-throw it
      const normalizedError = normalizeApiError(error, context);

      // For TanStack Query compatibility, we throw the original error but attach normalized data
      const enhancedError = error as EnhancedError;
      enhancedError.normalized = normalizedError;
      enhancedError.message = normalizedError.message;

      throw enhancedError;
    }
  }) as T;
}

/**
 * Utility to create service objects with automatic error handling
 * Usage: const myService = createApiService({ method1: async () => {...}, method2: async () => {...} }, 'MyService')
 */
export function createApiService<T extends Record<string, ServiceMethod>>(
  serviceMethods: T,
  serviceName?: string
): T {
  const wrappedService: Record<string, ServiceMethod> = {};

  for (const [methodName, method] of Object.entries(serviceMethods)) {
    const context = serviceName ? `${serviceName}.${methodName}` : methodName;
    wrappedService[methodName] = withApiErrorHandling(method, context);
  }

  return wrappedService as T;
}

/**
 * React Query error helper - extracts user-friendly message from query errors
 * Usage in components: const errorMessage = getQueryErrorMessage(error)
 */
export function getQueryErrorMessage(
  error: unknown,
  fallback = "Something went wrong"
): string {
  // Check if it's an enhanced error with normalized data
  if (typeof error === "object" && error && "normalized" in error) {
    const enhancedError = error as EnhancedError;
    if (enhancedError.normalized?.message) {
      return enhancedError.normalized.message;
    }
  }

  // Fallback to regular error message extraction
  return extractErrorMessage(error, fallback);
}

const api: AxiosInstance = axios.create({
  baseURL: apiUrl || "http://localhost:5197",
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = Persistence.getItem<string>("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      toast.error("Session expired. Please log in again.");
      Persistence.removeItem("auth_token");
      if (window.location.pathname !== "/auth/login")
        window.location.href = "/auth/login";
    }
    // Reject the full axios error so callers (and react-query) can inspect error.response and error.message
    return Promise.reject(error);
  }
);

export function setApiBaseURL(url: string) {
  const flag = separatedServiceFlag;
  if (flag !== 0) {
    api.defaults.baseURL = url;
  }
}

// Create service-specific axios instances
export function createServiceApi(baseURL: string): AxiosInstance {
  // If separated services are disabled, return the global api instance
  if (
    separatedServiceFlag === 0 &&
    ![storageApiUrl, reviewApiUrl, automationApiUrl].includes(baseURL)
  ) {
    return api;
  }

  const serviceApi = axios.create({
    baseURL,
  });

  // Copy interceptors from main api instance
  serviceApi.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = Persistence.getItem<string>("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.resolve(error)
  );

  // Copy response interceptor
  serviceApi.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized
        toast.error("Session expired. Please log in again.");
        Persistence.removeItem("auth_token");
        if (window.location.pathname !== "/auth/login")
          window.location.href = "/auth/login";
      }
      return Promise.reject(error);
    }
  );

  return serviceApi;
}

/**
 * Decode and parse the service URLs from environment variable.
 * @returns ServiceUrls object decoded from VITE_SERVICES_URLS_KEY
 * @deprecated Currently not in use since we have gateway already. Will be removed in future versions.
 */
function _getServiceUrlsObj(): ServiceUrls {
  const encoded = apiServiceUrlsKey;
  if (!encoded) {
    throw new Error("VITE_SERVICES_URLS_KEY is not defined");
  }
  const decoded = atob(encoded);
  return JSON.parse(decoded);
}

const serviceUrls = _getServiceUrlsObj();
export { serviceUrls };

export default api;
