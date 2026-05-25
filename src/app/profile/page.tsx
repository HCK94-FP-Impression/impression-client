import Link from "next/link";
import {
  BriefcaseBusiness,
  MapPin,
  Mail,
  Link2,
  PencilLine,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Award,
  Zap,
  Compass,
  FolderKanban,
  GraduationCap,
  ShieldCheck,
  Languages,
  Layers,
} from "lucide-react";
import {
  initialProfile,
  jobRecommendations,
  scoreData,
  profileContact,
  profileProjects,
  profileStrengths,
  profileReference,
  type CriteriaScore,
} from "./data";
import ProfileRadar from "./components/ProfileRadar";

export default function ProfilePage() {
  const profile = initialProfile;
  const strongest = [...scoreData].sort((a, b) => b.score - a.score)[0];
  const weakest   = [...scoreData].sort((a, b) => a.score - b.score)[0];
  const overallScore = Math.round(
    (scoreData.reduce((sum, s) => sum + s.score / s.max, 0) / scoreData.length) * 100,
  );

  const languageLevelWidth: Record<string, string> = {
    Native:       "100%",
    Fluent:       "90%",
    Professional: "80%",
    Intermediate: "60%",
  };

  return (
    <div className="flex flex-col gap-5">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">
            Dashboard
          </p>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            Profile Overview
          </h1>
        </div>

        {/* Edit button — contrasting but tasteful */}
        <Link
          href="/edit"
          className="group self-start sm:self-auto inline-flex items-center gap-2 rounded-xl bg-indigo-950 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-900/25 transition-all hover:-translate-y-0.5 hover:bg-indigo-800 hover:shadow-xl hover:shadow-indigo-900/30"
        >
          <PencilLine size={13} className="transition-transform group-hover:rotate-12" />
          Edit Profile
        </Link>
      </div>

      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* 1. HERO IDENTITY — col 8 */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-4xl border border-white/60 bg-white/70 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
          <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row gap-7 items-center sm:items-start">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-indigo-200 via-violet-200 to-indigo-300 opacity-60 blur-sm" />
              <img
                src={profile.imageUrl}
                alt={profile.name}
                className="relative h-32 w-32 sm:h-36 sm:w-36 rounded-3xl object-cover border border-white shadow-md"
              />
              <div className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full bg-white border border-gray-100 px-2 py-1 shadow-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span className="text-[8px] font-black uppercase tracking-wider text-gray-500">Active</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-950 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-100 shadow-sm mb-3">
                <Star size={9} fill="currentColor" />
                Top 3% Candidate
              </span>

              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 mb-1">
                {profile.name}
              </h2>
              <p className="text-sm font-bold text-indigo-600 mb-3">
                {profile.role}
              </p>

              <p className="text-sm leading-relaxed text-gray-500 max-w-xl mb-5">
                {profile.summary}
              </p>

              {/* Contact chips */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-[10px] font-bold text-gray-500">
                  <MapPin size={10} className="text-gray-400" />
                  {profileContact.location}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-[10px] font-bold text-gray-500">
                  <Mail size={10} className="text-gray-400" />
                  {profileContact.email}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-600">
                  <Link2 size={10} />
                  {profileContact.linkedin}
                </span>
              </div>

              {/* Skill tags */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {profile.skills.map((skill, i) => {
                  const palette = [
                    "border-indigo-200 bg-indigo-50 text-indigo-700",
                    "border-violet-200 bg-violet-50 text-violet-700",
                    "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
                    "border-cyan-200 bg-cyan-50 text-cyan-700",
                    "border-emerald-200 bg-emerald-50 text-emerald-700",
                    "border-gray-200 bg-gray-100 text-gray-600",
                  ];
                  return (
                    <span
                      key={skill}
                      className={`rounded-full border px-3 py-1 text-[10px] font-bold ${palette[i % palette.length]}`}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 2. OVERALL SCORE — col 4 */}
        <div className="lg:col-span-4 relative overflow-hidden rounded-4xl border border-indigo-950 bg-indigo-950 p-8 text-white shadow-2xl shadow-indigo-900/20 flex flex-col justify-between group">
          <div className="absolute right-0 top-0 p-6 opacity-10 transition-opacity group-hover:opacity-20 pointer-events-none">
            <Zap size={80} fill="currentColor" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
              <Target size={14} />
              Overall Match
            </div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-7xl font-black tracking-tighter">{overallScore}</span>
              <span className="text-2xl font-black text-indigo-400">%</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-400">
                <TrendingUp size={10} />
                +12%
              </div>
              <span className="text-[10px] font-bold text-indigo-300/60">vs last month</span>
            </div>
          </div>

          <div className="relative z-10 mt-6 space-y-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-indigo-400 transition-all duration-700"
                style={{ width: `${overallScore}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-400/60">Community Rank</span>
              <span className="text-[10px] font-black text-white">#14 globally</span>
            </div>
          </div>
        </div>

        {/* 3. PERFORMANCE RADAR — col 4 */}
        <ProfileRadar />

        {/* 4. DETAILED METRICS — col 4 */}
        <div className="lg:col-span-4 rounded-4xl border border-white/60 bg-white/70 p-7 shadow-xl shadow-slate-900/5 backdrop-blur-2xl flex flex-col">
          <p className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
            <TrendingUp size={12} className="text-indigo-500" />
            Detailed Metrics
          </p>
          <div className="flex flex-1 flex-col justify-center space-y-5">
            {scoreData.map((item: CriteriaScore, i) => {
              const pct = (item.score / item.max) * 100;
              const bars = [
                { track: "bg-indigo-100", fill: "bg-indigo-500" },
                { track: "bg-violet-100", fill: "bg-violet-500" },
                { track: "bg-cyan-100",   fill: "bg-cyan-500" },
              ];
              const bar = bars[i % bars.length];
              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700">{item.label}</span>
                    <span className="text-xs font-black text-gray-900">
                      {item.score.toFixed(1)}{" "}
                      <span className="font-bold text-gray-400">/ {item.max}</span>
                    </span>
                  </div>
                  <div className={`h-1.5 w-full overflow-hidden rounded-full ${bar.track}`}>
                    <div className={`h-full rounded-full ${bar.fill}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. HIGHLIGHTS — col 4 */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex flex-1 items-center gap-5 rounded-4xl border border-emerald-200/60 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-2xl group hover:border-emerald-300 hover:bg-emerald-50/40 transition-all duration-300">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 transition-transform group-hover:scale-105">
              <Award size={22} className="text-emerald-600" />
            </div>
            <div>
              <p className="mb-1 text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500/60">Top Strength</p>
              <p className="text-base font-black text-gray-900">{strongest?.label}</p>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-5 rounded-4xl border border-fuchsia-200/60 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-2xl group hover:border-fuchsia-300 hover:bg-fuchsia-50/40 transition-all duration-300">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-fuchsia-200 bg-fuchsia-50 transition-transform group-hover:scale-105">
              <TrendingDown size={22} className="text-fuchsia-600" />
            </div>
            <div>
              <p className="mb-1 text-[9px] font-black uppercase tracking-[0.3em] text-fuchsia-500/60">Focus Area</p>
              <p className="text-base font-black text-gray-900">{weakest?.label}</p>
            </div>
          </div>
        </div>

        {/* 6. CAREER JOURNEY — col 6 */}
        <div className="lg:col-span-6 rounded-4xl border border-white/60 bg-white/70 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
          <div className="mb-7 flex items-center gap-2">
            <BriefcaseBusiness size={13} className="text-gray-400" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
              Career Journey
            </p>
          </div>
          <div className="relative space-y-5 before:absolute before:left-5 before:top-0 before:h-full before:w-px before:bg-gradient-to-b before:from-indigo-300 before:via-indigo-100 before:to-transparent">
            {profile.experience.map((item, index) => (
              <div key={item.role} className="group relative flex items-start gap-5">
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-950 text-[10px] font-black text-white shadow-sm transition-all group-hover:bg-indigo-950">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 pb-2 transition-transform group-hover:translate-x-0.5">
                  <h4 className="text-sm font-black text-gray-900">{item.role}</h4>
                  <p className="mt-0.5 text-[11px] font-bold text-indigo-600">{item.company}</p>
                  <p className="mt-1 text-[10px] font-bold text-gray-400">{item.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. FEATURED PROJECTS — col 6 */}
        <div className="lg:col-span-6 rounded-4xl border border-white/60 bg-white/70 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
          <div className="mb-6 flex items-center gap-2">
            <FolderKanban size={13} className="text-gray-400" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
              Featured Projects
            </p>
          </div>
          <div className="space-y-4">
            {profileProjects.map((project, i) => {
              const accents = [
                { border: "border-violet-100", bg: "bg-violet-50/60", impact: "border-violet-200 bg-violet-50 text-violet-600", tag: "border-violet-100 bg-white/80 text-violet-600" },
                { border: "border-fuchsia-100", bg: "bg-fuchsia-50/60", impact: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-600", tag: "border-fuchsia-100 bg-white/80 text-fuchsia-600" },
              ];
              const accent = accents[i % accents.length];
              return (
                <div key={project.title} className={`rounded-2xl border ${accent.border} ${accent.bg} p-5`}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h4 className="text-sm font-black text-gray-900 leading-tight">{project.title}</h4>
                    <span className={`shrink-0 rounded-lg border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${accent.impact}`}>
                      {project.impact}
                    </span>
                  </div>
                  <p className="text-xs font-medium leading-5 text-gray-500 mb-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span key={tech} className={`rounded-lg border px-2 py-0.5 text-[9px] font-bold ${accent.tag}`}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 8. EDUCATION — col 4 */}
        <div className="lg:col-span-4 rounded-4xl border border-white/60 bg-white/70 p-7 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
          <div className="mb-5 flex items-center gap-2">
            <GraduationCap size={13} className="text-gray-400" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Education</p>
          </div>
          <div className="space-y-3">
            {profile.education.map((item) => (
              <div key={item.title} className="rounded-2xl border border-cyan-100 bg-cyan-50/50 p-4">
                <h5 className="text-sm font-black text-gray-900 leading-tight">{item.title}</h5>
                <p className="mt-1 text-[11px] font-bold text-gray-500">{item.school}</p>
                <span className="mt-2 inline-block rounded-lg border border-cyan-200 bg-white px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-cyan-600">
                  {item.meta}
                </span>
              </div>
            ))}
          </div>

          {/* Core Strengths */}
          <div className="mt-6 border-t border-gray-100 pt-5">
            <div className="mb-3 flex items-center gap-2">
              <Layers size={12} className="text-gray-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">Core Strengths</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {profileStrengths.map((s) => (
                <span key={s} className="rounded-lg border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 9. CERTIFICATIONS — col 4 */}
        <div className="lg:col-span-4 rounded-4xl border border-white/60 bg-white/70 p-7 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
          <div className="mb-5 flex items-center gap-2">
            <ShieldCheck size={13} className="text-gray-400" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Certifications</p>
          </div>
          <div className="space-y-3">
            {profileReference.certifications.map((cert) => (
              <div key={cert} className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
                <p className="text-xs font-bold text-gray-700">{cert}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 10. LANGUAGES — col 4 */}
        <div className="lg:col-span-4 rounded-4xl border border-white/60 bg-white/70 p-7 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
          <div className="mb-5 flex items-center gap-2">
            <Languages size={13} className="text-gray-400" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Languages</p>
          </div>
          <div className="space-y-4">
            {profileReference.languages.map((lang) => {
              const width = languageLevelWidth[lang.level] ?? "70%";
              return (
                <div key={lang.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-gray-900">{lang.name}</span>
                    <span className="rounded-lg border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-indigo-600">
                      {lang.level}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-indigo-500 to-violet-400"
                      style={{ width }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 11. MARKET MATCHING — col 12 */}
        <div className="lg:col-span-12 rounded-4xl border border-white/60 bg-white/70 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass size={13} className="text-gray-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                Market Matching
              </p>
            </div>
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600">
              {jobRecommendations.length} Roles
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {jobRecommendations.map((job, i) => {
              const accents = [
                { border: "border-indigo-100 hover:border-indigo-200", icon: "border-indigo-200 bg-indigo-50 text-indigo-500", company: "text-indigo-500" },
                { border: "border-violet-100 hover:border-violet-200", icon: "border-violet-200 bg-violet-50 text-violet-500", company: "text-violet-500" },
                { border: "border-fuchsia-100 hover:border-fuchsia-200", icon: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-500", company: "text-fuchsia-500" },
              ];
              const accent = accents[i % accents.length];
              return (
                <div
                  key={job.title}
                  className={`group flex cursor-pointer flex-col justify-between rounded-2xl border bg-white/60 ${accent.border} p-5 transition-all duration-300 hover:shadow-md backdrop-blur-sm`}
                >
                  <div>
                    <div className="mb-4 flex items-start justify-between">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${accent.icon}`}>
                        <BriefcaseBusiness size={14} />
                      </div>
                      <span className="rounded-lg border border-gray-100 bg-gray-50 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-gray-500">
                        {job.type}
                      </span>
                    </div>
                    <h4 className="mb-1 text-sm font-black leading-tight text-gray-900">{job.title}</h4>
                    <p className={`text-[11px] font-bold ${accent.company}`}>{job.company}</p>
                  </div>
                  <p className="mt-4 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                    <MapPin size={10} />
                    {job.location}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
