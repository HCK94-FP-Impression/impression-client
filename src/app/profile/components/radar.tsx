"use client";

import { useState } from "react";
import { Zap } from "lucide-react";

type Category = "sosial" | "profesional";

type RadarProps = {
  criteria: string[];
  socialScores: number[];
  professionalScores: number[];
};

const CENTER = { x: 50, y: 53 };
const AXES = [
  { dx: 0, dy: -43 },
  { dx: 35, dy: 22 },
  { dx: -35, dy: 22 },
];

const LABEL_POSITIONS = [
  {
    top: "-24px",
    left: "50%",
    transform: "translateX(-50%)",
    textAlign: "center" as const,
  },
  { bottom: "4px", right: "-52px", textAlign: "right" as const },
  { bottom: "4px", left: "-52px", textAlign: "left" as const },
];

function calcPoints(scores: number[]): string {
  return scores
    .map((score, i) => {
      const r = Math.min(score / 3, 1);
      const x = CENTER.x + AXES[i].dx * r;
      const y = CENTER.y + AXES[i].dy * r;
      return `${x},${y}`;
    })
    .join(" ");
}

export default function ProfileRadar({
  criteria,
  socialScores,
  professionalScores,
}: RadarProps) {
  const [active, setActive] = useState<Category | null>(null);

  const socialPct = socialScores.map((s) => Math.round((s / 3) * 100));
  const profPct = professionalScores.map((s) => Math.round((s / 3) * 100));
  const activePct =
    active === "sosial" ? socialPct : active === "profesional" ? profPct : null;
  const activeColor = active === "sosial" ? "text-cyan-400" : "text-indigo-300";

  const socialPoints = calcPoints(socialScores);
  const profPoints = calcPoints(professionalScores);

  const toggle = (cat: Category) =>
    setActive((prev) => (prev === cat ? null : cat));

  return (
    <div className="lg:col-span-4 flex flex-col items-center rounded-4xl border border-indigo-950 bg-indigo-950 p-7 shadow-xl shadow-indigo-900/20">
      <div className="mb-4 flex w-full items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
          Performance Radar
        </p>
        <Zap size={13} className="text-indigo-400" />
      </div>

      <div className="relative my-3 flex h-44 w-44 items-center justify-center">
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
          <polygon
            points="50,10 85,75 15,75"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
          <polygon
            points="50,32 72.5,64 27.5,64"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.75"
          />
          <line
            x1="50"
            y1="53"
            x2="50"
            y2="10"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.75"
            strokeDasharray="2"
          />
          <line
            x1="50"
            y1="53"
            x2="85"
            y2="75"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.75"
            strokeDasharray="2"
          />
          <line
            x1="50"
            y1="53"
            x2="15"
            y2="75"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.75"
            strokeDasharray="2"
          />

          <polygon
            points={socialPoints}
            fill="rgba(6,182,212,0.12)"
            stroke="#06b6d4"
            strokeWidth={active === "sosial" ? 2 : 1.5}
            opacity={active === "profesional" ? 0.25 : 1}
            style={{ transition: "opacity 0.25s, stroke-width 0.2s" }}
          />
          <polygon
            points={profPoints}
            fill="rgba(99,102,241,0.15)"
            stroke="#6366f1"
            strokeWidth={active === "profesional" ? 2 : 1.5}
            opacity={active === "sosial" ? 0.25 : 1}
            style={{ transition: "opacity 0.25s, stroke-width 0.2s" }}
          />

          {socialScores.map((score, i) => {
            const r = Math.min(score / 3, 1);
            return (
              <circle
                key={`s${i}`}
                cx={CENTER.x + AXES[i].dx * r}
                cy={CENTER.y + AXES[i].dy * r}
                r={active === "sosial" ? 3.5 : 2.5}
                fill="#06b6d4"
                opacity={active === "profesional" ? 0.2 : 1}
                style={{ transition: "opacity 0.25s" }}
              />
            );
          })}
          {professionalScores.map((score, i) => {
            const r = Math.min(score / 3, 1);
            return (
              <circle
                key={`p${i}`}
                cx={CENTER.x + AXES[i].dx * r}
                cy={CENTER.y + AXES[i].dy * r}
                r={active === "profesional" ? 3.5 : 2.5}
                fill="#6366f1"
                opacity={active === "sosial" ? 0.2 : 1}
                style={{ transition: "opacity 0.25s" }}
              />
            );
          })}
        </svg>

        {criteria.map((label, i) => (
          <div
            key={label}
            className="absolute pointer-events-none"
            style={{ ...LABEL_POSITIONS[i] }}
          >
            <p className="text-[8px] font-black uppercase tracking-widest text-indigo-400">
              {label}
            </p>
            {activePct && (
              <p
                className={`text-[10px] font-black ${activeColor} transition-opacity duration-200`}
                style={{ textAlign: LABEL_POSITIONS[i].textAlign }}
              >
                {activePct[i]}%
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex w-full justify-center gap-6">
        {(["sosial", "profesional"] as Category[]).map((cat) => {
          const isCyan = cat === "sosial";
          const isActive = active === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => toggle(cat)}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-widest transition-all duration-200 ${
                isActive
                  ? isCyan
                    ? "bg-cyan-400/10 text-cyan-400 ring-1 ring-cyan-400/30"
                    : "bg-indigo-400/10 text-indigo-300 ring-1 ring-indigo-400/30"
                  : "text-indigo-400/60 hover:text-indigo-200"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full transition-transform duration-200 ${
                  isCyan ? "bg-cyan-400" : "bg-indigo-500"
                } ${isActive ? "scale-150" : ""}`}
              />
              {cat}
            </button>
          );
        })}
      </div>

      {!active && (
        <p className="mt-2 text-[8px] font-bold uppercase tracking-widest text-indigo-400/40">
          Klik legend untuk melihat skor
        </p>
      )}
    </div>
  );
}
