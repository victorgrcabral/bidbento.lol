"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SpacesResponse, BrandSpace } from "@/types";
import { CurrencyCode } from "@/lib/currency";
import { Language, getTranslation } from "@/lib/i18n";
import { ScreenTreemap } from "@/components/ScreenTreemap";
import { BottomConversionBar } from "@/components/BottomConversionBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { PurchaseModal } from "@/components/PurchaseModal";
import { BoostModal } from "@/components/BoostModal";
import { LeaderboardDrawer } from "@/components/LeaderboardDrawer";
import { BidBentoLogo } from "@/components/BidBentoLogo";
import { LiveStatsPill } from "@/components/LiveStatsPill";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const [data, setData] = useState<SpacesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [language, setLanguage] = useState<Language>("en");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Modals & Drawers
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [boostTargetBrand, setBoostTargetBrand] = useState<BrandSpace | null>(null);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const t = getTranslation(language);

  // Auto-detect language and currency & ensure dark mode
  useEffect(() => {
    try {
      document.documentElement.classList.add("dark");

      // 1. Language
      const savedLang = localStorage.getItem("bidbento_lang") as Language;
      if (savedLang && (savedLang === "en" || savedLang === "es" || savedLang === "pt")) {
        setLanguage(savedLang);
      } else {
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith("pt")) {
          setLanguage("pt");
        } else if (browserLang.startsWith("es")) {
          setLanguage("es");
        } else {
          setLanguage("en");
        }
      }

      // 2. Currency
      const savedCurrency = localStorage.getItem("bidbento_currency") as CurrencyCode;
      if (savedCurrency && (savedCurrency === "USD" || savedCurrency === "EUR" || savedCurrency === "BRL")) {
        setCurrency(savedCurrency);
      }
    } catch {}
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem("bidbento_lang", lang);
    } catch {}
  };

  const handleCurrencyChange = (curr: CurrencyCode) => {
    setCurrency(curr);
    try {
      localStorage.setItem("bidbento_currency", curr);
    } catch {}
  };

  const fetchSpaces = useCallback(async () => {
    try {
      const url = new URL("/api/spaces", window.location.origin);
      url.searchParams.set("page", currentPage.toString());
      if (selectedCategory && selectedCategory !== "all") {
        url.searchParams.set("category", selectedCategory);
      }

      const res = await fetch(url.toString(), { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to fetch spaces:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedCategory]);

  useEffect(() => {
    fetchSpaces();
    // Fast polling for real-time live canvas changes
    const interval = setInterval(fetchSpaces, 4000);
    return () => clearInterval(interval);
  }, [fetchSpaces]);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  // Check URL params for payment success notification
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("success") === "true") {
        const domain = params.get("domain") || "your brand";
        setSuccessToast(t.spacePurchasedToast(domain));
        window.history.replaceState({}, "", "/");
        fetchSpaces();
        setTimeout(() => setSuccessToast(null), 6000);
      }
    }
  }, [fetchSpaces, t]);

  const handleBoost = (brand: BrandSpace) => {
    setBoostTargetBrand(brand);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#050508] text-white flex flex-col justify-between select-none">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-violet-600/15 blur-3xl pointer-events-none rounded-full" />

      {/* Top Header Navbar */}
      <header className="absolute top-0 left-0 right-0 z-40 h-14 px-3 sm:px-4 flex items-center justify-between gap-3 pointer-events-none">
        {/* Left Logo */}
        <div className="pointer-events-auto shrink-0 hidden sm:block">
          <BidBentoLogo
            withBadge={true}
            size="sm"
            onClick={() => {
              setSelectedCategory("all");
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Center Category Filter */}
        <div className="pointer-events-auto flex-1 max-w-full sm:max-w-xl md:max-w-2xl flex justify-center overflow-x-auto no-scrollbar mx-auto">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            availableCategories={data?.availableCategories || []}
            language={language}
          />
        </div>

        {/* Right Live Stats */}
        <div className="pointer-events-auto shrink-0 hidden md:block">
          <LiveStatsPill language={language} />
        </div>
      </header>

      {/* Main Screen Treemap Area with Vertical Swipe/Scroll Page Navigation */}
      <div className="relative w-full flex-1 pt-14 pb-24 md:pb-20 overflow-hidden">
        {isLoading && !data ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-zinc-400 font-mono tracking-wider">
              {t.loading}
            </span>
          </div>
        ) : (
          <ScreenTreemap
            brands={data?.brands || []}
            currency={currency}
            language={language}
            categoryName={selectedCategory}
            currentPage={data?.page || 1}
            totalPages={data?.totalPages || 1}
            onPageChange={(p) => setCurrentPage(p)}
            onBoost={handleBoost}
            onOpenPurchase={() => setIsPurchaseOpen(true)}
          />
        )}
      </div>

      {/* Bottom Conversion Bar with Pagination, Language Switcher & Real-Time Stats */}
      <BottomConversionBar
        brands={data?.brands || []}
        totalAmount={data?.totalAmount || 0}
        totalClicks={data?.totalClicks || 0}
        currentPage={data?.page || 1}
        totalPages={data?.totalPages || 1}
        onPageChange={(p) => setCurrentPage(p)}
        leader={data?.leader || null}
        lastBid={data?.lastBid || null}
        currency={currency}
        onCurrencyChange={handleCurrencyChange}
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenPurchase={() => setIsPurchaseOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
      />

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={isPurchaseOpen}
        onClose={() => setIsPurchaseOpen(false)}
        totalPoolAmount={data?.totalAmount || 0}
        existingBrands={data?.brands || []}
        currency={currency}
        language={language}
        initialCategory={selectedCategory}
        onSuccess={() => {
          fetchSpaces();
          setSuccessToast(t.spacePurchasedToast(""));
          setTimeout(() => setSuccessToast(null), 5000);
        }}
      />

      {/* Boost Modal */}
      <BoostModal
        brand={boostTargetBrand}
        isOpen={Boolean(boostTargetBrand)}
        onClose={() => setBoostTargetBrand(null)}
        totalPoolAmount={data?.totalAmount || 0}
        currency={currency}
        language={language}
        onSuccess={() => {
          fetchSpaces();
          setSuccessToast(t.boostAppliedToast);
          setTimeout(() => setSuccessToast(null), 5000);
        }}
      />

      {/* Leaderboard Drawer */}
      <LeaderboardDrawer
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        brands={data?.brands || []}
        currency={currency}
        language={language}
        onBoost={handleBoost}
      />

      {/* Success Notification Toast */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-black px-5 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-2.5 border border-emerald-400"
          >
            <CheckCircle2 className="w-5 h-5 text-black" />
            <span className="text-xs sm:text-sm">{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
