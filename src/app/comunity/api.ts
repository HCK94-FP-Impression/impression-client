import { api } from "@/constants/constants";
import type {
  CommunityListResponse,
  CommunityByIdResponse,
  CommunityDashboardResponse,
  MessageResponse,
} from "./types";

export async function getCommunities(params?: { search?: string; domain?: string }) {
  const response = await api.get<CommunityListResponse>("/communities", {
    params,
  });
  return response.data;
}

export async function getCommunityById(id: number) {
  const response = await api.get<CommunityByIdResponse>(`/communities/${id}`);
  return response.data;
}

export async function getCommunityDashboard(id: number) {
  const response = await api.get<CommunityDashboardResponse>(
    `/communities/${id}/dashboard`,
  );
  return response.data;
}

export async function joinCommunity(id: number) {
  const response = await api.post<MessageResponse>(`/communities/${id}/join`);
  return response.data;
}

export async function approveMember(communityId: number, userId: number) {
  const response = await api.patch<MessageResponse>(
    `/communities/${communityId}/members/${userId}/approve`,
  );
  return response.data;
}

export async function rejectMember(communityId: number, userId: number) {
  const response = await api.patch<MessageResponse>(
    `/communities/${communityId}/members/${userId}/reject`,
  );
  return response.data;
}
