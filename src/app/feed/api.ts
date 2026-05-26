import axios from "axios";
import type {
  FeedResponse,
  SubmitRatingPayload,
  SubmitRatingResponse,
} from "./types";

const feedApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const TOKEN_STORAGE_KEYS = ["token", "accessToken", "authToken"];
const USER_STORAGE_KEYS = ["user", "currentUser", "authUser"];

function getStorageValue(keys: string[]) {
  if (typeof window === "undefined") return null;

  for (const key of keys) {
    const localValue = window.localStorage.getItem(key);
    if (localValue) return localValue;

    const sessionValue = window.sessionStorage.getItem(key);
    if (sessionValue) return sessionValue;
  }

  return null;
}

export function getStoredAuthToken() {
  return getStorageValue(TOKEN_STORAGE_KEYS);
}

export function hasStoredSession() {
  return Boolean(getStoredAuthToken() && getStorageValue(USER_STORAGE_KEYS));
}

feedApi.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const token = getStoredAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function isUnauthorizedError(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

export async function getFeedPost(skipPostId?: number) {
  const response = await feedApi.get<FeedResponse>("/posts/feed", {
    params: skipPostId ? { skipPostId } : undefined,
  });

  return response.data;
}

export async function submitRating(payload: SubmitRatingPayload) {
  const insight = payload.insight?.trim();
  const response = await feedApi.post<SubmitRatingResponse>("/ratings", {
    postId: payload.postId,
    scores: payload.scores,
    ...(insight ? { insight } : {}),
  });

  return response.data;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }

  if (error instanceof Error) return error.message || fallback;

  return fallback;
}
