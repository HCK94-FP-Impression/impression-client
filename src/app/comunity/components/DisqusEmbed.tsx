"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    disqus_config?: () => void;
    DISQUS?: {
      reset: (opts: { reload: boolean; config: () => void }) => void;
    };
  }
}

type Props = {
  identifier: string;
  title: string;
};

const SHORTNAME = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME ?? "";

export default function DisqusEmbed({ identifier, title }: Props) {
  useEffect(() => {
    if (!SHORTNAME) return;

    function config(this: {
      page: { identifier: string; title: string; url: string };
    }) {
      this.page.url = window.location.href;
      this.page.identifier = identifier;
      this.page.title = title;
    }

    window.disqus_config = config;

    if (window.DISQUS) {
      window.DISQUS.reset({ reload: true, config });
    } else {
      const d = document;
      const s = d.createElement("script");
      s.src = `https://${SHORTNAME}.disqus.com/embed.js`;
      s.setAttribute("data-timestamp", String(+new Date()));
      (d.head || d.body).appendChild(s);
    }

    return () => {
      const thread = document.getElementById("disqus_thread");
      if (thread) thread.innerHTML = "";
      delete window.DISQUS;
    };
  }, [identifier, title]);

  if (!SHORTNAME) {
    return (
      <p className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
        Set NEXT_PUBLIC_DISQUS_SHORTNAME in .env
      </p>
    );
  }

  return (
    <>
      <div id="disqus_thread" />
      <noscript>
        Please enable JavaScript to view the{" "}
        <a href="https://disqus.com/?ref_noscript" className="underline">
          comments powered by Disqus.
        </a>
      </noscript>
    </>
  );
}
