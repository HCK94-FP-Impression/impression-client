export const CURRENT_USER = { id: 7, username: "dani_devops" };

export type MembershipStatus = "none" | "pending" | "approved";

export type Community = {
  id: number;
  name: string;
  description: string;
  domain: string;
  leaderId: number;
  memberCount: number;
  leader: { id: number; username: string };
};

export type CommunityMember = {
  id: number;
  userId: number;
  status: "pending" | "approved";
  user: { id: number; username: string };
};

export type LeaderboardEntry = {
  userId: number;
  username: string;
  averageScore: number;
  totalRatings: number;
};

export type CommunityDetailData = {
  members: CommunityMember[];
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

export const DOMAIN_META: Record<string, { label: string; pill: string }> = {
  javascript: { label: "JavaScript", pill: "border-yellow-400/30 bg-yellow-400/10 text-yellow-600" },
  python:     { label: "Python",     pill: "border-blue-400/30 bg-blue-400/10 text-blue-600" },
  frontend:   { label: "Frontend",   pill: "border-violet-400/30 bg-violet-400/10 text-violet-600" },
  devops:     { label: "DevOps",     pill: "border-emerald-400/30 bg-emerald-400/10 text-emerald-600" },
  mobile:     { label: "Mobile",     pill: "border-cyan-400/30 bg-cyan-400/10 text-cyan-600" },
  data:       { label: "Data & AI",  pill: "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-600" },
};

export const DOMAIN_META_DARK: Record<string, { label: string; pill: string }> = {
  javascript: { label: "JavaScript", pill: "border-yellow-400/30 bg-yellow-400/10 text-yellow-400" },
  python:     { label: "Python",     pill: "border-blue-400/30 bg-blue-400/10 text-blue-400" },
  frontend:   { label: "Frontend",   pill: "border-violet-400/30 bg-violet-400/10 text-violet-400" },
  devops:     { label: "DevOps",     pill: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400" },
  mobile:     { label: "Mobile",     pill: "border-cyan-400/30 bg-cyan-400/10 text-cyan-400" },
  data:       { label: "Data & AI",  pill: "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-400" },
};

export const COMMUNITIES: Community[] = [
  {
    id: 1,
    name: "JavaScript Indonesia",
    description: "Komunitas developer JavaScript di Indonesia. Tempat berbagi ilmu, pengalaman, dan peluang karir di bidang JavaScript.",
    domain: "javascript",
    leaderId: 1,
    memberCount: 5,
    leader: { id: 1, username: "luthfi_dev" },
  },
  {
    id: 2,
    name: "Python Enthusiast ID",
    description: "Komunitas pecinta Python di Indonesia. Dari data science hingga web development, semua ada di sini.",
    domain: "python",
    leaderId: 2,
    memberCount: 12,
    leader: { id: 2, username: "sarah_py" },
  },
  {
    id: 3,
    name: "React & Frontend Dev",
    description: "Komunitas frontend developer yang fokus pada React, Next.js, dan ekosistem modern JavaScript.",
    domain: "frontend",
    leaderId: 3,
    memberCount: 8,
    leader: { id: 3, username: "reza_fe" },
  },
  {
    id: 4,
    name: "DevOps & Cloud ID",
    description: "Komunitas untuk praktisi DevOps, cloud engineering, dan infrastructure as code di Indonesia.",
    domain: "devops",
    leaderId: 7,
    memberCount: 3,
    leader: { id: 7, username: "dani_devops" },
  },
  {
    id: 5,
    name: "Mobile Dev Indonesia",
    description: "Komunitas developer mobile yang membangun aplikasi iOS, Android, dan React Native.",
    domain: "mobile",
    leaderId: 5,
    memberCount: 7,
    leader: { id: 5, username: "budi_fullstack" },
  },
  {
    id: 6,
    name: "Data Science & AI",
    description: "Komunitas data scientist dan AI/ML engineer. Berbagi riset, tools, dan proyek machine learning.",
    domain: "data",
    leaderId: 6,
    memberCount: 15,
    leader: { id: 6, username: "nina_data" },
  },
];

export const INITIAL_MEMBERSHIPS: Record<number, MembershipStatus> = {
  1: "approved",
  2: "none",
  3: "none",
  4: "approved",
  5: "pending",
  6: "none",
};

export const COMMUNITY_DETAILS: Record<number, CommunityDetailData> = {
  1: {
    members: [
      { id: 1, userId: 1, status: "approved", user: { id: 1, username: "luthfi_dev" } },
      { id: 2, userId: 3, status: "approved", user: { id: 3, username: "tri_backend" } },
      { id: 3, userId: 4, status: "approved", user: { id: 4, username: "sari_frontend" } },
      { id: 4, userId: 5, status: "approved", user: { id: 5, username: "budi_fullstack" } },
      { id: 6, userId: 7, status: "approved", user: { id: 7, username: "dani_devops" } },
    ],
    leaderboard: {
      social: [
        { userId: 4, username: "sari_frontend", averageScore: 2.67, totalRatings: 1 },
        { userId: 7, username: "dani_devops",   averageScore: 2.67, totalRatings: 2 },
        { userId: 3, username: "tri_backend",   averageScore: 2.33, totalRatings: 1 },
        { userId: 5, username: "budi_fullstack", averageScore: 2.33, totalRatings: 1 },
      ],
      professional: [
        { userId: 4, username: "sari_frontend",  averageScore: 3.00, totalRatings: 1 },
        { userId: 3, username: "tri_backend",    averageScore: 2.50, totalRatings: 2 },
        { userId: 5, username: "budi_fullstack", averageScore: 2.33, totalRatings: 1 },
        { userId: 7, username: "dani_devops",    averageScore: 0.00, totalRatings: 0 },
      ],
    },
    statistics: { totalMembers: 5, totalPosts: 1, avgSocialScore: 2.50, avgProfessionalScore: 1.96 },
  },
  4: {
    members: [
      { id: 10, userId: 7,  status: "approved", user: { id: 7,  username: "dani_devops" } },
      { id: 11, userId: 8,  status: "approved", user: { id: 8,  username: "adi_ops" } },
      { id: 12, userId: 9,  status: "approved", user: { id: 9,  username: "kiki_cloud" } },
      { id: 13, userId: 10, status: "pending",  user: { id: 10, username: "rizki_infra" } },
      { id: 14, userId: 11, status: "pending",  user: { id: 11, username: "maya_sre" } },
    ],
    leaderboard: {
      social: [
        { userId: 7, username: "dani_devops", averageScore: 2.80, totalRatings: 3 },
        { userId: 8, username: "adi_ops",     averageScore: 2.50, totalRatings: 2 },
        { userId: 9, username: "kiki_cloud",  averageScore: 2.20, totalRatings: 2 },
      ],
      professional: [
        { userId: 9, username: "kiki_cloud",  averageScore: 2.90, totalRatings: 2 },
        { userId: 7, username: "dani_devops", averageScore: 2.70, totalRatings: 3 },
        { userId: 8, username: "adi_ops",     averageScore: 2.40, totalRatings: 2 },
      ],
    },
    statistics: { totalMembers: 3, totalPosts: 4, avgSocialScore: 2.50, avgProfessionalScore: 2.67 },
  },
  5: {
    members: [
      { id: 20, userId: 5,  status: "approved", user: { id: 5,  username: "budi_fullstack" } },
      { id: 21, userId: 15, status: "approved", user: { id: 15, username: "rina_ios" } },
      { id: 22, userId: 16, status: "approved", user: { id: 16, username: "tommy_android" } },
      { id: 23, userId: 7,  status: "pending",  user: { id: 7,  username: "dani_devops" } },
    ],
    leaderboard: {
      social: [
        { userId: 5,  username: "budi_fullstack",  averageScore: 2.90, totalRatings: 3 },
        { userId: 15, username: "rina_ios",         averageScore: 2.70, totalRatings: 2 },
        { userId: 16, username: "tommy_android",    averageScore: 2.40, totalRatings: 2 },
      ],
      professional: [
        { userId: 15, username: "rina_ios",         averageScore: 2.80, totalRatings: 2 },
        { userId: 5,  username: "budi_fullstack",   averageScore: 2.60, totalRatings: 3 },
        { userId: 16, username: "tommy_android",    averageScore: 2.30, totalRatings: 2 },
      ],
    },
    statistics: { totalMembers: 7, totalPosts: 3, avgSocialScore: 2.67, avgProfessionalScore: 2.57 },
  },
};
