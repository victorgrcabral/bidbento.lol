"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Zap, Flag, ArrowRight } from "lucide-react";
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
      desc: "Be the first pioneer to claim this space and dominate 100% of the screen on bidbento.lol for just $1.00.",
      cta: "Claim your Bento for $1.00",
      perks: [
        "100% Screen Share",
        "Instant Direct Traffic",
        "Zero Competition",
      ],
    },
    es: {
      tag: "TERRITORIO 100% DISPONIBLE",
      title: (cat: string) => `¡Aún no hay marcas en ${cat}!`,
      desc: "Sé el primer pionero en reclamar este espacio y domina el 100% de la pantalla en bidbento.lol por solo $1.00.",
      cta: "Reclamar tu Bento por $1.00",
      perks: [
        "100% de Pantalla",
        "Tráfico Directo Inmediato",
        "Cero Competencia",
      ],
    },
    pt: {
      tag: "TERRITÓRIO 100% VIRGEM",
      title: (cat: string) => `Nenhuma marca em ${cat} ainda!`,
      desc: "Seja o primeiro pioneiro a conquistar este espaço e domine 100% da tela no bidbento.lol por apenas $1.00.",
      cta: "Reivindicar seu Bento por $1.00",
      perks: [
        "100% de Dominância",
        "Tráfego Direto Instantâneo",
        "Zero Concorrentes",
      ],
    },
  }[language] || {
    tag: "100% UNCLAIMED TERRITORY",
    title: (cat: string) => `No brands in ${cat} yet!`,
    desc: "Be the first pioneer to claim this space and dominate 100% of the screen on bidbento.lol for just $1.00.",
    cta: "Claim your Bento for $1.00",
    perks: [
      "100% Screen Share",
      "Instant Direct Traffic",
      "Zero Competition",
    ],
  };

  const displayName = categoryName === "all" ? "bidbento.lol" : categoryName;

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

      {/* Transparent animated mascot supplied by the project owner */}
      <div className="relative z-10 mb-3 flex w-full justify-center">
        <Image
          src="/bidbento-mascot-transparent.svg"
          alt="BidBento mascot scanning for an open category"
          width={272}
          height={270}
          priority
          unoptimized
          className="h-auto w-56 max-w-full drop-shadow-2xl sm:w-80 [@media(max-height:700px)]:w-40"
        />
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
