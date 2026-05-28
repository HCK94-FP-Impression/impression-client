const profileSeed = {
  image: "https://xsgames.co/randomusers/avatar.php?g=male",
  targetJob: "SOFTWARE ENGINEER",
  criteria: ["PROFESIONAL", "ADAPTIF", "KOMUNIKATIF"],
};

const educationItems = [
  {
    title: "Bachelor's in Electrical Engineering",
    school: "Austrian Polytechnic Institute",
    meta: "Top Tier - Class of 1878",
  },
];

const profileSummary = `
Experienced software engineer with strong focus on scalable frontend
architecture, modern web technologies, and product-oriented development.
Skilled in building performant applications with clean UI systems,
maintainable code structure, and strong collaboration across teams.
`;

const projectItems = [
  {
    title: "AI Resume Analyzer Platform",
    description:
      "Built a resume screening platform with ATS scoring, profile matching, and recruiter analytics dashboard.",
    stack: ["Next.js", "TypeScript", "Tailwind", "PostgreSQL"],
    impact: "Increased recruiter screening speed by 48%",
  },
  {
    title: "E-Wallet Mobile Application",
    description:
      "Developed secure financial transaction flows and real-time balance synchronization system.",
    stack: ["React Native", "Redux", "Node.js"],
    impact: "Handled 20k+ monthly transactions",
  },
];

const certifications = [
  "AWS Certified Cloud Practitioner",
  "Google UX Design Professional",
  "Meta Front-End Engineer",
];

const languages = [
  { name: "English", level: "Professional" },
  { name: "Indonesian", level: "Native" },
];

const strengths = [
  "Problem Solving",
  "System Design",
  "Team Collaboration",
  "Leadership",
];

const contactInfo = {
  email: "alexcarter@example.com",
  linkedin: "linkedin.com/in/alexcarter",
  location: "San Francisco, California",
};

const experienceItems = [
  {
    role: "Chief Inventor & Founder",
    company: "Tesla Electric Light & Manufacturing",
    meta: "5 Years - Current",
  },
  {
    role: "Electrical Engineer",
    company: "Continental Edison Company",
    meta: "2 Years - Paris, France",
  },
];

const skillItems = [
  "Power Systems",
  "Renewable Energy",
  "AC Current Design",
  "Wireless Transmission",
  "Electromagnetism",
];

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
  role: profileSeed.targetJob,
  location: contactInfo.location,
  email: contactInfo.email,
  linkedin: contactInfo.linkedin,
  summary: profileSummary.trim(),
  imageUrl: profileSeed.image,
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
  criteria: [...profileSeed.criteria],
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
