"use client";

import { Info, LoaderCircle, RefreshCw, Send } from "lucide-react";
import { ratingOptions } from "../data";

type FeedRatingPanelProps = {
  criteria: string[];
  scores: Array<number | null>;
  isSubmitting: boolean;
  isSkipping: boolean;
  onScoreChange: (index: number, level: number) => void;
  onSubmit: () => void;
  onSkip: () => void;
};

export default function FeedRatingPanel({
  criteria,
  scores,
  isSubmitting,
  isSkipping,
  onScoreChange,
  onSubmit,
  onSkip,
}: FeedRatingPanelProps) {
  const completed = scores.filter((score) => score !== null).length;
  const total = criteria.length;
  const isComplete = total > 0 && completed === total;

  return (
    <section className="lg:col-span-5">
      <div className="mb-6">
        <h2 className="font-sans text-3xl font-black tracking-tight text-indigo-950">
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
            {completed} / {total}
          </span>
        </div>

        <div className="h-0.5 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-indigo-950 transition-all duration-300"
            style={{ width: total ? `${(completed / total) * 100}%` : "0%" }}
          />
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {criteria.map((label, index) => (
          <div key={`${label}-${index}`}>
            <div>
              <span className="inline-block rounded-lg bg-indigo-950 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-200">
                {label}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {ratingOptions.map((option) => {
                const active = scores[index] === option.level;

                return (
                  <button
                    key={option.level}
                    type="button"
                    onClick={() => onScoreChange(index, option.level)}
                    disabled={isSubmitting || isSkipping}
                    className={`group flex min-h-20 cursor-pointer flex-col items-center justify-center rounded-2xl border px-2 py-4 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                      active
                        ? "scale-[1.01] border-indigo-950 bg-indigo-950 text-white shadow-lg"
                        : "border-gray-100 bg-white shadow-sm hover:border-indigo-200"
                    }`}
                  >
                    <span
                      className={`text-[13px] font-black tracking-wide ${
                        active ? "text-white" : "text-indigo-950"
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
        {!isComplete ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-indigo-950 py-5 text-center text-white shadow-md">
            <Info size={14} className="text-indigo-400" />

            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em]">
              Please rate all criteria to continue
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || isSkipping}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-indigo-500 py-5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-white shadow-md transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isSubmitting ? (
              <LoaderCircle size={14} className="animate-spin" />
            ) : (
              <Send size={13} />
            )}
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </button>
        )}

        <button
          type="button"
          onClick={onSkip}
          disabled={isSubmitting || isSkipping}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-5 text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={13}
            className={isSkipping ? "animate-spin" : undefined}
          />
          {isSkipping ? "Loading Next..." : "Skip Profile"}
        </button>
      </div>
    </section>
  );
}
