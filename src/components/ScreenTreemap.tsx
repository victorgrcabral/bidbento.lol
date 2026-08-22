"use client";

import React, { useMemo, useState, useEffect } from "react";
import { BrandSpace } from "@/types";
import { CurrencyCode } from "@/lib/currency";
import { computeSquarifiedTreemap } from "@/lib/treemap";
import { BrandBlock } from "./BrandBlock";
import { BrandHoverCard } from "./BrandHoverCard";
import { AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface ScreenTreemapProps {
  brands: BrandSpace[];
  currency: CurrencyCode;
  onBoost: (brand: BrandSpace) => void;
  onOpenPurchase: () => void;
}

export const ScreenTreemap: React.FC<ScreenTreemapProps> = ({
  brands,
  currency,
  onBoost,
  onOpenPurchase,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedMobileBrand, setSelectedMobileBrand] = useState<BrandSpace | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Compute Treemap Layout Positions
  const positionedBrands = useMemo(() => {
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
        <h2 className="text-2xl font-bold text-white mb-2">A tela está vazia</h2>
        <p className="text-sm text-zinc-400 max-w-md mb-6">
          Seja a primeira marca a conquistar 100% de dominância no BidBento.lol por apenas $1.00!
        </p>
        <button
          onClick={onOpenPurchase}
          className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg shadow-violet-600/30 transition-all hover:scale-105 active:scale-95"
        >
          Conquistar a Tela Agora
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {positionedBrands.map((brand) => (
        <BrandBlock
          key={brand.id}
          brand={brand}
          currency={currency}
          onBoost={onBoost}
          onSelectMobileBrand={(b) => setSelectedMobileBrand(b)}
          isMobile={isMobile}
        />
      ))}

      {/* Mobile Popover Overlay */}
      <AnimatePresence>
        {isMobile && selectedMobileBrand && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMobileBrand(null)}
          >
            <BrandHoverCard
              brand={selectedMobileBrand}
              currency={currency}
              onClose={() => setSelectedMobileBrand(null)}
              onBoost={onBoost}
              isMobileModal
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
