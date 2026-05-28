"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  LoaderCircle,
  MessageSquare,
  SendHorizonal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getCommunityPosts, createCommunityPost } from "../api";
import { getApiErrorMessage } from "@/constants/constants";
import type { ForumPost } from "../types";
import DisqusEmbed from "./DisqusEmbed";

type Props = {
  communityId: number;
};

export default function ForumPanel({ communityId }: Props) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Only one post's comments open at a time (Disqus single-thread limitation)
  const [openCommentPostId, setOpenCommentPostId] = useState<number | null>(
    null,
  );

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCommunityPosts(communityId);
      setPosts(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load posts"));
    } finally {
      setIsLoading(false);
    }
  }, [communityId]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const newPost = await createCommunityPost(
        communityId,
        title.trim(),
        content.trim(),
      );
      setPosts((prev) => [newPost, ...prev]);
      setTitle("");
      setContent("");
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, "Failed to create post"));
    } finally {
      setIsSubmitting(false);
    }
  }

  function toggleComments(postId: number) {
    setOpenCommentPostId((prev) => (prev === postId ? null : postId));
  }

  return (
    <div className="rounded-4xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
      <div className="mb-6 flex items-center gap-2">
        <MessageSquare size={13} className="text-indigo-500" />
        <h2 className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
          Forum ({isLoading ? "…" : posts.length})
        </h2>
      </div>

      {/* Create post form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:opacity-50"
        />
        <div className="relative">
          <textarea
            placeholder="Share something with the community…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            rows={3}
            className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm font-medium text-gray-800 placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="absolute bottom-3 right-3 flex cursor-pointer h-8 w-8 items-center justify-center rounded-xl bg-indigo-950 text-white transition-all hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? (
              <LoaderCircle size={14} className="animate-spin" />
            ) : (
              <SendHorizonal size={14} />
            )}
          </button>
        </div>

        {submitError && (
          <div className="flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-rose-500">
            <AlertCircle size={12} />
            {submitError}
          </div>
        )}
      </form>

      {/* Posts list */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <LoaderCircle size={24} className="animate-spin text-indigo-400" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rose-500">
          <AlertCircle size={12} />
          {error}
        </div>
      ) : posts.length === 0 ? (
        <p className="py-10 text-center text-xs font-semibold text-gray-400">
          No posts yet. Be the first to share something!
        </p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => {
            const isOpen = openCommentPostId === post.id;
            const disqusId = `community-${communityId}-post-${post.id}`;

            return (
              <div
                key={post.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white/80"
              >
                {/* Post body */}
                <div className="px-5 py-4">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <span className="text-[11px] font-black text-gray-900">
                      {post.title}
                    </span>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500">
                        @{post.User?.username ?? "unknown"}
                      </span>
                      <span className="text-[9px] font-medium text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-medium leading-relaxed text-gray-600">
                    {post.content}
                  </p>
                </div>

                {/* Comments toggle */}
                <button
                  type="button"
                  onClick={() => toggleComments(post.id)}
                  className="flex cursor-pointer w-full items-center justify-between border-t border-gray-100 px-5 py-2.5 text-[9px] font-black uppercase tracking-widest text-gray-400 transition-colors hover:bg-gray-50 hover:text-indigo-600"
                >
                  <span>{isOpen ? "Hide Comments" : "Show Comments"}</span>
                  {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>

                {/* Disqus embed — only for the open post */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 py-4">
                    <DisqusEmbed identifier={disqusId} title={post.title} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
