"use client";

import { Crown, Users, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import type { Community, MembershipStatus, CommunityDetailData } from "../data";
import { DOMAIN_META, DOMAIN_META_DARK, CURRENT_USER } from "../data";
import PendingApprovalQueue from "./PendingApprovalQueue";

type Props = {
  communities: Community[];
  memberships: Record<number, MembershipStatus>;
  communityDetails: Record<number, CommunityDetailData>;
  onViewDetail: (id: number) => void;
  onApproveMember: (communityId: number, userId: number) => void;
  onRejectMember: (communityId: number, userId: number) => void;
};

export default function MyCommunity({
  communities,
  memberships,
  communityDetails,
  onViewDetail,
  onApproveMember,
  onRejectMember,
}: Props) {
  const myCommunities = communities.filter(
    (c) => memberships[c.id] === "approved" || memberships[c.id] === "pending",
  );
  const ledCommunities = communities.filter(
    (c) => c.leaderId === CURRENT_USER.id,
  );

  const allPending = ledCommunities.flatMap((c) => {
    const detail = communityDetails[c.id];
    if (!detail) return [];
    return detail.members
      .filter((m) => m.status === "pending")
      .map((m) => ({ ...m, community: c }));
  });

  if (myCommunities.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <Users size={40} className="text-indigo-400/30" />
        <p className="text-base font-black text-indigo-400/50">
          No communities yet
        </p>
        <p className="text-xs font-medium text-indigo-400/30">
          Explore and join communities to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Leader pending approval queue */}
      <PendingApprovalQueue
        title="Pending Approval"
        items={allPending.map((m) => ({
          id: `${m.community.id}-${m.userId}`,
          userId: m.userId,
          username: m.user.username,
          communityId: m.community.id,
          communityName: m.community.name,
        }))}
        tone="indigo"
        onApprove={onApproveMember}
        onReject={onRejectMember}
      />

      {/* My community cards */}
      <div>
        <h2 className="mb-4 text-[10px] font-black uppercase tracking-widest text-indigo-400/60">
          My Communities ({myCommunities.length})
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {myCommunities.map((c) => {
            const status = memberships[c.id];
            const isLeader = c.leaderId === CURRENT_USER.id;
            const domain =
              status === "approved" && isLeader
                ? (DOMAIN_META_DARK[c.domain] ?? {
                    label: c.domain,
                    pill: "border-gray-500/30 bg-gray-500/10 text-gray-400",
                  })
                : (DOMAIN_META[c.domain] ?? {
                    label: c.domain,
                    pill: "border-gray-200 bg-gray-100 text-gray-500",
                  });

            const cardBase = isLeader
              ? "flex flex-col rounded-4xl border border-indigo-900/40 bg-indigo-950 p-6 shadow-xl shadow-slate-900/10"
              : "flex flex-col rounded-4xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-2xl";

            const nameColor = isLeader ? "text-white" : "text-gray-900";
            const descColor = isLeader ? "text-indigo-300/70" : "text-gray-500";
            const metaColor = isLeader ? "text-indigo-300" : "text-gray-600";
            const metaIconColor = isLeader
              ? "text-indigo-400"
              : "text-gray-400";
            const dividerColor = isLeader
              ? "border-indigo-900/40"
              : "border-gray-100";
            const leaderTextColor = isLeader
              ? "text-indigo-400"
              : "text-indigo-600";

            return (
              <div key={c.id} className={cardBase}>
                {/* Domain + badges */}
                <div className="mb-4 flex items-start justify-between gap-2">
                  <span
                    className={`rounded-xl border px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] ${domain.pill}`}
                  >
                    {domain.label}
                  </span>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {isLeader && (
                      <span className="inline-flex items-center gap-1 rounded-xl border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-amber-400">
                        <Crown size={9} /> Leader
                      </span>
                    )}
                    {status === "pending" && (
                      <span className="inline-flex items-center gap-1 rounded-xl border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-amber-600">
                        <Clock size={9} /> Pending
                      </span>
                    )}
                    {status === "approved" && !isLeader && (
                      <span className="inline-flex items-center gap-1 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-emerald-600">
                        <CheckCircle2 size={9} /> Member
                      </span>
                    )}
                  </div>
                </div>

                <h3
                  className={`mb-2 text-base font-black leading-tight tracking-tight ${nameColor}`}
                >
                  {c.name}
                </h3>
                <p
                  className={`mb-5 flex-1 line-clamp-2 text-xs font-medium leading-5 ${descColor}`}
                >
                  {c.description}
                </p>

                <div
                  className={`mb-5 flex items-center gap-4 border-t pt-4 ${dividerColor}`}
                >
                  <div className="flex items-center gap-1.5">
                    <Users size={11} className={metaIconColor} />
                    <span className={`text-[11px] font-bold ${metaColor}`}>
                      {c.memberCount} members
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-widest ${isLeader ? "text-indigo-400/60" : "text-gray-400"}`}
                    >
                      by
                    </span>
                    <span
                      className={`text-[11px] font-black ${leaderTextColor}`}
                    >
                      @{c.leader.username}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onViewDetail(c.id)}
                  className={`flex w-full items-center justify-center gap-1.5 rounded-2xl py-2.5 text-[11px] font-black uppercase tracking-widest transition-all hover:-translate-y-0.5 ${
                    isLeader
                      ? "bg-white text-indigo-950 hover:bg-indigo-100"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-indigo-200 hover:text-indigo-600"
                  }`}
                >
                  View Detail <ArrowRight size={11} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
