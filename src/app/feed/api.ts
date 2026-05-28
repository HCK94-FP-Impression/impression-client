import { api } from "@/constants/constants";
import type {
  FeedResponse,
  SubmitRatingPayload,
  SubmitRatingResponse,
} from "../../types";

export { getCurrentUser } from "@/api/user";

export async function getFeedPost(skipPostId?: number) {
  const response = await api.get<FeedResponse>("/posts/feed", {
    params: skipPostId ? { skipPostId } : undefined,
  });

  return response.data;
}

export async function submitRating(payload: SubmitRatingPayload) {
  const insight = payload.insight?.trim();
  const response = await api.post<SubmitRatingResponse>("/ratings", {
    postId: payload.postId,
    scores: payload.scores,
    ...(insight ? { insight } : {}),
  });

  return response.data;
}

export async function getMyTargetJob(): Promise<string | null> {
  try {
    const response = await api.get<{ post: { targetJob: string } }>(
      "/posts/my-post",
    );
    return response.data.post.targetJob;
  } catch {
    return null;
  }
}
