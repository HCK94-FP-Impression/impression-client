"use client";

import {
  ArrowLeft,
  Users,
  Crown,
  Loader2,
  CheckCircle2,
  Clock,
  Trophy,
  TrendingUp,
} from "lucide-react";
import type {
  CommunityItem,
  MembershipStatus,
  CommunityDashboard,
} from "../types";
import { DOMAIN_META_DARK } from "../data";
import PendingApprovalQueue from "./PendingApprovalQueue";
import ForumPanel from "./ForumPanel";

type Props = {
  community: CommunityItem;
  membershipStatus: MembershipStatus;
  dashboard: CommunityDashboard | null;
  isLeader: boolean;
  isJoining?: boolean;
  onBack: () => void;
  onJoin: (id: number) => void;
  onApproveMember: (communityId: number, userId: number) => void;
  onRejectMember: (communityId: number, userId: number) => void;
};

export default function CommunityDetail({
  community,
  membershipStatus,
  dashboard,
  isLeader,
  isJoining = false,
  onBack,
  onJoin,
  onApproveMember,
  onRejectMember,
}: Props) {
  const domain = DOMAIN_META_DARK[community.domain] ?? {
    label: community.domain,
    pill: "border-gray-500/30 bg-gray-500/10 text-gray-400",
  };

  const approvedMembers = dashboard?.community.CommunityMembers ?? [];
  const pendingMembers = dashboard?.pendingMembers ?? [];

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex cursor-pointer items-center gap-2 text-[11px] font-black uppercase tracking-widest text-indigo-950 transition-colors hover:text-indigo-400"
      >
        <ArrowLeft size={12} /> Back to Communities
      </button>

      {/* Hero card */}
      <div className="rounded-4xl border border-indigo-900/40 bg-indigo-950 p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-xl border px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] ${domain.pill}`}
            >
              {domain.label}
            </span>
            {isLeader && (
              <span className="inline-flex items-center gap-1 rounded-xl border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-amber-400">
                <Crown size={9} /> Your Community
              </span>
            )}
          </div>

          {membershipStatus === null && (
            <button
              type="button"
              onClick={() => onJoin(community.id)}
              disabled={isJoining}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-2xl bg-white px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-indigo-950 transition-all hover:-translate-y-0.5 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isJoining && <Loader2 size={11} className="animate-spin" />}
              Join Community
            </button>
          )}
          {membershipStatus === "pending" && (
            <div className="inline-flex items-center gap-1.5 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-amber-400">
              <Loader2 size={11} className="animate-spin" /> Request Pending
            </div>
          )}
          {membershipStatus === "approved" && (
            <div className="inline-flex items-center gap-1.5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-emerald-400">
              <CheckCircle2 size={11} /> Member
            </div>
          )}
        </div>

        <h1 className="mb-3 text-2xl font-black tracking-tight text-white">
          {community.name}
        </h1>
        <p className="mb-6 text-sm font-medium leading-6 text-indigo-300/70">
          {community.description}
        </p>

        <div className="flex items-center gap-6 border-t border-indigo-900/40 pt-5">
          <div className="flex items-center gap-2">
            <Users size={13} className="text-indigo-400" />
            <span className="text-[11px] font-bold text-indigo-300">
              {community.memberCount} members
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-400/60">
              led by
            </span>
            <span className="text-[11px] font-black text-indigo-300">
              @{community.leader.username}
            </span>
          </div>
        </div>
      </div>

      {/* Pending — waiting for approval */}
      {membershipStatus === "pending" && !dashboard && (
        <div className="flex flex-col items-center gap-4 rounded-4xl border border-amber-400/20 bg-amber-400/5 py-16 text-center">
          <Clock size={32} className="text-amber-400/50" />
          <div>
            <p className="text-base font-black text-amber-400">
              Waiting for Approval
            </p>
            <p className="mt-1 text-xs font-medium text-amber-400/60">
              The community leader will review your request shortly.
            </p>
          </div>
        </div>
      )}

      {/* Dashboard — approved members + leader */}
      {dashboard && (
        <div className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              {
                label: "Total Members",
                value: dashboard.statistics.totalMembers,
              },
              { label: "Total Posts", value: dashboard.statistics.totalPosts },
              {
                label: "Avg Social Score",
                value: dashboard.statistics.avgSocialScore.toFixed(2),
              },
              {
                label: "Avg Pro Score",
                value: dashboard.statistics.avgProfessionalScore.toFixed(2),
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-indigo-900/40 bg-indigo-950 p-5 text-center"
              >
                <p className="mb-1 text-xl font-black text-white">
                  {stat.value}
                </p>
                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Leader: pending approval queue */}
          {isLeader && pendingMembers.length > 0 && (
            <PendingApprovalQueue
              title="Pending Requests"
              items={pendingMembers.map((m) => ({
                id: m.id,
                userId: m.userId,
                username: m.User?.username ?? "Unknown",
                communityId: community.id,
              }))}
              tone="amber"
              onApprove={onApproveMember}
              onReject={onRejectMember}
            />
          )}

          {/* Leaderboard */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Social */}
            <div className="rounded-4xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-2xl">
              <div className="mb-4 flex items-center gap-2">
                <Trophy size={13} className="text-indigo-500" />
                <h2 className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
                  Social Leaderboard
                </h2>
              </div>
              {dashboard.leaderboard.social.length === 0 ? (
                <p className="text-xs font-medium text-gray-400">
                  No data yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {dashboard.leaderboard.social.map((entry, i) => (
                    <div
                      key={entry.userId}
                      className="flex items-center gap-3 rounded-2xl bg-gray-50/80 px-4 py-3"
                    >
                      <span className="w-5 text-center text-[10px] font-black text-gray-400">
                        {i === 0
                          ? "🥇"
                          : i === 1
                            ? "🥈"
                            : i === 2
                              ? "🥉"
                              : `${i + 1}`}
                      </span>
                      <span className="flex-1 text-[11px] font-black text-gray-800">
                        @{entry.username}
                      </span>
                      <span className="text-[11px] font-black text-indigo-600">
                        {entry.averageScore.toFixed(2)}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400">
                        {entry.totalRatings} ratings
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Professional */}
            <div className="rounded-4xl border border-indigo-900/40 bg-indigo-950 p-6">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp size={13} className="text-indigo-400" />
                <h2 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                  Professional Leaderboard
                </h2>
              </div>
              {dashboard.leaderboard.professional.length === 0 ? (
                <p className="text-xs font-medium text-indigo-400/40">
                  No data yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {dashboard.leaderboard.professional.map((entry, i) => (
                    <div
                      key={entry.userId}
                      className="flex items-center gap-3 rounded-2xl bg-indigo-900/40 px-4 py-3"
                    >
                      <span className="w-5 text-center text-[10px] font-black text-indigo-400/60">
                        {i === 0
                          ? "🥇"
                          : i === 1
                            ? "🥈"
                            : i === 2
                              ? "🥉"
                              : `${i + 1}`}
                      </span>
                      <span className="flex-1 text-[11px] font-black text-white">
                        @{entry.username}
                      </span>
                      <span className="text-[11px] font-black text-cyan-400">
                        {entry.averageScore.toFixed(2)}
                      </span>
                      <span className="text-[9px] font-bold text-indigo-400/60">
                        {entry.totalRatings} ratings
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Approved Members */}
          <div className="rounded-4xl border border-indigo-900/40 bg-indigo-950 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Users size={13} className="text-indigo-400" />
              <h2 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                Members ({approvedMembers.length})
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {approvedMembers.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 rounded-2xl bg-indigo-900/40 px-4 py-3"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-800 text-[10px] font-black text-indigo-200">
                    {(m.User?.username ?? "?")[0].toUpperCase()}
                  </div>
                  <span className="truncate text-[11px] font-bold text-indigo-200">
                    @{m.User?.username ?? "Unknown"}
                  </span>
                  {m.userId === community.leaderId && (
                    <Crown size={9} className="shrink-0 text-amber-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Forum */}
          <ForumPanel communityId={community.id} />
        </div>
      )}
    </div>
  );
}
