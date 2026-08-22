"use client";

import React from "react";
import { BrandSpace } from "@/types";
import { formatCurrency, CurrencyCode } from "@/lib/currency";
import { formatTimeAgo, getFaviconUrl } from "@/lib/utils";
import { ExternalLink, Zap, MousePointerClick, Clock, TrendingUp, Trophy, X, Tag } from "lucide-react";
import { motion } from "framer-motion";

interface BrandHoverCardProps {
  brand: BrandSpace;
  currency: CurrencyCode;
  onClose?: () => void;
  onBoost: (brand: BrandSpace) => void;
  isMobileModal?: boolean;
}

export const BrandHoverCard: React.FC<BrandHoverCardProps> = ({
  brand,
  currency,
  onClose,
  onBoost,
  isMobileModal = false,
}) => {
  const logo = brand.logoUrl || getFaviconUrl(brand.domain);
  const clickRedirectUrl = `/api/click/${brand.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`w-80 max-w-[90vw] bg-zinc-950/98 backdrop-blur-2xl border border-white/20 rounded-2xl p-5 shadow-2xl shadow-black text-white pointer-events-auto select-text ${
        isMobileModal
          ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60]"
          : "z-[55]"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center p-2 overflow-hidden shadow-inner bg-zinc-900 shrink-0"
            style={{
              borderColor: brand.color ? `${brand.color}50` : "rgba(255,255,255,0.15)",
              boxShadow: brand.color ? `0 0 20px ${brand.color}30` : undefined,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt={brand.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base sm:text-lg text-white leading-tight truncate">
                {brand.name}
              </h3>
              {brand.rank === 1 && (
                <span className="flex items-center gap-1 text-[9px] uppercase font-black tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded-md shrink-0">
                  <Trophy className="w-2.5 h-2.5 text-amber-400" /> Líder
                </span>
              )}
            </div>
            <span className="text-xs text-zinc-400 font-mono block truncate">{brand.domain}</span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Badge & Tagline */}
      <div className="mb-3 space-y-1.5">
        {brand.category && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
            <Tag className="w-2.5 h-2.5 text-violet-400" />
            {brand.category}
          </span>
        )}
        {brand.tagline && (
          <p className="text-xs text-zinc-300 bg-zinc-900/70 border border-white/5 p-2.5 rounded-xl leading-relaxed">
            &ldquo;{brand.tagline}&rdquo;
          </p>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-zinc-900/90 border border-white/10 p-2.5 rounded-xl flex flex-col">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
            <span>Fatia na Página</span>
          </div>
          <div className="font-bold text-base text-violet-300">
            {brand.percentage}%
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-white/10 p-2.5 rounded-xl flex flex-col">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mb-1">
            <MousePointerClick className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cliques Reais</span>
          </div>
          <div className="font-bold text-base text-emerald-400">
            {brand.clicksCount.toLocaleString()}
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-white/10 p-2.5 rounded-xl flex flex-col">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mb-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Total Investido</span>
          </div>
          <div className="font-bold text-xs sm:text-sm text-zinc-100 font-mono truncate">
            {formatCurrency(brand.totalAmount, currency)}
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-white/10 p-2.5 rounded-xl flex flex-col">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mb-1">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Último Aporte</span>
          </div>
          <div className="font-medium text-xs text-zinc-200 truncate">
            {formatTimeAgo(brand.lastPaymentAt)}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <a
          href={clickRedirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-white text-zinc-950 font-semibold text-xs py-2.5 px-3 rounded-xl hover:bg-zinc-200 transition-all shadow-md active:scale-95"
        >
          <span>Visitar Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={() => {
            if (onClose) onClose();
            onBoost(brand);
          }}
          className="flex items-center justify-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs py-2.5 px-3.5 rounded-xl border border-violet-400/30 transition-all shadow-lg shadow-violet-600/30 active:scale-95"
        >
          <Zap className="w-3.5 h-3.5 fill-white text-white" />
          <span>Boost</span>
        </button>
      </div>
    </motion.div>
  );
};
