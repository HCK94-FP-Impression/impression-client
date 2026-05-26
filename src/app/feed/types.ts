export type FeedRatingCriterion = {
  label: string;
  average: number;
  maxScore: number;
};

export type FeedProfessionalInsight = {
  username: string;
  ratingType: string;
  averageScore: number;
  insight: string | null;
};

export type FeedRatings = {
  social: {
    totalRatings: number;
    criteria: FeedRatingCriterion[];
  };
  professional: {
    totalRatings: number;
    isRatedByProfessional: boolean;
    criteria: FeedRatingCriterion[];
    insights: FeedProfessionalInsight[];
  };
};

export type FeedCvItem = string | Record<string, unknown>;

export type FeedCv = {
  experiences?: FeedCvItem[];
  educations?: FeedCvItem[];
  skills?: string[];
};

export type FeedPost = {
  id: number;
  userId: number;
  image: string | null;
  targetJob: string;
  criteria: string[];
  aiScore: number | null;
  aiInsight: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
  };
  cv: FeedCv | null;
  ratings: FeedRatings;
};

export type FeedResponse = {
  post: FeedPost | null;
  cycleCompleted?: boolean;
  message?: string;
};

export type SubmitRatingPayload = {
  postId: number;
  scores: number[];
  insight?: string;
};

export type SubmitRatingResponse = {
  message: string;
};
