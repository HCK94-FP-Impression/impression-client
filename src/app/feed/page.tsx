"use client";

import { useState } from "react";
import { Info, RefreshCw, Target } from "lucide-react";

const dummyProfile = {
  image: "https://xsgames.co/randomusers/avatar.php?g=male",
  targetJob: "SOFTWARE ENGINEER",
  criteria: ["PROFESIONAL", "ADAPTIF", "KOMUNIKATIF"],
};

const ratingOptions = [
  { label: "NO", level: 0 },
  { label: "SOMEWHAT", level: 1 },
  { label: "YES", level: 2 },
  { label: "VERY", level: 3 },
];

export default function FeedPage() {
  const [scores, setScores] = useState<(number | null)[]>([null, null, null]);

  const completed = scores.filter((s) => s !== null).length;

  return (
    <div className="mx-auto w-full max-w-7xl py-2">
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT: Big framed profile (slightly smaller) */}
        <section className="col-span-7">
          <div className="rounded-3xl bg-[#05070c] p-6 shadow-2xl">
            <div className="rounded-2xl bg-black p-4">
              <div className="overflow-hidden rounded-xl bg-gray-900">
                <img
                  src={dummyProfile.image}
                  alt="Profile"
                  className="w-full object-cover max-h-[440px]"
                />
              </div>
              <div className="mt-4 text-white">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#3b4363]">
                  TARGET ROLE
                </span>
                <h1 className="mt-2 text-5xl font-extrabold tracking-tight text-white font-sans">
                  {dummyProfile.targetJob}
                </h1>

                <div className="mt-4 flex gap-3">
                  {dummyProfile.criteria.map((item) => (
                    <div
                      key={item}
                      className="inline-flex items-center gap-2 rounded-full border border-white/6 bg-white/3 px-4 py-2"
                    >
                      <Target
                        size={12}
                        className="text-indigo-400 opacity-80"
                      />
                      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-200">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: Rating column (expanded slightly) */}
        <section className="col-span-5">
          <div className="flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-3xl font-black tracking-tight text-[#0f141e] font-sans">
                RATE THIS PROFILE
              </h2>
              <p className="mt-2 text-[11px] font-bold tracking-[0.15em] text-gray-400 uppercase">
                Give a score for each criterion below.
              </p>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-end pb-3 text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">
                <span>Rated Criteria</span>
                <span className="text-gray-900 font-extrabold">
                  {completed} / {scores.length}
                </span>
              </div>
              <div className="h-0.5 w-full bg-gray-200 rounded-full overflow-hidden">
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

                  <div className="grid grid-cols-4 gap-4 mt-3">
                    {ratingOptions.map((option) => {
                      const active = scores[index] === option.level;

                      return (
                        <button
                          key={option.level}
                          onClick={() => {
                            const next = [...scores];
                            next[index] = option.level;
                            setScores(next);
                          }}
                          className={`group flex flex-col items-center justify-center rounded-2xl border py-4 px-2 transition-all duration-200
                            ${
                              active
                                ? "border-[#141923] bg-[#141923] text-white shadow-lg scale-[1.01]"
                                : "border-gray-100 bg-white hover:border-gray-300 shadow-sm"
                            }
                          `}
                        >
                          <span
                            className={`text-[13px] font-black tracking-wide ${active ? "text-white" : "text-[#1e2533]"}`}
                          >
                            {option.label}
                          </span>
                          <span
                            className={`mt-1 text-[8px] font-bold tracking-widest uppercase ${active ? "text-gray-400" : "text-gray-400/80"}`}
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
                <button className="w-full rounded-2xl bg-indigo-500 hover:bg-indigo-700 py-5 text-center text-white text-[11px] font-extrabold uppercase tracking-[0.2em] transition-all shadow-md">
                  Submit Rating
                </button>
              )}

              <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-5 text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-700 transition-all hover:bg-gray-50 shadow-sm">
                <RefreshCw size={13} />
                Skip Profile
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
