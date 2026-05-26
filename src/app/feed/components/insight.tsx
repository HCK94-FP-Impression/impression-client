"use client";

import { useState } from "react";
import { ArrowDownUp, Lock, MessageSquareText, Send, ShieldCheck } from "lucide-react";

// ── Dummy review data ─────────────────────────────────────────────────────────

type Review = {
  id: string;
  name: string;
  role: string;
  isRecruiter: boolean;
  totalRatings: number;
  scores: [number, number, number];
  comment: string;
  postedAt: string;
};

const SEED_REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Jordan Reeves",
    role: "Software Engineer",
    isRecruiter: false,
    totalRatings: 47,
    scores: [3, 2, 3],
    comment: "Strong system design fundamentals. Communication could be tightened in technical explanations, but overall a well-rounded candidate ready for senior-level work.",
    postedAt: "2 days ago",
  },
  {
    id: "r2",
    name: "Maya Chen",
    role: "Technical Recruiter",
    isRecruiter: true,
    totalRatings: 312,
    scores: [3, 3, 2],
    comment: "Impressive portfolio with measurable impact metrics. The AI Resume Analyzer project stands out — directly relevant to multiple open positions we're filling.",
    postedAt: "4 days ago",
  },
  {
    id: "r3",
    name: "Reza Adhitama",
    role: "Senior Software Engineer",
    isRecruiter: false,
    totalRatings: 23,
    scores: [2, 3, 3],
    comment: "Solid adaptability across multiple stacks. Would benefit from more detailed system architecture documentation in the portfolio.",
    postedAt: "1 week ago",
  },
  {
    id: "r4",
    name: "Priya Nair",
    role: "Engineering Manager",
    isRecruiter: true,
    totalRatings: 189,
    scores: [3, 3, 3],
    comment: "Exceptional across all three dimensions — especially communication, which is rare at this level. Would fast-track for a senior IC role.",
    postedAt: "1 week ago",
  },
  {
    id: "r5",
    name: "Lucas Hartmann",
    role: "Software Engineer",
    isRecruiter: false,
    totalRatings: 11,
    scores: [2, 2, 2],
    comment: "Competent overall. Solid project work but I'd want to see more evidence of end-to-end ownership before calling it truly senior-ready.",
    postedAt: "2 weeks ago",
  },
  {
    id: "r6",
    name: "Siti Rahma",
    role: "Frontend Engineer",
    isRecruiter: false,
    totalRatings: 35,
    scores: [3, 2, 3],
    comment: "Very professional presentation. The UI work on the AI Resume platform shows strong product sense. Adaptability score held back only by stack depth on the backend side.",
    postedAt: "2 weeks ago",
  },
  {
    id: "r7",
    name: "Carlos Mendez",
    role: "Senior Recruiter",
    isRecruiter: true,
    totalRatings: 540,
    scores: [3, 3, 2],
    comment: "High-value candidate. Communicative score is 'Yes' rather than 'Very' because the summary could be sharper for non-technical stakeholders — otherwise excellent.",
    postedAt: "3 weeks ago",
  },
  {
    id: "r8",
    name: "Aiko Tanaka",
    role: "Software Engineer",
    isRecruiter: false,
    totalRatings: 62,
    scores: [2, 3, 3],
    comment: "Really liked the E-Wallet project — clean architecture under real constraints. More public writing or talks would push the Professional score to 'Very'.",
    postedAt: "1 month ago",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function reviewAvg(scores: [number, number, number]) {
  return +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
}

const SCORE_META: Record<number, { label: string; pill: string; bar: string; text: string }> = {
  3: { label: "Very",     pill: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400", bar: "bg-emerald-500", text: "text-emerald-400" },
  2: { label: "Yes",      pill: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",          bar: "bg-cyan-500",     text: "text-cyan-400" },
  1: { label: "Somewhat", pill: "border-amber-500/30 bg-amber-500/10 text-amber-400",        bar: "bg-amber-500",    text: "text-amber-400" },
  0: { label: "No",       pill: "border-rose-500/30 bg-rose-500/10 text-rose-400",           bar: "bg-rose-500",     text: "text-rose-400" },
};

const AVATAR_COLORS = [
  "bg-indigo-950 text-indigo-300 border-indigo-500/20",
  "bg-violet-950 text-violet-300 border-violet-500/20",
  "bg-cyan-950 text-cyan-300 border-cyan-500/20",
  "bg-fuchsia-950 text-fuchsia-300 border-fuchsia-500/20",
  "bg-emerald-950 text-emerald-300 border-emerald-500/20",
  "bg-indigo-900 text-indigo-200 border-indigo-500/20",
  "bg-indigo-900 text-indigo-200 border-indigo-700/30",
  "bg-violet-900 text-violet-200 border-violet-500/20",
];

type SortMode = "newest" | "highest";

// ── Types ─────────────────────────────────────────────────────────────────────

type FeedInsightPanelProps = {
  profileRole: string;
  profileCriteria: string[];
  viewerName: string;
  viewerRole: string;
  isViewerRecruiter: boolean;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function FeedInsightPanel({
  profileRole,
  profileCriteria,
  viewerName,
  viewerRole,
  isViewerRecruiter,
}: FeedInsightPanelProps) {
  const [sort, setSort] = useState<SortMode>("newest");
  const [draft, setDraft] = useState("");
  const [localReviews, setLocalReviews] = useState<Review[]>([]);

  const canView =
    isViewerRecruiter ||
    viewerRole.toLowerCase() === profileRole.toLowerCase();

  const sorted = [...SEED_REVIEWS].sort((a, b) =>
    sort === "highest" ? reviewAvg(b.scores) - reviewAvg(a.scores) : 0,
  );
  const allReviews = [...localReviews, ...sorted];
  const reviewCount = allReviews.length;

  const overallAvg = +(
    allReviews.reduce((sum, r) => sum + reviewAvg(r.scores), 0) / reviewCount
  ).toFixed(1);

  const criteriaAvg = profileCriteria.map((_, ci) =>
    +(allReviews.reduce((sum, r) => sum + (r.scores[ci] ?? 0), 0) / reviewCount).toFixed(1),
  );

  const allScores = allReviews.flatMap((r) => r.scores);
  const distribution = [3, 2, 1, 0].map((level) => ({
    level,
    count: allScores.filter((s) => s === level).length,
    pct: Math.round((allScores.filter((s) => s === level).length / allScores.length) * 100),
  }));

  const handleSubmit = () => {
    if (!draft.trim()) return;
    setLocalReviews((prev) => [
      {
        id: `local-${Date.now()}`,
        name: viewerName,
        role: viewerRole,
        isRecruiter: isViewerRecruiter,
        totalRatings: 0,
        scores: [0, 0, 0],
        comment: draft.trim(),
        postedAt: "just now",
      },
      ...prev,
    ]);
    setDraft("");
  };

  return (
    <section className="mt-8 w-full">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
            <MessageSquareText size={14} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-bla">
              Peer Insights
            </h3>
            <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-400">
              {reviewCount} community reviews
            </p>
          </div>
        </div>

        {!canView && (
          <span className="flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-rose-400">
            <Lock size={9} /> Restricted
          </span>
        )}
      </div>

      {canView ? (
        <div className="space-y-4">

          {/* ── Aggregate card ────────────────────────────────────────────── */}
            <div className="grid grid-cols-12 gap-6">
              {/* Left: big score + distribution */}
              <div className="col-span-4 flex flex-col items-center justify-center gap-1 rounded-2xl border shadow border-gray-100 bg-gray-50/80 p-5 pr-5">
                <p className="text-5xl font-black tracking-tight text-gray-900">{overallAvg}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                  out of 3
                </p>
                <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  {reviewCount} reviews
                </p>

                <div className="mt-5 w-full space-y-2">
                  {distribution.map(({ level, count, pct }) => {
                    const meta = SCORE_META[level];
                    return (
                      <div key={level} className="flex items-center gap-2">
                        <span className={`w-14 text-right text-[8px] font-black uppercase tracking-widest ${meta.text}`}>
                          {meta.label}
                        </span>
                        <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${meta.bar}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-4 text-[9px] font-bold text-gray-400">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: per-criterion bars */}
              <div className="col-span-8 flex flex-col justify-center space-y-5 rounded-2xl border border-gray-100 shadow bg-gray-50/80 p-5">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">
                  By Criterion
                </p>
                {profileCriteria.map((label, ci) => {
                  const score = criteriaAvg[ci];
                  const pct = Math.round((score / 3) * 100);
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <span className="w-28 shrink-0 text-[9px] font-black uppercase tracking-widest text-gray-600 truncate">
                        {label}
                      </span>
                      <div className="flex-1 h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 shrink-0 text-right text-xs font-black text-gray-900">
                        {score}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>

          {/* ── Comment thread ─────────────────────────────────────────────── */}
          <div className="overflow-hidden rounded-3xl border border-white/5 bg-indigo-950 shadow-xl">

            {/* Write an insight — auto-shown when eligible */}
            <div className="border-b border-white/5 bg-indigo-900/40 px-6 py-5">
              <p className="mb-3 text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">
                Write an Insight
              </p>
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-950 text-[10px] font-black text-indigo-300">
                  {initials(viewerName)}
                </div>
                <div className="flex-1 space-y-2">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Share your honest insight about this profile…"
                    rows={draft ? 3 : 2}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-medium text-white outline-none transition-all placeholder:text-indigo-400/60 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                  />
                  {draft.trim() && (
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-indigo-400">
                        Posting as <span className="font-black text-indigo-200">{viewerName}</span>
                        {isViewerRecruiter && (
                          <span className="ml-2 inline-flex items-center gap-0.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest text-amber-400">
                            <ShieldCheck size={7} /> Recruiter
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setDraft("")}
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-300 transition hover:bg-white/10 hover:text-indigo-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-950 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-sm shadow-indigo-900/30 transition hover:-translate-y-0.5 hover:bg-indigo-800"
                        >
                          <Send size={10} /> Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-3">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-indigo-400">
                {reviewCount} reviews
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

            {/* Scrollable list */}
            <div className="max-h-[520px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10">
              {allReviews.map((review, i) => {
                const avg = reviewAvg(review.scores);
                const palette = AVATAR_COLORS[i % AVATAR_COLORS.length];
                const hasScores = review.scores.some((s) => s > 0);

                return (
                  <div key={review.id}>
                    {i > 0 && <div className="mx-6 border-t border-white/5" />}

                    <div className="flex gap-4 px-6 py-5">
                      {/* Avatar */}
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border text-[10px] font-black ${palette}`}>
                        {initials(review.name)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Name row */}
                        <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span className="text-sm font-black text-white">{review.name}</span>
                          {review.isRecruiter && (
                            <span className="inline-flex items-center gap-0.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest text-amber-400">
                              <ShieldCheck size={7} /> Recruiter
                            </span>
                          )}
                          <span className="text-[9px] font-bold text-indigo-500">·</span>
                          <span className="text-[9px] font-semibold text-indigo-400">{review.role}</span>
                          {review.totalRatings > 0 && (
                            <>
                              <span className="text-[9px] font-bold text-indigo-500">·</span>
                              <span className="text-[9px] font-semibold text-indigo-400/60">
                                {review.totalRatings} ratings given
                              </span>
                            </>
                          )}
                          <span className="ml-auto text-[9px] font-semibold text-indigo-400/60">
                            {review.postedAt}
                          </span>
                        </div>

                        {/* Criteria pills */}
                        {hasScores && (
                          <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
                            {profileCriteria.map((label, ci) => {
                              const meta = SCORE_META[review.scores[ci] ?? 0];
                              return (
                                <span key={label} className={`rounded-lg border px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${meta.pill}`}>
                                  {label}: {meta.label}
                                </span>
                              );
                            })}
                            <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[8px] font-black text-indigo-300">
                              avg {avg}/3
                            </span>
                          </div>
                        )}

                        {/* Comment */}
                        <p className="text-[13px] font-medium leading-6 text-indigo-200">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="border-t border-white/5 px-6 py-4 text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-indigo-500">
                  — {reviewCount} reviews total —
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Locked ─────────────────────────────────────────────────────────── */
        <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-indigo-950">
          {/* Skeleton ghost */}
          <div aria-hidden className="pointer-events-none select-none opacity-20 blur-sm p-6 space-y-4">
            <div className="h-28 rounded-2xl bg-indigo-900/50" />
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-4 px-2 py-4 border-t border-white/5 first:border-0">
                <div className="h-9 w-9 shrink-0 rounded-2xl bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-36 rounded-full bg-white/5" />
                  <div className="flex gap-1.5">
                    <div className="h-5 w-20 rounded-lg bg-white/5" />
                    <div className="h-5 w-16 rounded-lg bg-white/5" />
                    <div className="h-5 w-24 rounded-lg bg-white/5" />
                  </div>
                  <div className="h-3 w-full rounded-full bg-white/5" />
                  <div className="h-3 w-4/5 rounded-full bg-white/5" />
                </div>
              </div>
            ))}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <Lock size={20} className="text-indigo-400" />
            </div>
            <div>
              <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-white">
                Insights Restricted
              </p>
              <p className="max-w-xs text-xs font-medium leading-5 text-indigo-400">
                Only professionals with the same role or recruiters can read peer insights for this profile.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                Same role: {profileRole}
              </span>
              <span className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-amber-400">
                Recruiter
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
