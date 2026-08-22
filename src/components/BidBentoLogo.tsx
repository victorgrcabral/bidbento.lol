"use client";

import React from "react";

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
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-11",
    xl: "h-16",
  };

  const svgContent = (
    <svg
      viewBox="0 0 380 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size]} w-auto object-contain select-none`}
    >
      <defs>
        {/* Emerald Arrow Gradient */}
        <linearGradient id="bidbento-arrow-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
        {/* Text Glow Filter */}
        <filter id="bidbento-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#34d399" floodOpacity="0.3" />
        </filter>
      </defs>

      <g id="logo-text">
        {/* Letter 'b' (with arrow) */}
        <g id="letter-b1">
          {/* Vertical stem */}
          <rect x="25" y="16" width="10" height="58" rx="2" fill="#FFFFFF" />
          {/* Circular bowl */}
          <path
            d="M33 46 C33 34, 46 25, 59 25 C72 25, 83 36, 83 49 C83 62, 72 73, 59 73 C46 73, 33 64, 33 52 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="10"
          />
          {/* Rising Arrow on 'b' */}
          <g transform="translate(68, 8) rotate(-15)">
            <path
              d="M-5 24 L10 5"
              stroke="url(#bidbento-arrow-grad)"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
            <path
              d="M-1 4 L14 3 L13 18 Z"
              fill="url(#bidbento-arrow-grad)"
            />
          </g>
        </g>

        {/* Letter 'i' */}
        <g id="letter-i">
          <rect x="94" y="30" width="10" height="44" rx="2" fill="#FFFFFF" />
          <circle cx="99" cy="18" r="5.5" fill="#FFFFFF" />
        </g>

        {/* Letter 'd' */}
        <g id="letter-d">
          <rect x="156" y="16" width="10" height="58" rx="2" fill="#FFFFFF" />
          <path
            d="M158 52 C158 64, 145 73, 132 73 C119 73, 108 62, 108 49 C108 36, 119 25, 132 25 C145 25, 158 34, 158 46 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="10"
          />
        </g>

        {/* Letter 'b' (second) */}
        <g id="letter-b2">
          <rect x="178" y="16" width="10" height="58" rx="2" fill="#FFFFFF" />
          <path
            d="M186 46 C186 34, 199 25, 212 25 C225 25, 236 36, 236 49 C236 62, 225 73, 212 73 C199 73, 186 64, 186 52 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="10"
          />
        </g>

        {/* Letter 'e' */}
        <g id="letter-e">
          <path
            d="M284 50 L246 50 C246 38, 255 27, 267 27 C279 27, 287 36, 287 47 M246 50 C246 63, 255 73, 267 73 C277 73, 284 67, 287 59"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </g>

        {/* Letter 'n' */}
        <g id="letter-n">
          <rect x="298" y="30" width="10" height="44" rx="2" fill="#FFFFFF" />
          <path
            d="M306 43 C306 33, 314 26, 325 26 C336 26, 342 33, 342 44 L342 74"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </g>

        {/* Letter 't' */}
        <g id="letter-t">
          <rect x="353" y="18" width="10" height="54" rx="2" fill="#FFFFFF" />
          <rect x="345" y="30" width="26" height="9" rx="2" fill="#FFFFFF" />
        </g>

        {/* Letter 'o' with diagonal arrow */}
        <g id="letter-o">
          <circle
            cx="380"
            cy="49"
            r="23"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="10"
          />
          {/* Rising Arrow on 'o' */}
          <g transform="translate(393, 14) rotate(-15)">
            <path
              d="M-6 26 L12 5"
              stroke="url(#bidbento-arrow-grad)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M0 4 L16 3 L14 19 Z"
              fill="url(#bidbento-arrow-grad)"
            />
          </g>
        </g>

        {/* Extension: '.lol' */}
        <g id="extension-lol" opacity="0.85">
          <circle cx="417" cy="69" r="4.5" fill="#6ee7b7" />
          {/* letter l */}
          <rect x="427" y="30" width="6.5" height="44" rx="1.5" fill="#6ee7b7" />
          {/* letter o */}
          <circle cx="448" cy="52" r="14" fill="none" stroke="#6ee7b7" strokeWidth="6.5" />
          {/* letter l */}
          <rect x="469" y="30" width="6.5" height="44" rx="1.5" fill="#6ee7b7" />
        </g>
      </g>
    </svg>
  );

  if (withBadge) {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center bg-[#0d0e12]/95 border border-white/10 hover:border-emerald-500/40 px-4 py-2 rounded-2xl shadow-xl shadow-black/80 backdrop-blur-xl transition-all ${
          onClick ? "cursor-pointer active:scale-95" : ""
        } ${className}`}
        style={{
          boxShadow: "0 10px 30px -10px rgba(16, 185, 129, 0.15), 0 0 1px 1px rgba(255, 255, 255, 0.05)",
        }}
      >
        {svgContent}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center ${onClick ? "cursor-pointer active:scale-95" : ""} ${className}`}
    >
      {svgContent}
    </div>
  );
};
