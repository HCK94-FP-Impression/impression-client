"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogIn, ShieldAlert } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { hasClientAuthSession } from "@/constants/authProxy";

type LayoutShellProps = {
  children: React.ReactNode;
};

const HIDE_NAV_FOOTER_PATHS = new Set(["/login", "/register"]);
const PUBLIC_PATHS = new Set(["/", "/login", "/register"]);

export default function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const hideNavFooter = HIDE_NAV_FOOTER_PATHS.has(pathname);

  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (PUBLIC_PATHS.has(pathname) || hasClientAuthSession()) {
      setBlocked(false);
      return;
    }
    setBlocked(true);
  }, [pathname]);

  if (blocked) {
    const loginUrl = `/login?from=${encodeURIComponent(pathname)}`;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="flex max-w-sm flex-col items-center gap-6 rounded-4xl border border-indigo-100 bg-white/90 px-8 py-10 text-center shadow-xl backdrop-blur-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
            <ShieldAlert size={26} className="text-indigo-500" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-gray-900">
              Login Required
            </p>
            <p className="mt-2 text-xs font-medium leading-5 text-gray-400">
              You need to sign in to access this page.
            </p>
          </div>
          <Link
            href={loginUrl}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-950 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:bg-indigo-800"
          >
            <LogIn size={13} />
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {!hideNavFooter && <Navbar />}
      <main className={hideNavFooter ? "flex-1" : "relative z-10 flex-1"}>
        {hideNavFooter ? (
          children
        ) : (
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
            {children}
          </div>
        )}
      </main>
      {!hideNavFooter && <Footer />}
    </>
  );
}
