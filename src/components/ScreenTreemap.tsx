"use client";

import React, { useMemo, useState, useEffect } from "react";
import { BrandSpace } from "@/types";
import { CurrencyCode } from "@/lib/currency";
import { Language, getTranslation } from "@/lib/i18n";
import { computeSquarifiedTreemap } from "@/lib/treemap";
import { BrandBlock } from "./BrandBlock";
import { BrandHoverCard } from "./BrandHoverCard";
import { AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface ScreenTreemapProps {
  brands: BrandSpace[];
  currency: CurrencyCode;
  language?: Language;
  onBoost: (brand: BrandSpace) => void;
  onOpenPurchase: () => void;
}

export const ScreenTreemap: React.FC<ScreenTreemapProps> = ({
  brands,
  currency,
  language = "en",
  onBoost,
  onOpenPurchase,
}) => {
  const t = getTranslation(language);
  const [selectedMobileBrand, setSelectedMobileBrand] = useState<BrandSpace | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-5 text-violet-400">
          <Sparkles className="w-10 h-10 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{t.emptyTitle}</h2>
        <p className="text-sm text-zinc-400 max-w-md mb-6">
          {t.emptyDesc}
        </p>
        <button
          onClick={onOpenPurchase}
          className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm px-6 py-3 rounded-full shadow-lg shadow-violet-600/30 transition-transform active:scale-95"
        >
          {t.claimNow}
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full p-2 sm:p-3 overflow-hidden">
      <div className="relative w-full h-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl">
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
      </div>

      {/* Mobile Popover Modal */}
      <AnimatePresence>
        {selectedMobileBrand && isMobile && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
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
