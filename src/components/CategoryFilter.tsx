"use client";

import React from "react";
import { Layers } from "lucide-react";
import { Language, getTranslation } from "@/lib/i18n";
import { getCategoryOptions } from "@/lib/categories";

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  availableCategories: string[];
  language?: Language;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  availableCategories,
  language = "en",
}) => {
  const t = getTranslation(language);

  const configuredCategories = getCategoryOptions(language, true);
  const configuredKeys = new Set(configuredCategories.map((category) => category.key));
  const categoryMap = [
    ...configuredCategories,
    ...availableCategories
      .filter((category) => !configuredKeys.has(category))
      .map((category) => ({ key: category, label: category })),
  ];

  return (
    <nav aria-label={t.categoryLabel} className="w-full pointer-events-auto">
      <select
        value={selectedCategory}
        onChange={(event) => onSelectCategory(event.target.value)}
        className="md:hidden w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-violet-500"
      >
        {categoryMap.map((category) => (
          <option key={category.key} value={category.key}>{category.label}</option>
        ))}
      </select>

      <div className="hidden md:flex flex-wrap items-center justify-center gap-1 p-1 bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl shadow-black/50">
        {categoryMap.map((cat) => {
        const isActive = selectedCategory === cat.key;

        return (
          <button
            key={cat.key}
            onClick={() => onSelectCategory(cat.key)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-400 active:scale-[0.98] ${
              isActive
                ? "bg-violet-600 text-white shadow-sm shadow-violet-500/40"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
            }`}
          >
            {cat.key === "all" ? <Layers className="w-3 h-3" /> : null}
            <span>{cat.label}</span>
          </button>
        );
        })}
      </div>
    </nav>
  );
};
