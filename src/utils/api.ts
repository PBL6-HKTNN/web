import axios, { type AxiosInstance } from "axios";
import Persistence from "@/utils/persistence";

// filepath: src/utils/api.ts

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5197",
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
  // (error) => {
  //   // if (error.response?.status === 401) {
  //   //   // Handle unauthorized
  //   //   Persistence.removeItem("auth_token");
  //   //   window.location.href = "/auth/login";
  //   // }
  //   // return Promise.reject(error);
  //   return Promise.reject(error);
  // }
);

export default api;
