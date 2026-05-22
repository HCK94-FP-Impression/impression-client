"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  Info,
  RefreshCw,
  Target,
  FileUser,
  Image as ImageIcon,
  ChevronDown,
} from "lucide-react";

const dummyProfile = {
  image: "https://xsgames.co/randomusers/avatar.php?g=male",
  targetJob: "SOFTWARE ENGINEER",
  criteria: ["PROFESIONAL", "ADAPTIF", "KOMUNIKATIF"],
};

const ratingOptions = [
  { label: "NO", level: 0 },
  { label: "SOMEWHAT", level: 1 },
  { label: "YES", level: 2 },
  { label: "VERY", level: 3 },
];

const educationItems = [
  {
    title: "Bachelor's in Electrical Engineering",
    school: "Austrian Polytechnic Institute",
    meta: "Top Tier • Class of 1878",
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
  phone: "+1 202 555 0123",
  location: "San Francisco, California",
};

const experienceItems = [
  {
    role: "Chief Inventor & Founder",
    company: "Tesla Electric Light & Manufacturing",
    meta: "5 Years • Current",
  },
  {
    role: "Electrical Engineer",
    company: "Continental Edison Company",
    meta: "2 Years • Paris, France",
  },
];

const skillItems = [
  "Power Systems",
  "Renewable Energy",
  "AC Current Design",
  "Wireless Transmission",
  "Electromagnetism",
];

type SectionConfig = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconWrapClassName: string;
  iconClassName: string;
  metaClassName: string;
  items: Array<{
    title: string;
    subtitle: string;
    meta: string;
  }>;
};

const detailSections: SectionConfig[] = [
  {
    title: "Education",
    subtitle: "Academic background",
    icon: GraduationCap,
    iconWrapClassName: "bg-indigo-400/10",
    iconClassName: "text-indigo-200",
    metaClassName: "text-emerald-300/80",
    items: educationItems.map((item) => ({
      title: item.title,
      subtitle: item.school,
      meta: item.meta,
    })),
  },
  {
    title: "Experience",
    subtitle: "Career history",
    icon: BriefcaseBusiness,
    iconWrapClassName: "bg-violet-400/10",
    iconClassName: "text-violet-200",
    metaClassName: "text-indigo-300/80",
    items: experienceItems.map((item) => ({
      title: item.role,
      subtitle: item.company,
      meta: item.meta,
    })),
  },
];

export default function FeedPage() {
  const [scores, setScores] = useState<(number | null)[]>([null, null, null]);

  const [isFlipped, setIsFlipped] = useState(false);

  const completed = scores.filter((s) => s !== null).length;

  return (
    <div className="mx-auto w-full max-w-7xl py-2">
      <div className="grid grid-cols-12 items-start gap-8">
        {/* LEFT */}
        <section className="col-span-7" style={{ perspective: "1000px" }}>
          <div className="relative w-full" style={{ height: "650px" }}>
            {/* TOGGLE BUTTON */}
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              type="button"
              className="absolute right-6 top-6 z-50 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/90 px-5 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-[#141923] shadow-[0_12px_30px_-12px_rgba(15,23,42,0.5)] transition-all hover:-translate-y-0.5 hover:bg-white active:scale-[0.98]"
            >
              {isFlipped ? (
                <>
                  <ImageIcon size={14} />
                  <span>View Photo</span>
                </>
              ) : (
                <>
                  <FileUser size={14} />
                  <span>View CV</span>
                </>
              )}
            </button>

            <div
              className="relative h-full w-full transition-transform duration-700"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* FRONT */}
              <div
                className={`absolute inset-0 flex h-full w-full flex-col justify-between rounded-3xl bg-[#05070c] p-6 shadow-2xl transition-all duration-300 ${
                  isFlipped
                    ? "pointer-events-none opacity-0"
                    : "z-10 opacity-100"
                }`}
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div className="flex h-full flex-col justify-between rounded-2xl bg-black p-4">
                  <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-gray-900">
                    <img
                      src={dummyProfile.image}
                      alt="Profile"
                      className="h-full max-h-[440px] w-full object-cover"
                    />
                  </div>

                  <div className="mt-4 text-white">
                    <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#3b4363]">
                      TARGET ROLE
                    </span>

                    <h1 className="mt-2 font-sans text-5xl font-extrabold tracking-tight text-white">
                      {dummyProfile.targetJob}
                    </h1>

                    <div className="mt-4 flex gap-3">
                      {dummyProfile.criteria.map((item) => (
                        <div
                          key={item}
                          className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-2"
                        >
                          <Target
                            size={12}
                            className="text-indigo-400 opacity-80"
                          />

                          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-200">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* BACK */}
              <div
                className={`absolute inset-0 flex h-full w-full flex-col justify-between rounded-3xl border border-white/5 bg-[#0a0d17] p-6 shadow-2xl transition-all duration-300 ${
                  isFlipped
                    ? "z-20 opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                {/* Ambient background glow */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.15),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.06),transparent_50%)]" />

                <div className="relative mt-14 h-[calc(100%-4rem)] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="space-y-5">
                    {/* HEADER SECTION WITH RE-ENGINEERED RADAR CHART */}
                    <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#111627]/95 to-[#141b35]/80 p-6 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left w-full">
                          <div className="relative shrink-0">
                            <div className="absolute -inset-0.5 rounded-2xl blur opacity-30" />
                            <img
                              src={dummyProfile.image}
                              alt="profile"
                              className="relative h-24 w-24 rounded-2xl object-cover border border-white/10"
                            />
                          </div>

                          <div className="flex-1">
                            <h2 className="text-3xl font-black tracking-tight text-white bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
                              Alex Carter
                            </h2>
                            <p className="mt-1 text-sm font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-300">
                              Senior Software Engineer
                            </p>
                          </div>
                        </div>

                        {/* INFOGRAFIS STATISTIK RADAR (Perbandingan Penilaian Sosial vs Profesional) */}
                        <div className="flex flex-col items-center justify-between bg-black/40 border border-white/5 rounded-2xl p-6 min-w-[240px] h-full shrink-0 shadow-inner">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
                            PERFORMANCE RADAR
                          </span>

                          {/* CONTAINER GRAPH WITH BETTER PADDING */}
                          <div className="relative w-40 h-40 flex items-center justify-center my-2">
                            <svg
                              className="w-full h-full"
                              viewBox="0 0 100 100"
                            >
                              {/* 1. Jaring Panduan Radar Luar (Skor Maksimal 100%) - Dikecilkan sedikit agar label tidak tabrakan */}
                              <polygon
                                points="50,15 85,75 15,75"
                                fill="none"
                                stroke="rgba(255,255,255,0.08)"
                                strokeWidth="1"
                              />

                              {/* 2. Jaring Panduan Radar Tengah (Skor 50%) */}
                              <polygon
                                points="50,35 67.5,65 32.5,65"
                                fill="none"
                                stroke="rgba(255,255,255,0.04)"
                                strokeWidth="0.75"
                              />

                              {/* 3. Garis Sumbu Penanda Kriteria dari Pusat (50,55) */}
                              <line
                                x1="50"
                                y1="55"
                                x2="50"
                                y2="15"
                                stroke="rgba(255,255,255,0.12)"
                                strokeWidth="0.75"
                                strokeDasharray="2"
                              />
                              <line
                                x1="50"
                                y1="55"
                                x2="85"
                                y2="75"
                                stroke="rgba(255,255,255,0.12)"
                                strokeWidth="0.75"
                                strokeDasharray="2"
                              />
                              <line
                                x1="50"
                                y1="55"
                                x2="15"
                                y2="75"
                                stroke="rgba(255,255,255,0.12)"
                                strokeWidth="0.75"
                                strokeDasharray="2"
                              />

                              {/* ================= LAYER 1: PENILAIAN SOSIAL (Cyan) ================= */}
                              {/* Koordinat dikunci pas di dalam batas jaring: Top(50,30), Right(78,70), Left(22,71) */}
                              <polygon
                                points="50,30 78,70 22,71"
                                fill="url(#socialGradient)"
                                stroke="#06b6d4"
                                strokeWidth="1.5"
                                strokeLinejoin="round"
                                className="opacity-75"
                              />

                              {/* ================= LAYER 2: PENILAIAN PROFESIONAL (Indigo) ================= */}
                              {/* Koordinat dikunci pas di dalam batas jaring: Top(50,18), Right(74,66), Left(29,64) */}
                              <polygon
                                points="50,18 74,66 29,64"
                                fill="url(#professionalGradient)"
                                stroke="#6366f1"
                                strokeWidth="1.5"
                                strokeLinejoin="round"
                                className="opacity-80"
                              />

                              {/* Titik Simpul Data (Disinkronkan dengan koordinat polygon di atas) */}
                              {/* Titik Sosial (Cyan) */}
                              <circle cx="50" cy="30" r="2" fill="#06b6d4" />
                              <circle cx="78" cy="70" r="2" fill="#06b6d4" />
                              <circle cx="22" cy="71" r="2" fill="#06b6d4" />
                              {/* Titik Profesional (Indigo) */}
                              <circle cx="50" cy="18" r="2" fill="#818cf8" />
                              <circle cx="74" cy="66" r="2" fill="#818cf8" />
                              <circle cx="29" cy="64" r="2" fill="#818cf8" />

                              {/* DEFINISI GRADIENT */}
                              <defs>
                                <linearGradient
                                  id="socialGradient"
                                  x1="0%"
                                  y1="0%"
                                  x2="0%"
                                  y2="100%"
                                >
                                  <stop
                                    offset="0%"
                                    stopColor="rgba(6, 182, 212, 0.2)"
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor="rgba(6, 182, 212, 0.03)"
                                  />
                                </linearGradient>
                                <linearGradient
                                  id="professionalGradient"
                                  x1="0%"
                                  y1="0%"
                                  x2="0%"
                                  y2="100%"
                                >
                                  <stop
                                    offset="0%"
                                    stopColor="rgba(99, 102, 241, 0.25)"
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor="rgba(99, 102, 241, 0.03)"
                                  />
                                </linearGradient>
                              </defs>
                            </svg>

                            {/* TEXT LABELS WITH BETTER PLACEMENT & PADDING */}
                            {/* Atas */}
                            {/* TOP */}
                            <div className="absolute top-[-18px] left-1/2 -translate-x-1/2 text-center">
                              <p className="text-[8px] font-black tracking-widest text-slate-400 uppercase">
                                {dummyProfile.criteria[0]}
                              </p>

                              <span className="text-[10px] font-bold text-indigo-300">
                                92%
                              </span>
                            </div>

                            {/* RIGHT */}
                            <div className="absolute bottom-[0px] right-[-10px] text-right">
                              <p className="text-[8px] font-black tracking-widest text-slate-400 uppercase">
                                {dummyProfile.criteria[1]}
                              </p>

                              <span className="text-[10px] font-bold text-indigo-300">
                                84%
                              </span>
                            </div>

                            {/* LEFT */}
                            <div className="absolute bottom-[0px] left-[-10px] text-left">
                              <p className="text-[8px] font-black tracking-widest text-slate-400 uppercase">
                                {dummyProfile.criteria[2]}
                              </p>

                              <span className="text-[10px] font-bold text-indigo-300">
                                76%
                              </span>
                            </div>
                          </div>

                          {/* LEGENDA / KUNCI BACA GRAFIK */}
                          <div className="mt-4 w-full pt-3 border-t border-white/5 flex justify-center gap-5">
                            <div className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-[#06b6d4] shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                              <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase">
                                SOSIAL
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-[#6366f1] shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                              <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase">
                                PROFESIONAL
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CONTACT GRID */}
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { label: "EMAIL", value: contactInfo.email },
                          { label: "PHONE", value: contactInfo.phone },
                          { label: "LOCATION", value: contactInfo.location },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="rounded-xl border border-white/5 bg-black/30 p-3.5"
                          >
                            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-500">
                              {item.label}
                            </p>
                            <p className="mt-1.5 text-xs font-semibold text-slate-200 truncate select-all">
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 1. MINIMIZABLE SECTION: SUMMARY */}
                    <details
                      className="group rounded-3xl border border-white/5 bg-[#111627]/90 p-6 shadow-xl overflow-hidden block"
                      open
                    >
                      <summary className="flex items-center justify-between cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                            <FileText size={15} className="text-indigo-300" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white">
                              Professional Summary
                            </h3>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-indigo-400/60">
                              Candidate Overview
                            </p>
                          </div>
                        </div>
                        <ChevronDown
                          size={16}
                          className="text-slate-400 transition-transform duration-300 group-open:rotate-180"
                        />
                      </summary>

                      <div className="mt-5 border-t border-white/5 pt-4">
                        <p className="text-xs sm:text-sm leading-6 sm:leading-7 text-slate-300/95 font-medium">
                          {profileSummary}
                        </p>
                      </div>
                    </details>

                    {/* 2. MINIMIZABLE SECTION: EXPERIENCE */}
                    <details
                      className="group rounded-3xl border border-white/5 bg-[#111627]/90 p-6 shadow-xl overflow-hidden block"
                      open
                    >
                      <summary className="flex items-center justify-between cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20">
                            <BriefcaseBusiness
                              size={15}
                              className="text-violet-300"
                            />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white">
                              Work Experience
                            </h3>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-violet-400/60">
                              Career Journey
                            </p>
                          </div>
                        </div>
                        <ChevronDown
                          size={16}
                          className="text-slate-400 transition-transform duration-300 group-open:rotate-180"
                        />
                      </summary>

                      <div className="mt-5 border-t border-white/5 pt-4 space-y-3">
                        {experienceItems.map((item) => (
                          <div
                            key={item.role}
                            className="rounded-2xl border border-white/5 bg-gradient-to-r from-black/40 to-black/10 p-5 hover:border-violet-500/20 transition duration-300"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <div>
                                <h4 className="text-base font-bold text-white">
                                  {item.role}
                                </h4>
                                <p className="mt-1 text-xs text-slate-400 font-medium">
                                  {item.company}
                                </p>
                              </div>
                              <span className="self-start sm:self-auto rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-violet-300 whitespace-nowrap">
                                {item.meta}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>

                    {/* 3. MINIMIZABLE SECTION: FEATURED PROJECTS */}
                    <details
                      className="group rounded-3xl border border-white/5 bg-[#111627]/90 p-6 shadow-xl overflow-hidden block"
                      open
                    >
                      <summary className="flex items-center justify-between cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20">
                            <Target size={15} className="text-fuchsia-300" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white">
                              Featured Projects
                            </h3>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-fuchsia-400/60">
                              Selected Work
                            </p>
                          </div>
                        </div>
                        <ChevronDown
                          size={16}
                          className="text-slate-400 transition-transform duration-300 group-open:rotate-180"
                        />
                      </summary>

                      <div className="mt-5 border-t border-white/5 pt-4 space-y-3.5">
                        {projectItems.map((project) => (
                          <div
                            key={project.title}
                            className="rounded-2xl border border-white/5 bg-gradient-to-r from-black/40 to-black/10 p-5 hover:border-fuchsia-500/20 transition duration-300"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-2">
                                <h4 className="text-base font-bold text-white">
                                  {project.title}
                                </h4>
                                <p className="text-xs leading-5 text-slate-400 font-medium">
                                  {project.description}
                                </p>
                              </div>
                              <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-right shrink-0">
                                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-emerald-400/70">
                                  IMPACT
                                </p>
                                <p className="mt-0.5 text-[10px] font-black text-emerald-300">
                                  {project.impact}
                                </p>
                              </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {project.stack.map((tech) => (
                                <span
                                  key={tech}
                                  className="rounded-lg border border-white/5 bg-white/[0.04] px-2.5 py-1 text-[8px] font-bold text-slate-300"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>

                    {/* 4. TWO COLUMN COLLAPSIBLE GRID: EDUCATION & CERTIFICATIONS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* EDUCATION DETAILS */}
                      <details
                        className="group rounded-3xl border border-white/5 bg-[#111627]/90 p-6 shadow-xl overflow-hidden block"
                        open
                      >
                        <summary className="flex items-center justify-between cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                              <GraduationCap
                                size={15}
                                className="text-cyan-300"
                              />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-white">
                                Education
                              </h3>
                              <p className="text-[9px] uppercase tracking-[0.2em] text-cyan-400/60">
                                Academic
                              </p>
                            </div>
                          </div>
                          <ChevronDown
                            size={14}
                            className="text-slate-400 transition-transform duration-300 group-open:rotate-180"
                          />
                        </summary>

                        <div className="mt-4 border-t border-white/5 pt-4 space-y-3">
                          {educationItems.map((item) => (
                            <div
                              key={item.title}
                              className="rounded-xl border border-white/5 bg-black/30 p-4"
                            >
                              <h5 className="text-xs font-bold text-white">
                                {item.title}
                              </h5>
                              <p className="mt-1 text-[11px] text-slate-400 font-medium">
                                {item.school}
                              </p>
                              <span className="inline-block mt-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[8px] font-black text-emerald-400">
                                {item.meta}
                              </span>
                            </div>
                          ))}
                        </div>
                      </details>

                      {/* CERTIFICATIONS DETAILS */}
                      <details
                        className="group rounded-3xl border border-white/5 bg-[#111627]/90 p-6 shadow-xl overflow-hidden block"
                        open
                      >
                        <summary className="flex items-center justify-between cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                              <FileUser
                                size={15}
                                className="text-emerald-300"
                              />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-white">
                                Certifications
                              </h3>
                              <p className="text-[9px] uppercase tracking-[0.2em] text-emerald-400/60">
                                Validation
                              </p>
                            </div>
                          </div>
                          <ChevronDown
                            size={14}
                            className="text-slate-400 transition-transform duration-300 group-open:rotate-180"
                          />
                        </summary>

                        <div className="mt-4 border-t border-white/5 pt-4 space-y-2">
                          {certifications.map((item) => (
                            <div
                              key={item}
                              className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-black/30 px-4 py-2.5"
                            >
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                              <p className="text-xs font-semibold text-slate-200">
                                {item}
                              </p>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>

                    {/* 5. MINIMIZABLE SECTION: STRENGTHS & LANGUAGES */}
                    <details
                      className="group rounded-3xl border border-white/5 bg-[#111627]/90 p-6 shadow-xl overflow-hidden block"
                      open
                    >
                      <summary className="flex items-center justify-between cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                            <Target size={15} className="text-indigo-300" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white">
                              Skills & Languages
                            </h3>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-indigo-400/60">
                              Proficiencies
                            </p>
                          </div>
                        </div>
                        <ChevronDown
                          size={16}
                          className="text-slate-400 transition-transform duration-300 group-open:rotate-180"
                        />
                      </summary>

                      <div className="mt-5 border-t border-white/5 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 mb-3">
                            Core Strengths
                          </h4>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {strengths.map((item) => (
                              <span
                                key={item}
                                className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[9px] font-bold text-indigo-300"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {skillItems.map((item) => (
                              <span
                                key={item}
                                className="rounded-lg border border-fuchsia-500/20 bg-fuchsia-500/10 px-2.5 py-1 text-[9px] font-bold text-fuchsia-300"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3 border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0 md:pl-4">
                          <h4 className="text-xs font-bold text-slate-400">
                            Languages
                          </h4>
                          {languages.map((item) => {
                            const scoreMap: Record<string, string> = {
                              Native: "100%",
                              Fluent: "90%",
                              Professional: "80%",
                              Intermediate: "60%",
                            };
                            return (
                              <div key={item.name} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-bold text-slate-200">
                                    {item.name}
                                  </span>
                                  <span className="text-[9px] font-bold text-indigo-400">
                                    {item.level}
                                  </span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-400"
                                    style={{
                                      width: scoreMap[item.level] || "70%",
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <section className="col-span-5">
          <div className="flex h-full flex-col">
            <div className="mb-6">
              <h2 className="font-sans text-3xl font-black tracking-tight text-[#0f141e]">
                RATE THIS PROFILE
              </h2>

              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
                Give a score for each criterion below.
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-end justify-between pb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                <span>Rated Criteria</span>

                <span className="font-extrabold text-gray-900">
                  {completed} / {scores.length}
                </span>
              </div>

              <div className="h-0.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-[#1b2030] transition-all duration-300"
                  style={{
                    width: `${(completed / scores.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex-1 space-y-6">
              {dummyProfile.criteria.map((label, index) => (
                <div key={label}>
                  <div>
                    <span className="inline-block rounded-lg bg-[#141923] px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-white">
                      {label}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-4">
                    {ratingOptions.map((option) => {
                      const active = scores[index] === option.level;

                      return (
                        <button
                          key={option.level}
                          type="button"
                          onClick={() => {
                            const next = [...scores];
                            next[index] = option.level;
                            setScores(next);
                          }}
                          className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border px-2 py-4 transition-all duration-200 ${
                            active
                              ? "scale-[1.01] border-[#141923] bg-[#141923] text-white shadow-lg"
                              : "border-gray-100 bg-white shadow-sm hover:border-gray-300"
                          }`}
                        >
                          <span
                            className={`text-[13px] font-black tracking-wide ${
                              active ? "text-white" : "text-[#1e2533]"
                            }`}
                          >
                            {option.label}
                          </span>

                          <span
                            className={`mt-1 text-[8px] font-bold uppercase tracking-widest ${
                              active ? "text-gray-400" : "text-gray-400/80"
                            }`}
                          >
                            LVL {option.level}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              {completed !== scores.length ? (
                <div className="flex items-center justify-center gap-3 rounded-2xl bg-[#1c2230] py-5 text-center text-white shadow-md">
                  <Info size={14} className="text-indigo-400" />

                  <span className="text-[11px] font-extrabold uppercase tracking-[0.2em]">
                    Please rate all criteria to continue
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  className="w-full cursor-pointer rounded-2xl bg-indigo-500 py-5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-white shadow-md transition-all hover:bg-indigo-700"
                >
                  Submit Rating
                </button>
              )}

              <button
                type="button"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-5 text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-700 shadow-sm transition-all hover:bg-gray-50"
              >
                <RefreshCw size={13} />
                Skip Profile
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
