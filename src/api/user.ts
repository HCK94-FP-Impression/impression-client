import { api } from "@/constants/constants";

export type CurrentUser = {
  id: number;
  username: string;
  email: string;
  quota: number;
  role: "job_seeker" | "recruiter";
};

export async function getCurrentUser(): Promise<CurrentUser> {
  const response = await api.get<{ user: CurrentUser }>("/auth/me");
  return response.data.user;
}
