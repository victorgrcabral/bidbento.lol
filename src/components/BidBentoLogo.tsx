"use client";

import React from "react";
import Image from "next/image";

interface BidBentoLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  withBadge?: boolean;
  onClick?: () => void;
}

export const BidBentoLogo: React.FC<BidBentoLogoProps> = ({
  className = "",
  size = "md",
  withBadge = false,
  onClick,
}) => {
  const heightClasses = {
    sm: "h-5 sm:h-6",
    md: "h-7 sm:h-8",
    lg: "h-9 sm:h-10",
    xl: "h-12 sm:h-14",
  };

  const imageElement = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/logo.png"
      alt="bidbento.lol"
      className={`${heightClasses[size]} w-auto object-contain select-none drop-shadow-md`}
      draggable={false}
    />
  );

  if (withBadge) {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center bg-[#17181c]/95 border border-white/15 hover:border-emerald-400/50 px-3.5 py-1.5 rounded-2xl shadow-xl shadow-black/80 backdrop-blur-xl transition-all ${
          onClick ? "cursor-pointer active:scale-95" : ""
        } ${className}`}
        style={{
          boxShadow: "0 8px 24px -6px rgba(16, 185, 129, 0.2), 0 0 1px 1px rgba(255, 255, 255, 0.08)",
        }}
      >
        {imageElement}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center ${onClick ? "cursor-pointer active:scale-95" : ""} ${className}`}
    >
      {imageElement}
    </div>
  );
};
