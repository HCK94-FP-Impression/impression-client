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
import type { CvData } from "../../profile/data";
import { LoadingState } from "../page";

type ProfileEditorProps = {
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
}: ProfileEditorProps) {

  return (
    <section className="space-y-8 rounded-4xl border border-white/60 bg-white/70 p-7 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">

      {/* ── Curriculum Vitae── */}
      <div className="space-y-4">
        <SectionLabel icon={<Layers size={13} />} label="Curriculum Vitae" />

        {/* ── Experience ── */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
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
        <div className="space-y-4">
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
                <input value={item.startDate.toISOString().slice(0, 10)} onChange={(e) => onExperienceChange(index, "startDate", e.target.value)} disabled={!isEditing} placeholder="Duration (e.g. 2022 – Present)" className={subInputClass} />
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
      <div className="space-y-4">
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
                <input value={item.startDate.toISOString().slice(0, 10)} onChange={(e) => onEducationChange(index, "startDate", e.target.value)} disabled={!isEditing} placeholder="Year (e.g. 2019 – 2023)" className={subInputClass} />
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
          <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Skills (comma separated)</label>
          <input
            value={editor.skills.join(", ")}
            onChange={(e) =>
              onFieldChange("skills", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
            }
            disabled={!isEditing}
            placeholder="React, TypeScript, Node.js..."
            className={inputClass}
          />
          {editor.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {editor.skills.map((skill, i) => {
                const palettes = [
                  "border-indigo-200 bg-indigo-50 text-indigo-700",
                  "border-violet-200 bg-violet-50 text-violet-700",
                  "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
                  "border-emerald-200 bg-emerald-50 text-emerald-700",
                  "border-cyan-200 bg-cyan-50 text-cyan-700",
                ];
                return (
                  <span key={`${skill}-${i}`} className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold ${palettes[i % palettes.length]}`}>
                    {skill}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

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





    </section>
  );
}
