"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  ChevronDown,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  FileUser,
  ShieldCheck,
  Target,
} from "lucide-react";
import type { FeedCvItem, FeedPost } from "../../../types";
import PerformanceRadar, { type RadarCategory } from "./performanceRadar";

type FeedProfileCardProps = {
  post: FeedPost;
  isFlipped: boolean;
  onToggleFlip: () => void;
};

type CollapsibleSectionProps = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconColorClass: string;
  subtitleColorClass: string;
  borderColorClass: string;
  bgColorClass: string;
  children: ReactNode;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toText(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function itemField(item: FeedCvItem, keys: string[], fallback = "") {
  if (typeof item === "string") return item;
  if (!isRecord(item)) return fallback;

  for (const key of keys) {
    const text = toText(item[key]);
    if (text) return text;
  }

  return fallback;
}

function userInitial(username: string) {
  return username.slice(0, 1).toUpperCase() || "?";
}

function CollapsibleSection({
  title,
  subtitle,
  icon: Icon,
  iconColorClass,
  subtitleColorClass,
  borderColorClass,
  bgColorClass,
  children,
}: CollapsibleSectionProps) {
  return (
    <details
      className="group block overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-white/10"
      open
    >
      <summary className="flex cursor-pointer select-none items-center justify-between list-none rounded-lg outline-none transition-colors [&::-webkit-details-marker]:hidden">
        <div className="flex items-center gap-3.5">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl border shadow-inner ${borderColorClass} ${bgColorClass}`}
          >
            <Icon size={16} className={iconColorClass} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">
              {title}
            </h3>
            <p
              className={`mt-0.5 text-[9px] font-black uppercase tracking-widest ${subtitleColorClass}`}
            >
              {subtitle}
            </p>
          </div>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors group-hover:bg-white/10">
          <ChevronDown
            size={16}
            className="text-indigo-300 transition-transform duration-500 group-open:rotate-180"
          />
        </div>
      </summary>

      <div className="mt-5 border-t border-white/5 pt-5 opacity-0 transition-opacity duration-300 group-open:opacity-100">
        {children}
      </div>
    </details>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/10 px-4 py-6 text-center text-xs font-medium text-indigo-300/50">
      {children}
    </div>
  );
}

export default function FeedProfileCard({
  post,
  isFlipped,
  onToggleFlip,
}: FeedProfileCardProps) {
  const [activeRadar, setActiveRadar] = useState<RadarCategory>("social");
  const cv = post.cv ?? {};
  const image = post.image?.trim() || null;
  const username = post.user?.username ?? "anonymous";
  const email = post.user?.email ?? "No email";
  const experiences = cv.experiences ?? [];
  const educations = cv.educations ?? [];
  const skills = cv.skills ?? [];

  return (
    <section className="lg:col-span-7" style={{ perspective: "1000px" }}>
      <div className="relative w-full" style={{ height: "650px" }}>
        <button
          onClick={onToggleFlip}
          type="button"
          className="absolute right-6 top-6 z-50 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/95 px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-indigo-950 shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white active:scale-[0.98]"
        >
          {isFlipped ? (
            <>
              <ImageIcon size={14} className="text-indigo-600" />
              <span>View Photo</span>
            </>
          ) : (
            <>
              <FileUser size={14} className="text-indigo-600" />
              <span>View CV</span>
            </>
          )}
        </button>

        <div
          className="relative h-full w-full transition-transform duration-700 ease-in-out"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* FRONT CARD (Photo & Target Role) */}
          <div
            className={`absolute inset-0 flex h-full w-full flex-col justify-between rounded-4xl bg-indigo-950 p-6 shadow-2xl transition-all duration-300 ${
              isFlipped ? "pointer-events-none opacity-0" : "z-10 opacity-100"
            }`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="flex h-full flex-col justify-between rounded-2xl bg-indigo-950/50 p-4">
              <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-indigo-900/50 to-gray-900 shadow-inner">
                {image ? (
                  <Image
                    src={image}
                    alt={`${post.targetJob} profile`}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-indigo-900/40 text-indigo-200">
                    <FileUser size={48} className="text-indigo-400/50" />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-300/50">
                      No Image Provided
                    </span>
                  </div>
                )}

                {/* Overlay gradient for better text legibility if needed */}
              </div>

              <div className="mt-5 text-white">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                    Target Role
                  </span>
                </div>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
                  {post.targetJob}
                </h1>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {post.criteria.map((item) => (
                    <div
                      key={item}
                      className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 transition-colors hover:bg-indigo-500/20"
                    >
                      <Target size={12} className="text-indigo-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BACK CARD (CV & Stats) */}
          <div
            className={`absolute inset-0 flex h-full w-full flex-col justify-between rounded-4xl border border-white/10 bg-indigo-950 p-6 shadow-2xl transition-all duration-300 ${
              isFlipped ? "z-20 opacity-100" : "pointer-events-none opacity-0"
            }`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute inset-0 rounded-4xl bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(167,139,250,0.1),transparent_50%)]" />

            <div className="relative mt-14 h-[calc(100%-4rem)] overflow-y-auto pr-3 custom-scrollbar">
              <div className="space-y-6 pb-6">
                {/* Header / Radar Section */}
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-900/60 via-indigo-900/40 to-indigo-950/80 p-6 shadow-2xl backdrop-blur-md">
                  <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl" />

                  <div className="relative grid grid-cols-1 gap-6 md:grid-cols-12">
                    <div className="space-y-5 md:col-span-7">
                      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
                        <div className="relative h-20 w-20 shrink-0">
                          {image ? (
                            <Image
                              src={image}
                              alt={`${username} avatar`}
                              fill
                              sizes="80px"
                              className="rounded-2xl border-2 border-white/10 object-cover shadow-lg"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-2xl border-2 border-white/10 bg-gradient-to-br from-indigo-800 to-indigo-900 text-2xl font-black text-indigo-200 shadow-lg">
                              {userInitial(username)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h2 className="text-2xl font-black tracking-tight text-white">
                            @{username}
                          </h2>
                          <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                            {post.targetJob}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        {[
                          { label: "Email", value: email },
                          {
                            label: "AI Score",
                            value:
                              post.aiScore === null
                                ? "Pending"
                                : post.aiScore.toFixed(2),
                          },
                          {
                            label: "Created",
                            value: new Date(
                              post.createdAt,
                            ).toLocaleDateString(),
                          },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="group flex items-center justify-between rounded-xl border border-white/5 bg-black/20 px-4 py-3 transition-colors hover:bg-black/30"
                          >
                            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400/80">
                              {item.label}
                            </span>
                            <span className="max-w-[65%] truncate text-right text-xs font-bold text-indigo-100 group-hover:text-white">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-5 flex items-center justify-center">
                      <PerformanceRadar
                        post={post}
                        activeRadar={activeRadar}
                        onActiveRadarChange={setActiveRadar}
                      />
                    </div>
                  </div>
                </div>

                <CollapsibleSection
                  title="AI Insight"
                  subtitle="Server Analysis"
                  icon={FileText}
                  iconColorClass="text-indigo-300"
                  subtitleColorClass="text-indigo-400/70"
                  borderColorClass="border-indigo-500/30"
                  bgColorClass="bg-indigo-500/20"
                >
                  {post.aiInsight ? (
                    <p className="text-sm font-medium leading-relaxed text-indigo-100/90">
                      {post.aiInsight}
                    </p>
                  ) : (
                    <EmptyState>No AI insight from server yet.</EmptyState>
                  )}
                </CollapsibleSection>

                <CollapsibleSection
                  title="Work Experience"
                  subtitle="Career Journey"
                  icon={BriefcaseBusiness}
                  iconColorClass="text-violet-300"
                  subtitleColorClass="text-violet-400/70"
                  borderColorClass="border-violet-500/30"
                  bgColorClass="bg-violet-500/20"
                >
                  <div className="space-y-4">
                    {experiences.length ? (
                      experiences.map((item, index) => {
                        const title = itemField(
                          item,
                          ["role", "title", "position", "jobTitle"],
                          "Experience",
                        );
                        const company = itemField(
                          item,
                          ["company", "organization", "institution"],
                          "",
                        );
                        const meta = itemField(
                          item,
                          ["meta", "period", "duration", "date", "startDate"],
                          "",
                        );
                        const description = itemField(
                          item,
                          ["description", "summary", "details"],
                          "",
                        );

                        return (
                          <div
                            key={`${title}-${index}`}
                            className="group rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:border-violet-500/30 hover:bg-violet-500/5 hover:shadow-lg hover:shadow-violet-900/20"
                          >
                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                              <div>
                                <h4 className="text-sm font-black text-white transition-colors group-hover:text-violet-100">
                                  {title}
                                </h4>
                                {company ? (
                                  <p className="mt-1 text-xs font-medium text-violet-300/80">
                                    {company}
                                  </p>
                                ) : null}
                              </div>
                              {meta ? (
                                <span className="self-start whitespace-nowrap rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-violet-300 sm:self-auto">
                                  {meta}
                                </span>
                              ) : null}
                            </div>
                            {description ? (
                              <p className="mt-4 text-xs font-medium leading-relaxed text-indigo-200/80">
                                {description}
                              </p>
                            ) : null}
                          </div>
                        );
                      })
                    ) : (
                      <EmptyState>
                        No work experience listed in this CV.
                      </EmptyState>
                    )}
                  </div>
                </CollapsibleSection>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <CollapsibleSection
                    title="Education"
                    subtitle="Academic"
                    icon={GraduationCap}
                    iconColorClass="text-cyan-300"
                    subtitleColorClass="text-cyan-400/70"
                    borderColorClass="border-cyan-500/30"
                    bgColorClass="bg-cyan-500/20"
                  >
                    <div className="space-y-4">
                      {educations.length ? (
                        educations.map((item, index) => {
                          const title = itemField(
                            item,
                            ["title", "degree", "major", "field"],
                            "Education",
                          );
                          const school = itemField(
                            item,
                            ["school", "university", "institution"],
                            "",
                          );
                          const meta = itemField(
                            item,
                            ["meta", "period", "year", "date"],
                            "",
                          );

                          return (
                            <div
                              key={`${title}-${index}`}
                              className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-cyan-500/30 hover:bg-cyan-500/5"
                            >
                              <h5 className="text-sm font-black text-white">
                                {title}
                              </h5>
                              {school ? (
                                <p className="mt-1 text-xs font-medium text-cyan-300/80">
                                  {school}
                                </p>
                              ) : null}
                              {meta ? (
                                <span className="mt-3 inline-block rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-cyan-400">
                                  {meta}
                                </span>
                              ) : null}
                            </div>
                          );
                        })
                      ) : (
                        <EmptyState>No education data found.</EmptyState>
                      )}
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection
                    title="Skills"
                    subtitle="CV Keywords"
                    icon={Target}
                    iconColorClass="text-emerald-300"
                    subtitleColorClass="text-emerald-400/70"
                    borderColorClass="border-emerald-500/30"
                    bgColorClass="bg-emerald-500/20"
                  >
                    {skills.length ? (
                      <div className="flex flex-wrap gap-2">
                        {skills.map((item) => (
                          <span
                            key={item}
                            className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-300 transition-colors hover:bg-emerald-500/20"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <EmptyState>No skills listed in this CV.</EmptyState>
                    )}
                  </CollapsibleSection>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}