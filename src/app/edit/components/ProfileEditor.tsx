"use client";

import { useRef } from "react";
import {
  BriefcaseBusiness,
  Camera,
  GraduationCap,
  Layers,
  Link2,
  Mail,
  MapPin,
  PencilLine,
  Plus,
  Sparkles,
  Target,
  Trash2,
  User,
  WandSparkles,
} from "lucide-react";
import type { ProfileData } from "../../profile/data";

type ProfileEditorProps = {
  editor: ProfileData;
  isEditing: boolean;
  selectedImage: File | null;
  onSelectImage: (file: File | null) => void;
  onFieldChange: <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => void;
  onExperienceChange: (index: number, key: "role" | "company" | "meta", value: string) => void;
  onEducationChange: (index: number, key: "title" | "school" | "meta", value: string) => void;
  onAddExperience: () => void;
  onRemoveExperience: (index: number) => void;
  onAddEducation: () => void;
  onRemoveEducation: (index: number) => void;
  criteriaMode: "ai" | "manual";
  onCriteriaModeChange: (mode: "ai" | "manual") => void;
  onGenerateCriteria: () => void;
  generatingCriteria: boolean;
  criteriaFeedback?: { error: string; message: string };
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

export default function ProfileEditor({
  editor,
  isEditing,
  selectedImage,
  onSelectImage,
  onFieldChange,
  onExperienceChange,
  onEducationChange,
  onAddExperience,
  onRemoveExperience,
  onAddEducation,
  onRemoveEducation,
  criteriaMode,
  onCriteriaModeChange,
  onGenerateCriteria,
  generatingCriteria,
  criteriaFeedback,
}: ProfileEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagePreviewUrl = selectedImage ? URL.createObjectURL(selectedImage) : null;

  return (
    <section className="space-y-8 rounded-4xl border border-white/60 bg-white/70 p-7 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">

      {/* ── Basic Info ── */}
      <div className="space-y-4">
        <SectionLabel icon={<User size={13} />} label="Basic Info" />

        {/* Photo */}
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Photo</p>
          <div className="flex items-center gap-4">
            <div
              onClick={() => isEditing && fileInputRef.current?.click()}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                isEditing ? "cursor-pointer border-dashed border-gray-300 hover:border-indigo-400" : "border-gray-200"
              } bg-gray-50`}
            >
              {imagePreviewUrl || editor.imageUrl ? (
                <img src={imagePreviewUrl ?? editor.imageUrl} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Camera size={20} className="text-gray-300" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <button
                type="button"
                onClick={() => isEditing && fileInputRef.current?.click()}
                disabled={!isEditing}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-500 transition hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40"
              >
                <Camera size={12} />
                {selectedImage ? selectedImage.name : "Choose Photo"}
              </button>
              <p className="mt-1.5 text-[9px] font-bold text-gray-400">PNG or JPG — max 5 MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => onSelectImage(e.target.files?.[0] ?? null)}
              disabled={!isEditing}
              className="hidden"
            />
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Full Name</label>
          <input value={editor.name} onChange={(e) => onFieldChange("name", e.target.value)} disabled={!isEditing} placeholder="Your full name" className={inputClass} />
        </div>

        {/* Role + embedded Criteria Setup */}
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Role</label>
            <input
              value={editor.role}
              onChange={(e) => onFieldChange("role", e.target.value)}
              disabled={!isEditing}
              placeholder="e.g. Senior Frontend Engineer"
              className={inputClass}
            />
          </div>

          {/* Criteria — nested under Role since role drives AI generation */}
          <div className="rounded-3xl border border-gray-100 bg-gray-50/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target size={11} className="text-indigo-400" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Evaluation Criteria</span>
              </div>
              <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-0.5">
                {(["ai", "manual"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onCriteriaModeChange(mode)}
                    disabled={!isEditing}
                    className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[9px] font-black uppercase tracking-widest transition-all ${
                      criteriaMode === mode ? "bg-indigo-950 text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {mode === "ai" ? <WandSparkles size={8} /> : <PencilLine size={8} />}
                    {mode === "ai" ? "AI" : "Manual"}
                  </button>
                ))}
              </div>
            </div>

            {criteriaMode === "ai" ? (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={onGenerateCriteria}
                  disabled={generatingCriteria || !editor.role.trim() || !isEditing}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-950 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white shadow-sm shadow-indigo-900/25 transition-all hover:-translate-y-0.5 hover:bg-indigo-800 disabled:translate-y-0 disabled:opacity-40"
                >
                  {generatingCriteria ? (
                    <><Sparkles size={11} className="animate-pulse" /> Generating...</>
                  ) : (
                    <><WandSparkles size={11} /> Generate from Role</>
                  )}
                </button>
                {editor.criteria.some((c) => c.trim()) && (
                  <div className="grid grid-cols-3 gap-2">
                    {editor.criteria.map((item, i) => (
                      <div key={i} className="rounded-xl border border-indigo-100 bg-white px-3 py-2.5 text-center text-[10px] font-bold text-indigo-700 shadow-sm">
                        {item || `Criterion ${i + 1}`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {editor.criteria.map((item, i) => (
                  <input
                    key={i}
                    value={item}
                    onChange={(e) => {
                      const next = [...editor.criteria];
                      next[i] = e.target.value;
                      onFieldChange("criteria", next);
                    }}
                    disabled={!isEditing}
                    placeholder={`#${i + 1}`}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-center text-[10px] font-semibold text-gray-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder:text-gray-300 disabled:opacity-40"
                  />
                ))}
              </div>
            )}

            {criteriaFeedback?.message && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-emerald-700">
                {criteriaFeedback.message}
              </div>
            )}
            {criteriaFeedback?.error && (
              <div className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-rose-600">
                {criteriaFeedback.error}
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
            <MapPin size={10} /> Location
          </label>
          <input value={editor.location} onChange={(e) => onFieldChange("location", e.target.value)} disabled={!isEditing} placeholder="City, Country" className={inputClass} />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
            <Mail size={10} /> Email
          </label>
          <input value={editor.email} onChange={(e) => onFieldChange("email", e.target.value)} disabled={!isEditing} placeholder="you@example.com" type="email" className={inputClass} />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
            <Link2 size={10} /> LinkedIn
          </label>
          <input value={editor.linkedin} onChange={(e) => onFieldChange("linkedin", e.target.value)} disabled={!isEditing} placeholder="linkedin.com/in/yourname" className={inputClass} />
        </div>

        {/* Summary */}
        <div>
          <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Summary</label>
          <textarea
            value={editor.summary}
            onChange={(e) => onFieldChange("summary", e.target.value)}
            disabled={!isEditing}
            rows={4}
            placeholder="A brief professional summary..."
            className={`${inputClass} resize-none leading-relaxed`}
          />
        </div>
      </div>

      {/* ── Skills ── */}
      <div className="space-y-4">
        <SectionLabel icon={<Layers size={13} />} label="Skills" />
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

      {/* ── Experience ── */}
      <div className="space-y-4">
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
          {editor.experience.map((item, index) => (
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
                <input value={item.role} onChange={(e) => onExperienceChange(index, "role", e.target.value)} disabled={!isEditing} placeholder="Job Title / Role" className={subInputClass} />
                <input value={item.company} onChange={(e) => onExperienceChange(index, "company", e.target.value)} disabled={!isEditing} placeholder="Company Name" className={subInputClass} />
                <input value={item.meta} onChange={(e) => onExperienceChange(index, "meta", e.target.value)} disabled={!isEditing} placeholder="Duration (e.g. 2022 – Present)" className={subInputClass} />
              </div>
            </div>
          ))}
          {editor.experience.length === 0 && (
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
          {editor.education.map((item, index) => (
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
                <input value={item.title} onChange={(e) => onEducationChange(index, "title", e.target.value)} disabled={!isEditing} placeholder="Degree / Certificate" className={subInputClass} />
                <input value={item.school} onChange={(e) => onEducationChange(index, "school", e.target.value)} disabled={!isEditing} placeholder="Institution / School" className={subInputClass} />
                <input value={item.meta} onChange={(e) => onEducationChange(index, "meta", e.target.value)} disabled={!isEditing} placeholder="Year (e.g. 2019 – 2023)" className={subInputClass} />
              </div>
            </div>
          ))}
          {editor.education.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center">
              <GraduationCap size={24} className="mx-auto mb-2 text-gray-200" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">No education added yet</p>
            </div>
          )}
        </div>
      </div>

    </section>
  );
}
