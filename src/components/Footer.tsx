"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // dummy UI data
  const appName = "Impression";

  return (
    <footer className="mt-auto border-t border-white/80 bg-white/40 backdrop-blur-2xl">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          
          {/* Branding */}
          <div className="space-y-2">
            <p className="text-sm font-black uppercase tracking-tighter text-gray-900">
              {appName}
            </p>

            <p className="max-w-xs text-[10px] font-bold uppercase tracking-widest leading-relaxed text-gray-400">
              Profile impression feedback loop. Built for measurable personal
              branding.
            </p>
          </div>

          {/* Status & Credits */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center md:gap-8">
            
            {/* System Status */}
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">
                System Status
              </p>

              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                <p className="text-[11px] font-bold text-gray-700">
                  All Systems Operational
                </p>
              </div>
            </div>

            <div className="hidden h-10 w-px bg-gray-200 sm:block" />

            {/* Copyright */}
            <div className="text-left sm:text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                © {currentYear} {appName}
              </p>

              <p className="text-[11px] font-bold text-gray-700">
                Jakarta, Indonesia
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}