"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CloudUpload,
  Lock,
  Target,
  WandSparkles,
} from "lucide-react";
import ProfileEditor from "./components/ProfileEditor";
import { initialProfile, type ProfileData } from "../profile/data";

type FeedbackState = { error: string; message: string };

type LoadingState = {
  upload: boolean;
  generate: boolean;
  submit: boolean;
};

const uploadQuotaRequirement = 5;

const getErrorMessage = (error: unknown, fallback = "Something went wrong") => {
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
};

const Notice = ({
  message,
  tone = "error",
}: {
  message: string;
  tone?: "error" | "success";
}) => {
  if (!message) {
    return null;
  }

  const toneStyles =
    tone === "success"
      ? "border-emerald-100 bg-emerald-50 text-emerald-600"
      : "border-rose-100 bg-rose-50 text-rose-600";

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] ${toneStyles}`}
    >
      {message}
    </div>
  );
};

const Panel = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-[32px] border border-white/60 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)] ${className}`}
  >
    {children}
  </div>
);

export default function EditProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [editor, setEditor] = useState<ProfileData>(initialProfile);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<FeedbackState>({
    error: "",
    message: "",
  });

  const [quota, setQuota] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [targetJob, setTargetJob] = useState("");
  const [criteria, setCriteria] = useState(["", "", ""]);
  const [loading, setLoading] = useState<LoadingState>({
    upload: false,
    generate: false,
    submit: false,
  });
  const [feedback, setFeedback] = useState<FeedbackState>({
    error: "",
    message: "",
  });
  const [published, setPublished] = useState(false);

  const ratingsNeeded = Math.max(uploadQuotaRequirement - quota, 0);
  const isLocked = quota < uploadQuotaRequirement;

  const canSubmit = useMemo(() => {
    return (
      imageUrl &&
      targetJob.trim() &&
      criteria.every((item) => item.trim().length > 0)
    );
  }, [imageUrl, targetJob, criteria]);

  useEffect(() => {
    if (!selectedImage) {
      return;
    }

    const nextUrl = URL.createObjectURL(selectedImage);
    setEditor((prev) => ({ ...prev, imageUrl: nextUrl }));

    return () => {
      URL.revokeObjectURL(nextUrl);
    };
  }, [selectedImage]);

  const handleFieldChange = <K extends keyof ProfileData>(
    key: K,
    value: ProfileData[K],
  ) => {
    setEditor((prev) => ({ ...prev, [key]: value }));
  };

  const handleExperienceChange = (
    index: number,
    key: "role" | "company" | "meta",
    value: string,
  ) => {
    setEditor((prev) => {
      const next = [...prev.experience];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, experience: next };
    });
  };

  const handleEducationChange = (
    index: number,
    key: "title" | "school" | "meta",
    value: string,
  ) => {
    setEditor((prev) => {
      const next = [...prev.education];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, education: next };
    });
  };

  const handleAddExperience = () => {
    setEditor((prev) => ({
      ...prev,
      experience: [...prev.experience, { role: "", company: "", meta: "" }],
    }));
  };

  const handleRemoveExperience = (index: number) => {
    setEditor((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleAddEducation = () => {
    setEditor((prev) => ({
      ...prev,
      education: [...prev.education, { title: "", school: "", meta: "" }],
    }));
  };

  const handleRemoveEducation = (index: number) => {
    setEditor((prev) => ({
      ...prev,
      education: prev.education.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSaveProfile = () => {
    setProfile(editor);
    setSaveFeedback({ error: "", message: "Profile updates saved" });
  };

  const handleResetProfile = () => {
    setEditor(profile);
    setSaveFeedback({ error: "", message: "Changes reverted" });
  };

  const handleUpload = async () => {
    if (!file) {
      setFeedback({ message: "", error: "Please select an image file first" });
      return;
    }

    const allowedMimeTypes = ["image/jpeg", "image/png"];
    if (!allowedMimeTypes.includes(file.type)) {
      setFeedback({
        message: "",
        error: "Only JPG, JPEG, and PNG files are supported",
      });
      return;
    }

    const maxFileSize = 5 * 1024 * 1024;
    if (file.size > maxFileSize) {
      setFeedback({
        message: "",
        error: "Image size must be 5MB or less",
      });
      return;
    }

    setLoading((prev) => ({ ...prev, upload: true }));
    setFeedback({ error: "", message: "" });

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/posts/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const data = (await response.json()) as { secure_url?: string };
      if (!data.secure_url) {
        throw new Error("Upload response missing image URL");
      }

      setImageUrl(data.secure_url);
      setFeedback({ error: "", message: "Image uploaded successfully" });
    } catch (err) {
      setFeedback({
        message: "",
        error: getErrorMessage(err, "Image upload failed. Please try again"),
      });
    } finally {
      setLoading((prev) => ({ ...prev, upload: false }));
    }
  };

  const handleGenerate = async () => {
    if (!targetJob.trim()) {
      setFeedback({ message: "", error: "Target role is required" });
      return;
    }

    setLoading((prev) => ({ ...prev, generate: true }));
    setFeedback({ error: "", message: "" });

    try {
      const response = await fetch("/api/posts/generate-criteria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetJob }),
      });

      if (!response.ok) {
        throw new Error("Criteria generation failed");
      }

      const data = (await response.json()) as { criteria?: string[] };
      setCriteria(data.criteria ?? ["", "", ""]);
      setFeedback({ error: "", message: "Criteria generated successfully" });
    } catch (err) {
      setFeedback({ message: "", error: getErrorMessage(err) });
    } finally {
      setLoading((prev) => ({ ...prev, generate: false }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading((prev) => ({ ...prev, submit: true }));
    setFeedback({ error: "", message: "" });

    try {
      const payload = {
        imageUrl,
        targetJob,
        criteria: criteria.map((item) => item.trim()),
      };
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Publish failed");
      }

      const data = (await response.json()) as { remainingQuota?: number };
      setQuota(data.remainingQuota ?? quota);
      setPublished(true);
      setFeedback({ error: "", message: "Profile published successfully" });

      setImageUrl("");
      setTargetJob("");
      setCriteria(["", "", ""]);
      setFile(null);
    } catch (err) {
      setFeedback({ message: "", error: getErrorMessage(err) });
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 py-4">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
            Editor
          </p>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-gray-900">
            Profile Edit Studio
          </h1>
          <p className="mt-2 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
            Update your profile data and publish a new profile post from here.
          </p>
        </div>
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 transition hover:border-indigo-300 hover:text-indigo-600"
        >
          Back to Profile
          <ArrowRight size={14} />
        </Link>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ProfileEditor
          editor={editor}
          isEditing
          selectedImage={selectedImage}
          onSelectImage={setSelectedImage}
          onFieldChange={handleFieldChange}
          onExperienceChange={handleExperienceChange}
          onEducationChange={handleEducationChange}
          onAddExperience={handleAddExperience}
          onRemoveExperience={handleRemoveExperience}
          onAddEducation={handleAddEducation}
          onRemoveEducation={handleRemoveEducation}
        />
        <Panel className="flex flex-col justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
              Save changes
            </p>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-tight text-gray-900">
              Apply Profile Updates
            </h2>
            <p className="mt-4 text-sm font-semibold text-gray-600">
              Review your edits, then save. You can always adjust the content
              before publishing to the feed.
            </p>
          </div>
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleSaveProfile}
              className="w-full rounded-2xl bg-indigo-950 px-5 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-indigo-950/20 transition hover:bg-indigo-900"
            >
              Save Profile
            </button>
            <button
              type="button"
              onClick={handleResetProfile}
              className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 transition hover:border-gray-300 hover:text-gray-900"
            >
              Reset Changes
            </button>
            <Notice message={saveFeedback.message} tone="success" />
            <Notice message={saveFeedback.error} />
          </div>
        </Panel>
      </section>

      <section className="rounded-[32px] border border-dashed border-indigo-100 bg-indigo-50/60 p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
              Publish
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-gray-900">
              Post to the rating feed
            </h2>
          </div>
          <div className="flex gap-2 text-[9px] font-black uppercase">
            <span className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-indigo-600">
              Points: {quota}
            </span>
            <span className="rounded-full border border-rose-200 bg-white px-3 py-1 text-rose-600">
              Cost: {uploadQuotaRequirement}
            </span>
          </div>
        </div>
        <p className="mt-4 text-sm font-semibold text-gray-600">
          Upload a profile image, set a target role, and generate criteria.
          Publish when you are ready.
        </p>
      </section>

      {isLocked ? (
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <Panel className="relative overflow-hidden p-10">
            <div className="absolute top-0 right-0 p-10 opacity-5 text-gray-900">
              <Lock size={200} />
            </div>
            <div className="relative z-10">
              <span className="inline-block rounded-full border border-rose-200 bg-rose-950 px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-rose-100 shadow-xl">
                Posting Locked
              </span>
              <h2 className="mt-8 text-4xl font-black uppercase tracking-tighter leading-tight text-gray-900">
                Complete {ratingsNeeded} <br />
                More Ratings.
              </h2>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                    Quota
                  </p>
                  <p className="text-3xl font-black text-gray-900">{quota}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                    Threshold
                  </p>
                  <p className="text-3xl font-black text-gray-900">
                    {uploadQuotaRequirement}
                  </p>
                </div>
                <div className="rounded-2xl bg-indigo-950 p-6 shadow-xl">
                  <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400">
                    Needed
                  </p>
                  <p className="text-3xl font-black text-white">
                    {ratingsNeeded}
                  </p>
                </div>
              </div>

              <Link href="/feed" className="inline-block mt-10">
                <span className="flex items-center gap-3 rounded-xl bg-indigo-950 px-10 py-4 text-[11px] font-black uppercase tracking-widest text-white">
                  Go to Rating Feed
                  <ArrowRight size={16} />
                </span>
              </Link>
            </div>
          </Panel>

          <div className="rounded-[2.5rem] bg-indigo-950 p-8 text-white">
            <span className="mb-8 block text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
              How to Unlock
            </span>
            <div className="space-y-8">
              {[
                "Rate profiles in feed",
                "Earn +1 quota per rating",
                "Reach threshold",
                "Publish profile",
              ].map((step, index) => (
                <div key={step} className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-800 text-[10px] font-black text-white">
                    0{index + 1}
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-200/60">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Panel className="p-8">
            <span className="inline-block rounded-full border border-indigo-400/30 bg-indigo-950 px-4 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-indigo-100">
              Profile Image Upload
            </span>
            <h2 className="mt-6 text-2xl font-black uppercase tracking-tighter text-gray-900">
              Upload Image
            </h2>

            <label className="mt-8 block cursor-pointer rounded-4xl border-2 border-dashed border-gray-200 bg-slate-50 p-12 text-center transition-all hover:border-indigo-600">
              <CloudUpload size={32} className="mx-auto mb-4 text-gray-300" />
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
                className="hidden"
              />
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                {file ? file.name : "Select image"}
              </span>
            </label>

            <button
              type="button"
              onClick={handleUpload}
              disabled={loading.upload}
              className="mt-6 w-full rounded-2xl bg-gray-950 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white"
            >
              {loading.upload ? "Uploading..." : "Upload image"}
            </button>

            {imageUrl && (
              <div className="mt-6 overflow-hidden rounded-3xl border-4 border-white shadow-2xl">
                <img
                  src={imageUrl}
                  className="h-64 w-full object-cover"
                  alt="Preview"
                />
              </div>
            )}
          </Panel>

          <Panel className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Setup
                </span>
                <div className="flex gap-2 text-[9px] font-black uppercase">
                  <span className="rounded border border-indigo-100 bg-indigo-50 px-2 py-1 text-indigo-600">
                    Points: {quota}
                  </span>
                  <span className="rounded border border-rose-100 bg-rose-50 px-2 py-1 text-rose-600">
                    Cost: {uploadQuotaRequirement}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Target Role
                  </span>
                  <div className="mt-1 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 transition-all focus-within:border-indigo-600">
                    <Target size={18} className="text-gray-400" />
                    <input
                      value={targetJob}
                      onChange={(event) => setTargetJob(event.target.value)}
                      placeholder="e.g. Product Designer"
                      className="w-full bg-transparent text-sm font-black uppercase text-gray-900 outline-none"
                    />
                  </div>
                </label>

                <div className="rounded-4xl bg-slate-900 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <WandSparkles size={16} className="text-indigo-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                        Generate Criteria
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerate}
                      disabled={loading.generate}
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[9px] font-black uppercase hover:bg-indigo-500"
                    >
                      {loading.generate ? "Generating..." : "Generate"}
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {criteria.map((item, index) => (
                    <input
                      key={index}
                      value={item}
                      onChange={(event) => {
                        const next = [...criteria];
                        next[index] = event.target.value;
                        setCriteria(next);
                      }}
                      placeholder={`Criterion 0${index + 1}`}
                      className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-[10px] font-black uppercase text-gray-900 outline-none focus:border-indigo-600"
                    />
                  ))}
                </div>
              </div>

              <Notice message={feedback.error} />
              <Notice message={feedback.message} tone="success" />

              <button
                type="submit"
                disabled={loading.submit || !canSubmit}
                className="w-full rounded-4xl bg-indigo-950 py-5 text-[11px] font-black uppercase tracking-[0.3em] text-white shadow-2xl shadow-indigo-950/20 disabled:opacity-60"
              >
                {loading.submit ? "Publishing..." : "Publish Profile"}
              </button>

              {published && (
                <Link
                  href="/profile"
                  className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline"
                >
                  View Profile Dashboard <ArrowRight size={14} />
                </Link>
              )}
            </form>
          </Panel>
        </div>
      )}
    </div>
  );
}
