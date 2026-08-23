"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Layers } from "lucide-react";
import { Language, getTranslation } from "@/lib/i18n";
import { getCategoryOptions } from "@/lib/categories";

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  availableCategories: string[];
  categoryTotals: { category: string; totalAmount: number }[];
  language?: Language;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  availableCategories,
  categoryTotals,
  language = "en",
}) => {
  const t = getTranslation(language);
  const [visibleLimit, setVisibleLimit] = useState(6);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const categoryMap = useMemo(() => {
    const configured = getCategoryOptions(language);
    const configuredKeys = new Set(configured.map((category) => category.key));
    const dynamic = availableCategories
      .filter((category) => !configuredKeys.has(category))
      .map((category) => ({ key: category, label: category }));
    const totalMap = new Map(categoryTotals.map((item) => [item.category, item.totalAmount]));
    const orderMap = new Map([...configured, ...dynamic].map((category, index) => [category.key, index]));
    const ordered = [...configured, ...dynamic].sort((first, second) => {
      const amountDifference = (totalMap.get(second.key) || 0) - (totalMap.get(first.key) || 0);
      return amountDifference || (orderMap.get(first.key) || 0) - (orderMap.get(second.key) || 0);
    });
    const allLabel = language === "pt" ? "Todos" : language === "es" ? "Todos" : "All";
    return [{ key: "all", label: allLabel }, ...ordered];
  }, [availableCategories, categoryTotals, language]);

  useEffect(() => {
    const updateLimit = () => {
      if (window.innerWidth >= 1600) setVisibleLimit(10);
      else if (window.innerWidth >= 1440) setVisibleLimit(8);
      else if (window.innerWidth >= 1200) setVisibleLimit(6);
      else if (window.innerWidth >= 1024) setVisibleLimit(5);
      else setVisibleLimit(4);
    };
    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsMoreOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMoreOpen(false);
    };
    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const visibleCategories = categoryMap.slice(0, visibleLimit + 1);
  const moreCategories = categoryMap.slice(visibleLimit + 1);
  const moreLabel = language === "pt" ? "Ver mais categorias" : language === "es" ? "Ver más categorías" : "More categories";
  const buttonClass = (active: boolean) => `shrink-0 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus:outline-none focus:ring-2 focus:ring-violet-400 active:scale-[0.98] ${active ? "bg-violet-600 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`;

  return (
    <nav aria-label={t.categoryLabel} className="w-full pointer-events-auto">
      <select
        value={selectedCategory}
        onChange={(event) => onSelectCategory(event.target.value)}
        className="md:hidden w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-violet-500"
      >
        {categoryMap.map((category) => <option key={category.key} value={category.key}>{category.label}</option>)}
      </select>

      <div className="relative hidden md:flex h-11 items-center gap-1 rounded-full border border-white/10 bg-zinc-950/90 p-1 shadow-xl shadow-black/50 backdrop-blur-xl">
        {visibleCategories.map((category) => (
          <button key={category.key} type="button" onClick={() => onSelectCategory(category.key)} className={buttonClass(selectedCategory === category.key)}>
            <span className="flex items-center gap-1">
              {category.key === "all" ? <Layers className="h-3 w-3" /> : null}
              {category.label}
            </span>
          </button>
        ))}

        {moreCategories.length > 0 && (
          <div ref={menuRef} className="relative ml-auto shrink-0">
            <button
              type="button"
              aria-expanded={isMoreOpen}
              onClick={() => setIsMoreOpen((open) => !open)}
              className={buttonClass(moreCategories.some((category) => category.key === selectedCategory))}
            >
              {moreLabel} ▾
            </button>
            {isMoreOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 grid max-h-80 min-w-64 grid-cols-2 gap-1 overflow-y-auto rounded-2xl border border-white/10 bg-[#181818] p-2 shadow-2xl">
                {moreCategories.map((category) => (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => { onSelectCategory(category.key); setIsMoreOpen(false); }}
                    className={`rounded-lg px-3 py-2 text-left text-xs font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus:outline-none focus:ring-2 focus:ring-violet-400 active:scale-[0.98] ${selectedCategory === category.key ? "bg-violet-600 text-white" : "text-zinc-300 hover:bg-[#272727]"}`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
