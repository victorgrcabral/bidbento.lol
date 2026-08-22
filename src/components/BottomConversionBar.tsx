"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BrandSpace } from "@/types";
import { CurrencyCode, formatCurrency } from "@/lib/currency";
import { Language, getTranslation } from "@/lib/i18n";
import { CurrencyToggle } from "./CurrencyToggle";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle, Theme } from "./ThemeToggle";
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
  theme?: Theme;
  onThemeChange?: (theme: Theme) => void;
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
  theme = "dark",
  onThemeChange,
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
    lastBid
      ? t.copyLastBid(lastBid.brandName, formatCurrency(lastBid.amount, currency), lastBid.timeAgo)
      : t.copyStartingFrom,
    t.copyAntiDilution,
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMessageIndex((prev) => (prev + 1) % conversionMessages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [conversionMessages.length]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-2 sm:p-4 pointer-events-none flex justify-center">
      <div className="w-full max-w-6xl bg-white/95 dark:bg-zinc-950/90 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 rounded-2xl sm:rounded-full p-2 sm:px-5 sm:py-3 shadow-2xl shadow-black/10 dark:shadow-black/90 pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-3 transition-all duration-300">
        {/* Left: Dynamic Conversion Copy */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-hidden">
          <div className="hidden sm:flex w-9 h-9 rounded-full bg-violet-600/10 dark:bg-violet-600/20 border border-violet-500/20 dark:border-violet-500/30 items-center justify-center shrink-0">
            <Flame className="w-4 h-4 text-violet-600 dark:text-violet-400 animate-pulse" />
          </div>

          <div className="h-6 flex items-center overflow-hidden w-full md:w-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${language}-${activeMessageIndex}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="text-xs sm:text-sm font-medium text-slate-800 dark:text-zinc-200 truncate flex items-center gap-2"
              >
                <span className="truncate">{conversionMessages[activeMessageIndex]}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Actions, Pagination, Currency, Language, Theme, Rules and Main CTA */}
        <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-2.5 w-full md:w-auto shrink-0 flex-wrap sm:flex-nowrap">
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-900/90 border border-slate-200 dark:border-white/10 p-1 rounded-full text-xs text-slate-700 dark:text-zinc-300">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono text-[11px] font-bold text-violet-600 dark:text-violet-300">
                {currentPage}/{totalPages}
              </span>
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Theme Toggle (Dark/Light) */}
          {onThemeChange && (
            <ThemeToggle
              theme={theme}
              onThemeChange={onThemeChange}
            />
          )}

          {/* Language Toggle */}
          <LanguageToggle
            language={language}
            onLanguageChange={onLanguageChange}
          />

          {/* Currency Toggle */}
          <div className="hidden sm:block">
            <CurrencyToggle
              currentCurrency={currency}
              onCurrencyChange={onCurrencyChange}
            />
          </div>

          {/* Stats Link */}
          <Link
            href="/stats"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-100 dark:bg-zinc-900/90 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-all"
            title={t.stats}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span className="hidden sm:inline">{t.stats}</span>
          </Link>

          {/* Rules Link */}
          <Link
            href="/rules"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-100 dark:bg-zinc-900/90 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-all"
            title={t.rules}
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
            <span className="hidden sm:inline">{t.rules}</span>
          </Link>

          {/* Hall of Fame Button */}
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-100 dark:bg-zinc-900/90 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-all"
            title={t.ranking}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t.ranking}</span>
          </button>

          {/* Primary Main CTA */}
          <button
            onClick={onOpenPurchase}
            className="relative group overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg shadow-violet-600/40 border border-violet-400/40 transition-all transform active:scale-95 flex items-center gap-2"
          >
            <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Zap className="w-4 h-4 fill-white animate-bounce" />
            <span>{t.claimSpace}</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
