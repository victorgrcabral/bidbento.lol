"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Language } from "@/lib/i18n";

interface LiveStatsPillProps {
  language?: Language;
  className?: string;
}

export const LiveStatsPill: React.FC<LiveStatsPillProps> = ({
  language = "en",
  className = "",
}) => {
  const [stats, setStats] = useState({ liveOnline: 0, totalVisitors: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const response = await fetch("/api/stats", { cache: "no-store" });
      if (response.ok) setStats(await response.json());
    };

    void loadStats();
    const interval = window.setInterval(() => void loadStats(), 15_000);
    return () => window.clearInterval(interval);
  }, []);

  const labels = {
    en: { online: "online", visitors: "visitors since launch", stats: "see stats" },
    es: { online: "online", visitors: "visitantes desde el inicio", stats: "ver stats" },
    pt: { online: "online", visitors: "visitantes desde o lançamento", stats: "ver stats" },
  }[language];

  return (
    <Link
      href="/stats"
      className={`inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-3 py-2 text-xs font-medium text-zinc-300 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-emerald-500/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 active:scale-[0.98] ${className}`}
    >
      <span className="flex items-center gap-1 text-emerald-400">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        {stats.liveOnline.toLocaleString()} {labels.online}
      </span>
      <span className="font-mono text-zinc-400">
        {stats.totalVisitors.toLocaleString()} {labels.visitors}
      </span>
      <span className="font-semibold text-zinc-300">{labels.stats}</span>
    </Link>
  );
};
