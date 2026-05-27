import axios from "axios";

type AuthRouter = { replace: (href: string) => void };

const AUTH_MARKER_KEY = "impression_authenticated";
const AUTH_USER_KEY = "impression_user";

function isBrowser() {
  return typeof window !== "undefined";
}

function readLocal(key: string) {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(key);
}

function writeLocal(key: string, value: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, value);
}

function removeLocal(keys: string[]) {
  if (!isBrowser()) return;
  for (const key of keys) window.localStorage.removeItem(key);
}

function extractUser(payload: unknown): Record<string, unknown> | null {
  const root =
    payload && typeof payload === "object" && !Array.isArray(payload)
      ? (payload as Record<string, unknown>)
      : null;
  if (!root) return null;

  const candidates = ["user", "currentUser", "authUser", "profile"];
  for (const key of candidates) {
    const v = root[key];
    if (v && typeof v === "object" && !Array.isArray(v))
      return v as Record<string, unknown>;
  }
  return null;
}

// Call after a successful login/register response.
// Stores a client-side marker so hasClientAuthSession() works.
// Actual auth happens via the HTTP-only cookie set by the server.
export function persistAuthSession(payload: unknown) {
  writeLocal(AUTH_MARKER_KEY, "true");
  const user = extractUser(payload);
  if (user) writeLocal(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  removeLocal([AUTH_MARKER_KEY, AUTH_USER_KEY]);
}

export function getStoredAuthUser() {
  const raw = readLocal(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

// True when the client-side marker is present.
// The actual session lives in the HTTP-only cookie — this is just a UI hint.
export function hasClientAuthSession() {
  return Boolean(readLocal(AUTH_MARKER_KEY));
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
