"use client";

import Link from "next/link";
import { WandSparkles, X } from "lucide-react";
import { useState } from "react";

export default function NoPostBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-4">
      <div className="flex items-center gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-300/40 bg-indigo-100">
          <WandSparkles size={16} className="text-indigo-600" />
        </div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-indigo-800">
            No profile yet
          </p>
          <p className="mt-0.5 text-[10px] font-medium text-indigo-600/70">
            Create your profile in Studio to get rated by the community and appear in the feed.
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/studio"
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-950 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:bg-indigo-800"
        >
          <WandSparkles size={11} />
          Studio
        </Link>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-indigo-400 transition-colors hover:bg-indigo-100 hover:text-indigo-700"
          aria-label="Tutup"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
