"use client";

import React, { useState, useRef } from "react";
import { BrandSpace } from "@/types";
import { CurrencyCode } from "@/lib/currency";
import { getFaviconUrl } from "@/lib/utils";
import { BrandHoverCard } from "./BrandHoverCard";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, MousePointerClick } from "lucide-react";

interface BrandBlockProps {
  brand: BrandSpace;
  currency: CurrencyCode;
  onBoost: (brand: BrandSpace) => void;
  onSelectMobileBrand: (brand: BrandSpace) => void;
  isMobile: boolean;
}

export const BrandBlock: React.FC<BrandBlockProps> = ({
  brand,
  currency,
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
    }, 150);
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

  // Robust viewport-safe positioning for the popover
  // If the block is tall (h > 35%), center the popover inside to prevent overflowing screen edges
  const isTallBlock = rect.h > 35;
  const isBottomHalf = rect.y > 50;
  const isRightSide = rect.x > 60;
  const isLeftSide = rect.x < 35;

  let popupPositionClasses = "absolute z-[60] pointer-events-auto ";
  if (isTallBlock) {
    // Center inside the tall block
    popupPositionClasses += "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ";
  } else if (isBottomHalf) {
    // Open UPWARDS above the short block
    popupPositionClasses += "bottom-full mb-3 ";
    if (isRightSide) popupPositionClasses += "right-0 ";
    else if (isLeftSide) popupPositionClasses += "left-0 ";
    else popupPositionClasses += "left-1/2 -translate-x-1/2 ";
  } else {
    // Open DOWNWARDS below the short block
    popupPositionClasses += "top-full mt-3 ";
    if (isRightSide) popupPositionClasses += "right-0 ";
    else if (isLeftSide) popupPositionClasses += "left-0 ";
    else popupPositionClasses += "left-1/2 -translate-x-1/2 ";
  }

  return (
    <motion.div
      layout
      transition={{
        layout: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      }}
      style={{
        position: "absolute",
        left: `${rect.x}%`,
        top: `${rect.y}%`,
        width: `${rect.w}%`,
        height: `${rect.h}%`,
        zIndex: isHovered ? 45 : 10,
      }}
      className="p-1 box-border select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        onClick={handleClick}
        style={{
          borderColor: isHovered
            ? `${brandColor}`
            : brand.rank === 1
            ? "#eab30866"
            : `${brandColor}30`,
          boxShadow: isHovered
            ? `0 0 35px ${brandColor}40, inset 0 0 25px ${brandColor}20`
            : brand.rank === 1
            ? "0 0 25px rgba(234, 179, 8, 0.15)"
            : "none",
        }}
        className={`w-full h-full rounded-2xl relative overflow-hidden flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border bg-gradient-to-br from-zinc-950/90 via-zinc-900/80 to-zinc-950/95 backdrop-blur-md group ${
          isHovered ? "scale-[0.99]" : ""
        }`}
      >
        {/* Background Ambient Glow */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none transition-opacity duration-300 group-hover:opacity-30"
          style={{
            background: `radial-gradient(circle at center, ${brandColor} 0%, transparent 70%)`,
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
          {brand.rank === 1 && (
            <span className="flex items-center gap-1 text-[9px] uppercase font-black tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded-md backdrop-blur-md">
              <Trophy className="w-2.5 h-2.5 text-amber-400" /> #{brand.rank}
            </span>
          )}

          {isMedium && brand.rank !== 1 && (
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900/80 px-1.5 py-0.5 rounded border border-white/5">
              #{brand.rank}
            </span>
          )}

          <span className="ml-auto text-[10px] font-bold text-violet-300 bg-violet-950/60 border border-violet-500/30 px-1.5 py-0.5 rounded-md backdrop-blur-md">
            {brand.percentage}%
          </span>
        </div>

        {/* Content Section based on size */}
        <div className="flex flex-col items-center justify-center p-2 text-center max-w-full z-10 pointer-events-none">
          {/* Logo */}
          <div
            className={`rounded-xl bg-zinc-900/90 border border-white/10 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110 shadow-lg ${
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
              {isHuge && brand.tagline && (
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 max-w-xs px-2 font-normal leading-tight">
                  {brand.tagline}
                </p>
              )}
            </>
          )}

          {isMedium && !isLarge && (
            <span className="text-[11px] font-semibold text-zinc-200 truncate max-w-full px-1">
              {brand.name}
            </span>
          )}
        </div>

        {/* Bottom stats badge on large blocks */}
        {isLarge && (
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-zinc-400 px-1 pointer-events-none">
            <span className="truncate font-mono text-[9px] text-zinc-500">
              {brand.domain}
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium text-[10px]">
              <MousePointerClick className="w-2.5 h-2.5" />
              {brand.clicksCount}
            </span>
          </div>
        )}
      </div>

      {/* Desktop Hover Card with Viewport-Safe Positioning */}
      <AnimatePresence>
        {!isMobile && isHovered && (
          <div
            className={popupPositionClasses}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <BrandHoverCard
              brand={brand}
              currency={currency}
              onBoost={onBoost}
            />
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
