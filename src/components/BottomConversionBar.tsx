"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BrandSpace } from "@/types";
import { CurrencyCode, formatCurrency } from "@/lib/currency";
import { Language, getTranslation } from "@/lib/i18n";
import { CurrencyToggle } from "./CurrencyToggle";
import { LanguageToggle } from "./LanguageToggle";
import {
  Zap,
  Trophy,
  Flame,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BottomConversionBarProps {
  brands: BrandSpace[];
  totalAmount: number;
  totalClicks: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  leader: BrandSpace | null;
  lastBid: { brandName: string; amount: number; timeAgo: string } | null;
  currency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenPurchase: () => void;
  onOpenLeaderboard: () => void;
}

export const BottomConversionBar: React.FC<BottomConversionBarProps> = ({
  brands,
  totalAmount,
  totalClicks,
  currentPage,
  totalPages,
  onPageChange,
  leader,
  lastBid,
  currency,
  onCurrencyChange,
  language = "en",
  onLanguageChange,
  onOpenPurchase,
  onOpenLeaderboard,
}) => {
  const t = getTranslation(language);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  const conversionMessages = [
    leader
      ? t.copyLeader(leader.name, leader.percentage)
      : t.copyStartingFrom,
    t.copyClicks(totalClicks.toLocaleString()),
    t.copyFairness,
    lastBid
      ? t.copyLastBid(lastBid.brandName, formatCurrency(lastBid.amount, currency), lastBid.timeAgo)
      : t.copyStartingFrom,
    t.copyAntiDilution,
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMessageIndex((prev) => (prev + 1) % conversionMessages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [conversionMessages.length]);

  const message = (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${language}-${activeMessageIndex}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
        className="flex min-w-0 items-center gap-2 text-xs font-medium text-zinc-200 sm:text-sm"
      >
        <span className="truncate">{conversionMessages[activeMessageIndex]}</span>
      </motion.div>
    </AnimatePresence>
  );

  const pagination = totalPages > 1 ? (
    <div className="flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-zinc-900/90 p-1 text-xs text-zinc-300">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="rounded-full p-1 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-violet-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </button>
      <span className="px-1 font-mono text-xs font-bold text-violet-300">
        {currentPage}/{totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="rounded-full p-1 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-violet-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  ) : null;

  const navigationClass = "flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-zinc-900/90 px-2 py-2 text-xs font-semibold text-zinc-300 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-400 active:scale-[0.98] md:min-h-0 md:rounded-full md:px-3";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:p-4">
      <div className="pointer-events-auto w-full max-w-6xl rounded-2xl border border-white/15 bg-zinc-950/90 p-2 shadow-2xl shadow-black/90 backdrop-blur-2xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] md:flex md:items-center md:justify-between md:gap-3 md:rounded-full md:px-5 md:py-3">
        {/* Mobile: message, language and pagination */}
        <div className="flex min-w-0 items-center gap-2 md:hidden">
          <div className="flex min-h-8 min-w-0 flex-1 items-center overflow-hidden">{message}</div>
          {pagination}
          <LanguageToggle
            language={language}
            onLanguageChange={onLanguageChange}
          />
        </div>

        {/* Mobile: named destinations remain visible */}
        <nav aria-label="BidBento pages" className="mt-2 grid grid-cols-3 gap-2 md:hidden">
          <Link href="/stats" className={navigationClass}>
            <BarChart3 className="h-4 w-4 text-emerald-400" />
            <span>{t.stats}</span>
          </Link>
          <Link href="/rules" className={navigationClass}>
            <BookOpen className="h-4 w-4 text-sky-400" />
            <span>{t.rules}</span>
          </Link>
          <button type="button" onClick={onOpenLeaderboard} className={navigationClass}>
            <Trophy className="h-4 w-4 text-amber-400" />
            <span>{t.ranking}</span>
          </button>
        </nav>

        {/* Mobile: the primary action uses the full available width */}
        <button
          type="button"
          onClick={onOpenPurchase}
          className="group relative mt-2 flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-violet-400/40 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-3 py-2 text-base font-semibold text-white shadow-lg shadow-violet-600/40 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-violet-300 active:scale-[0.98] md:hidden"
        >
          <Zap className="h-4 w-4 fill-white" />
          <span>{t.claimSpace}</span>
          <ChevronRight className="h-4 w-4 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1" />
        </button>

        {/* Desktop layout remains a single compact row */}
        <div className="hidden min-w-0 items-center gap-3 overflow-hidden md:flex">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-violet-500/30 bg-violet-600/20">
            <Flame className="h-4 w-4 animate-pulse text-violet-400" />
          </div>
          <div className="min-w-0 overflow-hidden">{message}</div>
        </div>

        <div className="hidden shrink-0 items-center justify-end gap-2 md:flex">
          {pagination}
          <LanguageToggle
            language={language}
            onLanguageChange={onLanguageChange}
          />
          <CurrencyToggle
            currentCurrency={currency}
            onCurrencyChange={onCurrencyChange}
          />
          <Link href="/stats" className={navigationClass}>
            <BarChart3 className="h-3.5 w-3.5 text-emerald-400" />
            <span>{t.stats}</span>
          </Link>
          <Link href="/rules" className={navigationClass}>
            <BookOpen className="h-3.5 w-3.5 text-sky-400" />
            <span>{t.rules}</span>
          </Link>
          <button type="button" onClick={onOpenLeaderboard} className={navigationClass}>
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span>{t.ranking}</span>
          </button>
          <button
            type="button"
            onClick={onOpenPurchase}
            className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-violet-400/40 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/40 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-violet-300 active:scale-[0.98]"
          >
            <Zap className="h-4 w-4 fill-white" />
            <span>{t.claimSpace}</span>
            <ChevronRight className="h-4 w-4 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
