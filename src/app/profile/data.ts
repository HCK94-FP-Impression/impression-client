import {
  certifications,
  contactInfo,
  dummyProfile,
  educationItems,
  experienceItems,
  languages,
  profileSummary,
  projectItems,
  skillItems,
  strengths,
} from "../feed/data";

export type CriteriaScore = {
  label: string;
  score: number;
  max: number;
};

export type ProfileData = {
  name: string;
  role: string;
  location: string;
  email: string;
  linkedin: string;
  summary: string;
  imageUrl: string;
  experience: Array<{ role: string; company: string; meta: string }>;
  education: Array<{ title: string; school: string; meta: string }>;
  skills: string[];
  criteria: string[];
};

export const initialProfile: ProfileData = {
  name: "Alex Carter",
  role: dummyProfile.targetJob,
  location: contactInfo.location,
  email: contactInfo.email,
  linkedin: contactInfo.linkedin,
  summary: profileSummary.trim(),
  imageUrl: dummyProfile.image,
  experience: experienceItems.map((item) => ({
    role: item.role,
    company: item.company,
    meta: item.meta,
  })),
  education: educationItems.map((item) => ({
    title: item.title,
    school: item.school,
    meta: item.meta,
  })),
  skills: [...skillItems],
  criteria: [...dummyProfile.criteria],
};

export const scoreData: CriteriaScore[] = [
  { label: "Profesional", score: 2.7, max: 3 },
  { label: "Adaptif", score: 2.2, max: 3 },
  { label: "Komunikatif", score: 2.9, max: 3 },
];

export const socialScores = [2.5, 2.1, 2.8];
export const professionalScores = [2.8, 2.4, 2.6];

export const jobRecommendations = [
  {
    title: "Senior Frontend Engineer",
    company: "Nebula",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Product Engineer",
    company: "Lighthouse",
    location: "Singapore",
    type: "Hybrid",
  },
  {
    title: "Design Systems Lead",
    company: "Orbit",
    location: "Berlin",
    type: "On-site",
  },
];

export const profileContact = contactInfo;
export const profileProjects = projectItems;
export const profileStrengths = strengths;
export const profileReference = {
  certifications,
  languages,
};
