"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import { hasClientAuthSession } from "@/constants/authProxy";
import { getCurrentUser } from "@/api/user";
import type { CurrentUser } from "@/api/user";

const appName = "Impression";
const uploadQuotaRequirement = 50;

const landingSteps = [
  "Rate other professional profiles anonymously.",
  "Earn points from every completed rating.",
  "Use your points to unlock profile uploads.",
  "Improve your first impression using community feedback.",
];

export default function Home() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authenticated = hasClientAuthSession();
    setIsAuthenticated(authenticated);
    if (!authenticated) return;
    getCurrentUser()
      .then(setUser)
      .catch(() => {});
  }, []);

  const quota = user?.quota ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-4xl border border-white/60 bg-white/70 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-2xl sm:p-12">
          {/* Background Blur */}
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col">
            <header>
              <span className="inline-block rounded-full border border-indigo-400/30 bg-indigo-950 px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100 shadow-lg">
                🎯 Community Rating
              </span>

              <h1 className="mt-6 text-4xl font-black leading-[1.1] tracking-tight text-gray-900 sm:text-5xl">
                Build a stronger <br />
                first impression.
              </h1>

              <p className="mt-6 max-w-lg text-base font-medium leading-relaxed text-gray-500">
                {appName} helps you improve your professional profile through
                anonymous community feedback before your first interview.
              </p>
            </header>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/feed"
                className="group inline-flex items-center gap-3 rounded-2xl bg-indigo-950 px-8 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-900/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-900"
              >
                Start Rating
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              {!isAuthenticated && (
                <Link
                  href="/register"
                  className="rounded-2xl border border-gray-200 bg-white px-8 py-4 text-[11px] font-black uppercase tracking-widest text-gray-700 transition-all hover:border-indigo-200 hover:text-indigo-600"
                >
                  Create Account
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Right Cards */}
        <div className="grid gap-6">
          {/* Access Mode */}
          <section className="rounded-4xl border border-indigo-100 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Access Mode
              </span>

              <ShieldCheck size={18} className="text-indigo-600" />
            </div>

            <p className="text-2xl font-black uppercase tracking-tighter text-gray-900">
              {isAuthenticated ? "Authenticated" : "Guest Mode"}
            </p>

            <p className="mt-2 text-sm font-medium leading-relaxed text-gray-500">
              {isAuthenticated
                ? "Your identity stays hidden while rating other profiles."
                : "Sign in to collect points and unlock profile uploads."}
            </p>
          </section>

          {/* Quota */}
          <section className="group relative overflow-hidden rounded-4xl border border-indigo-950 bg-indigo-950 p-8 text-white shadow-2xl shadow-indigo-900/20">
            <div className="absolute right-0 top-0 p-6 opacity-10 transition-opacity group-hover:opacity-20">
              <Zap size={80} fill="currentColor" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
                <Zap size={14} fill="currentColor" />
                Quota Balance
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-black">
                  {isAuthenticated ? quota : "0"}
                </span>

                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                  Points
                </span>
              </div>

              <p className="mt-4 text-sm font-medium leading-relaxed text-indigo-200/80">
                {isAuthenticated
                  ? `${Math.max(uploadQuotaRequirement - quota, 0)} more ratings required to unlock uploads.`
                  : "Collect points to unlock uploads."}
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Steps */}
        <section className="rounded-4xl border border-white/60 bg-white/70 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
          <header className="mb-8">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
              <BarChart3 size={14} />
              How It Works
            </div>

            <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-900">
              How it works
            </h3>
          </header>

          <div className="space-y-6">
            {landingSteps.map((step, index) => (
              <div key={index} className="group flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-950 text-xs font-black text-white">
                  0{index + 1}
                </div>

                <p className="text-sm font-bold leading-snug text-gray-600 transition-colors group-hover:text-gray-900">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Insight */}
        <section className="flex flex-col justify-between rounded-4xl border-2 border-dashed border-indigo-200 bg-white/70 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
          <header>
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-lg bg-fuchsia-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-fuchsia-700">
                <Sparkles size={12} />
                Insight
              </span>
            </div>

            <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 leading-tight">
              Measurable <br />
              Quality Control.
            </h2>

            <p className="mt-4 text-sm font-medium leading-relaxed text-gray-500">
              Use structured community feedback to discover profile weaknesses,
              improve presentation quality, and strengthen your professional
              image.
            </p>
          </header>

          <div className="mt-8 border-t border-gray-100 pt-8">
            <Link
              href="/profile"
              className="group flex items-center justify-between"
            >
              <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600">
                Open Dashboard
              </span>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-100 transition-all group-hover:bg-indigo-600 group-hover:text-white">
                <ArrowRight size={18} />
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
