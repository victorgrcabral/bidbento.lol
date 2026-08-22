"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  TrendingUp,
  AlertTriangle,
  MousePointerClick,
  ChevronLeft,
  HelpCircle,
} from "lucide-react";
import { Language, getTranslation } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";

export default function RulesPage() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("bidbento_lang") as Language;
      if (savedLang && (savedLang === "en" || savedLang === "es" || savedLang === "pt")) {
        setLanguage(savedLang);
      } else {
        const userLocale = navigator.language.toLowerCase();
        if (userLocale.startsWith("pt")) {
          setLanguage("pt");
        } else if (userLocale.startsWith("es")) {
          setLanguage("es");
        }
      }
    } catch {}
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem("bidbento_lang", lang);
    } catch {}
  };

  const t = getTranslation(language);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-600 selection:text-white p-4 sm:p-8 md:p-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Top Navigation */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white bg-zinc-900 border border-white/10 px-4 py-2 rounded-full transition-all hover:border-violet-500/50"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t.backToHome}</span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageToggle
              language={language}
              onLanguageChange={handleLanguageChange}
            />

            <span className="text-xs font-mono text-violet-400 bg-violet-950/60 border border-violet-500/30 px-3 py-1.5 rounded-full">
              {t.rulesTitle}
            </span>
          </div>
        </div>

        {/* Header Hero */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex p-3 rounded-2xl bg-violet-600/20 text-violet-400 border border-violet-500/30 mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            {t.rulesHeroTitle}
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            {t.rulesHeroDesc}
          </p>
        </div>

        {/* Rules Grid */}
        <div className="space-y-6">
          {/* Rule 1: The Screen Space Dynamics */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {t.rule1Title}
              </h2>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              {t.rule1Desc}
            </p>
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5 font-mono text-xs text-violet-300">
              <code>{t.rule1Formula}</code>
            </div>
          </div>

          {/* Rule 2: Cumulative Sum and Dilution */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {t.rule2Title}
              </h2>
            </div>
            <ul className="space-y-3 text-sm text-zinc-300">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>{t.rule2Min}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>{t.rule2Grouping}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>{t.rule2Dilution}</span>
              </li>
            </ul>
          </div>

          {/* Rule 3: Content Guidelines */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {t.rule3Title}
              </h2>
            </div>
            <p className="text-sm text-zinc-300 mb-3">
              {t.rule3Intro}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-400 mb-4">
              <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-red-300 font-medium">
                ❌ {t.rule3Item1}
              </div>
              <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-red-300 font-medium">
                ❌ {t.rule3Item2}
              </div>
              <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-red-300 font-medium">
                ❌ {t.rule3Item3}
              </div>
              <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-red-300 font-medium">
                ❌ {t.rule3Item4}
              </div>
            </div>
            <p className="text-xs text-zinc-500 italic">
              {t.rule3Warning}
            </p>
          </div>

          {/* Rule 4: Tracking and Clicks */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <MousePointerClick className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {t.rule4Title}
              </h2>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {t.rule4Desc}
            </p>
          </div>

          {/* FAQ */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {t.faqTitle}
              </h2>
            </div>

            <div className="space-y-4 text-sm">
              <div className="border-b border-white/5 pb-4">
                <h3 className="font-bold text-white mb-1">
                  {t.faq1Q}
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  {t.faq1A}
                </p>
              </div>

              <div className="border-b border-white/5 pb-4">
                <h3 className="font-bold text-white mb-1">
                  {t.faq2Q}
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  {t.faq2A}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white mb-1">
                  {t.faq3Q}
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  {t.faq3A}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center pb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-xl shadow-violet-600/30 transition-all active:scale-95"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>{t.rulesCta}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
