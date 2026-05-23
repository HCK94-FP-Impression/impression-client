"use client";

import { Info, RefreshCw } from "lucide-react";
import { dummyProfile, ratingOptions } from "../data";

type FeedRatingPanelProps = {
  scores: Array<number | null>;
  onScoreChange: (index: number, level: number) => void;
};

export default function FeedRatingPanel({
  scores,
  onScoreChange,
}: FeedRatingPanelProps) {
  const completed = scores.filter((score) => score !== null).length;

  return (
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
              style={{ width: `${(completed / scores.length) * 100}%` }}
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
                      onClick={() => onScoreChange(index, option.level)}
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
  );
}
