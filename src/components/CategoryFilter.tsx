"use client";

import React from "react";
import { Layers } from "lucide-react";
import { Language, getTranslation } from "@/lib/i18n";

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

  const categoryMap: { key: string; label: string }[] = [
    { key: "all", label: t.categories.all },
    { key: "Developer Tools", label: t.categories.devTools },
    { key: "SaaS", label: t.categories.saas },
    { key: "IA / Machine Learning", label: t.categories.ai },
    { key: "Design & UI", label: t.categories.design },
    { key: "Fintech", label: t.categories.fintech },
    { key: "Crypto / Web3", label: t.categories.crypto },
    { key: "Produtividade", label: t.categories.productivity },
    { key: "E-commerce", label: t.categories.ecommerce },
  ];

  return (
    <div className="absolute top-3 left-0 right-0 z-30 pointer-events-none flex justify-center px-4">
      <div className="flex items-center gap-1.5 p-1 bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-full max-w-full overflow-x-auto no-scrollbar shadow-lg pointer-events-auto">
        {categoryMap.map((cat) => {
          const isActive = selectedCategory === cat.key;

          return (
            <button
              key={cat.key}
              onClick={() => onSelectCategory(cat.key)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-500/40"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              {cat.key === "all" ? <Layers className="w-3 h-3" /> : null}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
