"use client";

import { useEffect, useMemo, useState } from "react";
import type { SubmitEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  // ArrowRight,
  // Coins,
  // FileText,
  // Lock,
  // Send,
  // Sparkles,
  // WandSparkles,
} from "lucide-react";
import CvEditor, { CvData } from "./components/CvEditor";
import PostEditor, { PostData } from "./components/PostEditor";
import { api, getApiErrorMessage } from "@/constants/constants";

// ── Types ─────────────────────────────────────────────────────────────────────

export type FeedbackState = { error: string; message: string };
export type LoadingState = { generate: boolean; submit: boolean; parse: boolean };

// ── Constants ─────────────────────────────────────────────────────────────────

/* const PUBLISH_COST = 5;   // rating points needed to republish
const CV_TOKEN_COST = 3;  // CV tokens needed per parse (separate pool) */

// ── Sub-components ────────────────────────────────────────────────────────────

/* const GlassCard = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-4xl border border-white/60 bg-white/70 p-7 shadow-xl shadow-slate-900/5 backdrop-blur-2xl ${className}`}>
    {children}
  </div>
);

const SectionHead = ({ icon, label, aside }: { icon: ReactNode; label: string; aside?: ReactNode }) => (
  <div className="mb-5 flex items-center justify-between">
    <div className="flex items-center gap-2.5">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-500">
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{label}</span>
    </div>
    {aside}
  </div>
);

const TokenBadge = ({ tokens, cost, label }: { tokens: number; cost: number; label: string }) => (
  <div className={`flex items-center gap-1.5 rounded-xl border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
    tokens >= cost ? "border-emerald-100 bg-emerald-50 text-emerald-600" : "border-rose-100 bg-rose-50 text-rose-500"
  }`}>
    <Coins size={9} /> {tokens} {label}
  </div>
); */

// ── Page ─────────────────────────────────────────────────────────────────────

export default function EditProfilePage() {
  // Profile data — live, no explicit save needed
  const [cv, setCv] = useState<CvData>({
    experiences: [],
    educations: [],
    skills: []
  });

  const [post, setPost] = useState<PostData>({
    image: "",
    targetJob: "",
    criteria: ["", "", ""]
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [hasPost, setHasPost] = useState<boolean | null>(null);
  const [hasCv, setHasCv] = useState<boolean | null>(null);

  // Token pools
  // const [ratingPoints, setRatingPoints] = useState(0);
  // const [cvTokens, setCvTokens] = useState(CV_TOKEN_COST);   // new users: 1 free parse
  // const [hasPublishedBefore, setHasPublishedBefore] = useState(false);

  // CV Parser
  // const [cvFile, setCvFile] = useState<File | null>(null);
  // const [parseFeedback, setParseFeedback] = useState<FeedbackState>({ error: "", message: "" });

  // Criteria
  const [criteriaMode, setCriteriaMode] = useState<"ai" | "manual">("ai");
  const [criteriaFeedback, setCriteriaFeedback] = useState<FeedbackState>({ error: "", message: "" });

  // Publish
  const [publishCvFeedback, setPublishCvFeedback] = useState<FeedbackState>({ error: "", message: "" });
  const [publishPostFeedback, setPublishPostFeedback] = useState<FeedbackState>({ error: "", message: "" });
  // const [published, setPublished] = useState(false);

  const [loading, setLoading] = useState<LoadingState>({ generate: false, submit: false, parse: false });

  // const cvInputRef = useRef<HTMLInputElement>(null);

  // ── Derived ────────────────────────────────────────────────────────────────
  // const canPublishFree = !hasPublishedBefore;
  // const canPublishPaid = ratingPoints >= PUBLISH_COST;
  // const canPublish = canPublishFree || canPublishPaid;
  // const ratingsNeeded = Math.max(PUBLISH_COST - ratingPoints, 0);
  // const canUseCvParser = cvTokens >= CV_TOKEN_COST;

  const canSubmitPost = useMemo(
    () => post.targetJob.trim() && post.criteria.every((c) => c.trim().length > 0),
    [post.targetJob, post.criteria],
  );

  const canSubmitCv = useMemo(
    () => cv.experiences.every((c) => {
      if (!c.title) return false;
      if (!c.company) return false;
      if (!c.startDate) return false;
      if (!c.endDate) return false;
      if (!c.description?.trim()) return false;
      return true;
    }) && cv.educations.every((c) => {
      if (!c.degree) return false;
      if (!c.institution) return false;
      if (!c.startDate) return false;
      if (!c.endDate) return false;
      if (c.gpa === null || Number.isNaN(c.gpa)) return false;
      return true;
    }) && cv.skills.every((c) => c.trim().length > 0),
    [cv.experiences, cv.educations, cv.skills],
  );

  const isFirstTime = hasPost === false && hasCv === false;
  const pageTitle = hasPost === null || hasCv === null
    ? "Profile"
    : isFirstTime
      ? "Add Profile"
      : "Edit Profile";

  const normalizeDate = (value?: string | Date | null) => {
    if (!value) return null;
    const parsed = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toISOString().slice(0, 10);
  };

  const normalizeCriteria = (criteria?: string[]) => {
    const base = criteria ? [...criteria] : [];
    while (base.length < 3) base.push("");
    return base.slice(0, 3) as [string, string, string];
  };

  useEffect(() => {
    let isActive = true;

    const loadProfile = async () => {
      const [postResult, cvResult] = await Promise.allSettled([
        api.get<{ post?: { image?: string; targetJob?: string; criteria?: string[] } }>("/posts/my-post"),
        api.get<{
          experiences?: Array<{ title: string; company: string; startDate: string | null; endDate: string | null; description: string | null }>;
          educations?: Array<{ degree: string; institution: string; startDate: string | null; endDate: string | null; gpa: number | null }>;
          skills?: string[];
        }>("/cvs"),
      ]);

      if (!isActive) return;

      if (postResult.status === "fulfilled" && postResult.value.data?.post) {
        const postData = postResult.value.data.post;
        setPost({
          image: postData.image ?? "",
          targetJob: postData.targetJob ?? "",
          criteria: normalizeCriteria(postData.criteria),
        });
        setHasPost(true);
      } else {
        setHasPost(false);
      }

      if (cvResult.status === "fulfilled") {
        const cvData = cvResult.value.data;
        const experiences = (cvData.experiences ?? []).map((item) => ({
          title: item.title,
          company: item.company,
          startDate: normalizeDate(item.startDate),
          endDate: normalizeDate(item.endDate),
          description: item.description ?? "",
        }));
        const educations = (cvData.educations ?? []).map((item) => ({
          degree: item.degree,
          institution: item.institution,
          startDate: normalizeDate(item.startDate),
          endDate: normalizeDate(item.endDate),
          gpa: item.gpa ?? null,
        }));

        if (experiences.length || educations.length || (cvData.skills?.length ?? 0) > 0) {
          setCv({
            experiences,
            educations,
            skills: cvData.skills ?? [],
          });
          setHasCv(true);
        } else {
          setHasCv(false);
        }
      } else {
        setHasCv(false);
      }
    };

    loadProfile();

    return () => {
      isActive = false;
    };
  }, []);

  // Sync selectedImage → profile photo preview
  useEffect(() => {
    if (!selectedImage) return;
    const url = URL.createObjectURL(selectedImage);
    setCv((prev) => ({ ...prev, imageUrl: url }));
    return () => URL.revokeObjectURL(url);
  }, [selectedImage]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleCvFieldChange = <K extends keyof CvData>(key: K, value: CvData[K]) => {
    setCv((prev) => ({ ...prev, [key]: value }));
  };

  const handlePostFieldChange = <K extends keyof PostData>(key: K, value: PostData[K]) => {
    setPost((prev) => ({ ...prev, [key]: value }));
  };

  const handleExperienceChange = (index: number, key: "title" | "company" | "startDate" | "endDate" | "description", value: string) => {
    setCv((prev) => {
      const next = [...prev.experiences];
      if (key === "startDate" || key === "endDate") {
        next[index] = { ...next[index], [key]: value || null };
      } else {
        next[index] = { ...next[index], [key]: value };
      }
      return { ...prev, experiences: next };
    });
  };

  const handleEducationChange = (index: number, key: "degree" | "institution" | "startDate" | "endDate" | "gpa", value: string) => {
    setCv((prev) => {
      const next = [...prev.educations];
      if (key === "gpa") {
        const parsedValue = value ? Number(value) : null;
        const parsed = parsedValue !== null && Number.isNaN(parsedValue) ? null : parsedValue;
        next[index] = { ...next[index], gpa: parsed }; 
      } else if (key === "startDate" || key === "endDate") {
        next[index] = { ...next[index], [key]: value || null };
      } else {
        next[index] = { ...next[index], [key]: value };
      }
      return { ...prev, educations: next };
    });
  };

  /* const handleParseCV = async () => {
    if (!cvFile) { setParseFeedback({ message: "", error: "Select a CV file first" }); return; }
    if (!canUseCvParser) { setParseFeedback({ message: "", error: "Not enough CV tokens" }); return; }

    setLoading((p) => ({ ...p, parse: true }));
    setParseFeedback({ error: "", message: "" });
    const formData = new FormData();
    formData.append("file", cvFile);
    try {
      const res = await fetch("/api/posts/parse-cv", { method: "POST", body: formData });
      if (!res.ok) throw new Error("CV parsing failed");
      const data = (await res.json()) as Partial<ProfileData>;
      const fields: (keyof ProfileData)[] = ["name", "role", "location", "summary", "skills", "criteria", "experience", "education"];
      for (const key of fields) {
        if (data[key] !== undefined) handleFieldChange(key, data[key] as ProfileData[typeof key]);
      }
      setCvTokens((t) => t - CV_TOKEN_COST);
      setParseFeedback({ error: "", message: "CV parsed — fields updated" });
    } catch (err) {
      setParseFeedback({ message: "", error: getErrorMessage(err, "CV parsing failed") });
    } finally {
      setLoading((p) => ({ ...p, parse: false }));
    }
  }; */

  const handleGenerateCriteria = async () => {
    if (!post.targetJob.trim()) {
      setCriteriaFeedback({ message: "", error: "Fill in your role first" });
      return;
    }
    setLoading((p) => ({ ...p, generate: true }));
    setCriteriaFeedback({ error: "", message: "" });
    try {
      const response = await api.post<{ criteria?: string[] }>("/posts/generate-criteria", {
        targetJob: post.targetJob.trim(),
      });
      setPost((prev) => ({ ...prev, criteria: normalizeCriteria(response.data.criteria) }));
      setCriteriaFeedback({ error: "", message: "Criteria generated" });
    } catch (err) {
      setCriteriaFeedback({ message: "", error: getApiErrorMessage(err) });
    } finally {
      setLoading((p) => ({ ...p, generate: false }));
    }
  };

  const handleSubmitPost = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!selectedImage && !post.image) {
      setPublishPostFeedback({ message: "", error: "Please choose a profile photo" });
      return;
    }
    setLoading((p) => ({ ...p, submit: true }));
    setPublishPostFeedback({ error: "", message: "" });
    try {
      const criteria = post.criteria.map((item) => item.trim());
      const formData = new FormData();
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      formData.append("targetJob", post.targetJob.trim());
      formData.append("criteria", JSON.stringify(criteria));

      const isEditingPost = hasPost === true;
      const response = isEditingPost
        ? await api.put("/posts", formData)
        : await api.post("/posts", formData);

      const nextImage = response.data?.post?.image as string | undefined;
      if (nextImage) {
        setPost((prev) => ({ ...prev, image: nextImage }));
        setSelectedImage(null);
      }
      if (!isEditingPost) setHasPost(true);
      // if (!res.ok) throw new Error("Publish failed");
      // const data = (await res.json()) as { remainingQuota?: number };
      // if (data.remainingQuota !== undefined) setRatingPoints(data.remainingQuota);
      // setHasPublishedBefore(true);
      // setPublished(true);
      setPublishPostFeedback({ error: "", message: "Published successfully" });
    } catch (err) {
      setPublishPostFeedback({ message: "", error: getApiErrorMessage(err) });
    } finally {
      setLoading((p) => ({ ...p, submit: false }));
    }
  };

  const handleSubmitCv = async (e: SubmitEvent) => {
    e.preventDefault();
    setLoading((p) => ({ ...p, submit: true }));
    setPublishCvFeedback({ error: "", message: "" });
    try {
      const toDateString = (value: string | null) => (value ? value : null);

      const payload = {
        experiences: cv.experiences.map((item) => ({
          title: item.title,
          company: item.company,
          startDate: toDateString(item.startDate),
          endDate: toDateString(item.endDate),
          description: item.description,
        })),
        educations: cv.educations.map((item) => ({
          degree: item.degree,
          institution: item.institution,
          startDate: toDateString(item.startDate),
          endDate: toDateString(item.endDate),
          gpa: item.gpa,
        })),
        skills: cv.skills.filter(Boolean),
      };

      const isEditingCv = hasCv === true;
      if (isEditingCv) {
        await api.patch("/cvs/edit", payload);
      } else {
        await api.post("/cvs/add", payload);
        setHasCv(true);
      }
      //TODO: Handle free first time profile setup
      // if (!res.ok) throw new Error("Publish failed");
      // const data = (await res.json()) as { remainingQuota?: number };
      // if (data.remainingQuota !== undefined) setRatingPoints(data.remainingQuota);
      // setHasPublishedBefore(true);
      // setPublished(true);
      setPublishCvFeedback({ error: "", message: "Published successfully" });
    } catch (err) {
      setPublishCvFeedback({ message: "", error: getApiErrorMessage(err) });
    } finally {
      setLoading((p) => ({ ...p, submit: false }));
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 py-4">

      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Studio</p>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">{pageTitle}</h1>
        </div>
        <Link
          href="/profile"
          className="group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-gray-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600"
        >
          <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
          Back
        </Link>
      </header>

      {/* ── CV AI Parser ──────────────────────────────────────────────────────── */}
      {/* <GlassCard>
        <SectionHead
          icon={<FileText size={13} />}
          label="CV AI Parser"
          aside={<TokenBadge tokens={cvTokens} cost={CV_TOKEN_COST} label="CV tokens" />}
        />
        <p className="mb-5 text-sm font-semibold leading-relaxed text-gray-400">
          Upload your CV and AI will auto-fill the form fields below.{" "}
          <span className="font-bold text-gray-500">Costs {CV_TOKEN_COST} CV tokens per parse.</span>
        </p>

        <div
          onClick={() => canUseCvParser && cvInputRef.current?.click()}
          className={`group mb-4 flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed px-8 py-7 text-center transition-all ${
            canUseCvParser
              ? "cursor-pointer border-gray-200 bg-gray-50/60 hover:border-indigo-400 hover:bg-indigo-50/40"
              : "cursor-not-allowed border-gray-100 bg-gray-50/30 opacity-40"
          }`}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-100 bg-white shadow-sm transition-transform group-hover:scale-105">
            <FileText size={18} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">
              {cvFile ? cvFile.name : "Drop CV or click to browse"}
            </p>
            <p className="mt-1 text-[9px] font-bold text-gray-400">PDF, DOC, DOCX — max 10 MB</p>
          </div>
          <input
            ref={cvInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />
        </div>

        <button
          type="button"
          onClick={handleParseCV}
          disabled={loading.parse || !cvFile || !canUseCvParser}
          className="w-full rounded-xl bg-indigo-950 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-900/25 transition-all hover:-translate-y-0.5 hover:bg-indigo-800 disabled:translate-y-0 disabled:opacity-40"
        >
          {loading.parse ? (
            <span className="flex items-center justify-center gap-2">
              <Sparkles size={13} className="animate-pulse" /> Parsing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <WandSparkles size={13} /> Parse with AI — {CV_TOKEN_COST} tokens
            </span>
          )}
        </button>

        {(parseFeedback.message || parseFeedback.error) && (
          <div className="mt-4 space-y-2">
            <Notice message={parseFeedback.message} tone="success" />
            <Notice message={parseFeedback.error} />
          </div>
        )}
      </GlassCard> */}

      {/* ── Profile Form (criteria embedded inside) ───────────────────────────── */}
      <PostEditor
        editor={post}
        loading={loading}
        canSubmit={canSubmitPost}
        isEditing
        selectedImage={selectedImage}
        onSelectImage={setSelectedImage}
        onFieldChange={handlePostFieldChange}
        criteriaMode={criteriaMode}
        onCriteriaModeChange={setCriteriaMode}
        onGenerateCriteria={handleGenerateCriteria}
        generatingCriteria={loading.generate}
        criteriaFeedback={criteriaFeedback}
        handleSubmitPost={handleSubmitPost}
        publishPostFeedback={publishPostFeedback}
      />

      <CvEditor
        editor={cv}
        loading={loading}
        canSubmit={canSubmitCv}
        isEditing
        onFieldChange={handleCvFieldChange}
        onExperienceChange={handleExperienceChange}
        onEducationChange={handleEducationChange}
        onAddExperience={() => {

          setCv((prev) => ({
            ...prev,
            experiences: [...prev.experiences, { title: "", company: "", startDate: null, endDate: null, description: "" }],
          }))
          console.log(cv)
        }
        }
        onRemoveExperience={(i) =>
          setCv((prev) => ({ ...prev, experiences: prev.experiences.filter((_, idx) => idx !== i) }))
        }
        onAddEducation={() =>
          setCv((prev) => ({
            ...prev,
            educations: [...prev.educations, { degree: "", institution: "", startDate: null, endDate: null, gpa: null }],
          }))
        }
        onRemoveEducation={(i) =>
          setCv((prev) => ({ ...prev, education: prev.educations.filter((_, idx) => idx !== i) }))
        }
        handleSubmitCv={handleSubmitCv}
        publishCvFeedback={publishCvFeedback}
      />

      {/* ── Publish ───────────────────────────────────────────────────────────── */}
      {/* <div className="relative overflow-hidden rounded-4xl border border-indigo-950 bg-indigo-950 p-7 text-white shadow-2xl shadow-indigo-900/25">
        <div className="pointer-events-none absolute right-0 top-0 p-6 opacity-5">
          {canPublish ? <Send size={110} /> : <Lock size={110} />}
        </div>

        <div className="relative z-10">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Publish</p>
              <h2 className="text-xl font-black tracking-tight text-white">Post to Feed</h2>
            </div>
            <div className="flex flex-wrap justify-end gap-2 text-[9px] font-black uppercase">
              {canPublishFree ? (
                <span className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-emerald-400">
                  1 free post
                </span>
              ) : (
                <>
                  <span className="rounded-lg border border-indigo-700 bg-indigo-900/60 px-2.5 py-1 text-indigo-300">
                    {ratingPoints} pts
                  </span>
                  <span className="rounded-lg border border-rose-900/40 bg-rose-900/20 px-2.5 py-1 text-rose-400">
                    Cost {PUBLISH_COST}
                  </span>
                </>
              )}
            </div>
          </div>

          {canPublish ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {post.criteria.some((c) => c.trim()) && (
                <div>
                  <p className="mb-2 text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">Criteria</p>
                  <div className="grid grid-cols-3 gap-2">
                    {post.criteria.map((c, i) => (
                      <div key={i} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center text-[10px] font-bold text-indigo-200">
                        {c || `—`}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(publishFeedback.message || publishFeedback.error) && (
                <div className="space-y-2">
                  <Notice message={publishFeedback.message} tone="success" />
                  <Notice message={publishFeedback.error} />
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

              {!canSubmit && (
                <p className="text-center text-[9px] font-bold text-indigo-400/60">
                  Fill in your role and set 3 criteria to publish
                </p>
              )}

              {published && (
                <Link
                  href="/profile"
                  className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-300 transition-colors hover:text-white"
                >
                  View Profile <ArrowRight size={12} />
                </Link>
              )}
            </form>
          ) : (
            <div className="space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                  <span className="text-indigo-400">Ratings earned</span>
                  <span className="text-white">{ratingPoints} / {PUBLISH_COST}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-indigo-400 transition-all duration-700"
                    style={{ width: `${Math.min((ratingPoints / PUBLISH_COST) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs font-bold text-indigo-200">
                  Rate <span className="font-black text-white">{ratingsNeeded}</span> more profile{ratingsNeeded !== 1 ? "s" : ""} to unlock publishing.
                </p>
              </div>
              <Link
                href="/feed"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-[11px] font-black uppercase tracking-widest text-indigo-950 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-indigo-50"
              >
                Go Rate Profiles <ArrowRight size={13} />
              </Link>
            </div>
          )}
        </div>
      </div> */}

    </div>
  );
}
