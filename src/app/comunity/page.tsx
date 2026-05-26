"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, BookMarked } from "lucide-react";
import {
  COMMUNITIES,
  INITIAL_MEMBERSHIPS,
  COMMUNITY_DETAILS,
  CURRENT_USER,
  type MembershipStatus,
  type CommunityDetailData,
  type CommunityMember,
} from "./data";
import CommunityExplore from "./components/list";
import MyCommunity from "./components/MyCommunity";

type Tab = "explore" | "mine";

export default function CommunityPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("explore");
  const [memberships, setMemberships] =
    useState<Record<number, MembershipStatus>>(INITIAL_MEMBERSHIPS);
  const [communityDetails, setCommunityDetails] = useState<Record<number, CommunityDetailData>>(COMMUNITY_DETAILS);

  function handleJoin(id: number) {
    setMemberships((prev) => ({ ...prev, [id]: "pending" }));
    setCommunityDetails((prev) => {
      const detail = prev[id];
      if (!detail) return prev;
      const alreadyMember = detail.members.some((m) => m.userId === CURRENT_USER.id);
      if (alreadyMember) return prev;
      const newMember: CommunityMember = {
        id: Date.now(),
        userId: CURRENT_USER.id,
        status: "pending",
        user: { id: CURRENT_USER.id, username: CURRENT_USER.username },
      };
      return { ...prev, [id]: { ...detail, members: [...detail.members, newMember] } };
    });
  }

  function handleApproveMember(communityId: number, userId: number) {
    setCommunityDetails((prev) => {
      const detail = prev[communityId];
      if (!detail) return prev;
      return {
        ...prev,
        [communityId]: {
          ...detail,
          members: detail.members.map((m) =>
            m.userId === userId ? { ...m, status: "approved" as const } : m
          ),
          statistics: {
            ...detail.statistics,
            totalMembers: detail.statistics.totalMembers + 1,
          },
        },
      };
    });
    if (userId === CURRENT_USER.id) {
      setMemberships((prev) => ({ ...prev, [communityId]: "approved" }));
    }
  }

  function handleRejectMember(communityId: number, userId: number) {
    setCommunityDetails((prev) => {
      const detail = prev[communityId];
      if (!detail) return prev;
      return {
        ...prev,
        [communityId]: {
          ...detail,
          members: detail.members.filter((m) => m.userId !== userId),
        },
      };
    });
    if (userId === CURRENT_USER.id) {
      setMemberships((prev) => ({ ...prev, [communityId]: "none" }));
    }
  }

  function handleViewDetail(id: number) {
    router.push(`/comunity/${id}`);
  }

  return (
    <div >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-indigo-950">
            Communities
          </h1>
          <p className="mt-1 text-sm font-medium text-indigo-400">
            Join communities, connect with peers, and grow together.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="mb-6 inline-flex rounded-2xl border border-white/60 bg-white/70 p-1 shadow-lg shadow-slate-900/5 backdrop-blur-2xl">
          {(
            [
              { key: "explore", label: "Explore", icon: Compass },
              { key: "mine", label: "My Communities", icon: BookMarked },
            ] as { key: Tab; label: string; icon: React.ElementType }[]
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all ${
                tab === key
                  ? "bg-indigo-950 text-white shadow-sm"
                  : "text-gray-500 hover:text-indigo-700"
              }`}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>

        {tab === "explore" && (
          <CommunityExplore
            communities={COMMUNITIES}
            memberships={memberships}
            onJoin={handleJoin}
            onViewDetail={handleViewDetail}
          />
        )}

        {tab === "mine" && (
          <MyCommunity
            communities={COMMUNITIES}
            memberships={memberships}
            communityDetails={communityDetails}
            onViewDetail={handleViewDetail}
            onApproveMember={handleApproveMember}
            onRejectMember={handleRejectMember}
          />
        )}
      </div>
    </div>
  );
}
