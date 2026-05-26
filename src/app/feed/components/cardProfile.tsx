"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  ChevronDown,
  FileText,
  GraduationCap,
  Target,
  FileUser,
  Image as ImageIcon,
} from "lucide-react";
import {
  certifications,
  contactInfo,
  dummyProfile,
  educationItems,
  experienceItems,
  languages,
  profileSummary,
  projectItems,
  skillItems,
  strengths,
} from "../data";

type FeedProfileCardProps = {
  isFlipped: boolean;
  onToggleFlip: () => void;
};

type RadarCategory = "sosial" | "profesional";

// Per-category scores at each criterion vertex (criteria[0], criteria[1], criteria[2])
const RADAR_SCORES: Record<RadarCategory, [number, number, number]> = {
  sosial:      [75, 80, 93],
  profesional: [92, 84, 76],
};

type CollapsibleSectionProps = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconColorClass: string;
  borderColorClass: string;
  bgColorClass: string;
  children: React.ReactNode;
};

function CollapsibleSection({
  title,
  subtitle,
  icon: Icon,
  iconColorClass,
  borderColorClass,
  bgColorClass,
  children,
}: CollapsibleSectionProps) {
  return (
    <details
      className="group block overflow-hidden rounded-3xl border border-indigo-900/30 bg-indigo-900/40 p-6 shadow-xl"
      open
    >
      <summary className="flex cursor-pointer items-center justify-between list-none select-none [&::-webkit-details-marker]:hidden">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${borderColorClass} ${bgColorClass}`}>
            <Icon size={15} className={iconColorClass} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{title}</h3>
            <p className={`text-[9px] uppercase tracking-[0.2em] ${iconColorClass}/60`}>
              {subtitle}
            </p>
          </div>
        </div>
        <ChevronDown
          size={16}
          className="text-indigo-300 transition-transform duration-300 group-open:rotate-180"
        />
      </summary>

      <div className="mt-5 border-t border-indigo-900/30 pt-4">
        {children}
      </div>
    </details>
  );
}

export default function FeedProfileCard({
  isFlipped,
  onToggleFlip,
}: FeedProfileCardProps) {
  const [activeRadar, setActiveRadar] = useState<RadarCategory | null>(null);

  const toggleRadar = (cat: RadarCategory) =>
    setActiveRadar((prev) => (prev === cat ? null : cat));

  const activePct = activeRadar ? RADAR_SCORES[activeRadar] : null;

  const languageScores: Record<string, string> = {
    Native: "100%",
    Fluent: "90%",
    Professional: "80%",
    Intermediate: "60%",
  };

  return (
    <section className="col-span-7" style={{ perspective: "1000px" }}>
      <div className="relative w-full" style={{ height: "650px" }}>
        
        {/* Flip Toggle Button */}
        <button
          onClick={onToggleFlip}
          type="button"
          className="absolute right-6 top-6 z-50 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/90 px-5 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-indigo-950 shadow-[0_12px_30px_-12px_rgba(15,23,42,0.5)] transition-all hover:-translate-y-0.5 hover:bg-white active:scale-[0.98]"
        >
          {isFlipped ? (
            <>
              <ImageIcon size={14} />
              <span>View Photo</span>
            </>
          ) : (
            <>
              <FileUser size={14} />
              <span>View CV</span>
            </>
          )}
        </button>

        {/* Card Container */}
        <div
          className="relative h-full w-full transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          
          {/* FRONT SIDE */}
          <div
            className={`absolute inset-0 flex h-full w-full flex-col justify-between rounded-3xl bg-indigo-950 p-6 shadow-2xl transition-all duration-300 ${
              isFlipped ? "pointer-events-none opacity-0" : "z-10 opacity-100"
            }`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="flex h-full flex-col justify-between rounded-2xl bg-indigo-950 p-4">
              <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-gray-900">
                <img
                  src={dummyProfile.image}
                  alt="Profile"
                  className="h-full max-h-[440px] w-full object-cover"
                />
              </div>

              <div className="mt-4 text-white">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-400">
                  TARGET ROLE
                </span>
                <h1 className="mt-2 font-sans text-5xl font-extrabold tracking-tight text-white">
                  {dummyProfile.targetJob}
                </h1>
                <div className="mt-4 flex gap-3">
                  {dummyProfile.criteria.map((item) => (
                    <div
                      key={item}
                      className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-2"
                    >
                      <Target size={12} className="text-indigo-400 opacity-80" />
                      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-200">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BACK SIDE (CV Details) */}
          <div
            className={`absolute inset-0 flex h-full w-full flex-col justify-between rounded-3xl border border-indigo-900/30 bg-indigo-950 p-6 shadow-2xl transition-all duration-300 ${
              isFlipped ? "z-20 opacity-100" : "pointer-events-none opacity-0"
            }`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.15),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.06),transparent_50%)]" />

            <div className="relative mt-14 h-[calc(100%-4rem)] overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-5">
                
                {/* Header Card (Profil, Info Kontak, & Radar Sejajar) */}
                <div className="relative overflow-hidden rounded-3xl border border-indigo-900/30 bg-linear-to-br from-indigo-900/50 to-indigo-900/70 p-6 shadow-xl">
                  <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

                  {/* Pembagian Grid 2 Kolom Kiri & Kanan */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                    
                    {/* KOLOM KIRI (Profil & Info Kontak Tepat di bawah Image) */}
                    <div className="flex flex-col justify-between md:col-span-7 space-y-4">
                      
                      {/* Avatar & Nama */}
                      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
                        <div className="relative shrink-0">
                          <img
                            src={dummyProfile.image}
                            alt="profile"
                            className="relative h-20 w-20 rounded-2xl border border-white/10 object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-2xl font-black tracking-tight text-white bg-clip-text bg-linear-to-r from-white via-indigo-100 to-indigo-200">
                            Alex Carter
                          </h2>
                          <p className="mt-1 text-xs font-bold tracking-wide text-transparent bg-clip-text bg-indigo-400">
                            Senior Software Engineer
                          </p>
                        </div>
                      </div>

                      {/* Info Kontak: Sekarang Tepat di bawah Profil, Rapi dengan Ukuran Kompak */}
                      <div className="flex flex-col gap-4">
                        {[
                          { label: "EMAIL", value: contactInfo.email },
                          { label: "LinkedIn", value: contactInfo.linkedin },
                          { label: "LOCATION", value: contactInfo.location },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-3.5 py-2.5"
                          >
                            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-indigo-400">
                              {item.label}
                            </span>
                            <span className="truncate text-xs font-medium text-indigo-200 select-all max-w-[70%] text-right">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>

                    </div>

                    {/* KOLOM KANAN (Performance Radar) */}
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/40 p-5 shadow-inner md:col-span-5 min-w-[220px]">
                      <span className="mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">
                        PERFORMANCE RADAR
                      </span>

                      <div className="relative my-2 flex h-36 w-36 items-center justify-center">
                        <svg className="h-full w-full" viewBox="0 0 100 100">
                          {/* Grid rings */}
                          <polygon points="50,15 85,75 15,75" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                          <polygon points="50,35 67.5,65 32.5,65" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.75" />
                          {/* Axes */}
                          <line x1="50" y1="55" x2="50" y2="15" stroke="rgba(255,255,255,0.12)" strokeWidth="0.75" strokeDasharray="2" />
                          <line x1="50" y1="55" x2="85" y2="75" stroke="rgba(255,255,255,0.12)" strokeWidth="0.75" strokeDasharray="2" />
                          <line x1="50" y1="55" x2="15" y2="75" stroke="rgba(255,255,255,0.12)" strokeWidth="0.75" strokeDasharray="2" />

                          {/* Sosial polygon */}
                          <polygon
                            points="50,30 78,70 22,71"
                            fill="url(#socialGradient)"
                            stroke="#06b6d4"
                            strokeWidth={activeRadar === "sosial" ? 2 : 1.5}
                            strokeLinejoin="round"
                            opacity={activeRadar === "profesional" ? 0.2 : 0.85}
                            style={{ transition: "opacity 0.25s, stroke-width 0.2s" }}
                          />
                          {/* Profesional polygon */}
                          <polygon
                            points="50,18 74,66 29,64"
                            fill="url(#professionalGradient)"
                            stroke="#6366f1"
                            strokeWidth={activeRadar === "profesional" ? 2 : 1.5}
                            strokeLinejoin="round"
                            opacity={activeRadar === "sosial" ? 0.2 : 0.9}
                            style={{ transition: "opacity 0.25s, stroke-width 0.2s" }}
                          />

                          {/* Sosial dots */}
                          {([{cx:50,cy:30},{cx:78,cy:70},{cx:22,cy:71}] as const).map((p, i) => (
                            <circle key={i} cx={p.cx} cy={p.cy} r={activeRadar === "sosial" ? 3 : 2} fill="#06b6d4"
                              opacity={activeRadar === "profesional" ? 0.2 : 1}
                              style={{ transition: "opacity 0.25s, r 0.2s" }} />
                          ))}
                          {/* Profesional dots */}
                          {([{cx:50,cy:18},{cx:74,cy:66},{cx:29,cy:64}] as const).map((p, i) => (
                            <circle key={i} cx={p.cx} cy={p.cy} r={activeRadar === "profesional" ? 3 : 2} fill="#818cf8"
                              opacity={activeRadar === "sosial" ? 0.2 : 1}
                              style={{ transition: "opacity 0.25s, r 0.2s" }} />
                          ))}

                          <defs>
                            <linearGradient id="socialGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="rgba(6,182,212,0.2)" />
                              <stop offset="100%" stopColor="rgba(6,182,212,0.03)" />
                            </linearGradient>
                            <linearGradient id="professionalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="rgba(99,102,241,0.25)" />
                              <stop offset="100%" stopColor="rgba(99,102,241,0.03)" />
                            </linearGradient>
                          </defs>
                        </svg>

                        {/* Axis labels + conditional percentages */}
                        <div className="absolute left-1/2 -top-4.5 -translate-x-1/2 text-center">
                          <p className="text-[7px] font-black uppercase tracking-widest text-indigo-300">{dummyProfile.criteria[0]}</p>
                          {activePct && (
                            <span className={`text-[9px] font-black ${activeRadar === "sosial" ? "text-cyan-400" : "text-indigo-300"}`}>
                              {activePct[0]}%
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-0 -right-2.5 text-right">
                          <p className="text-[7px] font-black uppercase tracking-widest text-indigo-300">{dummyProfile.criteria[1]}</p>
                          {activePct && (
                            <span className={`text-[9px] font-black ${activeRadar === "sosial" ? "text-cyan-400" : "text-indigo-300"}`}>
                              {activePct[1]}%
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-0 -left-2.5 text-left">
                          <p className="text-[7px] font-black uppercase tracking-widest text-indigo-300">{dummyProfile.criteria[2]}</p>
                          {activePct && (
                            <span className={`text-[9px] font-black ${activeRadar === "sosial" ? "text-cyan-400" : "text-indigo-300"}`}>
                              {activePct[2]}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Clickable legend */}
                      <div className="mt-3 flex w-full justify-center gap-4 border-t border-white/5 pt-2">
                        {(["sosial", "profesional"] as RadarCategory[]).map((cat) => {
                          const isCyan = cat === "sosial";
                          const isActive = activeRadar === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => toggleRadar(cat)}
                              className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest transition-all duration-200 ${
                                isActive
                                  ? isCyan ? "text-cyan-400 bg-cyan-400/10 ring-1 ring-cyan-400/30"
                                           : "text-indigo-300 bg-indigo-400/10 ring-1 ring-indigo-400/30"
                                  : "text-indigo-400/60 hover:text-indigo-200"
                              }`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full transition-transform duration-200 ${
                                isCyan ? "bg-[#06b6d4]" : "bg-[#6366f1]"
                              } ${isActive ? "scale-150" : ""}`} />
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>

                {/* --- Section Details di bawahnya tetap sama dan rapi --- */}
                <CollapsibleSection title="Professional Summary" subtitle="Candidate Overview" icon={FileText} iconColorClass="text-indigo-300" borderColorClass="border-indigo-500/20" bgColorClass="bg-indigo-500/10">
                  <p className="text-xs font-medium leading-6 text-indigo-200/95 sm:text-sm sm:leading-7">{profileSummary}</p>
                </CollapsibleSection>

                <CollapsibleSection title="Work Experience" subtitle="Career Journey" icon={BriefcaseBusiness} iconColorClass="text-violet-300" borderColorClass="border-violet-500/20" bgColorClass="bg-violet-500/10">
                  <div className="space-y-3">
                    {experienceItems.map((item) => (
                      <div key={item.role} className="rounded-2xl border border-white/5 bg-gradient-to-r from-black/40 to-black/10 p-5 transition duration-300 hover:border-violet-500/20">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                          <div>
                            <h4 className="text-base font-bold text-white">{item.role}</h4>
                            <p className="mt-1 text-xs font-medium text-indigo-300">{item.company}</p>
                          </div>
                          <span className="self-start whitespace-nowrap rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-violet-300 sm:self-auto">
                            {item.meta}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Featured Projects" subtitle="Selected Work" icon={Target} iconColorClass="text-fuchsia-300" borderColorClass="border-fuchsia-500/20" bgColorClass="bg-fuchsia-500/10">
                  <div className="space-y-3.5">
                    {projectItems.map((project) => (
                      <div key={project.title} className="rounded-2xl border border-white/5 bg-gradient-to-r from-black/40 to-black/10 p-5 transition duration-300 hover:border-fuchsia-500/20">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2">
                            <h4 className="text-base font-bold text-white">{project.title}</h4>
                            <p className="text-xs font-medium leading-5 text-indigo-300">{project.description}</p>
                          </div>
                          <div className="shrink-0 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-right">
                            <p className="text-[7px] font-black uppercase tracking-[0.2em] text-emerald-400/70">IMPACT</p>
                            <p className="mt-0.5 text-[10px] font-black text-emerald-300">{project.impact}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {project.stack.map((tech) => (
                            <span key={tech} className="rounded-lg border border-white/5 bg-white/[0.04] px-2.5 py-1 text-[8px] font-bold text-indigo-200">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <CollapsibleSection title="Education" subtitle="Academic" icon={GraduationCap} iconColorClass="text-cyan-300" borderColorClass="border-cyan-500/20" bgColorClass="bg-cyan-500/10">
                    <div className="space-y-3">
                      {educationItems.map((item) => (
                        <div key={item.title} className="rounded-xl border border-white/5 bg-black/30 p-4">
                          <h5 className="text-xs font-bold text-white">{item.title}</h5>
                          <p className="mt-1 text-[11px] font-medium text-indigo-300">{item.school}</p>
                          <span className="mt-2 inline-block rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[8px] font-black text-emerald-400">
                            {item.meta}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Certifications" subtitle="Validation" icon={FileUser} iconColorClass="text-emerald-300" borderColorClass="border-emerald-500/20" bgColorClass="bg-emerald-500/10">
                    <div className="space-y-2">
                      {certifications.map((item) => (
                        <div key={item} className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-black/30 px-4 py-2.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                          <p className="text-xs font-semibold text-indigo-100">{item}</p>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                </div>

                <CollapsibleSection title="Skills & Languages" subtitle="Proficiencies" icon={Target} iconColorClass="text-indigo-300" borderColorClass="border-indigo-500/20" bgColorClass="bg-indigo-500/10">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="mb-3 text-xs font-bold text-indigo-300">Core Strengths</h4>
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {strengths.map((item) => (
                          <span key={item} className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[9px] font-bold text-indigo-300">
                            {item}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {skillItems.map((item) => (
                          <span key={item} className="rounded-lg border border-fuchsia-500/20 bg-fuchsia-500/10 px-2.5 py-1 text-[9px] font-bold text-fuchsia-300">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 border-t border-white/5 pt-3 md:border-l md:border-t-0 md:pl-4 md:pt-0">
                      <h4 className="text-xs font-bold text-indigo-300">Languages</h4>
                      {languages.map((item) => {
                        const widthValue = languageScores[item.level] || "70%";
                        return (
                          <div key={item.name} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-indigo-100">{item.name}</span>
                              <span className="text-[9px] font-bold text-indigo-400">{item.level}</span>
                            </div>
                            <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                              <div
                                className="h-full bg-indigo-500  w-[var(--progress)]"
                                style={{ ["--progress" as string]: widthValue }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CollapsibleSection>

              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}