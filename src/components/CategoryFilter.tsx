"use client";

import React from "react";
import { Sparkles, Layers } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  availableCategories: string[];
}

const DEFAULT_CATEGORIES = [
  "Todos",
  "Developer Tools",
  "SaaS",
  "IA / Machine Learning",
  "Design & UI",
  "Fintech",
  "Crypto / Web3",
  "Produtividade",
  "E-commerce",
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  availableCategories,
}) => {
  // Combine defaults with any custom from DB
  const categories = Array.from(
    new Set(["Todos", ...DEFAULT_CATEGORIES, ...availableCategories])
  );

  return (
    <div className="absolute top-3 left-0 right-0 z-30 pointer-events-none flex justify-center px-4">
      <div className="flex items-center gap-1.5 p-1 bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-full max-w-full overflow-x-auto no-scrollbar shadow-lg pointer-events-auto">
        {categories.map((cat) => {
          const isActive =
            (cat === "Todos" && selectedCategory === "all") ||
            selectedCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat === "Todos" ? "all" : cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-500/40"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              {cat === "Todos" ? <Layers className="w-3 h-3" /> : null}
              <span>{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
