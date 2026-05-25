"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

type LayoutShellProps = {
  children: React.ReactNode;
};

const HIDE_NAV_FOOTER_PATHS = new Set(["/login", "/register"]);

export default function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const hideNavFooter = HIDE_NAV_FOOTER_PATHS.has(pathname);

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
