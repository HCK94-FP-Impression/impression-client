"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  getCommunityById,
  getCommunityDashboard,
  joinCommunity,
  approveMember,
  rejectMember,
} from "../api";
import { getApiErrorMessage } from "@/constants/constants";
import {
  requireClientAuth,
  isUnauthorizedError,
  redirectToLogin,
} from "@/constants/authProxy";
import type {
  CommunityItem,
  MembershipStatus,
  CommunityDashboard,
} from "../types";
import CommunityDetail from "../components/detail";

export default function CommunityDetailPage() {
  const router = useRouter();
  const params = useParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const communityId = rawId ? Number(rawId) : NaN;

  const [community, setCommunity] = useState<CommunityItem | null>(null);
  const [membershipStatus, setMembershipStatus] =
    useState<MembershipStatus>(null);
  const [dashboard, setDashboard] = useState<CommunityDashboard | null>(null);
  const [isLeader, setIsLeader] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!Number.isFinite(communityId)) {
      setIsLoading(false);
      return;
    }
    if (!requireClientAuth(router)) return;

    setIsLoading(true);
    setError(null);
    try {
      // Fetch basic community info + membership status
      const { community: c, membershipStatus: status } =
        await getCommunityById(communityId);
      setCommunity(c);
      setMembershipStatus(status);

      // Fetch dashboard only for approved members
      if (status === "approved") {
        try {
          const dash = await getCommunityDashboard(communityId);
          setDashboard(dash);
          setIsLeader(dash.isLeader);
        } catch {
          // Dashboard access denied (shouldn't happen since status=approved)
        }
      }
    } catch (err) {
      if (isUnauthorizedError(err)) {
        redirectToLogin(router);
        return;
      }
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [communityId, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleJoin(id: number) {
    if (isJoining) return;
    setIsJoining(true);
    setError(null);
    try {
      await joinCommunity(id);
      setMembershipStatus("pending");
    } catch (err) {
      if (isUnauthorizedError(err)) {
        redirectToLogin(router);
        return;
      }
      setError(getApiErrorMessage(err));
    } finally {
      setIsJoining(false);
    }
  }

  async function handleApproveMember(cId: number, userId: number) {
    try {
      await approveMember(cId, userId);
      // Refresh dashboard to get updated members/pending list
      const dash = await getCommunityDashboard(cId);
      setDashboard(dash);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  async function handleRejectMember(cId: number, userId: number) {
    try {
      await rejectMember(cId, userId);
      const dash = await getCommunityDashboard(cId);
      setDashboard(dash);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-indigo-400">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm font-black uppercase tracking-widest">
            Loading…
          </span>
        </div>
      </div>
    );
  }

  if (!Number.isFinite(communityId) || (!community && !isLoading)) {
    return (
      <div className="mx-auto max-w-6xl py-10 px-4">
        <div className="rounded-4xl border border-white/60 bg-white/70 p-8 text-center shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
          <p className="text-lg font-black text-indigo-950">
            {error ?? "Community not found"}
          </p>
          <button
            type="button"
            onClick={() => router.push("/comunity")}
            className="mt-6 cursor-pointer rounded-2xl bg-indigo-950 px-6 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:bg-indigo-800"
          >
            Back to Communities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto max-w-6xl">
        {error && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-rose-600">
            {error}
          </div>
        )}
        {community && (
          <CommunityDetail
            community={community}
            membershipStatus={membershipStatus}
            dashboard={dashboard}
            isLeader={isLeader}
            isJoining={isJoining}
            onBack={() => router.push("/comunity")}
            onJoin={handleJoin}
            onApproveMember={handleApproveMember}
            onRejectMember={handleRejectMember}
          />
        )}
      </div>
    </div>
  );
}
