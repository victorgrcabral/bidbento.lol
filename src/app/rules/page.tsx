"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Language, getTranslation } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { BidBentoLogo } from "@/components/BidBentoLogo";
import {
  ChevronLeft,
  Scale,
  ShieldCheck,
  Zap,
  TrendingUp,
  HelpCircle,
  Sparkles,
  Layers,
  Flame,
  CheckCircle2,
} from "lucide-react";

export default function RulesPage() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    try {
      document.documentElement.classList.add("dark");
      const savedLang = localStorage.getItem("bidbento_lang") as Language;
      if (savedLang && (savedLang === "en" || savedLang === "es" || savedLang === "pt")) {
        setLanguage(savedLang);
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

  const fairnessTexts = {
    en: {
      badge: "DEMOCRATIC REAL ESTATE",
      title: "Why bidbento.lol is Fairer than Other Market Billboards",
      subtitle:
        "Most internet billboards and ranking directories suffer from extreme monopoly: giant corporations capture 99% of visual space, reducing smaller advertisers and indie creators to microscopic 1-pixel invisible dots.",
      perk1Title: "Multi-Page Balanced Bento Distribution",
      perk1Desc:
        "Every page on bidbento.lol accommodates up to 12 spacious bento slots. If your budget is $5 or $20, you can conquer huge visual dominance on Page 2 or Page 3 with prominent logos and high CTR, rather than being crushed into an invisible speck.",
      perk2Title: "Cumulative Equity (Never Expiring)",
      perk2Desc:
        "Your investment never resets or vanishes. Every dollar you bid permanently accumulates into your domain's total balance. You can top up anytime with small boosts to climb pages.",
      perk3Title: "Transparent Real-Time Traffic Attribution",
      perk3Desc:
        "Every click is tracked and displayed publicly in real-time. You get direct visitors to your product without hidden algorithms or pay-per-click bid auctions taking fees.",
    },
    es: {
      badge: "ESPACIO DEMOCRÁTICO",
      title: "Por qué bidbento.lol es más Justo que Otros Rankings del Mercado",
      subtitle:
        "La mayoría de carteleras en internet sufren de monopolio extremo: grandes corporaciones acaparan el 99% del espacio visual, dejando a creadores independientes y pequeñas empresas reducidos a puntos invisibles.",
      perk1Title: "Distribución Bento Equilibrada en Múltiples Páginas",
      perk1Desc:
        "Cada página en bidbento.lol aloja hasta 12 bloques bento destacados. Con presupuestos accesibles de $5 a $20 puedes dominar amplias áreas en las páginas 2 o 3 con gran visibilidad y altas tasas de clic.",
      perk2Title: "Capital Acumulativo Permanente",
      perk2Desc:
        "Tu dinero no desaparece ni se borra. Cada aporte se suma al historial de tu dominio. Puedes aplicar pequeños boosts para ascender posiciones a tu propio ritmo.",
      perk3Title: "Atribución de Clics Transparente y Directa",
      perk3Desc:
        "Todos los clics se auditan y publican en tiempo real. Recibes tráfico directo sin intermediarios ni comisiones ocultas por clic.",
    },
    pt: {
      badge: "ESPAÇO DEMOCRÁTICO",
      title: "Por que o bidbento.lol é mais Justo que Outros Rankings do Mercado",
      subtitle:
        "A maioria dos murais e rankings da internet são monopolizados: gigantes do mercado concentram 99% da tela e reduzem pequenos negócios e criadores independentes a pontos invisíveis de 1 pixel.",
      perk1Title: "Distribuição Bento Equilibrada em Múltiplas Páginas",
      perk1Desc:
        "Cada página do bidbento.lol divide a tela entre 12 blocos generosos. Com orçamentos acessíveis (de $5 a $20) sua marca conquista grande destaque visual nas páginas 2 ou 3, atraindo cliques reais dos usuários ao navegar.",
      perk2Title: "Saldo Acumulativo Vitalício",
      perk2Desc:
        "Seu investimento nunca expira ou é zerado. Cada aporte se soma ao histórico do seu domínio, permitindo dar boosts acessíveis para subir posições quando desejar.",
      perk3Title: "Rastreamento Transparente de Cliques",
      perk3Desc:
        "Cada clique é computado publicamente em tempo real. Tráfego direto para seu site, sem leilões diários caros de anúncios tradicionais.",
    },
  }[language] || {
    badge: "DEMOCRATIC REAL ESTATE",
    title: "Why bidbento.lol is Fairer than Other Market Billboards",
    subtitle:
      "Most internet billboards and ranking directories suffer from extreme monopoly: giant corporations capture 99% of visual space, reducing smaller advertisers and indie creators to microscopic 1-pixel invisible dots.",
    perk1Title: "Multi-Page Balanced Bento Distribution",
    perk1Desc:
      "Every page on bidbento.lol accommodates up to 12 spacious bento slots. If your budget is $5 or $20, you can conquer huge visual dominance on Page 2 or Page 3 with prominent logos and high CTR, rather than being crushed into an invisible speck.",
    perk2Title: "Cumulative Equity (Never Expiring)",
    perk2Desc:
      "Your investment never resets or vanishes. Every dollar you bid permanently accumulates into your domain's total balance. You can top up anytime with small boosts to climb pages.",
    perk3Title: "Transparent Real-Time Traffic Attribution",
    perk3Desc:
      "Every click is tracked and displayed publicly in real-time. You get direct visitors to your product without hidden algorithms or pay-per-click bid auctions taking fees.",
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white selection:bg-violet-600 selection:text-white p-4 sm:p-8 md:p-12 overflow-y-auto">
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
          <div className="mb-5">
            <BidBentoLogo withBadge={true} size="md" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            {t.rulesHeroTitle}
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            {t.rulesHeroDesc}
          </p>
        </div>

        {/* Highlighted Section: FAIRNESS & ACCESSIBILITY */}
        <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-violet-950/40 via-zinc-950 to-zinc-950 border border-violet-500/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-3xl pointer-events-none rounded-full" />

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-violet-400 mb-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>{fairnessTexts.badge}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
            {fairnessTexts.title}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mb-6 leading-relaxed">
            {fairnessTexts.subtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Layers className="w-4 h-4" />
                <span>{fairnessTexts.perk1Title}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {fairnessTexts.perk1Desc}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Flame className="w-4 h-4" />
                <span>{fairnessTexts.perk2Title}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {fairnessTexts.perk2Desc}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>{fairnessTexts.perk3Title}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {fairnessTexts.perk3Desc}
              </p>
            </div>
          </div>
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

          {/* Rule 2: Minimum Bid & Dilution */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {t.rule2Title}
              </h2>
            </div>
            <div className="space-y-3 text-sm text-zinc-300">
              <p className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{t.rule2Min}</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{t.rule2Grouping}</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{t.rule2Dilution}</span>
              </p>
            </div>
          </div>

          {/* Rule 3: Content Guidelines */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {t.rule3Title}
              </h2>
            </div>
            <p className="text-sm text-zinc-300 mb-4">{t.rule3Intro}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                <span>🚫</span>
                <span>{t.rule3Item1}</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                <span>🚫</span>
                <span>{t.rule3Item2}</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                <span>🚫</span>
                <span>{t.rule3Item3}</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                <span>🚫</span>
                <span>{t.rule3Item4}</span>
              </div>
            </div>
            <p className="text-xs text-zinc-500 italic">{t.rule3Warning}</p>
          </div>

          {/* Rule 4: Clicks & Transparency */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Scale className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {t.rule4Title}
              </h2>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {t.rule4Desc}
            </p>
          </div>

          {/* FAQ Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {t.faqTitle}
              </h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5">
                <h4 className="font-semibold text-sm text-white mb-1">
                  {t.faq1Q}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {t.faq1A}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5">
                <h4 className="font-semibold text-sm text-white mb-1">
                  {t.faq2Q}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {t.faq2A}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5">
                <h4 className="font-semibold text-sm text-white mb-1">
                  {t.faq3Q}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {t.faq3A}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-lg shadow-violet-600/30 border border-violet-400/30 transition-all transform hover:scale-105 active:scale-95"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>{t.rulesCta}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
