"use client";

import {
  BriefcaseBusiness,
  GraduationCap,
  Layers,
  Plus,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { FeedbackState, LoadingState } from "../page";
import { SubmitEvent, useState, type KeyboardEvent } from "react";

export type CvData = {
  experiences: Experience[];
  educations: Education[];
  skills: string[];
};

export type Experience = {
  title: string;
  company: string;
  startDate: string | null;
  endDate: string | null;
  description: string;
};

export type Education = {
  degree: string;
  institution: string;
  startDate: string | null;
  endDate: string | null;
  gpa: number | null;
};

type CvEditorProps = {
  loading: LoadingState;
  canSubmit: boolean | "";
  editor: CvData;
  isEditing: boolean;
  onFieldChange: <K extends keyof CvData>(key: K, value: CvData[K]) => void;
  onExperienceChange: (index: number, key: "title" | "company" | "startDate" | "endDate" | "description", value: string) => void;
  onEducationChange: (index: number, key: "degree" | "institution" | "startDate" | "endDate" | "gpa", value: string) => void;
  onAddExperience: () => void;
  onRemoveExperience: (index: number) => void;
  onAddEducation: () => void;
  onRemoveEducation: (index: number) => void;
  handleSubmitCv: (e: SubmitEvent) => Promise<void>
  publishCvFeedback: FeedbackState
};

const inputClass =
  "w-full rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-50 disabled:text-gray-400 placeholder:text-gray-300";

const subInputClass =
  "w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-xs font-semibold text-gray-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-50 placeholder:text-gray-300";

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-500">
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{label}</span>
    </div>
  );
}

const Notice = ({ message, tone = "error" }: { message: string; tone?: "error" | "success" }) => {
  if (!message) return null;
  const cls = tone === "success"
    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
    : "border-rose-100 bg-rose-50 text-rose-600";
  return (
    <div className={`rounded-2xl border px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] ${cls}`}>
      {message}
    </div>
  );
};

export default function CvEditor({
  loading,
  canSubmit,
  editor,
  isEditing,
  onFieldChange,
  onExperienceChange,
  onEducationChange,
  onAddExperience,
  onRemoveExperience,
  onAddEducation,
  onRemoveEducation,
  handleSubmitCv,
  publishCvFeedback,
}: CvEditorProps) {
  const [skillInput, setSkillInput] = useState("");

  const commitSkills = (raw: string) => {
    const tokens = raw
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (tokens.length === 0) return;

    const next = [...editor.skills];
    tokens.forEach((token) => {
      if (!next.includes(token)) next.push(token);
    });
    onFieldChange("skills", next);
  };

  const handleSkillKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitSkills(skillInput);
      setSkillInput("");
      return;
    }
    if (event.key === "Backspace" && !skillInput && editor.skills.length > 0) {
      event.preventDefault();
      onFieldChange("skills", editor.skills.slice(0, -1));
    }
  };

  const handleSkillBlur = () => {
    if (!skillInput.trim()) return;
    commitSkills(skillInput);
    setSkillInput("");
  };

  return (
    <section className="space-y-8 rounded-4xl border border-white/60 bg-white/70 p-7 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">

      {/* ── Curriculum Vitae── */}
      <form onSubmit={handleSubmitCv}>
        <div className="space-y-4">
          <SectionLabel icon={<Layers size={13} />} label="Curriculum Vitae" />

          {/* ── Experience ── */}
          <div className="flex items-center justify-between border-b border-gray-100 ">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-500">
                <BriefcaseBusiness size={13} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Experience</span>
            </div>
            <button
              type="button"
              onClick={onAddExperience}
              disabled={!isEditing}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-950 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-sm shadow-indigo-900/25 transition hover:-translate-y-0.5 hover:bg-indigo-800 disabled:translate-y-0 disabled:opacity-40"
            >
              <Plus size={11} /> Add
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {editor.experiences.map((item, index) => (
              <div key={`exp-${index}`} className="relative rounded-3xl border border-gray-100 bg-white/80 p-5 shadow-sm transition hover:border-indigo-100 hover:shadow-md">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-950 text-[10px] font-black text-white shadow-sm">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">Position {String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveExperience(index)}
                    disabled={!isEditing}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-100 bg-rose-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-rose-500 transition hover:bg-rose-100 disabled:opacity-40"
                  >
                    <Trash2 size={10} /> Remove
                  </button>
                </div>
                <div className="grid gap-2.5">
                  <input value={item.title} onChange={(e) => onExperienceChange(index, "title", e.target.value)} disabled={!isEditing} placeholder="Job Title / Role" className={subInputClass} />
                  <input value={item.company} onChange={(e) => onExperienceChange(index, "company", e.target.value)} disabled={!isEditing} placeholder="Company Name" className={subInputClass} />
                  <input type="date" value={item.startDate ?? ""} onChange={(e) => onExperienceChange(index, "startDate", e.target.value)} disabled={!isEditing} className={subInputClass} />
                  <input type="date" value={item.endDate ?? ""} onChange={(e) => onExperienceChange(index, "endDate", e.target.value)} disabled={!isEditing} className={subInputClass} />
                  <textarea value={item.description} onChange={(e) => onExperienceChange(index, "description", e.target.value)} disabled={!isEditing} placeholder="Describe your impact" className={`${subInputClass} min-h-22.5 resize-y`} />
                </div>
              </div>
            ))}
            {editor.experiences.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                <BriefcaseBusiness size={24} className="mx-auto mb-2 text-gray-200" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">No experience added yet</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Education ── */}
        <div className="mt-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-500">
                <GraduationCap size={13} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Education</span>
            </div>
            <button
              type="button"
              onClick={onAddEducation}
              disabled={!isEditing}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-950 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-sm shadow-indigo-900/25 transition hover:-translate-y-0.5 hover:bg-indigo-800 disabled:translate-y-0 disabled:opacity-40"
            >
              <Plus size={11} /> Add
            </button>
          </div>
          <div className="space-y-4">
            {editor.educations.map((item, index) => (
              <div key={`edu-${index}`} className="relative rounded-3xl border border-gray-100 bg-white/80 p-5 shadow-sm transition hover:border-cyan-100 hover:shadow-md">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-900 text-[10px] font-black text-white shadow-sm">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">Degree {String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveEducation(index)}
                    disabled={!isEditing}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-100 bg-rose-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-rose-500 transition hover:bg-rose-100 disabled:opacity-40"
                  >
                    <Trash2 size={10} /> Remove
                  </button>
                </div>
                <div className="grid gap-2.5">
                  <input value={item.degree} onChange={(e) => onEducationChange(index, "degree", e.target.value)} disabled={!isEditing} placeholder="Degree / Certificate" className={subInputClass} />
                  <input value={item.institution} onChange={(e) => onEducationChange(index, "institution", e.target.value)} disabled={!isEditing} placeholder="Institution / School" className={subInputClass} />
                  <input type="date" value={item.startDate ?? ""} onChange={(e) => onEducationChange(index, "startDate", e.target.value)} disabled={!isEditing} className={subInputClass} />
                  <input type="date" value={item.endDate ?? ""} onChange={(e) => onEducationChange(index, "endDate", e.target.value)} disabled={!isEditing} className={subInputClass} />
                  <input type="number" value={item.gpa ?? ""} onChange={(e) => onEducationChange(index, "gpa", e.target.value)} disabled={!isEditing} placeholder="GPA" className={subInputClass} step="0.01" min="0" max="4" />
                </div>
              </div>
            ))}
            {editor.educations.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                <GraduationCap size={24} className="mx-auto mb-2 text-gray-200" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">No education added yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mt-4 mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Skills (comma separated)</label>
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              onBlur={handleSkillBlur}
              disabled={!isEditing}
              placeholder="React, TypeScript, Node.js..."
              className={inputClass}
            />
            {editor.skills.length > 0 && (
              <div className="mt-3 mb-2 flex flex-wrap gap-1.5">
                {editor.skills.map((skill, i) => {
                  const palettes = [
                    "border-indigo-200 bg-indigo-50 text-indigo-700",
                    "border-violet-200 bg-violet-50 text-violet-700",
                    "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
                    "border-emerald-200 bg-emerald-50 text-emerald-700",
                    "border-cyan-200 bg-cyan-50 text-cyan-700",
                  ];
                  return (
                    <button
                      key={`${skill}-${i}`}
                      type="button"
                      onClick={() =>
                        onFieldChange(
                          "skills",
                          editor.skills.filter((_, index) => index !== i),
                        )
                      }
                      className={`group inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[9px] font-bold transition hover:opacity-80 ${palettes[i % palettes.length]}`}
                      aria-label={`Remove ${skill}`}
                      title="Remove skill"
                    >
                      {skill}
                      <span className="text-[9px] font-black opacity-0 transition-opacity group-hover:opacity-70">
                        x
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {(publishCvFeedback.message || publishCvFeedback.error) && (
          <div className="space-y-2">
            <Notice message={publishCvFeedback.message} tone="success" />
            <Notice message={publishCvFeedback.error} />
          </div>
        )}

        <button
          type="submit"
          disabled={loading.submit || !canSubmit}
          className="w-full rounded-xl bg-white px-5 py-3 text-[11px] font-black uppercase tracking-widest text-indigo-950 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-indigo-50 disabled:translate-y-0 disabled:opacity-50"
        >
          {loading.submit ? (
            <span className="flex items-center justify-center gap-2">
              <Sparkles size={13} className="animate-pulse" /> Publishing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Send size={13} /> Publish Profile
            </span>
          )}
        </button>
      </form>
    </section>
  );
}
