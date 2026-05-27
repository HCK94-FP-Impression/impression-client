"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, LogOut, Zap } from "lucide-react";
import { clearAuthSession, hasClientAuthSession } from "@/constants/authProxy";
import { getCurrentUser } from "@/api/user";
import type { CurrentUser } from "@/api/user";

const navLinkClassName = (pathname: string, href: string, exact = false) => {
  const isActive = exact ? pathname === href : pathname.startsWith(href);
  return `flex items-center gap-2 rounded-xl px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all duration-300 ease-out ${
    isActive
      ? "bg-indigo-950 text-white shadow-lg shadow-indigo-900/20"
      : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
  }`;
};

const appName = "Impression";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authenticated = hasClientAuthSession();
    setIsAuthenticated(authenticated);
    if (!authenticated) return;
    getCurrentUser()
      .then(setUser)
      .catch(() => {});
  }, []);

  function handleLogout() {
    clearAuthSession();
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/40 backdrop-blur-2xl shadow-sm shadow-slate-900/5">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950 text-white transition-transform group-hover:rotate-12">
            <Zap size={20} fill="currentColor" />
          </div>

          <div className="hidden sm:block">
            <p className="text-lg font-black uppercase tracking-tighter text-gray-900">
              {appName}
            </p>

            <p className="leading-none text-[9px] font-black uppercase tracking-[0.3em] text-indigo-500/90">
              Impression For Jobs
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="hidden items-center rounded-2xl border border-gray-200/50 bg-gray-100/50 p-1 md:flex">
            <Link href="/" className={navLinkClassName(pathname, "/", true)}>
              Home
            </Link>

            <Link href="/feed" className={navLinkClassName(pathname, "/feed")}>
              Feed
            </Link>

            <Link
              href="/profile"
              className={navLinkClassName(pathname, "/profile")}
            >
              Profile
            </Link>
          </nav>

          <div className="hidden h-6 w-px bg-gray-200 md:block" />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Quota */}
              <div className="hidden items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 sm:flex">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                  <Zap size={10} fill="currentColor" />
                </div>

                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700">
                  {user?.quota ?? "—"} Quota
                </span>
              </div>

              {/* Community */}
              <Link
                href="/comunity"
                className="flex items-center gap-2 rounded-xl bg-indigo-950 px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-900/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-900"
              >
                Comunity
                <ArrowUpRight size={14} />
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl cursor-pointer p-2.5 text-gray-700 transition-colors hover:bg-rose-50 hover:text-rose-600"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-[11px] font-black uppercase tracking-widest text-gray-600 transition-colors hover:text-indigo-600"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-indigo-950 px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-900/20 transition-all hover:scale-105"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
