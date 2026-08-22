"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Sparkles, Flag, ArrowRight } from "lucide-react";
import { Language, getTranslation } from "@/lib/i18n";

interface EmptyCategoryPlaceholderProps {
  categoryName: string;
  language?: Language;
  onOpenPurchase: () => void;
}

export const EmptyCategoryPlaceholder: React.FC<EmptyCategoryPlaceholderProps> = ({
  categoryName,
  language = "en",
  onOpenPurchase,
}) => {
  const t = getTranslation(language);

  const texts = {
    en: {
      tag: "100% UNCLAIMED TERRITORY",
      title: (cat: string) => `No brands in ${cat} yet!`,
      desc: "Be the first pioneer to claim this space and dominate 100% of the screen for just $1.00.",
      cta: "Plant Your Flag for $1.00",
      perks: [
        "100% Screen Share",
        "Instant Direct Traffic",
        "Zero Competition",
      ],
    },
    es: {
      tag: "TERRITORIO 100% DISPONIBLE",
      title: (cat: string) => `¡Aún no hay marcas en ${cat}!`,
      desc: "Sé el primer pionero en reclamar este espacio y domina el 100% de la pantalla por solo $1.00.",
      cta: "Plantar tu Bandera por $1.00",
      perks: [
        "100% de Pantalla",
        "Tráfico Directo Inmediato",
        "Cero Competencia",
      ],
    },
    pt: {
      tag: "TERRITÓRIO 100% VIRGEM",
      title: (cat: string) => `Nenhuma marca em ${cat} ainda!`,
      desc: "Seja o primeiro pioneiro a conquistar este espaço e domine 100% da tela por apenas $1.00.",
      cta: "Fincar sua Bandeira por $1.00",
      perks: [
        "100% de Dominância",
        "Tráfego Direto Instantâneo",
        "Zero Concorrentes",
      ],
    },
  }[language] || {
    tag: "100% UNCLAIMED TERRITORY",
    title: (cat: string) => `No brands in ${cat} yet!`,
    desc: "Be the first pioneer to claim this space and dominate 100% of the screen for just $1.00.",
    cta: "Plant Your Flag for $1.00",
    perks: [
      "100% Screen Share",
      "Instant Direct Traffic",
      "Zero Competition",
    ],
  };

  const displayName = categoryName === "all" ? "BidBento" : categoryName;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 text-center relative overflow-hidden select-none">
      {/* Background Animated Ambient Lights */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-emerald-500/20 via-violet-600/20 to-transparent blur-3xl pointer-events-none"
      />

      {/* Floating Space Bento Mascot Character */}
      <div className="relative mb-6 z-10">
        {/* Radar Scanner Waves */}
        <motion.div
          animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 m-auto w-24 h-24 rounded-full border border-emerald-400/40 pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1.5, ease: "easeOut" }}
          className="absolute inset-0 m-auto w-24 h-24 rounded-full border border-violet-400/40 pointer-events-none"
        />

        {/* Orbiting Stars & Coins */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 -m-8 pointer-events-none"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-400/80 shadow-[0_0_12px_#f59e0b] flex items-center justify-center text-[9px] font-black text-black">
            $
          </div>
          <div className="absolute bottom-2 right-4 w-3 h-3 text-emerald-400">
            <Sparkles className="w-full h-full animate-pulse" />
          </div>
          <div className="absolute top-1/2 left-0 w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_10px_#a855f7]" />
        </motion.div>

        {/* The Animated Character Box (Bento Pioneer) */}
        <motion.div
          animate={{
            y: [-10, 10, -10],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-28 h-28 sm:w-32 sm:h-32"
        >
          <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-2xl">
            {/* Jetpack Booster Flames */}
            <motion.path
              animate={{
                d: [
                  "M65 140 Q80 165 95 140 Q80 152 65 140 Z",
                  "M65 140 Q80 178 95 140 Q80 158 65 140 Z",
                  "M65 140 Q80 165 95 140 Q80 152 65 140 Z",
                ],
              }}
              transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
              fill="url(#flame-grad)"
            />

            {/* Jetpack Thrusters */}
            <rect x="58" y="118" width="16" height="24" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="3" />
            <rect x="86" y="118" width="16" height="24" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="3" />

            {/* Robot Body / Bento Head */}
            <rect x="25" y="25" width="110" height="96" rx="28" fill="#18181b" stroke="url(#body-border)" strokeWidth="4" />

            {/* Glass Face Screen */}
            <rect x="36" y="36" width="88" height="74" rx="20" fill="#09090b" stroke="#27272a" strokeWidth="2" />

            {/* Eyes Screen (Blinking & Searching) */}
            <motion.g
              animate={{
                scaleY: [1, 1, 0.1, 1, 1, 1],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                times: [0, 0.45, 0.5, 0.55, 0.9, 1],
              }}
              style={{ transformOrigin: "80px 70px" }}
            >
              {/* Left Eye */}
              <circle cx="58" cy="68" r="9" fill="#10b981" />
              <circle cx="61" cy="65" r="3" fill="#ffffff" />

              {/* Right Eye */}
              <circle cx="102" cy="68" r="9" fill="#10b981" />
              <circle cx="105" cy="65" r="3" fill="#ffffff" />

              {/* Cute Digital Smile */}
              <path d="M72 82 Q80 89 88 82" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
            </motion.g>

            {/* Antenna with Pulsing Beacon */}
            <line x1="80" y1="25" x2="80" y2="8" stroke="#71717a" strokeWidth="4" strokeLinecap="round" />
            <motion.circle
              cx="80"
              cy="8"
              r="6"
              fill="#a855f7"
              animate={{
                scale: [1, 1.3, 1],
                fill: ["#a855f7", "#34d399", "#a855f7"],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />

            {/* Flag Pole on Hand */}
            <motion.g
              animate={{ rotate: [-5, 8, -5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "135px 75px" }}
            >
              <line x1="135" y1="95" x2="135" y2="15" stroke="#e4e4e7" strokeWidth="3.5" strokeLinecap="round" />
              {/* Emerald Triangular Flag with $ */}
              <path d="M135 18 L160 30 L135 42 Z" fill="#10b981" />
              <circle cx="143" cy="30" r="4" fill="#ffffff" />
            </motion.g>

            {/* Gradients */}
            <defs>
              <linearGradient id="body-border" x1="0" y1="0" x2="160" y2="160">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="flame-grad" x1="80" y1="140" x2="80" y2="170" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>

      {/* Copy & Persuasive Value Proposition */}
      <div className="max-w-md z-10 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-950/40">
          <Flag className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          {texts.tag}
        </span>

        <h3 className="text-xl sm:text-3xl font-black tracking-tight text-white dark:text-white">
          {texts.title(displayName)}
        </h3>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
          {texts.desc}
        </p>

        {/* 3 Value Badges */}
        <div className="flex items-center justify-center gap-2 pt-1 pb-2 flex-wrap">
          {texts.perks.map((perk, idx) => (
            <span
              key={idx}
              className="text-[10px] sm:text-[11px] font-semibold text-zinc-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg backdrop-blur-md"
            >
              ✓ {perk}
            </span>
          ))}
        </div>

        {/* Primary CTA Action */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenPurchase}
          className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-violet-600 hover:from-emerald-400 hover:to-violet-500 text-white font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-full shadow-2xl shadow-emerald-500/30 border border-emerald-400/40 transition-all cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>{texts.cta}</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};
