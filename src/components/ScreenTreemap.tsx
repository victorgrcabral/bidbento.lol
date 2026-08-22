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
}) => {
  const [selectedMobileBrand, setSelectedMobileBrand] = useState<BrandSpace | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const touchStartY = useRef<number | null>(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle touch swipe on mobile for page changes
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null || !onPageChange || totalPages <= 1) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    touchStartY.current = null;

    // Swipe up (scrolling down): Go to next page
    if (diff > 45 && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
    // Swipe down (scrolling up): Go to previous page
    else if (diff < -45 && currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Handle mouse wheel for page changes with debounce
  const handleWheel = (e: React.WheelEvent) => {
    if (!onPageChange || totalPages <= 1 || isScrollingRef.current) return;

    if (Math.abs(e.deltaY) > 35) {
      isScrollingRef.current = true;
      if (e.deltaY > 0 && currentPage < totalPages) {
        onPageChange(currentPage + 1);
      } else if (e.deltaY < 0 && currentPage > 1) {
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
    return (
      <EmptyCategoryPlaceholder
        categoryName={categoryName}
        language={language}
        onOpenPurchase={onOpenPurchase}
      />
    );
  }

  return (
    <div
      className="relative w-full h-full p-2 sm:p-3 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <div className="relative w-full h-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full relative"
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
        {isMobile && totalPages > 1 && (
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
        {selectedMobileBrand && isMobile && (
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
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
