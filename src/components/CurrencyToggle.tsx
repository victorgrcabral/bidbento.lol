"use client";

import React from "react";
import { CurrencyCode, SUPPORTED_CURRENCIES } from "@/lib/currency";
import { DollarSign, Globe } from "lucide-react";

interface CurrencyToggleProps {
  currentCurrency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
}

export const CurrencyToggle: React.FC<CurrencyToggleProps> = ({
  currentCurrency,
  onCurrencyChange,
}) => {
  return (
    <div className="flex items-center gap-1 bg-zinc-900/80 backdrop-blur-md border border-white/10 p-1 rounded-full text-xs text-zinc-300">
      {(Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[]).map((code) => {
        const item = SUPPORTED_CURRENCIES[code];
        const isActive = currentCurrency === code;
        return (
          <button
            key={code}
            onClick={() => onCurrencyChange(code)}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              isActive
                ? "bg-violet-600 text-white shadow-sm shadow-violet-500/50"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
            }`}
          >
            {item.symbol} {item.code}
          </button>
        );
      })}
    </div>
  );
};
