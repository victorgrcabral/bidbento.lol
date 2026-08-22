"use client";

import React, { useState, useRef } from "react";
import { BrandSpace } from "@/types";
import { CurrencyCode } from "@/lib/currency";
import { Language } from "@/lib/i18n";
import { getFaviconUrl } from "@/lib/utils";
import { BrandHoverCard } from "./BrandHoverCard";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, MousePointerClick } from "lucide-react";

interface BrandBlockProps {
  brand: BrandSpace;
  currency: CurrencyCode;
  language?: Language;
  onBoost: (brand: BrandSpace) => void;
  onSelectMobileBrand: (brand: BrandSpace) => void;
  isMobile: boolean;
}

export const BrandBlock: React.FC<BrandBlockProps> = ({
  brand,
  currency,
  language = "en",
  onBoost,
  onSelectMobileBrand,
  isMobile,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const logo = brand.logoUrl || getFaviconUrl(brand.domain);
  const rect = brand.rect || { x: 0, y: 0, w: 0, h: 0 };

  const handleMouseEnter = () => {
    if (isMobile) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 180);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
      onSelectMobileBrand(brand);
    } else {
      window.open(`/api/click/${brand.id}`, "_blank", "noopener,noreferrer");
    }
  };

  // Adaptive size tiers
  const isHuge = rect.w > 25 && rect.h > 25;
  const isLarge = rect.w > 14 && rect.h > 14;
  const isMedium = rect.w > 7 && rect.h > 7;

  const brandColor = brand.color || "#7c3aed";

  // Viewport-safe Popover Positioning:
  // Large/Tall blocks anchor inside their spacious area, smaller blocks float above/below safely
  const isSpaciousBlock = rect.w > 28 && rect.h > 28;
  const openUpwards = !isSpaciousBlock && rect.y > 35;
  const isRightAnchored = rect.x > 60 || (rect.x + rect.w) > 80;
  const isLeftAnchored = rect.x < 20;

  return (
    <div
      className="absolute p-0.5 select-none"
      style={{
        left: `${rect.x}%`,
        top: `${rect.y}%`,
        width: `${rect.w}%`,
        height: `${rect.h}%`,
        zIndex: isHovered ? 80 : 1,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={handleClick}
        style={{
          borderColor: isHovered
            ? brandColor
            : brand.color
            ? `${brand.color}50`
            : undefined,
          boxShadow: isHovered
            ? `0 0 35px ${brandColor}50, inset 0 0 15px ${brandColor}25`
            : undefined,
        }}
        className={`w-full h-full rounded-2xl relative overflow-hidden flex flex-col items-center justify-center cursor-pointer transition-all duration-200 border bg-gradient-to-br from-zinc-950/95 via-black/95 to-black border-white/10 group ${
          isHovered ? "ring-2 ring-violet-500/60 scale-[1.01] shadow-2xl z-20" : ""
        }`}
      >
        {/* Background Ambient Glow */}
        <div
          className="absolute inset-0 opacity-15 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${brandColor} 0%, transparent 70%)`,
          }}
        />

        {/* Top Badges with concentric rounding */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          {brand.rank === 1 && (
            <span className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-lg backdrop-blur-md shadow-sm">
              <Trophy className="w-3 h-3 text-amber-400" /> #{brand.rank}
            </span>
          )}

          {isMedium && brand.rank !== 1 && (
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900/80 px-2 py-0.5 rounded-lg border border-white/10 backdrop-blur-sm">
              #{brand.rank}
            </span>
          )}

          <span className="ml-auto text-[10px] font-bold text-violet-300 bg-violet-950/70 border border-violet-500/30 px-2 py-0.5 rounded-lg backdrop-blur-md">
            {brand.percentage}%
          </span>
        </div>

        {/* Content Section based on size */}
        <div className="flex flex-col items-center justify-center p-2 text-center max-w-full z-10 pointer-events-none">
          {/* Logo */}
          <div
            className={`rounded-xl bg-zinc-900/90 border border-white/10 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110 shadow-md ${
              isHuge
                ? "w-20 h-20 p-3 mb-2.5"
                : isLarge
                ? "w-14 h-14 p-2 mb-2"
                : isMedium
                ? "w-10 h-10 p-1.5 mb-1"
                : "w-7 h-7 p-1"
            }`}
            style={{
              borderColor: `${brandColor}40`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt={brand.name}
              className="w-full h-full object-contain filter drop-shadow"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>

          {/* Name & Tagline */}
          {isLarge && (
            <>
              <h4 className="font-bold text-white tracking-tight leading-none truncate max-w-full px-2 text-sm sm:text-base">
                {brand.name}
              </h4>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5 truncate max-w-full px-2">
                {brand.domain}
              </p>
            </>
          )}

          {isHuge && brand.tagline && (
            <p className="text-xs text-zinc-300 mt-2 line-clamp-2 px-3 font-normal max-w-sm leading-snug opacity-90">
              &ldquo;{brand.tagline}&rdquo;
            </p>
          )}
        </div>

        {/* Verified Clicks Counter inside block */}
        {isMedium && (
          <div className="absolute bottom-2.5 right-2.5 text-[10px] text-zinc-400 font-mono flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded-full border border-white/10 z-10 shadow-sm">
            <MousePointerClick className="w-3 h-3 text-emerald-400" />
            <span>{brand.clicksCount} clicks</span>
          </div>
        )}
      </motion.div>

      {/* Desktop Rich Hover Popover Card with Viewport-Safe Positioning */}
      <AnimatePresence>
        {isHovered && !isMobile && (
          <div
            className={`absolute z-[90] pointer-events-auto ${
              isSpaciousBlock
                ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                : openUpwards
                ? "bottom-full mb-3"
                : "top-full mt-3"
            } ${
              isSpaciousBlock
                ? ""
                : isRightAnchored
                ? "right-0"
                : isLeftAnchored
                ? "left-0"
                : "left-1/2 -translate-x-1/2"
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <BrandHoverCard
              brand={brand}
              currency={currency}
              language={language}
              onBoost={onBoost}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
