"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import FeedProfileCard from "./components/cardProfile";
import FeedRatingPanel from "./components/rating";
import FeedInsightPanel from "./components/insight";
import {
  getApiErrorMessage,
  getFeedPost,
  hasStoredSession,
  isUnauthorizedError,
  submitRating,
} from "./api";
import type { FeedResponse } from "./types";

type FeedbackState = {
  tone: "error" | "success";
  message: string;
} | null;

function FeedbackNotice({ feedback }: { feedback: FeedbackState }) {
  if (!feedback) return null;

  const isSuccess = feedback.tone === "success";

  return (
    <div
      className={`mb-6 flex items-center gap-3 rounded-2xl border px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] ${
        isSuccess
          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
          : "border-rose-100 bg-rose-50 text-rose-600"
      }`}
    >
      {isSuccess ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
      <span>{feedback.message}</span>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[520px] items-center justify-center rounded-3xl border border-gray-100 bg-white/70 shadow-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <LoaderCircle size={30} className="animate-spin text-indigo-500" />
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-gray-900">
            Loading Feed
          </p>
          <p className="mt-2 text-xs font-semibold text-gray-400">
            Fetching a profile from the server.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FeedPage() {
  const router = useRouter();
  const [feed, setFeed] = useState<FeedResponse | null>(null);
  const [scores, setScores] = useState<Array<number | null>>([]);
  const [insightDraft, setInsightDraft] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const post = feed?.post ?? null;

  const loadFeed = useCallback(
    async (skipPostId?: number, nextFeedback?: FeedbackState) => {
      if (!hasStoredSession()) {
        router.replace("/login");
        return;
      }

      setIsLoading(true);
      if (!nextFeedback) setFeedback(null);

      try {
        const data = await getFeedPost(skipPostId);
        setFeed(data);
        setScores(data.post ? Array(data.post.criteria.length).fill(null) : []);
        setInsightDraft("");
        setIsFlipped(false);
        if (nextFeedback) setFeedback(nextFeedback);
      } catch (error) {
        if (isUnauthorizedError(error)) {
          router.replace("/login");
          return;
        }

        setFeedback({
          tone: "error",
          message: getApiErrorMessage(error, "Failed to load feed"),
        });
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadFeed();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadFeed]);

  const handleScoreChange = (index: number, level: number) => {
    const next = [...scores];
    next[index] = level;
    setScores(next);
  };

  const handleSubmitRating = async () => {
    if (!post) return;

    if (!hasStoredSession()) {
      router.replace("/login");
      return;
    }

    const normalizedScores = scores.map((score) => score ?? -1);
    const hasInvalidScore = normalizedScores.some(
      (score) => !Number.isInteger(score) || score < 0 || score > 3,
    );

    if (hasInvalidScore || normalizedScores.length !== post.criteria.length) {
      setFeedback({
        tone: "error",
        message: "Scores length must match criteria length",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await submitRating({
        postId: post.id,
        scores: normalizedScores,
        insight: insightDraft,
      });

      await loadFeed(post.id, {
        tone: "success",
        message: response.message,
      });
    } catch (error) {
      if (isUnauthorizedError(error)) {
        router.replace("/login");
        return;
      }

      setFeedback({
        tone: "error",
        message: getApiErrorMessage(error, "Failed to submit rating"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipPost = async () => {
    await loadFeed(post?.id);
  };

  const handleRetry = async () => {
    await loadFeed();
  };

  if (isLoading && !post) {
    return (
      <div className="mx-auto w-full max-w-7xl py-2">
        <FeedbackNotice feedback={feedback} />
        <LoadingState />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto w-full max-w-7xl py-2">
        <FeedbackNotice feedback={feedback} />
        <div className="flex min-h-[520px] items-center justify-center rounded-3xl border border-gray-100 bg-white/70 p-8 text-center shadow-sm">
          <div className="max-w-md">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-gray-900">
              {feed?.message ?? "No posts available"}
            </p>
            <p className="mt-3 text-xs font-semibold leading-6 text-gray-400">
              The server did not return a profile for this feed request.
            </p>
            <button
              type="button"
              onClick={handleRetry}
              disabled={isLoading}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-indigo-950 px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-sm transition hover:bg-indigo-800 disabled:bg-gray-300"
            >
              <RefreshCw
                size={13}
                className={isLoading ? "animate-spin" : undefined}
              />
              Refresh Feed
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl py-2">
      <FeedbackNotice feedback={feedback} />

      {feed?.cycleCompleted ? (
        <div className="mb-6 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">
          Cycle completed. The server is now returning random posts from all
          available profiles.
        </div>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <FeedProfileCard
          post={post}
          isFlipped={isFlipped}
          onToggleFlip={() => setIsFlipped((prev) => !prev)}
        />
        <FeedRatingPanel
          criteria={post.criteria}
          scores={scores}
          isSubmitting={isSubmitting}
          isSkipping={isLoading && !isSubmitting}
          onScoreChange={handleScoreChange}
          onSubmit={handleSubmitRating}
          onSkip={handleSkipPost}
        />
      </div>

      <FeedInsightPanel
        post={post}
        insightDraft={insightDraft}
        disabled={isSubmitting || isLoading}
        onInsightChange={setInsightDraft}
      />
    </div>
  );
}
