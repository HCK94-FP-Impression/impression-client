import type { ComponentType, ReactNode } from "react";

type AuthSplitLayoutProps = {
  accentIcon?: ComponentType<{ size?: number; className?: string }>;
  leftBadge: string;
  leftTitle: ReactNode;
  leftDescription: ReactNode;
  highlights?: Array<{ icon: ReactNode; text: string }>;
  rightTitle: ReactNode;
  rightSubtitle: ReactNode;
  footer?: ReactNode;
  footerClassName?: string;
  children: ReactNode;
};

export default function AuthSplitLayout({
  accentIcon: AccentIcon,
  leftBadge,
  leftTitle,
  leftDescription,
  highlights = [],
  rightTitle,
  rightSubtitle,
  footer,
  footerClassName = "mt-12 border-t border-gray-100 pt-8 text-center space-y-4",
  children,
}: AuthSplitLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent px-4 py-8">
      <div className="relative z-10 mx-auto grid w-full max-w-5xl items-stretch overflow-hidden rounded-[2.5rem] border border-white/50 shadow-2xl md:grid-cols-2">
        <div className="relative flex flex-col justify-center overflow-hidden bg-indigo-950 p-10 md:p-16">
          {AccentIcon ? (
            <div className="absolute -right-10 top-0 opacity-5 text-white">
              <AccentIcon size={300} />
            </div>
          ) : null}

          <div className="relative z-10">
            <span className="inline-block rounded-full border border-indigo-400/30 bg-indigo-900/50 px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100 shadow-lg">
              {leftBadge}
            </span>
            <h2 className="mt-8 font-heading text-4xl font-black uppercase leading-[1.1] tracking-tighter text-white md:text-5xl">
              {leftTitle}
            </h2>
            <p className="mt-6 max-w-sm text-base font-medium leading-relaxed text-indigo-200/60">
              {leftDescription}
            </p>

            <div className="mt-10 space-y-4">
              {highlights.map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-800 text-indigo-300">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100/80">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center border-l border-gray-100 bg-white/95 p-10 md:p-16">
          <header className="mb-10">
            <h3 className="font-heading text-3xl font-black uppercase tracking-tighter text-gray-900">
              {rightTitle}
            </h3>
            <p className="mt-2 text-[11px] font-black uppercase tracking-widest text-gray-400">
              {rightSubtitle}
            </p>
          </header>

          {children}

          {footer ? (
            <footer className={footerClassName}>{footer}</footer>
          ) : null}
        </div>
      </div>
    </div>
  );
}
