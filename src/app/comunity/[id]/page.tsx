"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  COMMUNITIES,
  INITIAL_MEMBERSHIPS,
  COMMUNITY_DETAILS,
  CURRENT_USER,
  type MembershipStatus,
  type CommunityDetailData,
  type CommunityMember,
} from "../data";
import CommunityDetail from "../components/detail";

export default function CommunityDetailPage() {
  const router = useRouter();
  const params = useParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const communityId = rawId ? Number(rawId) : NaN;
  const community = Number.isFinite(communityId)
    ? (COMMUNITIES.find((item) => item.id === communityId) ?? null)
    : null;

  const [memberships, setMemberships] =
    useState<Record<number, MembershipStatus>>(INITIAL_MEMBERSHIPS);
  const [communityDetails, setCommunityDetails] =
    useState<Record<number, CommunityDetailData>>(COMMUNITY_DETAILS);

  function handleJoin(id: number) {
    setMemberships((prev) => ({ ...prev, [id]: "pending" }));
    setCommunityDetails((prev) => {
      const detail = prev[id];
      if (!detail) return prev;
      const alreadyMember = detail.members.some(
        (m) => m.userId === CURRENT_USER.id,
      );
      if (alreadyMember) return prev;
      const newMember: CommunityMember = {
        id: Date.now(),
        userId: CURRENT_USER.id,
        status: "pending",
        user: { id: CURRENT_USER.id, username: CURRENT_USER.username },
      };
      return {
        ...prev,
        [id]: { ...detail, members: [...detail.members, newMember] },
      };
    });
  }

  function handleApproveMember(communityIdValue: number, userId: number) {
    setCommunityDetails((prev) => {
      const detail = prev[communityIdValue];
      if (!detail) return prev;
      return {
        ...prev,
        [communityIdValue]: {
          ...detail,
          members: detail.members.map((m) =>
            m.userId === userId ? { ...m, status: "approved" as const } : m,
          ),
          statistics: {
            ...detail.statistics,
            totalMembers: detail.statistics.totalMembers + 1,
          },
        },
      };
    });
    if (userId === CURRENT_USER.id) {
      setMemberships((prev) => ({ ...prev, [communityIdValue]: "approved" }));
    }
  }

  function handleRejectMember(communityIdValue: number, userId: number) {
    setCommunityDetails((prev) => {
      const detail = prev[communityIdValue];
      if (!detail) return prev;
      return {
        ...prev,
        [communityIdValue]: {
          ...detail,
          members: detail.members.filter((m) => m.userId !== userId),
        },
      };
    });
    if (userId === CURRENT_USER.id) {
      setMemberships((prev) => ({ ...prev, [communityIdValue]: "none" }));
    }
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50/60 to-slate-100 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-4xl border border-white/60 bg-white/70 p-8 text-center shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
            <p className="text-lg font-black text-indigo-950">
              Community not found
            </p>
            <p className="mt-2 text-sm font-medium text-slate-500">
              The community you are looking for does not exist.
            </p>
            <button
              type="button"
              onClick={() => router.push("/comunity")}
              className="mt-6 rounded-2xl bg-indigo-950 px-6 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:bg-indigo-800"
            >
              Back to Communities
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status = memberships[community.id] ?? "none";
  const isLeader = community.leaderId === CURRENT_USER.id;
  const canViewDetails = status === "approved" || isLeader;
  const detail = canViewDetails
    ? (communityDetails[community.id] ?? null)
    : null;

  return (
    <div>
      <div className="mx-auto max-w-6xl">
        <CommunityDetail
          community={community}
          status={status}
          detail={detail}
          onBack={() => router.push("/comunity")}
          onJoin={handleJoin}
          onApproveMember={handleApproveMember}
          onRejectMember={handleRejectMember}
        />
      </div>
    </div>
  );
}
