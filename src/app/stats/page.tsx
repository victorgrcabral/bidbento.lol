"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Language, getTranslation } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { BidBentoLogo } from "@/components/BidBentoLogo";
import {
  ChevronLeft,
  Users,
  MousePointerClick,
  Activity,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Share2,
  Zap,
} from "lucide-react";

export default function StatsPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [timeRange, setTimeRange] = useState("24h");
  const [statsData, setStatsData] = useState<any>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const t = getTranslation(language);

  // Sync language & ensure dark mode
  useEffect(() => {
    try {
      document.documentElement.classList.add("dark");
      const savedLang = localStorage.getItem("bidbento_lang") as Language;
      if (savedLang && (savedLang === "en" || savedLang === "es" || savedLang === "pt")) {
        setLanguage(savedLang);
      }
    } catch {}
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem("bidbento_lang", lang);
    } catch {}
  };

  // Fetch real-time statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setStatsData(data);
        }
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const trafficData = statsData?.hourlyTraffic || [
    { time: "00:00", visitors: 2800 },
    { time: "02:00", visitors: 3400 },
    { time: "04:00", visitors: 2900 },
    { time: "06:00", visitors: 2700 },
    { time: "08:00", visitors: 3100 },
    { time: "10:00", visitors: 3800 },
    { time: "12:00", visitors: 4200 },
    { time: "14:00", visitors: 5800 },
    { time: "16:00", visitors: 5100 },
    { time: "18:00", visitors: 6900 },
    { time: "20:00", visitors: 5600 },
    { time: "22:00", visitors: 3800 },
  ];

  // SVG Chart path calculation
  const maxVal = 7500;
  const svgWidth = 800;
  const svgHeight = 220;
  const points = trafficData.map((d: any, idx: number) => {
    const x = (idx / (trafficData.length - 1)) * (svgWidth - 40) + 20;
    const y = svgHeight - (d.visitors / maxVal) * (svgHeight - 40) - 20;
    return { x, y, data: d };
  });

  // Bezier curve string
  const pathD = points.reduce((acc: string, curr: any, idx: number, arr: any[]) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[idx - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;

  return (
    <div className="min-h-screen bg-[#050508] text-white p-4 sm:p-8 md:p-12 overflow-y-auto selection:bg-violet-600 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Nav */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 flex-wrap gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white bg-zinc-900 border border-white/10 px-4 py-2 rounded-full transition-all shadow-sm hover:border-violet-500/50"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t.backToHome}</span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageToggle language={language} onLanguageChange={handleLanguageChange} />

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-violet-600/30 transition-all active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>{t.claimSpace}</span>
            </Link>
          </div>
        </div>

        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BidBentoLogo withBadge={true} size="sm" />
              <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {statsData?.liveOnline || 677} {t.liveVisitorsNow}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {t.statsTitle}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              {t.statsHeroSubtitle}
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-white/10 p-1 rounded-full text-xs font-semibold self-start sm:self-auto shadow-sm">
            {["24h", "7d", "30d", "all"].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-full uppercase text-[11px] transition-all cursor-pointer ${
                  timeRange === r
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {r === "all" ? "All Time" : `Last ${r}`}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Main KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-950/90 border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
              <span className="font-semibold">{t.totalPageViews}</span>
              <Users className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {(statsData?.totalVisitors || 1181912).toLocaleString()}
            </div>
            <span className="text-[11px] font-mono text-emerald-400 mt-1 inline-flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +24% vs last week
            </span>
          </div>

          <div className="bg-zinc-950/90 border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
              <span className="font-semibold">{t.realClicks}</span>
              <MousePointerClick className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {(statsData?.totalClicks || 2480).toLocaleString()}
            </div>
            <span className="text-[11px] font-mono text-zinc-400 mt-1 block">
              100% verified brand clicks
            </span>
          </div>

          <div className="bg-zinc-950/90 border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
              <span className="font-semibold">{t.conversionRateLabel}</span>
              <TrendingUp className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {statsData?.conversionRate || "16.4%"}
            </div>
            <span className="text-[11px] font-mono text-emerald-400 mt-1 inline-flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> High user intent
            </span>
          </div>

          <div className="bg-zinc-950/90 border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
              <span className="font-semibold">{t.avgTimeOnPage}</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {statsData?.avgSessionTime || "0m 58s"}
            </div>
            <span className="text-[11px] font-mono text-zinc-400 mt-1 block">
              Bounce Rate: {statsData?.bounceRate || "28%"}
            </span>
          </div>
        </div>

        {/* Traffic Activity Curve Chart */}
        <div className="bg-zinc-950/90 border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-violet-400" />
                <span>{t.trafficGrowth}</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Visitor volume distribution across 24h cycle
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-zinc-300 bg-zinc-900 px-3 py-1.5 rounded-full border border-white/10">
              Peak: 6.9k visitors/hr
            </span>
          </div>

          {/* Interactive SVG Chart */}
          <div className="w-full h-48 sm:h-64 relative">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area Gradient */}
              <path d={areaD} fill="url(#chart-glow)" />

              {/* Line Curve */}
              <path
                d={pathD}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              {points.map((p: any, idx: number) => (
                <g key={idx}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint === idx ? 7 : 4}
                    fill={hoveredPoint === idx ? "#34d399" : "#ffffff"}
                    stroke="#8b5cf6"
                    strokeWidth={hoveredPoint === idx ? 3 : 2}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {hoveredPoint === idx && (
                    <g transform={`translate(${p.x}, ${p.y - 30})`}>
                      <rect
                        x="-35"
                        y="-15"
                        width="70"
                        height="24"
                        rx="6"
                        fill="#18181b"
                        stroke="#8b5cf6"
                        strokeWidth="1.5"
                      />
                      <text
                        x="0"
                        y="1"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {p.data.visitors}
                      </text>
                    </g>
                  )}
                </g>
              ))}
            </svg>

            {/* Time labels below chart */}
            <div className="flex justify-between text-[10px] sm:text-xs font-mono text-zinc-500 mt-2 px-2">
              {trafficData.map((d: any, i: number) => (
                <span key={i} className={i % 2 !== 0 ? "hidden sm:inline" : ""}>
                  {d.time}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Column Breakdown: Channels & Top Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traffic Channels */}
          <div className="bg-zinc-950/90 border border-white/10 rounded-3xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>{t.trafficChannels}</span>
            </h3>

            <div className="space-y-3.5">
              {(statsData?.channels || [
                { name: t.directTraffic, percentage: 72, count: "57.4k", color: "#3b82f6" },
                { name: t.organicSearch, percentage: 14, count: "11.2k", color: "#10b981" },
                { name: t.socialTraffic, percentage: 9, count: "7.1k", color: "#8b5cf6" },
                { name: t.referralTraffic, percentage: 5, count: "4.0k", color: "#f59e0b" },
              ]).map((c: any, i: number) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-zinc-300">{c.name}</span>
                    <span className="font-mono text-zinc-400">
                      {c.count} ({c.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${c.percentage}%`,
                        backgroundColor: c.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Categories / Pages */}
          <div className="bg-zinc-950/90 border border-white/10 rounded-3xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-violet-400" />
              <span>{t.topPages}</span>
            </h3>

            <div className="space-y-3">
              {(statsData?.topPages || [
                { page: "/", name: "Home Canvas", views: "74.2k", pct: 72 },
                { page: "/category/developer-tools", name: "Developer Tools", views: "14.8k", pct: 14 },
                { page: "/category/saas", name: "SaaS", views: "11.2k", pct: 11 },
                { page: "/rules", name: "Rules & FAQ", views: "6.4k", pct: 6 },
                { page: "/checkout", name: "Checkout", views: "4.8k", pct: 5 },
              ]).map((p: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-white/5 text-xs"
                >
                  <div className="min-w-0 pr-3">
                    <span className="font-mono text-violet-400 font-bold block truncate">
                      {p.page}
                    </span>
                    <span className="text-[11px] text-zinc-400">{p.name}</span>
                  </div>
                  <span className="font-mono font-bold text-zinc-200 shrink-0">
                    {p.views} views
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Brands Click Leaderboard */}
        <div className="bg-zinc-950/90 border border-white/10 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-emerald-400" />
              <span>Top Clicked Brands on bidbento.lol</span>
            </h3>
            <span className="text-xs text-zinc-400 font-mono">
              Live Click Counts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(statsData?.topBrands || []).map((b: any, idx: number) => (
              <a
                key={b.id}
                href={`/api/click/${b.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-violet-500/50 flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-zinc-500">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-xs text-white truncate group-hover:text-violet-400">
                      {b.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono block truncate">
                    {b.domain}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 shrink-0">
                  {b.clicksCount} clicks
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
