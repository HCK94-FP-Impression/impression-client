import axios from "axios";

type AuthRouter = {
  replace: (href: string) => void;
};

type AuthPayload = Record<string, unknown>;

const AUTH_MARKER_KEY = "impression_authenticated";
const AUTH_TOKEN_KEY = "impression_token";
const AUTH_USER_KEY = "impression_user";

const TOKEN_STORAGE_KEYS = [
  AUTH_TOKEN_KEY,
  "token",
  "accessToken",
  "authToken",
  "access_token",
];

const USER_STORAGE_KEYS = [AUTH_USER_KEY, "user", "currentUser", "authUser"];

function isBrowser() {
  return typeof window !== "undefined";
}

function asRecord(value: unknown): AuthPayload | null {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
    ? (value as AuthPayload)
    : null;
}

function readStorage(keys: string[]) {
  if (!isBrowser()) return null;

  for (const key of keys) {
    const localValue = window.localStorage.getItem(key);
    if (localValue) return localValue;

    const sessionValue = window.sessionStorage.getItem(key);
    if (sessionValue) return sessionValue;
  }

  return null;
}

function writeStorage(key: string, value: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, value);
}

function removeStorage(keys: string[]) {
  if (!isBrowser()) return;

  for (const key of keys) {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  }
}

function pickString(payload: AuthPayload | null, keys: string[]) {
  if (!payload) return null;

  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) return value;
  }

  return null;
}

function pickRecord(payload: AuthPayload | null, keys: string[]) {
  if (!payload) return null;

  for (const key of keys) {
    const value = asRecord(payload[key]);
    if (value) return value;
  }

  return null;
}

function extractToken(payload: unknown) {
  const root = asRecord(payload);
  const nested = pickRecord(root, ["data", "result"]);

  return (
    pickString(root, ["token", "accessToken", "authToken", "access_token"]) ??
    pickString(nested, ["token", "accessToken", "authToken", "access_token"])
  );
}

function extractUser(payload: unknown) {
  const root = asRecord(payload);
  const nested = pickRecord(root, ["data", "result"]);

  return (
    pickRecord(root, ["user", "currentUser", "authUser", "profile"]) ??
    pickRecord(nested, ["user", "currentUser", "authUser", "profile"])
  );
}

export function persistAuthSession(payload: unknown) {
  const token = extractToken(payload);
  const user = extractUser(payload);

  writeStorage(AUTH_MARKER_KEY, "true");

  if (token) writeStorage(AUTH_TOKEN_KEY, token);
  if (user) writeStorage(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  removeStorage([
    AUTH_MARKER_KEY,
    ...TOKEN_STORAGE_KEYS,
    ...USER_STORAGE_KEYS,
  ]);
}

export function getStoredAuthToken() {
  return readStorage(TOKEN_STORAGE_KEYS);
}

export function getStoredAuthUser() {
  const rawUser = readStorage(USER_STORAGE_KEYS);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthPayload;
  } catch {
    return null;
  }
}

export function hasClientAuthSession() {
  return Boolean(readStorage([AUTH_MARKER_KEY]) || getStoredAuthToken());
}

export function requireClientAuth(router: AuthRouter) {
  if (hasClientAuthSession()) return true;
  router.replace("/login");
  return false;
}

export function redirectToLogin(router: AuthRouter) {
  clearAuthSession();
  router.replace("/login");
}

export function isUnauthorizedError(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 401;
}
