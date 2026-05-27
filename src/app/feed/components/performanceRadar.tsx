"use client";

import type { FeedPost, FeedRatingCriterion } from "../../../types";

export type RadarCategory = "social" | "professional";

const RADAR_CENTER = { x: 50, y: 55 };
const RADAR_VERTICES = [
  { x: 50, y: 15 },
  { x: 85, y: 75 },
  { x: 15, y: 75 },
];
const RADAR_CATEGORIES: RadarCategory[] = ["social", "professional"];

function formatRatingAverage(criteria: FeedRatingCriterion[]) {
  if (!criteria.length) return "0.00";

  const sum = criteria.reduce((total, item) => total + item.average, 0);
  return (sum / criteria.length).toFixed(2);
}

function normalizeRadarCriteria(
  criteria: FeedRatingCriterion[],
  fallbackLabels: string[],
) {
  return Array.from({ length: 3 }, (_, index) => {
    const criterion = criteria[index];

    return {
      label:
        criterion?.label ?? fallbackLabels[index] ?? `Criteria ${index + 1}`,
      average: criterion?.average ?? 0,
      maxScore: criterion?.maxScore ?? 3,
    };
  });
}

function criterionPct(criterion: FeedRatingCriterion) {
  if (criterion.maxScore <= 0) return 0;
  return Math.min(
    Math.max((criterion.average / criterion.maxScore) * 100, 0),
    100,
  );
}

function radarPolygonPoints(criteria: FeedRatingCriterion[]) {
  return criteria
    .map((criterion, index) => {
      const vertex = RADAR_VERTICES[index];
      const pct = criterionPct(criterion) / 100;
      const x = RADAR_CENTER.x + (vertex.x - RADAR_CENTER.x) * pct;
      const y = RADAR_CENTER.y + (vertex.y - RADAR_CENTER.y) * pct;

      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

type PerformanceRadarProps = {
  post: FeedPost;
  activeRadar: RadarCategory;
  onActiveRadarChange: (category: RadarCategory) => void;
};

export default function PerformanceRadar({
  post,
  activeRadar,
  onActiveRadarChange,
}: PerformanceRadarProps) {
  const socialCriteria = normalizeRadarCriteria(
    post.ratings.social.criteria,
    post.criteria,
  );
  const professionalCriteria = normalizeRadarCriteria(
    post.ratings.professional.criteria,
    post.criteria,
  );
  const radarData = {
    social: {
      label: "Sosial",
      total: post.ratings.social.totalRatings,
      criteria: socialCriteria,
      points: radarPolygonPoints(socialCriteria),
      stroke: "#06b6d4",
      fill: "url(#socialGradient)",
      text: "text-cyan-400",
      activeClass: "text-cyan-400 bg-cyan-400/10 ring-1 ring-cyan-400/30",
    },
    professional: {
      label: "Profesional",
      total: post.ratings.professional.totalRatings,
      criteria: professionalCriteria,
      points: radarPolygonPoints(professionalCriteria),
      stroke: "#818cf8",
      fill: "url(#professionalGradient)",
      text: "text-indigo-300",
      activeClass: "text-indigo-300 bg-indigo-400/10 ring-1 ring-indigo-400/30",
    },
  };
  const active = radarData[activeRadar];
  const axisPositions = [
    "absolute left-1/2 -top-4.5 -translate-x-1/2 text-center",
    "absolute bottom-0 -right-2.5 text-right",
    "absolute bottom-0 -left-2.5 text-left",
  ];

  return (
    <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/40 p-5 shadow-inner">
      <div className="mb-3 flex w-full items-start justify-between gap-3">
        <div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">
            Performance Radar
          </span>
          <p className="mt-1 text-[8px] font-bold uppercase tracking-widest text-indigo-400/60">
            {active.label} score
          </p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-black leading-none ${active.text}`}>
            {formatRatingAverage(active.criteria)}
          </p>
          <p className="mt-1 text-[8px] font-black uppercase tracking-widest text-indigo-400/60">
            {active.total} ratings
          </p>
        </div>
      </div>

      <div className="relative my-2 flex h-32 w-32 items-center justify-center">
        <svg className="h-full w-full" viewBox="0 0 100 100">
          <polygon
            points="50,15 85,75 15,75"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
          <polygon
            points="50,35 67.5,65 32.5,65"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.75"
          />
          {RADAR_VERTICES.map((point) => (
            <line
              key={`${point.x}-${point.y}`}
              x1={RADAR_CENTER.x}
              y1={RADAR_CENTER.y}
              x2={point.x}
              y2={point.y}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.75"
              strokeDasharray="2"
            />
          ))}

          {RADAR_CATEGORIES.map((category) => {
            const item = radarData[category];
            const isActive = activeRadar === category;

            return (
              <polygon
                key={category}
                points={item.points}
                fill={item.fill}
                stroke={item.stroke}
                strokeWidth={isActive ? 2.2 : 1.4}
                strokeLinejoin="round"
                opacity={isActive ? 0.95 : 0.24}
                style={{ transition: "opacity 0.25s, stroke-width 0.2s" }}
              />
            );
          })}

          {RADAR_CATEGORIES.flatMap((category) => {
            const item = radarData[category];
            const isActive = activeRadar === category;

            return item.points.split(" ").map((point, index) => {
              const [cx, cy] = point.split(",");

              return (
                <circle
                  key={`${category}-${index}`}
                  cx={cx}
                  cy={cy}
                  r={isActive ? 3 : 2}
                  fill={item.stroke}
                  opacity={isActive ? 1 : 0.32}
                  style={{ transition: "opacity 0.25s, r 0.2s" }}
                />
              );
            });
          })}

          <defs>
            <linearGradient
              id="socialGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(6,182,212,0.24)" />
              <stop offset="100%" stopColor="rgba(6,182,212,0.04)" />
            </linearGradient>
            <linearGradient
              id="professionalGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(129,140,248,0.28)" />
              <stop offset="100%" stopColor="rgba(129,140,248,0.04)" />
            </linearGradient>
          </defs>
        </svg>

        {active.criteria.map((criterion, index) => (
          <div key={criterion.label} className={axisPositions[index]}>
            <p className="max-w-20 truncate text-[7px] font-black uppercase tracking-widest text-indigo-300">
              {criterion.label}
            </p>
            <span className={`text-[9px] font-black ${active.text}`}>
              {Math.round(criterionPct(criterion))}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex w-full justify-center gap-4 border-t border-white/5 pt-2">
        {RADAR_CATEGORIES.map((category) => {
          const isActive = activeRadar === category;
          const isSocial = category === "social";
          const item = radarData[category];

          return (
            <button
              key={category}
              type="button"
              onClick={() => onActiveRadarChange(category)}
              className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest transition-all duration-200 ${
                isActive
                  ? item.activeClass
                  : "text-indigo-400/60 hover:text-indigo-200"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full transition-transform duration-200 ${
                  isSocial ? "bg-[#06b6d4]" : "bg-[#818cf8]"
                } ${isActive ? "scale-150" : ""}`}
              />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
