"use client";

import { Users, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import type { CommunityItem, MembershipStatus } from "../types";
import { DOMAIN_META } from "../data";

type Props = {
  communities: CommunityItem[];
  memberships: Record<number, MembershipStatus>;
  joiningId?: number | null;
  onJoin: (id: number) => void;
  onViewDetail: (id: number) => void;
};

export default function CommunityExplore({
  communities,
  memberships,
  joiningId,
  onJoin,
  onViewDetail,
}: Props) {
  if (communities.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <Users size={40} className="text-indigo-400/30" />
        <p className="text-base font-black text-indigo-400/50">No communities found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {communities.map((c) => {
        const status = memberships[c.id] ?? null;
        const domain = DOMAIN_META[c.domain] ?? {
          label: c.domain,
          pill: "border-gray-200 bg-gray-100 text-gray-500",
        };

        return (
          <div
            key={c.id}
            className="group flex flex-col rounded-4xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-2xl transition-all duration-300 hover:shadow-2xl"
          >
            {/* Domain + Leader badge */}
            <div className="mb-4 flex items-start justify-between gap-2">
              <span
                className={`rounded-xl border px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] ${domain.pill}`}
              >
                {domain.label}
              </span>
            </div>

            {/* Name + Description */}
            <h3 className="mb-2 text-base font-black leading-tight tracking-tight text-gray-900">
              {c.name}
            </h3>
            <p className="mb-5 flex-1 line-clamp-2 text-xs font-medium leading-5 text-gray-500">
              {c.description}
            </p>

            {/* Meta */}
            <div className="mb-5 flex items-center gap-4 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-1.5">
                <Users size={11} className="text-gray-400" />
                <span className="text-[11px] font-bold text-gray-600">
                  {c.memberCount} members
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                  by
                </span>
                <span className="text-[11px] font-black text-indigo-600">
                  @{c.leader.username}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {status === null && (
                <button
                  type="button"
                  onClick={() => onJoin(c.id)}
                  disabled={joiningId === c.id}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-indigo-950 py-2.5 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {joiningId === c.id && <Loader2 size={11} className="animate-spin" />}
                  Join Community
                </button>
              )}
              {status === "pending" && (
                <div className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-amber-200 bg-amber-50 py-2.5 text-[11px] font-black uppercase tracking-widest text-amber-600">
                  <Loader2 size={11} className="animate-spin" /> Pending
                </div>
              )}
              {status === "approved" && (
                <div className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-emerald-200 bg-emerald-50 py-2.5 text-[11px] font-black uppercase tracking-widest text-emerald-600">
                  <CheckCircle2 size={11} /> Joined
                </div>
              )}

              <button
                type="button"
                onClick={() => onViewDetail(c.id)}
                className="flex items-center gap-1.5 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-600 transition-all hover:border-indigo-200 hover:text-indigo-600"
              >
                View <ArrowRight size={11} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
