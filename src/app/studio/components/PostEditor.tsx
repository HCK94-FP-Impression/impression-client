"use client";

import { useRef } from "react";
import {
  Camera,
  PencilLine,
  Send,
  Sparkles,
  Target,
  User,
  WandSparkles,
} from "lucide-react";
import type { PostData } from "../../profile/data";
import Image from "next/image";
import { LoadingState } from "../page";

type ProfileEditorProps = {
  loading: LoadingState,
  canSubmit: boolean | "",
  editor: PostData;
  isEditing: boolean;
  selectedImage: File | null;
  onSelectImage: (file: File | null) => void;
  onFieldChange: <K extends keyof PostData>(key: K, value: PostData[K]) => void;
  criteriaMode: "ai" | "manual";
  onCriteriaModeChange: (mode: "ai" | "manual") => void;
  onGenerateCriteria: () => void;
  generatingCriteria: boolean;
  criteriaFeedback?: { error: string; message: string };
};

const inputClass =
  "w-full rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-50 disabled:text-gray-400 placeholder:text-gray-300";

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

export default function PostEditor({
  loading,
  canSubmit,
  editor,
  isEditing,
  selectedImage,
  onSelectImage,
  onFieldChange,
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
        <SectionLabel icon={<User size={13} />} label="Post Info" />

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
              {imagePreviewUrl || editor.image ? (
                <Image src={imagePreviewUrl ?? editor.image} alt="Profile preview" className="h-full w-full object-cover" width={500} height={500} />
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
        {/* <div>
          <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">User Name</label>
          <input value={editor.name} onChange={(e) => onFieldChange("name", e.target.value)} disabled={!isEditing} placeholder="Your full name" className={inputClass} />
        </div> */}

        {/* Target Job + embedded Criteria Setup */}
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Target Job</label>
            <input
              value={editor.targetJob}
              onChange={(e) => onFieldChange("targetJob", e.target.value)}
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
                  disabled={generatingCriteria || !editor.targetJob.trim() || !isEditing}
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
            <Send size={13} /> Publish Post
          </span>
        )}
      </button>

      </div>
    </section>
  );
}
