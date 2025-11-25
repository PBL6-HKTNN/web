export type ApiResponse<T> = {
  status: number;
  error: unknown;
  isSuccess: boolean;
  data: T | null;
};

export type ServiceUrls = {
  AUTH_SERVICE_URL: string;
  USER_SERVICE_URL: string;
  COURSE_SERVICE_URL: string;
  ENROLLMENT_SERVICE_URL: string;
  STORAGE_SERVICE_URL: string;
};
