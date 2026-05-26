"use client";

import { useState } from "react";
import FeedProfileCard from "./components/cardProfile";
import FeedRatingPanel from "./components/rating";
import FeedInsightPanel from "./components/insight";
import { dummyProfile } from "./data";

// Mock current viewer — in a real app this comes from auth context
type ViewerMode = "same-role" | "different-role" | "recruiter";

const VIEWER_MODES: Record<ViewerMode, { name: string; role: string; isRecruiter: boolean; label: string }> = {
  "same-role":      { name: "Alex Kim",    role: dummyProfile.targetJob, isRecruiter: false, label: "Same Role" },
  "different-role": { name: "Sam Taylor",  role: "PRODUCT MANAGER",       isRecruiter: false, label: "Different Role" },
  "recruiter":      { name: "Jordan Lee",  role: "TECHNICAL RECRUITER",   isRecruiter: true,  label: "Recruiter" },
};

export default function FeedPage() {
  const [scores, setScores] = useState<Array<number | null>>(() =>
    Array(dummyProfile.criteria.length).fill(null),
  );
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewerMode, setViewerMode] = useState<ViewerMode>("same-role");

  const viewer = VIEWER_MODES[viewerMode];

  const handleScoreChange = (index: number, level: number) => {
    const next = [...scores];
    next[index] = level;
    setScores(next);
  };

  return (
    <div className="mx-auto w-full max-w-7xl py-2">

      {/* ── Main rating grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 items-start gap-8">
        <FeedProfileCard
          isFlipped={isFlipped}
          onToggleFlip={() => setIsFlipped((prev) => !prev)}
        />
        <FeedRatingPanel scores={scores} onScoreChange={handleScoreChange} />
      </div>

      {/* ── Viewer role switcher (demo only) ───────────────────────────────── */}
      <div className="mt-8 flex items-center gap-3">
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">
          Viewing as
        </span>
        <div className="flex items-center gap-1 rounded-xl border border-white/5 bg-[#0a0d17] p-1">
          {(Object.keys(VIEWER_MODES) as ViewerMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewerMode(mode)}
              className={`rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${
                viewerMode === mode
                  ? "bg-indigo-950 text-indigo-300 shadow-sm"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {VIEWER_MODES[mode].label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Peer Insights panel ────────────────────────────────────────────── */}
      <FeedInsightPanel
        profileRole={dummyProfile.targetJob}
        profileCriteria={dummyProfile.criteria}
        viewerName={viewer.name}
        viewerRole={viewer.role}
        isViewerRecruiter={viewer.isRecruiter}
      />

    </div>
  );
}
