import axios, { type AxiosInstance } from "axios";
import Persistence from "@/utils/persistence";
import type { ServiceUrls } from "@/types/core/api";
import {
  apiServiceUrlsKey,
  apiUrl,
  reviewApiUrl,
  separatedServiceFlag,
  storageApiUrl,
} from "@/conf";
import { toast } from "sonner";

// filepath: src/utils/api.ts

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
      // Persistence.removeItem("auth_token");
      // window.location.href = "/auth/login";
    }
    return Promise.resolve(error.response);
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
    ![storageApiUrl, reviewApiUrl].includes(baseURL)
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
        // Persistence.removeItem("auth_token");
        // window.location.href = "/auth/login";
      }
      return Promise.reject(error);
    }
  );

  return serviceApi;
}

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
