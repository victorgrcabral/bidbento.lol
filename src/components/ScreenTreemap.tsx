"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { BrandSpace } from "@/types";
import { CurrencyCode } from "@/lib/currency";
import { Language } from "@/lib/i18n";
import { computeSquarifiedTreemap } from "@/lib/treemap";
import { BrandBlock } from "./BrandBlock";
import { BrandHoverCard } from "./BrandHoverCard";
import { EmptyCategoryPlaceholder } from "./EmptyCategoryPlaceholder";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ScreenTreemapProps {
  brands: BrandSpace[];
  currency: CurrencyCode;
  language?: Language;
  categoryName?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onBoost: (brand: BrandSpace) => void;
  onOpenPurchase: () => void;
  presentationMode?: boolean;
}

export const ScreenTreemap: React.FC<ScreenTreemapProps> = ({
  brands,
  currency,
  language = "en",
  categoryName = "all",
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onBoost,
  onOpenPurchase,
  presentationMode = false,
}) => {
  const [selectedMobileBrand, setSelectedMobileBrand] = useState<BrandSpace | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [direction, setDirection] = useState(1);
  const prevPageRef = useRef(currentPage);

  const touchStartY = useRef<number | null>(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    if (currentPage !== prevPageRef.current) {
      setDirection(currentPage > prevPageRef.current ? 1 : -1);
      prevPageRef.current = currentPage;
    }
  }, [currentPage]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!selectedMobileBrand) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedMobileBrand(null);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selectedMobileBrand]);

  // Handle touch swipe on mobile for page changes
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null || !onPageChange || totalPages <= 1) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    touchStartY.current = null;

    // Swipe up (scrolling down): Go to next page (slide UP)
    if (diff > 45 && currentPage < totalPages) {
      setDirection(1);
      onPageChange(currentPage + 1);
    }
    // Swipe down (scrolling up): Go to previous page (slide DOWN)
    else if (diff < -45 && currentPage > 1) {
      setDirection(-1);
      onPageChange(currentPage - 1);
    }
  };

  // Handle mouse wheel for page changes with debounce
  const handleWheel = (e: React.WheelEvent) => {
    if (!onPageChange || totalPages <= 1 || isScrollingRef.current) return;

    if (Math.abs(e.deltaY) > 35) {
      isScrollingRef.current = true;
      if (e.deltaY > 0 && currentPage < totalPages) {
        setDirection(1);
        onPageChange(currentPage + 1);
      } else if (e.deltaY < 0 && currentPage > 1) {
        setDirection(-1);
        onPageChange(currentPage - 1);
      }
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 600);
    }
  };

  // Compute rectangular layout using pure squarified treemap algorithm
  const layoutBrands = useMemo(() => {
    if (!brands || brands.length === 0) return [];

    const items = brands.map((b) => ({
      data: b,
      value: Math.max(0.01, b.totalAmount),
    }));

    const layout = computeSquarifiedTreemap(items, {
      x: 0,
      y: 0,
      w: 100,
      h: 100,
    });

    return layout.map((item) => ({
      ...item.data,
      rect: item.rect,
    }));
  }, [brands]);

  if (!brands || brands.length === 0) {
    if (presentationMode) return <div className="h-full w-full bg-black" />;
    return (
      <EmptyCategoryPlaceholder
        categoryName={categoryName}
        language={language}
        onOpenPurchase={onOpenPurchase}
      />
    );
  }

  const slideVariants = {
    enter: (dir: number) => ({
      y: dir > 0 ? "100%" : "-100%",
      opacity: 0.9,
      scale: 0.98,
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        y: { type: "spring", stiffness: 280, damping: 32, mass: 0.9 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    },
    exit: (dir: number) => ({
      y: dir > 0 ? "-100%" : "100%",
      opacity: 0.6,
      scale: 0.96,
      transition: {
        y: { type: "spring", stiffness: 280, damping: 32, mass: 0.9 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    }),
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${presentationMode ? "bg-black" : "p-2 sm:p-3"}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <div className={`relative w-full h-full overflow-hidden ${presentationMode ? "bg-black pointer-events-none" : "rounded-3xl border border-slate-200/90 dark:border-white/10 bg-slate-200/50 dark:bg-black/40 backdrop-blur-sm shadow-inner dark:shadow-2xl"}`}>
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full h-full absolute inset-0"
          >
            {layoutBrands.map((brand) => (
              <BrandBlock
                key={brand.id}
                brand={brand}
                currency={currency}
                language={language}
                onBoost={onBoost}
                onSelectMobileBrand={(b) => setSelectedMobileBrand(b)}
                isMobile={isMobile}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Mobile Swipe Guidance indicator */}
        {isMobile && totalPages > 1 && !presentationMode && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 bg-black/70 backdrop-blur-md px-1.5 py-2.5 rounded-full border border-white/10 pointer-events-none z-20 opacity-70">
            {currentPage > 1 && <ChevronUp className="w-3.5 h-3.5 text-violet-400 animate-bounce" />}
            <span className="font-mono text-[9px] font-bold text-zinc-300">
              {currentPage}/{totalPages}
            </span>
            {currentPage < totalPages && <ChevronDown className="w-3.5 h-3.5 text-violet-400 animate-bounce" />}
          </div>
        )}
      </div>

      {/* Mobile Popover Modal */}
      <AnimatePresence>
        {selectedMobileBrand && isMobile && !presentationMode && (
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-black/85 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-sm"
            onClick={() => setSelectedMobileBrand(null)}
          >
            <BrandHoverCard
              brand={selectedMobileBrand}
              currency={currency}
              language={language}
              onClose={() => setSelectedMobileBrand(null)}
              onBoost={onBoost}
              isMobileModal={true}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
