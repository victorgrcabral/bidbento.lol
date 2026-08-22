"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SpacesResponse, BrandSpace } from "@/types";
import { CurrencyCode } from "@/lib/currency";
import { ScreenTreemap } from "@/components/ScreenTreemap";
import { BottomConversionBar } from "@/components/BottomConversionBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { PurchaseModal } from "@/components/PurchaseModal";
import { BoostModal } from "@/components/BoostModal";
import { LeaderboardDrawer } from "@/components/LeaderboardDrawer";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const [data, setData] = useState<SpacesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Modals & Drawers
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [boostTargetBrand, setBoostTargetBrand] = useState<BrandSpace | null>(null);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Auto-detect currency by browser locale
  useEffect(() => {
    try {
      const userLocale = navigator.language.toLowerCase();
      if (userLocale.includes("pt") || userLocale.includes("br")) {
        setCurrency("BRL");
      } else if (
        userLocale.includes("de") ||
        userLocale.includes("fr") ||
        userLocale.includes("es") ||
        userLocale.includes("it")
      ) {
        setCurrency("EUR");
      }
    } catch {
      // Keep USD default
    }
  }, []);

  // Fetch Spaces Data with Pagination and Category Filter
  const fetchSpaces = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        category: selectedCategory,
      });

      const res = await fetch(`/api/spaces?${params.toString()}`, { cache: "no-store" });
      if (res.ok) {
        const json: SpacesResponse = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Failed to fetch spaces:", e);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedCategory]);

  // Poll for real-time updates every 4 seconds
  useEffect(() => {
    fetchSpaces();
    const interval = setInterval(fetchSpaces, 4000);
    return () => clearInterval(interval);
  }, [fetchSpaces]);

  // Reset to page 1 when changing category filter
  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  // Check URL params for payment success notification
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("success") === "true") {
        const domain = params.get("domain") || "sua marca";
        setSuccessToast(`🎉 Espaço garantido com sucesso para ${domain}!`);
        window.history.replaceState({}, "", "/");
        fetchSpaces();
        setTimeout(() => setSuccessToast(null), 6000);
      }
    }
  }, [fetchSpaces]);

  const handleBoost = (brand: BrandSpace) => {
    setBoostTargetBrand(brand);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black flex flex-col justify-between select-none">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-violet-600/10 blur-3xl pointer-events-none rounded-full" />

      {/* Top Category Filter Chips */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        availableCategories={data?.availableCategories || []}
      />

      {/* Main Screen Treemap Area */}
      <div className="relative w-full flex-1 pt-14 pb-24 md:pb-20 overflow-hidden">
        {isLoading && !data ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-zinc-400 font-mono tracking-wider">
              CARREGANDO O MYSPACE...
            </span>
          </div>
        ) : (
          <ScreenTreemap
            brands={data?.brands || []}
            currency={currency}
            onBoost={handleBoost}
            onOpenPurchase={() => setIsPurchaseOpen(true)}
          />
        )}
      </div>

      {/* Bottom Conversion Bar with Pagination */}
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
        onCurrencyChange={(c) => setCurrency(c)}
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
        onSuccess={() => {
          fetchSpaces();
          setSuccessToast("🚀 Espaço adquirido com sucesso!");
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
        onSuccess={() => {
          fetchSpaces();
          setSuccessToast("⚡ Boost aplicado com sucesso!");
          setTimeout(() => setSuccessToast(null), 5000);
        }}
      />

      {/* Leaderboard Drawer */}
      <LeaderboardDrawer
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        brands={data?.brands || []}
        currency={currency}
        onBoost={handleBoost}
      />

      {/* Success Notification Toast */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-xs sm:text-sm font-semibold"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
