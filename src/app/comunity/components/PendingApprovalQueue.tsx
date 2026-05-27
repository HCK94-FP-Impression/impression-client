"use client";

import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";

type Tone = "indigo" | "amber";

type PendingApprovalItem = {
  id: number | string;
  userId: number;
  username: string;
  communityId: number;
  communityName?: string;
};

type Props = {
  title: string;
  items: PendingApprovalItem[];
  tone?: Tone;
  onApprove: (communityId: number, userId: number) => void;
  onReject: (communityId: number, userId: number) => void;
};

const TONE_STYLES: Record<
  Tone,
  {
    container: string;
    icon: string;
    title: string;
    row: string;
    avatar: string;
    username: string;
    community: string;
  }
> = {
  indigo: {
    container: "rounded-4xl border border-indigo-200/60 bg-indigo-50/70 p-6",
    icon: "text-indigo-500",
    title: "text-indigo-500",
    row: "border border-indigo-200/60 bg-white/80",
    avatar: "bg-indigo-100 text-indigo-600",
    username: "text-gray-900",
    community: "text-indigo-500/70",
  },
  amber: {
    container: "rounded-4xl border border-amber-200/60 bg-amber-50/70 p-6",
    icon: "text-amber-500",
    title: "text-amber-500",
    row: "border border-amber-200/60 bg-white/80",
    avatar: "bg-amber-100 text-amber-600",
    username: "text-gray-900",
    community: "text-amber-500/70",
  },
};

export default function PendingApprovalQueue({
  title,
  items,
  tone = "indigo",
  onApprove,
  onReject,
}: Props) {
  if (items.length === 0) return null;
  const styles = TONE_STYLES[tone];

  return (
    <div className={styles.container}>
      <div className="mb-4 flex items-center gap-2">
        <ShieldCheck size={14} className={styles.icon} />
        <h2
          className={`text-xs font-black uppercase tracking-widest ${styles.title}`}
        >
          {title} ({items.length})
        </h2>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl px-5 py-3.5 ${styles.row}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-black ${styles.avatar}`}
              >
                {item.username[0].toUpperCase()}
              </div>
              <div>
                <p className={`text-[12px] font-black ${styles.username}`}>
                  @{item.username}
                </p>
                {item.communityName && (
                  <p
                    className={`text-[9px] font-bold uppercase tracking-widest ${styles.community}`}
                  >
                    {item.communityName}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onApprove(item.communityId, item.userId)}
                className="flex cursor-pointer items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400 transition-all hover:bg-emerald-500/20"
              >
                <CheckCircle2 size={10} /> Approve
              </button>
              <button
                type="button"
                onClick={() => onReject(item.communityId, item.userId)}
                className="flex cursor-pointer items-center gap-1 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-red-400 transition-all hover:bg-red-500/20"
              >
                <XCircle size={10} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
