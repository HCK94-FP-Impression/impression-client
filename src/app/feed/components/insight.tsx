"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownUp,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type {
  FeedPost,
  FeedProfessionalInsight,
  FeedRatingCriterion,
} from "../types";

type SortMode = "newest" | "highest";

type FeedInsightPanelProps = {
  post: FeedPost;
  insightDraft: string;
  disabled: boolean;
  onInsightChange: (value: string) => void;
};

const AVATAR_COLORS = [
  "bg-indigo-950 text-indigo-300 border-indigo-500/20",
  "bg-violet-950 text-violet-300 border-violet-500/20",
  "bg-cyan-950 text-cyan-300 border-cyan-500/20",
  "bg-fuchsia-950 text-fuchsia-300 border-fuchsia-500/20",
  "bg-emerald-950 text-emerald-300 border-emerald-500/20",
  "bg-indigo-900 text-indigo-200 border-indigo-700/30",
];

function initials(name: string) {
  return name
    .split(/[\s_]+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatAverage(criteria: FeedRatingCriterion[]) {
  if (!criteria.length) return "0.00";

  const total = criteria.reduce((sum, item) => sum + item.average, 0);
  return (total / criteria.length).toFixed(2);
}

function formatRatingType(type: string) {
  return type.replaceAll("_", " ");
}

function RatingAggregate({
  title,
  total,
  criteria,
  tone,
}: {
  title: string;
  total: number;
  criteria: FeedRatingCriterion[];
  tone: "cyan" | "indigo";
}) {
  const barClass = tone === "cyan" ? "bg-cyan-500" : "bg-indigo-500";
  const labelClass = tone === "cyan" ? "text-cyan-500" : "text-indigo-500";

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-5 shadow">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className={`text-[9px] font-black uppercase tracking-[0.3em] ${labelClass}`}>
            {title}
          </p>
          <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-gray-400">
            {total} ratings
          </p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-black tracking-tight text-gray-900">
            {formatAverage(criteria)}
          </p>
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
            out of 3
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {criteria.length ? (
          criteria.map((item) => {
            const pct =
              item.maxScore > 0
                ? Math.min(Math.max((item.average / item.maxScore) * 100, 0), 100)
                : 0;

            return (
              <div key={`${title}-${item.label}`} className="flex items-center gap-3">
                <span className="w-28 shrink-0 truncate text-[9px] font-black uppercase tracking-widest text-gray-600">
                  {item.label}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barClass}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-9 shrink-0 text-right text-xs font-black text-gray-900">
                  {item.average.toFixed(1)}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-xs font-semibold text-gray-400">
            No {title.toLowerCase()} ratings yet.
          </p>
        )}
      </div>
    </div>
  );
}

function InsightItem({
  insight,
  index,
}: {
  insight: FeedProfessionalInsight;
  index: number;
}) {
  const palette = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <div>
      {index > 0 ? <div className="mx-6 border-t border-white/5" /> : null}

      <div className="flex gap-4 px-6 py-5">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border text-[10px] font-black ${palette}`}
        >
          {initials(insight.username)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-sm font-black text-white">
              @{insight.username}
            </span>
            <span className="inline-flex items-center gap-0.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest text-amber-400">
              <ShieldCheck size={7} /> Professional
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-widest text-indigo-400">
              {formatRatingType(insight.ratingType)}
            </span>
            <span className="ml-auto rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[8px] font-black text-indigo-300">
              avg {insight.averageScore.toFixed(2)}/3
            </span>
          </div>

          <p className="text-[13px] font-medium leading-6 text-indigo-200">
            {insight.insight || "No written insight provided."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FeedInsightPanel({
  post,
  insightDraft,
  disabled,
  onInsightChange,
}: FeedInsightPanelProps) {
  const [sort, setSort] = useState<SortMode>("newest");
  const insights = post.ratings.professional.insights;
  const sortedInsights = useMemo(() => {
    const next = [...insights];
    if (sort === "highest") {
      next.sort((a, b) => b.averageScore - a.averageScore);
    }
    return next;
  }, [insights, sort]);

  return (
    <section className="mt-8 w-full">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
            <MessageSquareText size={14} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-black">
              Peer Insights
            </h3>
            <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-400">
              {insights.length} professional insights
            </p>
          </div>
        </div>

        {post.ratings.professional.isRatedByProfessional ? (
          <span className="flex items-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-amber-500">
            <ShieldCheck size={9} /> Pro Rated
          </span>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RatingAggregate
            title="Social"
            total={post.ratings.social.totalRatings}
            criteria={post.ratings.social.criteria}
            tone="cyan"
          />
          <RatingAggregate
            title="Professional"
            total={post.ratings.professional.totalRatings}
            criteria={post.ratings.professional.criteria}
            tone="indigo"
          />
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/5 bg-indigo-950 shadow-xl">
          <div className="border-b border-white/5 bg-indigo-900/40 px-6 py-5">
            <p className="mb-3 text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">
              Optional Insight
            </p>
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-950 text-indigo-300">
                <Sparkles size={14} />
              </div>
              <textarea
                value={insightDraft}
                onChange={(event) => onInsightChange(event.target.value)}
                disabled={disabled}
                placeholder="Share a professional note for this profile..."
                rows={insightDraft ? 3 : 2}
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-medium text-white outline-none transition-all placeholder:text-indigo-400/60 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-white/5 px-6 py-3">
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-indigo-400">
              {insights.length} insights
            </p>
            <div className="flex items-center gap-1 rounded-xl border border-white/5 bg-black/30 p-1">
              <ArrowDownUp size={9} className="ml-1 text-indigo-400/60" />
              {(["newest", "highest"] as SortMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSort(mode)}
                  className={`rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${
                    sort === mode
                      ? "bg-indigo-950 text-indigo-300 shadow-sm"
                      : "text-indigo-400 hover:text-indigo-200"
                  }`}
                >
                  {mode === "newest" ? "Newest" : "Highest"}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[520px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10">
            {sortedInsights.length ? (
              sortedInsights.map((insight, index) => (
                <InsightItem
                  key={`${insight.username}-${insight.ratingType}-${index}`}
                  insight={insight}
                  index={index}
                />
              ))
            ) : (
              <div className="px-6 py-10 text-center">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-white">
                  No professional insights yet
                </p>
                <p className="mx-auto mt-2 max-w-md text-xs font-medium leading-5 text-indigo-400">
                  Professional comments will appear here when the server returns
                  them for this post.
                </p>
              </div>
            )}

            <div className="border-t border-white/5 px-6 py-4 text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-indigo-500">
                {insights.length} insights total
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
