"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  PencilLine,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Award,
  Zap,
  GraduationCap,
  LoaderCircle,
  Sparkles,
} from "lucide-react";
import ProfileRadar from "./components/radar";
import { api, getApiErrorMessage } from "@/constants/constants";
import { isUnauthorizedError, redirectToLogin } from "@/constants/authProxy";
import { useRouter } from "next/navigation";
import type { CurrentUser } from "@/api/user";

type CriteriaScore = {
  label: string;
  average: number;
  maxScore: number;
};

type ProfileInsight = {
  username: string;
  ratingType: string;
  averageScore: number;
  scores: { label: string; score: number }[];
  insight: string | null;
};

type MyPost = {
  id: number;
  image: string | null;
  targetJob: string;
  criteria: string[];
  aiScore: number | null;
  aiInsight: string | null;
};

type CriteriaBreakdown = {
  social: CriteriaScore[];
  professional: CriteriaScore[];
};

type Experience = {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description?: string;
};

type Education = {
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  gpa: number;
};

type Cv = {
  experiences: Experience[];
  educations: Education[];
  skills: string[];
} | null;

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate).getFullYear();
  const end =
    endDate === "Present" ? "Present" : new Date(endDate).getFullYear();
  return `${start} – ${end}`;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [post, setPost] = useState<MyPost | null>(null);
  const [breakdown, setBreakdown] = useState<CriteriaBreakdown | null>(null);
  const [insights, setInsights] = useState<ProfileInsight[]>([]);
  const [cv, setCv] = useState<Cv>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const [userRes, postRes] = await Promise.all([
          api.get<{ user: CurrentUser }>("/auth/me"),
          api.get<{
            post: MyPost;
            criteriaBreakdown: CriteriaBreakdown;
            insights: ProfileInsight[];
          }>("/posts/my-post"),
        ]);

        setUser(userRes.data.user);
        setPost(postRes.data.post);
        setBreakdown(postRes.data.criteriaBreakdown);
        setInsights(postRes.data.insights);

        try {
          const cvRes = await api.get<Cv>("/cvs");
          setCv(cvRes.data);
        } catch {
          setCv(null);
        }
      } catch (err) {
        if (isUnauthorizedError(err)) {
          redirectToLogin(router);
          return;
        }
        setError(getApiErrorMessage(err, "Failed to load profile"));
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
  }, [router]);

  const socialScores = breakdown?.social.map((s) => s.average) ?? [];
  const professionalScores =
    breakdown?.professional.map((s) => s.average) ?? [];

  const allScores = breakdown
    ? [...breakdown.social, ...breakdown.professional]
    : [];

  const overallScore =
    allScores.length > 0
      ? Math.round(
          (allScores.reduce((sum, s) => sum + s.average / s.maxScore, 0) /
            allScores.length) *
            100,
        )
      : 0;

  const strongest = breakdown?.social.length
    ? [...breakdown.social].sort((a, b) => b.average - a.average)[0]
    : null;

  const weakest = breakdown?.social.length
    ? [...breakdown.social].sort((a, b) => a.average - b.average)[0]
    : null;

  if (isLoading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle size={30} className="animate-spin text-indigo-500" />
          <p className="text-sm font-black uppercase tracking-[0.25em] text-gray-900">
            Loading Profile
          </p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-[520px] items-center justify-center rounded-3xl border border-gray-100 bg-white/70 p-8 text-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-gray-900">
            {error || "No profile found"}
          </p>
          <p className="mt-3 text-xs text-gray-400">
            {!post && !error
              ? "You haven't created a profile post yet."
              : "Something went wrong loading your profile."}
          </p>
          {!post && !error && (
            <Link
              href="/studio"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-indigo-950 px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white"
            >
              Create Profile
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">
            Dashboard
          </p>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            Profile Overview
          </h1>
        </div>
        <Link
          href="/studio"
          className="group self-start sm:self-auto inline-flex items-center gap-2 rounded-xl bg-indigo-950 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-900/25 transition-all hover:-translate-y-0.5 hover:bg-indigo-800"
        >
          <PencilLine
            size={13}
            className="transition-transform group-hover:rotate-12"
          />
          Edit Studio
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 1. HERO IDENTITY */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-4xl border border-white/60 bg-white/70 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
          <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row gap-7 items-center sm:items-start">
            <div className="relative shrink-0">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-indigo-200 via-violet-200 to-indigo-300 opacity-60 blur-sm" />
              {post.image ? (
                <img
                  src={post.image}
                  alt={user?.username ?? "Profile"}
                  className="relative h-32 w-32 sm:h-36 sm:w-36 rounded-3xl object-cover border border-white shadow-md"
                />
              ) : (
                <div className="relative h-32 w-32 sm:h-36 sm:w-36 rounded-3xl bg-indigo-100 border border-white shadow-md flex items-center justify-center">
                  <span className="text-4xl font-black text-indigo-400">
                    {user?.username?.[0]?.toUpperCase() ?? "?"}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-950 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-100 shadow-sm mb-3">
                <Star size={9} fill="currentColor" />
                {post.targetJob}
              </span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 mb-1">
                {user?.username ?? "—"}
              </h2>
              <p className="text-sm font-bold text-indigo-600 mb-3">
                {user?.email}
              </p>
              {cv?.skills && cv.skills.length > 0 && (
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  {cv.skills.map((skill, i) => {
                    const palette = [
                      "border-indigo-200 bg-indigo-50 text-indigo-700",
                      "border-violet-200 bg-violet-50 text-violet-700",
                      "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
                      "border-cyan-200 bg-cyan-50 text-cyan-700",
                      "border-emerald-200 bg-emerald-50 text-emerald-700",
                      "border-gray-200 bg-gray-100 text-gray-600",
                    ];
                    return (
                      <span
                        key={skill}
                        className={`rounded-full border px-3 py-1 text-[10px] font-bold ${palette[i % palette.length]}`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. OVERALL SCORE */}
        <div className="lg:col-span-4 relative overflow-hidden rounded-4xl border border-indigo-950 bg-indigo-950 p-8 text-white shadow-2xl shadow-indigo-900/20 flex flex-col justify-between group">
          <div className="absolute right-0 top-0 p-6 opacity-10 pointer-events-none">
            <Zap size={80} fill="currentColor" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
              <Target size={14} />
              Overall Match
            </div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-7xl font-black tracking-tighter">
                {overallScore}
              </span>
              <span className="text-2xl font-black text-indigo-400">%</span>
            </div>
          </div>
          <div className="relative z-10 mt-6 space-y-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-indigo-400 transition-all duration-700"
                style={{ width: `${overallScore}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-400/60">
                Quota
              </span>
              <span className="text-[10px] font-black text-white">
                🪙 {user?.quota ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* 3. PERFORMANCE RADAR */}
        {breakdown && post.criteria.length > 0 && (
          <ProfileRadar
            criteria={post.criteria}
            socialScores={socialScores}
            professionalScores={professionalScores}
          />
        )}

        {/* 4. DETAILED METRICS */}
        {breakdown && (
          <div className="lg:col-span-4 rounded-4xl border border-indigo-950 bg-indigo-950 p-7 shadow-xl shadow-indigo-900/20 flex flex-col">
            <p className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
              <TrendingUp size={12} className="text-indigo-400" />
              Detailed Metrics
            </p>
            <div className="flex flex-1 flex-col justify-center space-y-5">
              {breakdown.social.map((item, i) => {
                const pct = (item.average / item.maxScore) * 100;
                const bars = [
                  { track: "bg-white/10", fill: "bg-indigo-400" },
                  { track: "bg-white/10", fill: "bg-violet-400" },
                  { track: "bg-white/10", fill: "bg-cyan-400" },
                ];
                const bar = bars[i % bars.length];
                return (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-200">
                        {item.label}
                      </span>
                      <span className="text-xs font-black text-white">
                        {item.average.toFixed(1)}{" "}
                        <span className="font-bold text-indigo-400/60">
                          / {item.maxScore}
                        </span>
                      </span>
                    </div>
                    <div
                      className={`h-1.5 w-full overflow-hidden rounded-full ${bar.track}`}
                    >
                      <div
                        className={`h-full rounded-full ${bar.fill}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. HIGHLIGHTS */}
        {breakdown && (
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex flex-1 items-center gap-5 rounded-4xl border border-emerald-200/60 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50">
                <Award size={22} className="text-emerald-600" />
              </div>
              <div>
                <p className="mb-1 text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500/60">
                  Top Strength
                </p>
                <p className="text-base font-black text-gray-900">
                  {strongest?.label ?? "—"}
                </p>
              </div>
            </div>
            <div className="flex flex-1 items-center gap-5 rounded-4xl border border-fuchsia-200/60 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-fuchsia-200 bg-fuchsia-50">
                <TrendingDown size={22} className="text-fuchsia-600" />
              </div>
              <div>
                <p className="mb-1 text-[9px] font-black uppercase tracking-[0.3em] text-fuchsia-500/60">
                  Focus Area
                </p>
                <p className="text-base font-black text-gray-900">
                  {weakest?.label ?? "—"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 6. AI INSIGHT */}
        {post.aiInsight && (
          <div className="lg:col-span-12 rounded-4xl border border-white/60 bg-white/70 p-7 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={13} className="text-indigo-400" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                  AI Insight — Gemini
                </p>
              </div>
              {post.aiScore !== null && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[10px] font-black text-indigo-600">
                  <Sparkles size={9} />
                  {post.aiScore.toFixed(1)} / 3
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed text-gray-600">
              {post.aiInsight}
            </p>
          </div>
        )}

        {/* 7. CAREER JOURNEY */}
        {cv?.experiences && cv.experiences.length > 0 && (
          <div className="lg:col-span-6 rounded-4xl border border-indigo-950 bg-indigo-950 p-8 shadow-xl shadow-indigo-900/20">
            <div className="mb-7 flex items-center gap-2">
              <BriefcaseBusiness size={13} className="text-indigo-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
                Career Journey
              </p>
            </div>
            <div className="relative space-y-5 before:absolute before:left-5 before:top-0 before:h-full before:w-px before:bg-linear-to-b before:from-indigo-500 before:via-indigo-800 before:to-transparent">
              {cv.experiences.map((item, index) => (
                <div
                  key={index}
                  className="group relative flex items-start gap-5"
                >
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-900 text-[10px] font-black text-white shadow-sm">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 pb-2">
                    <h4 className="text-sm font-black text-white">
                      {item.title}
                    </h4>
                    <p className="mt-0.5 text-[11px] font-bold text-indigo-400">
                      {item.company}
                    </p>
                    <p className="mt-1 text-[10px] font-bold text-indigo-400/60">
                      {formatDateRange(item.startDate, item.endDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. EDUCATION */}
        {cv?.educations && cv.educations.length > 0 && (
          <div
            className={`${cv?.experiences?.length ? "lg:col-span-6" : "lg:col-span-12"} rounded-4xl border border-indigo-950 bg-indigo-950 p-7 shadow-xl shadow-indigo-900/20`}
          >
            <div className="mb-5 flex items-center gap-2">
              <GraduationCap size={13} className="text-indigo-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
                Education
              </p>
            </div>
            <div className="space-y-3">
              {cv.educations.map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-indigo-900/30 bg-indigo-900/40 p-4"
                >
                  <h5 className="text-sm font-black text-white leading-tight">
                    {item.degree}
                  </h5>
                  <p className="mt-1 text-[11px] font-bold text-indigo-300">
                    {item.institution}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-block rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-400">
                      GPA {item.gpa}
                    </span>
                    <span className="text-[9px] font-bold text-indigo-400/60">
                      {formatDateRange(item.startDate, item.endDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. PROFESSIONAL INSIGHTS */}
        {insights.length > 0 && (
          <div className="lg:col-span-12 rounded-4xl border border-white/60 bg-white/70 p-7 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
            <div className="mb-5 flex items-center gap-2">
              <Star size={13} className="text-gray-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                Professional Reviews
              </p>
            </div>
            <div className="space-y-4">
              {insights.map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-100 bg-white/60 p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-black text-gray-900">
                        {item.username}
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-400">
                        {item.ratingType === "professional_recruiter"
                          ? "Recruiter"
                          : "Same Field"}
                      </p>
                    </div>
                    <span className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-black text-indigo-600">
                      {item.averageScore.toFixed(2)} / 3
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.scores.map((s) => (
                      <span
                        key={s.label}
                        className="rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1 text-[9px] font-bold text-gray-600"
                      >
                        {s.label}: {s.score}/3
                      </span>
                    ))}
                  </div>
                  {item.insight && (
                    <p className="text-xs leading-relaxed text-gray-500">
                      {item.insight}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
