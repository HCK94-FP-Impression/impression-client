"use client";

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
import type {
  FeedCvItem,
  FeedPost,
  FeedRatingCriterion,
} from "../types";

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
  borderColorClass: string;
  bgColorClass: string;
  children: ReactNode;
};

const FALLBACK_IMAGE = "https://xsgames.co/randomusers/avatar.php?g=male";

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

function formatRatingAverage(criteria: FeedRatingCriterion[]) {
  if (!criteria.length) return "0.00";

  const sum = criteria.reduce((total, item) => total + item.average, 0);
  return (sum / criteria.length).toFixed(2);
}

function CollapsibleSection({
  title,
  subtitle,
  icon: Icon,
  iconColorClass,
  borderColorClass,
  bgColorClass,
  children,
}: CollapsibleSectionProps) {
  return (
    <details
      className="group block overflow-hidden rounded-3xl border border-indigo-900/30 bg-indigo-900/40 p-6 shadow-xl"
      open
    >
      <summary className="flex cursor-pointer select-none items-center justify-between list-none [&::-webkit-details-marker]:hidden">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl border ${borderColorClass} ${bgColorClass}`}
          >
            <Icon size={15} className={iconColorClass} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{title}</h3>
            <p className={`text-[9px] uppercase tracking-[0.2em] ${iconColorClass}/60`}>
              {subtitle}
            </p>
          </div>
        </div>
        <ChevronDown
          size={16}
          className="text-indigo-300 transition-transform duration-300 group-open:rotate-180"
        />
      </summary>

      <div className="mt-5 border-t border-indigo-900/30 pt-4">{children}</div>
    </details>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-white/5 bg-black/20 px-4 py-3 text-xs font-semibold text-indigo-300/70">
      {children}
    </p>
  );
}

function RatingSnapshot({
  label,
  total,
  criteria,
  tone,
}: {
  label: string;
  total: number;
  criteria: FeedRatingCriterion[];
  tone: "cyan" | "indigo";
}) {
  const toneClasses =
    tone === "cyan"
      ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
      : "border-indigo-500/20 bg-indigo-500/10 text-indigo-300";

  return (
    <div className="rounded-2xl border border-white/5 bg-black/30 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span
          className={`rounded-lg border px-2.5 py-1 text-[8px] font-black uppercase tracking-widest ${toneClasses}`}
        >
          {label}
        </span>
        <div className="text-right">
          <p className="text-lg font-black text-white">
            {formatRatingAverage(criteria)}
          </p>
          <p className="text-[8px] font-black uppercase tracking-widest text-indigo-400/60">
            {total} ratings
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {criteria.length ? (
          criteria.map((item) => {
            const pct =
              item.maxScore > 0
                ? Math.min(Math.max((item.average / item.maxScore) * 100, 0), 100)
                : 0;

            return (
              <div key={`${label}-${item.label}`} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[9px] font-black uppercase tracking-widest text-indigo-200">
                    {item.label}
                  </span>
                  <span className="text-[10px] font-black text-white">
                    {item.average.toFixed(1)}/{item.maxScore}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`h-full rounded-full ${
                      tone === "cyan" ? "bg-cyan-400" : "bg-indigo-400"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs font-semibold text-indigo-300/60">
            No {label.toLowerCase()} ratings yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default function FeedProfileCard({
  post,
  isFlipped,
  onToggleFlip,
}: FeedProfileCardProps) {
  const cv = post.cv ?? {};
  const image = post.image || FALLBACK_IMAGE;
  const username = post.user?.username ?? "anonymous";
  const experiences = cv.experiences ?? [];
  const educations = cv.educations ?? [];
  const skills = cv.skills ?? [];
  const hasProfessionalRating = post.ratings.professional.isRatedByProfessional;

  return (
    <section className="lg:col-span-7" style={{ perspective: "1000px" }}>
      <div className="relative w-full" style={{ height: "650px" }}>
        <button
          onClick={onToggleFlip}
          type="button"
          className="absolute right-6 top-6 z-50 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/90 px-5 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-indigo-950 shadow-[0_12px_30px_-12px_rgba(15,23,42,0.5)] transition-all hover:-translate-y-0.5 hover:bg-white active:scale-[0.98]"
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
          <div
            className={`absolute inset-0 flex h-full w-full flex-col justify-between rounded-3xl bg-indigo-950 p-6 shadow-2xl transition-all duration-300 ${
              isFlipped ? "pointer-events-none opacity-0" : "z-10 opacity-100"
            }`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="flex h-full flex-col justify-between rounded-2xl bg-indigo-950 p-4">
              <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-gray-900">
                <Image
                  src={image}
                  alt={`${post.targetJob} profile`}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
                {hasProfessionalRating ? (
                  <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-amber-300 backdrop-blur">
                    <ShieldCheck size={11} />
                    Pro Rated
                  </div>
                ) : null}
              </div>

              <div className="mt-4 text-white">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-400">
                    Target Role
                  </span>
                  <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[9px] font-black uppercase tracking-widest text-indigo-200">
                    @{username}
                  </span>
                </div>
                <h1 className="mt-2 font-sans text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                  {post.targetJob}
                </h1>
                <div className="mt-4 flex flex-wrap gap-3">
                  {post.criteria.map((item) => (
                    <div
                      key={item}
                      className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-2"
                    >
                      <Target size={12} className="text-indigo-400 opacity-80" />
                      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-200">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`absolute inset-0 flex h-full w-full flex-col justify-between rounded-3xl border border-indigo-900/30 bg-indigo-950 p-6 shadow-2xl transition-all duration-300 ${
              isFlipped ? "z-20 opacity-100" : "pointer-events-none opacity-0"
            }`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.15),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.06),transparent_50%)]" />

            <div className="relative mt-14 h-[calc(100%-4rem)] overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-5">
                <div className="relative overflow-hidden rounded-3xl border border-indigo-900/30 bg-linear-to-br from-indigo-900/50 to-indigo-900/70 p-6 shadow-xl">
                  <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

                  <div className="relative grid grid-cols-1 gap-6 md:grid-cols-12">
                    <div className="space-y-4 md:col-span-5">
                      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
                        <div className="relative h-20 w-20 shrink-0">
                          <Image
                            src={image}
                            alt={`${username} avatar`}
                            fill
                            sizes="80px"
                            className="rounded-2xl border border-white/10 object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h2 className="bg-linear-to-r from-white via-indigo-100 to-indigo-200 bg-clip-text text-2xl font-black tracking-tight text-white">
                            @{username}
                          </h2>
                          <p className="mt-1 text-xs font-bold tracking-wide text-indigo-400">
                            {post.targetJob}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        {[
                          { label: "Post ID", value: `#${post.id}` },
                          {
                            label: "AI Score",
                            value:
                              post.aiScore === null
                                ? "Pending"
                                : post.aiScore.toFixed(2),
                          },
                          {
                            label: "Created",
                            value: new Date(post.createdAt).toLocaleDateString(),
                          },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-3.5 py-2.5"
                          >
                            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-indigo-400">
                              {item.label}
                            </span>
                            <span className="max-w-[70%] truncate text-right text-xs font-medium text-indigo-200">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 md:col-span-7">
                      <RatingSnapshot
                        label="Social"
                        total={post.ratings.social.totalRatings}
                        criteria={post.ratings.social.criteria}
                        tone="cyan"
                      />
                      <RatingSnapshot
                        label="Professional"
                        total={post.ratings.professional.totalRatings}
                        criteria={post.ratings.professional.criteria}
                        tone="indigo"
                      />
                    </div>
                  </div>
                </div>

                <CollapsibleSection
                  title="AI Insight"
                  subtitle="Server Analysis"
                  icon={FileText}
                  iconColorClass="text-indigo-300"
                  borderColorClass="border-indigo-500/20"
                  bgColorClass="bg-indigo-500/10"
                >
                  {post.aiInsight ? (
                    <p className="text-xs font-medium leading-6 text-indigo-200/95 sm:text-sm sm:leading-7">
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
                  borderColorClass="border-violet-500/20"
                  bgColorClass="bg-violet-500/10"
                >
                  <div className="space-y-3">
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
                            className="rounded-2xl border border-white/5 bg-gradient-to-r from-black/40 to-black/10 p-5 transition duration-300 hover:border-violet-500/20"
                          >
                            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                              <div>
                                <h4 className="text-base font-bold text-white">
                                  {title}
                                </h4>
                                {company ? (
                                  <p className="mt-1 text-xs font-medium text-indigo-300">
                                    {company}
                                  </p>
                                ) : null}
                              </div>
                              {meta ? (
                                <span className="self-start whitespace-nowrap rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-violet-300 sm:self-auto">
                                  {meta}
                                </span>
                              ) : null}
                            </div>
                            {description ? (
                              <p className="mt-3 text-xs font-medium leading-5 text-indigo-300">
                                {description}
                              </p>
                            ) : null}
                          </div>
                        );
                      })
                    ) : (
                      <EmptyState>No work experience in this CV.</EmptyState>
                    )}
                  </div>
                </CollapsibleSection>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <CollapsibleSection
                    title="Education"
                    subtitle="Academic"
                    icon={GraduationCap}
                    iconColorClass="text-cyan-300"
                    borderColorClass="border-cyan-500/20"
                    bgColorClass="bg-cyan-500/10"
                  >
                    <div className="space-y-3">
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
                              className="rounded-xl border border-white/5 bg-black/30 p-4"
                            >
                              <h5 className="text-xs font-bold text-white">
                                {title}
                              </h5>
                              {school ? (
                                <p className="mt-1 text-[11px] font-medium text-indigo-300">
                                  {school}
                                </p>
                              ) : null}
                              {meta ? (
                                <span className="mt-2 inline-block rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[8px] font-black text-emerald-400">
                                  {meta}
                                </span>
                              ) : null}
                            </div>
                          );
                        })
                      ) : (
                        <EmptyState>No education data in this CV.</EmptyState>
                      )}
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection
                    title="Skills"
                    subtitle="CV Keywords"
                    icon={Target}
                    iconColorClass="text-emerald-300"
                    borderColorClass="border-emerald-500/20"
                    bgColorClass="bg-emerald-500/10"
                  >
                    {skills.length ? (
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((item) => (
                          <span
                            key={item}
                            className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[9px] font-bold text-emerald-300"
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
