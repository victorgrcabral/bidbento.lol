"use client";

import React from "react";
import { BrandSpace } from "@/types";
import { CurrencyCode, formatCurrency } from "@/lib/currency";
import { formatTimeAgo, getFaviconUrl } from "@/lib/utils";
import { Language, getTranslation } from "@/lib/i18n";
import { X, Trophy, MousePointerClick, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface LeaderboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brands: BrandSpace[];
  currency: CurrencyCode;
  language?: Language;
  onBoost: (brand: BrandSpace) => void;
}

export const LeaderboardDrawer: React.FC<LeaderboardDrawerProps> = ({
  isOpen,
  onClose,
  brands,
  currency,
  language = "en",
  onBoost,
}) => {
  const t = getTranslation(language);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-md h-full bg-zinc-950 border-l border-white/10 p-6 shadow-2xl flex flex-col text-white overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">{t.leaderboardTitle}</h2>
              <p className="text-xs text-zinc-400">
                {t.leaderboardDesc(brands.length)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brands List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {brands.map((b, idx) => {
            const logo = b.logoUrl || getFaviconUrl(b.domain);
            return (
              <div
                key={b.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  idx === 0
                    ? "bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 border-amber-500/30 shadow-lg shadow-amber-950/20"
                    : "bg-zinc-900/60 border-white/5 hover:border-white/15"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`font-mono text-xs font-bold w-6 text-center shrink-0 ${
                      idx === 0
                        ? "text-amber-400 text-sm"
                        : idx === 1
                        ? "text-zinc-300"
                        : idx === 2
                        ? "text-amber-600"
                        : "text-zinc-500"
                    }`}
                  >
                    #{idx + 1}
                  </span>

                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 p-1.5 flex items-center justify-center shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo} alt={b.name} className="w-full h-full object-contain" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-white truncate">{b.name}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                      <span className="font-bold text-violet-400">{b.percentage}% {t.ofThePage}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-emerald-400">
                        <MousePointerClick className="w-2.5 h-2.5" />
                        {b.clicksCount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-zinc-200">
                      {formatCurrency(b.totalAmount, currency)}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {formatTimeAgo(b.lastPaymentAt, language)}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onBoost(b);
                    }}
                    className="p-2 rounded-xl bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white transition-colors"
                    title={t.boostBrand}
                  >
                    <Zap className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
