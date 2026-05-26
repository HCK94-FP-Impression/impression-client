import axios from "axios";
import { clearAuthSession, getStoredAuthToken } from "./authProxy";

export interface ApiErrorData {
  message: string; // or string[] depending on your API
}

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:3000",
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getStoredAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAuthSession();
    }

    return Promise.reject(error);
  },
);

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
) {
  if (axios.isAxiosError<ApiErrorData>(error)) {
    return error.response?.data.message ?? error.message ?? fallback;
  }

  if (error instanceof Error) return error.message || fallback;

  return fallback;
}
