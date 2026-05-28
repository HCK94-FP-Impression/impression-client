"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import { api, getApiErrorMessage } from "@/constants/constants";

type Props = {
  alreadyAnalyzed: boolean;
  cvReady: boolean;
  onAnalyzed: () => void;
};

export default function AnalyzeSection({
  alreadyAnalyzed,
  cvReady,
  onAnalyzed,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canAnalyze = cvReady && !alreadyAnalyzed;

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post("/posts/analyze", {}, { timeout: 60000 });
      onAnalyzed();
      router.push("/profile");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-4xl border border-indigo-950 bg-indigo-950 p-7 text-white shadow-2xl shadow-indigo-900/20">
      <div className="pointer-events-none absolute right-0 top-0 p-6 opacity-5">
        <Sparkles size={110} />
      </div>

      <div className="relative z-10">
        <div className="mb-5">
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
            AI Analysis
          </p>
          <h2 className="text-xl font-black tracking-tight text-white">
            Analyze Your Profile
          </h2>
          <p className="mt-2 text-sm font-medium text-indigo-300/70">
            Gemini will analyze your CV against your target job and criteria —
            generating a score and personalized insight.
          </p>
        </div>

        {!cvReady && !alreadyAnalyzed && (
          <div className="mb-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-[10px] font-bold text-amber-300">
            Complete your CV with at least 1 experience, 1 education, and 1
            skill to unlock analysis.
          </div>
        )}

        {alreadyAnalyzed && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-[10px] font-bold text-emerald-300">
            <CheckCircle size={13} />
            Analysis already generated — view it on your profile.
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-[10px] font-bold text-rose-300">
            {error}
          </div>
        )}

        {alreadyAnalyzed ? (
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-[11px] font-black uppercase tracking-widest text-indigo-950 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-indigo-50"
          >
            View Profile <ArrowRight size={13} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!canAnalyze || loading}
            className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-[11px] font-black uppercase tracking-widest text-indigo-950 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-indigo-50 disabled:translate-y-0 disabled:opacity-40"
          >
            {loading ? (
              <>
                <Sparkles size={13} className="animate-pulse" /> Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={13} /> Analyze with Gemini
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
