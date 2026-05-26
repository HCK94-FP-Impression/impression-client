"use client";

import { Users, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import type { CommunityItem, MembershipStatus } from "../types";
import { DOMAIN_META, DOMAIN_META_DARK } from "../data";

type Props = {
  communities: CommunityItem[];
  memberships: Record<number, MembershipStatus>;
  onViewDetail: (id: number) => void;
};

export default function MyCommunity({ communities, memberships, onViewDetail }: Props) {
  const myCommunities = communities.filter(
    (c) => memberships[c.id] === "approved" || memberships[c.id] === "pending",
  );

  if (myCommunities.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <Users size={40} className="text-indigo-400/30" />
        <p className="text-base font-black text-indigo-400/50">No communities yet</p>
        <p className="text-xs font-medium text-indigo-400/30">
          Explore and join communities to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {myCommunities.map((c) => {
        const status = memberships[c.id];
        const isLeader = false; // determined per-community only on detail page
        const domain = isLeader
          ? (DOMAIN_META_DARK[c.domain] ?? { label: c.domain, pill: "border-gray-500/30 bg-gray-500/10 text-gray-400" })
          : (DOMAIN_META[c.domain] ?? { label: c.domain, pill: "border-gray-200 bg-gray-100 text-gray-500" });

        return (
          <div
            key={c.id}
            className="flex flex-col rounded-4xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-2xl"
          >
            {/* Domain + status badges */}
            <div className="mb-4 flex items-start justify-between gap-2">
              <span
                className={`rounded-xl border px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] ${domain.pill}`}
              >
                {domain.label}
              </span>
              <div className="flex flex-wrap justify-end gap-1.5">
                {status === "pending" && (
                  <span className="inline-flex items-center gap-1 rounded-xl border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-amber-600">
                    <Clock size={9} /> Pending
                  </span>
                )}
                {status === "approved" && (
                  <span className="inline-flex items-center gap-1 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-emerald-600">
                    <CheckCircle2 size={9} /> Member
                  </span>
                )}
              </div>
            </div>

            <h3 className="mb-2 text-base font-black leading-tight tracking-tight text-gray-900">
              {c.name}
            </h3>
            <p className="mb-5 flex-1 line-clamp-2 text-xs font-medium leading-5 text-gray-500">
              {c.description}
            </p>

            <div className="mb-5 flex items-center gap-4 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-1.5">
                <Users size={11} className="text-gray-400" />
                <span className="text-[11px] font-bold text-gray-600">
                  {c.memberCount} members
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">by</span>
                <span className="text-[11px] font-black text-indigo-600">
                  @{c.leader.username}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onViewDetail(c.id)}
              className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-gray-200 bg-white py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-600 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-600"
            >
              View Detail <ArrowRight size={11} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
