"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { socialScores, professionalScores } from "../data";

type Category = "sosial" | "profesional";

const AXES = ["Profesional", "Adaptif", "Komunikatif"] as const;

// Vertex positions for each polygon in SVG viewBox (100×100)
const SOSIAL_PTS = [
  { cx: 50, cy: 25 }, // top
  { cx: 78, cy: 68 }, // bottom-right
  { cx: 20, cy: 68 }, // bottom-left
];
const PROFESIONAL_PTS = [
  { cx: 50, cy: 15 }, // top
  { cx: 70, cy: 62 }, // bottom-right
  { cx: 30, cy: 62 }, // bottom-left
];

// Label anchor offsets (in the relative container, not SVG units)
const LABEL_POSITIONS = [
  { top: "-24px", left: "50%", transform: "translateX(-50%)", textAlign: "center" as const },
  { bottom: "4px",  right: "-52px", textAlign: "right" as const },
  { bottom: "4px",  left:  "-52px", textAlign: "left" as const },
];

export default function ProfileRadar() {
  const [active, setActive] = useState<Category | null>(null);

  const socialPct  = socialScores.map((s) => Math.round((s / 3) * 100));
  const profPct    = professionalScores.map((s) => Math.round((s / 3) * 100));
  const activePct  = active === "sosial" ? socialPct : active === "profesional" ? profPct : null;
  const activeColor = active === "sosial" ? "text-cyan-500" : "text-indigo-600";

  const toggle = (cat: Category) =>
    setActive((prev) => (prev === cat ? null : cat));

  return (
    <div className="lg:col-span-4 flex flex-col items-center rounded-[2rem] border border-white/60 bg-white/70 p-7 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">

      {/* Header */}
      <div className="mb-4 flex w-full items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
          Performance Radar
        </p>
        <Zap size={13} className="text-indigo-500" />
      </div>

      {/* SVG Radar */}
      <div className="relative my-3 flex h-44 w-44 items-center justify-center">
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
          {/* Grid rings */}
          <polygon points="50,10 85,75 15,75" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
          <polygon points="50,32 72.5,64 27.5,64" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="0.75" />
          {/* Axis lines */}
          <line x1="50" y1="53" x2="50" y2="10"  stroke="rgba(0,0,0,0.08)" strokeWidth="0.75" strokeDasharray="2" />
          <line x1="50" y1="53" x2="85" y2="75"  stroke="rgba(0,0,0,0.08)" strokeWidth="0.75" strokeDasharray="2" />
          <line x1="50" y1="53" x2="15" y2="75"  stroke="rgba(0,0,0,0.08)" strokeWidth="0.75" strokeDasharray="2" />

          {/* Sosial polygon */}
          <polygon
            points="50,25 78,68 20,68"
            fill="rgba(6,182,212,0.12)"
            stroke="#06b6d4"
            strokeWidth={active === "sosial" ? 2 : 1.5}
            opacity={active === "profesional" ? 0.25 : 1}
            style={{ transition: "opacity 0.25s, stroke-width 0.2s" }}
          />
          {/* Profesional polygon */}
          <polygon
            points="50,15 70,62 30,62"
            fill="rgba(99,102,241,0.15)"
            stroke="#6366f1"
            strokeWidth={active === "profesional" ? 2 : 1.5}
            opacity={active === "sosial" ? 0.25 : 1}
            style={{ transition: "opacity 0.25s, stroke-width 0.2s" }}
          />

          {/* Sosial dots */}
          {SOSIAL_PTS.map((p, i) => (
            <circle
              key={`s${i}`}
              cx={p.cx}
              cy={p.cy}
              r={active === "sosial" ? 3.5 : 2.5}
              fill="#06b6d4"
              opacity={active === "profesional" ? 0.2 : 1}
              style={{ transition: "opacity 0.25s, r 0.2s" }}
            />
          ))}
          {/* Profesional dots */}
          {PROFESIONAL_PTS.map((p, i) => (
            <circle
              key={`p${i}`}
              cx={p.cx}
              cy={p.cy}
              r={active === "profesional" ? 3.5 : 2.5}
              fill="#6366f1"
              opacity={active === "sosial" ? 0.2 : 1}
              style={{ transition: "opacity 0.25s, r 0.2s" }}
            />
          ))}
        </svg>

        {/* Axis labels + percentages */}
        {AXES.map((axis, i) => (
          <div
            key={axis}
            className="absolute pointer-events-none"
            style={{ ...LABEL_POSITIONS[i] }}
          >
            <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">
              {axis}
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

      {/* Clickable legend */}
      <div className="mt-3 flex w-full justify-center gap-6">
        {(["sosial", "profesional"] as Category[]).map((cat) => {
          const isCyan = cat === "sosial";
          const isActive = active === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => toggle(cat)}
              className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-widest transition-all duration-200 ${
                isActive
                  ? isCyan
                    ? "bg-cyan-50 text-cyan-600 ring-1 ring-cyan-200"
                    : "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200"
                  : "text-gray-400 hover:text-gray-600"
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
        <p className="mt-2 text-[8px] font-bold uppercase tracking-widest text-gray-300">
          Klik legend untuk melihat skor
        </p>
      )}
    </div>
  );
}
