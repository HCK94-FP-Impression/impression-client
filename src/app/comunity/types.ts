export type MembershipStatus = "pending" | "approved" | null;

export type CommunityItem = {
  id: number;
  name: string;
  description: string;
  domain: string;
  leaderId: number;
  memberCount: number;
  leader: { id: number; username: string };
};

export type CommunityMemberRecord = {
  id: number;
  communityId: number;
  userId: number;
  status: "pending" | "approved";
  User: { id: number; username: string } | null;
};

export type LeaderboardEntry = {
  userId: number;
  username: string;
  averageScore: number;
  totalRatings: number;
};

export type CommunityDashboard = {
  community: CommunityItem & { CommunityMembers: CommunityMemberRecord[] };
  isLeader: boolean;
  pendingMembers: CommunityMemberRecord[];
  leaderboard: {
    social: LeaderboardEntry[];
    professional: LeaderboardEntry[];
  };
  statistics: {
    totalMembers: number;
    totalPosts: number;
    avgSocialScore: number;
    avgProfessionalScore: number;
  };
};

export type ForumPost = {
  id: number;
  communityId: number;
  userId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  User: { id: number; username: string } | null;
};

// API response shapes
export type CommunityListResponse = {
  communities: CommunityItem[];
};

export type CommunityByIdResponse = {
  community: CommunityItem;
  memberCount: number;
  membershipStatus: MembershipStatus;
};

export type CommunityDashboardResponse = CommunityDashboard;

export type MessageResponse = {
  message: string;
};
