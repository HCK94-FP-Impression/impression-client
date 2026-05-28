"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Compass, BookMarked, Loader2, RefreshCw } from "lucide-react";
import { getCommunities, getCommunityById, joinCommunity } from "./api";
import { getApiErrorMessage } from "@/constants/constants";
import {
  requireClientAuth,
  isUnauthorizedError,
  redirectToLogin,
} from "@/constants/authProxy";
import type { CommunityItem, MembershipStatus } from "./types";
import CommunityExplore from "./components/list";
import MyCommunity from "./components/MyCommunity";

type Tab = "explore" | "mine";

export default function CommunityPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("explore");
  const [communities, setCommunities] = useState<CommunityItem[]>([]);
  const [memberships, setMemberships] = useState<
    Record<number, MembershipStatus>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCommunities = useCallback(async () => {
    if (!requireClientAuth(router)) return;
    setIsLoading(true);
    setError(null);
    try {
      const { communities: list } = await getCommunities();
      setCommunities(list);

      // Fetch membership status for all communities in parallel
      const statuses = await Promise.all(
        list.map((c) =>
          getCommunityById(c.id)
            .then((res) => ({ id: c.id, status: res.membershipStatus }))
            .catch(() => ({ id: c.id, status: null as MembershipStatus })),
        ),
      );
      const statusMap: Record<number, MembershipStatus> = {};
      for (const { id, status } of statuses) statusMap[id] = status;
      setMemberships(statusMap);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        redirectToLogin(router);
        return;
      }
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadCommunities();
  }, [loadCommunities]);

  async function handleJoin(id: number) {
    if (joiningId) return;
    setJoiningId(id);
    setError(null);
    try {
      await joinCommunity(id);
      setMemberships((prev) => ({ ...prev, [id]: "pending" }));
    } catch (err) {
      if (isUnauthorizedError(err)) {
        redirectToLogin(router);
        return;
      }
      setError(getApiErrorMessage(err));
    } finally {
      setJoiningId(null);
    }
  }

  function handleViewDetail(id: number) {
    router.push(`/comunity/${id}`);
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-indigo-400">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm font-black uppercase tracking-widest">
            Loading communities…
          </span>
        </div>
      </div>
    );
  }

  if (error && communities.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-sm font-black uppercase tracking-widest text-rose-500">
          {error}
        </p>
        <button
          type="button"
          onClick={loadCommunities}
          className="flex cursor-pointer items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-[11px] font-black uppercase tracking-widest text-gray-600 hover:border-indigo-200 hover:text-indigo-600"
        >
          <RefreshCw size={13} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-indigo-950">
            Communities
          </h1>
          <p className="mt-1 text-sm font-medium text-indigo-400">
            Join communities, connect with peers, and grow together.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-rose-600">
            {error}
          </div>
        )}

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
              className={`flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all ${
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
            communities={communities}
            memberships={memberships}
            joiningId={joiningId}
            onJoin={handleJoin}
            onViewDetail={handleViewDetail}
          />
        )}

        {tab === "mine" && (
          <MyCommunity
            communities={communities}
            memberships={memberships}
            onViewDetail={handleViewDetail}
          />
        )}
      </div>
    </div>
  );
}
