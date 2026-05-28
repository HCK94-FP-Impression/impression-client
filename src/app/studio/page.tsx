"use client";

import { useEffect, useMemo, useState } from "react";
import type { SubmitEvent } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CvEditor, { CvData } from "./components/CvEditor";
import PostEditor, { PostData } from "./components/PostEditor";
import { api, getApiErrorMessage } from "@/constants/constants";
import AnalyzeSection from "./components/AnalyzeSection";

export type FeedbackState = { error: string; message: string };
export type LoadingState = {
  generate: boolean;
  submit: boolean;
  parse: boolean;
};

export default function EditProfilePage() {
  const [cv, setCv] = useState<CvData>({
    experiences: [],
    educations: [],
    skills: [],
  });
  const [initialCv, setInitialCv] = useState<CvData | null>(null);

  const [post, setPost] = useState<PostData>({
    image: "",
    targetJob: "",
    criteria: ["", "", ""],
  });
  const [initialPost, setInitialPost] = useState<PostData | null>(null);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [hasPost, setHasPost] = useState<boolean | null>(null);
  const [hasCv, setHasCv] = useState<boolean | null>(null);
  const [alreadyAnalyzed, setAlreadyAnalyzed] = useState<boolean>(false);

  const [criteriaMode, setCriteriaMode] = useState<"ai" | "manual">("ai");
  const [criteriaFeedback, setCriteriaFeedback] = useState<FeedbackState>({
    error: "",
    message: "",
  });

  const [publishCvFeedback, setPublishCvFeedback] = useState<FeedbackState>({
    error: "",
    message: "",
  });
  const [publishPostFeedback, setPublishPostFeedback] = useState<FeedbackState>(
    { error: "", message: "" },
  );

  const [loading, setLoading] = useState<LoadingState>({
    generate: false,
    submit: false,
    parse: false,
  });

  // ── Derived ────────────────────────────────────────────────────────────────

  const hasPostChanges = useMemo(() => {
    if (!initialPost) return true;
    return (
      post.targetJob !== initialPost.targetJob ||
      JSON.stringify(post.criteria) !== JSON.stringify(initialPost.criteria) ||
      selectedImage !== null
    );
  }, [post, initialPost, selectedImage]);

  const hasCvChanges = useMemo(() => {
    if (!initialCv) return true;
    return JSON.stringify(cv) !== JSON.stringify(initialCv);
  }, [cv, initialCv]);

  const canSubmitPost = useMemo(
    () =>
      hasPostChanges &&
      !!post.targetJob.trim() &&
      post.criteria.every((c) => c.trim().length > 0),
    [post.targetJob, post.criteria, hasPostChanges],
  );

  const canSubmitCv = useMemo(
    () =>
      hasCvChanges &&
      cv.experiences.every((c) => {
        if (!c.title) return false;
        if (!c.company) return false;
        if (!c.startDate) return false;
        return true;
      }) &&
      cv.educations.every((c) => {
        if (!c.degree) return false;
        if (!c.institution) return false;
        if (!c.startDate) return false;
        if (c.gpa === null || Number.isNaN(c.gpa)) return false;
        return true;
      }) &&
      cv.skills.every((c) => c.trim().length > 0),
    [cv, hasCvChanges],
  );

  const isFirstTime = hasPost === false && hasCv === false;
  const pageTitle =
    hasPost === null || hasCv === null
      ? "Profile"
      : isFirstTime
        ? "Add Profile"
        : "Edit Profile";

  const normalizeDate = (value?: string | Date | null) => {
    if (!value) return null;
    if (typeof value === "string" && value.toLowerCase() === "present")
      return "Present";
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
        api.get<{
          post?: {
            image?: string;
            targetJob?: string;
            criteria?: string[];
            aiScore?: number | null;
            aiInsight?: string | null;
          };
        }>("/posts/my-post"),
        api.get<{
          experiences?: Array<{
            title: string;
            company: string;
            startDate: string | null;
            endDate: string | null;
            description: string | null;
          }>;
          educations?: Array<{
            degree: string;
            institution: string;
            startDate: string | null;
            endDate: string | null;
            gpa: number | null;
          }>;
          skills?: string[];
        }>("/cvs"),
      ]);

      if (!isActive) return;

      if (postResult.status === "fulfilled" && postResult.value.data?.post) {
        const postData = postResult.value.data.post;
        const normalizedPost: PostData = {
          image: postData.image ?? "",
          targetJob: postData.targetJob ?? "",
          criteria: normalizeCriteria(postData.criteria),
          aiScore: postData.aiScore ?? null,
          aiInsight: postData.aiInsight ?? null,
        };
        setPost(normalizedPost);
        setInitialPost(normalizedPost);
        setHasPost(true);
        setAlreadyAnalyzed(
          postData.aiScore !== null && postData.aiScore !== undefined,
        );
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

        if (
          experiences.length ||
          educations.length ||
          (cvData.skills?.length ?? 0) > 0
        ) {
          const normalizedCv: CvData = {
            experiences,
            educations,
            skills: cvData.skills ?? [],
          };
          setCv(normalizedCv);
          setInitialCv(normalizedCv);
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

  useEffect(() => {
    if (!selectedImage) return;
    const url = URL.createObjectURL(selectedImage);
    setCv((prev) => ({ ...prev, imageUrl: url }));
    return () => URL.revokeObjectURL(url);
  }, [selectedImage]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleCvFieldChange = <K extends keyof CvData>(
    key: K,
    value: CvData[K],
  ) => {
    setCv((prev) => ({ ...prev, [key]: value }));
  };

  const handlePostFieldChange = <K extends keyof PostData>(
    key: K,
    value: PostData[K],
  ) => {
    setPost((prev) => ({ ...prev, [key]: value }));
  };

  const handleExperienceChange = (
    index: number,
    key: "title" | "company" | "startDate" | "endDate" | "description",
    value: string,
  ) => {
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

  const handleEducationChange = (
    index: number,
    key: "degree" | "institution" | "startDate" | "endDate" | "gpa",
    value: string,
  ) => {
    setCv((prev) => {
      const next = [...prev.educations];
      if (key === "gpa") {
        const parsedValue = value ? Number(value) : null;
        const parsed =
          parsedValue !== null && Number.isNaN(parsedValue)
            ? null
            : parsedValue;
        next[index] = { ...next[index], gpa: parsed };
      } else if (key === "startDate" || key === "endDate") {
        next[index] = { ...next[index], [key]: value || null };
      } else {
        next[index] = { ...next[index], [key]: value };
      }
      return { ...prev, educations: next };
    });
  };

  const handleGenerateCriteria = async () => {
    if (!post.targetJob.trim()) {
      setCriteriaFeedback({ message: "", error: "Fill in your role first" });
      return;
    }
    setLoading((p) => ({ ...p, generate: true }));
    setCriteriaFeedback({ error: "", message: "" });
    try {
      const response = await api.post<{ criteria?: string[] }>(
        "/posts/generate-criteria",
        { targetJob: post.targetJob.trim() },
      );
      setPost((prev) => ({
        ...prev,
        criteria: normalizeCriteria(response.data.criteria),
      }));
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
      setPublishPostFeedback({
        message: "",
        error: "Please choose a profile photo",
      });
      return;
    }
    setLoading((p) => ({ ...p, submit: true }));
    setPublishPostFeedback({ error: "", message: "" });
    try {
      const criteria = post.criteria.map((item) => item.trim());
      const formData = new FormData();
      if (selectedImage) formData.append("image", selectedImage);
      formData.append("targetJob", post.targetJob.trim());
      formData.append("criteria", JSON.stringify(criteria));

      const isEditingPost = hasPost === true;
      const response = isEditingPost
        ? await api.put("/posts", formData)
        : await api.post("/posts", formData);

      const nextImage = response.data?.post?.image as string | undefined;
      const updatedPost: PostData = {
        ...post,
        image: nextImage ?? post.image,
      };
      if (nextImage) {
        setPost(updatedPost);
        setSelectedImage(null);
      }
      setInitialPost(updatedPost);
      if (!isEditingPost) setHasPost(true);
      setPublishPostFeedback({ error: "", message: "Published successfully" });
      window.dispatchEvent(new Event("quota-updated"));
      setAlreadyAnalyzed(false);
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
      setInitialCv({ ...cv });
      setPublishCvFeedback({ error: "", message: "Published successfully" });
      window.dispatchEvent(new Event("quota-updated"));
      setAlreadyAnalyzed(false);
    } catch (err) {
      setPublishCvFeedback({ message: "", error: getApiErrorMessage(err) });
    } finally {
      setLoading((p) => ({ ...p, submit: false }));
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 py-4">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
            Studio
          </p>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            {pageTitle}
          </h1>
        </div>
        <Link
          href="/profile"
          className="group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-gray-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600"
        >
          <ArrowLeft
            size={13}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          Back
        </Link>
      </header>

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
            experiences: [
              ...prev.experiences,
              {
                title: "",
                company: "",
                startDate: null,
                endDate: null,
                description: "",
              },
            ],
          }));
        }}
        onRemoveExperience={(i) =>
          setCv((prev) => ({
            ...prev,
            experiences: prev.experiences.filter((_, idx) => idx !== i),
          }))
        }
        onAddEducation={() =>
          setCv((prev) => ({
            ...prev,
            educations: [
              ...prev.educations,
              {
                degree: "",
                institution: "",
                startDate: null,
                endDate: null,
                gpa: null,
              },
            ],
          }))
        }
        onRemoveEducation={(i) =>
          setCv((prev) => ({
            ...prev,
            educations: prev.educations.filter((_, idx) => idx !== i),
          }))
        }
        handleSubmitCv={handleSubmitCv}
        publishCvFeedback={publishCvFeedback}
      />

      {hasPost && hasCv && (
        <AnalyzeSection
          alreadyAnalyzed={alreadyAnalyzed}
          cvReady={
            cv.experiences.length >= 1 &&
            cv.educations.length >= 1 &&
            cv.skills.length >= 1
          }
          onAnalyzed={() => setAlreadyAnalyzed(true)}
        />
      )}
    </div>
  );
}
