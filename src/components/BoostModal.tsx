"use client";

import React, { useState, useMemo } from "react";
import { BrandSpace } from "@/types";
import { CurrencyCode, formatCurrency, SUPPORTED_CURRENCIES } from "@/lib/currency";
import { getFaviconUrl } from "@/lib/utils";
import { Language, getTranslation } from "@/lib/i18n";
import { getAnonymousSessionId } from "@/lib/analytics-client";
import { X, Zap, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface BoostModalProps {
  brand: BrandSpace | null;
  isOpen: boolean;
  onClose: () => void;
  totalPoolAmount: number;
  currency: CurrencyCode;
  language?: Language;
  onSuccess: () => void;
}

const BOOST_PRESETS_USD = [5, 10, 25, 50, 100];
const BOOST_PRESETS_EUR = [5, 10, 25, 50, 100];
const BOOST_PRESETS_BRL = [25, 50, 100, 250, 500];

export const BoostModal: React.FC<BoostModalProps> = ({
  brand,
  isOpen,
  onClose,
  totalPoolAmount,
  currency = "USD",
  language = "en",
  onSuccess,
}) => {
  const t = getTranslation(language);

  const presets = useMemo(() => {
    if (currency === "BRL") return BOOST_PRESETS_BRL;
    if (currency === "EUR") return BOOST_PRESETS_EUR;
    return BOOST_PRESETS_USD;
  }, [currency]);

  const currencySymbol = SUPPORTED_CURRENCIES[currency]?.symbol || "$";
  const currencyRate = SUPPORTED_CURRENCIES[currency]?.rateAgainstUSD || 1.0;

  const [amount, setAmount] = useState<number>(presets[2] || 25);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const calculation = useMemo(() => {
    if (!brand) return { projectedPercentage: 0, newTotalUSD: 0, enteredAmountUSD: 0 };
    const rawVal = Math.max(1, amount || 0);
    const enteredAmountUSD = currency === "USD" ? rawVal : rawVal / currencyRate;
    const newBrandTotalUSD = brand.totalAmount + enteredAmountUSD;
    const newPoolUSD = totalPoolAmount + enteredAmountUSD;
    const projectedPercentage = Number(((newBrandTotalUSD / newPoolUSD) * 100).toFixed(1));
    return { projectedPercentage, newTotalUSD: newBrandTotalUSD, enteredAmountUSD };
  }, [brand, amount, totalPoolAmount, currency, currencyRate]);

  if (!isOpen || !brand) return null;

  const logo = brand.logoUrl || getFaviconUrl(brand.domain);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!amount || calculation.enteredAmountUSD < 1.0) {
      setErrorMessage(t.minAmountError);
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/boost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId: brand.id,
          amount,
          currency,
          sessionId: getAnonymousSessionId(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process boost");
      }

      if (!data.url) throw new Error("A Stripe não retornou a URL do checkout.");
      window.location.href = data.url;
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl text-white relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 p-2 flex items-center justify-center shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt={brand.name} className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{t.boostTitle(brand.name)}</h2>
            <p className="text-xs text-zinc-400 font-mono">{brand.domain}</p>
          </div>
        </div>

        {/* Prediction Card */}
        <div className="p-4 rounded-2xl bg-violet-950/40 border border-violet-500/30 mb-5">
          <div className="flex items-center justify-between text-xs text-violet-300 mb-1">
            <span className="flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> {t.newDominance}
            </span>
            <span className="font-mono text-zinc-400">
              {t.currentShare(brand.percentage)}
            </span>
          </div>
          <div className="text-2xl font-black text-white">
            {calculation.projectedPercentage}% {t.ofThePage}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            {t.newTotalAccumulated(formatCurrency(calculation.newTotalUSD, currency))}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              {t.chooseBoostAmount} ({currency})
            </label>
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {presets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer font-mono ${
                    amount === val
                      ? "bg-violet-600 border-violet-400 text-white shadow-md shadow-violet-600/40"
                      : "bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  +{currencySymbol}{val}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm font-mono">
                {currencySymbol}
              </span>
              <input
                type="number"
                min="1"
                step="any"
                value={amount || ""}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                placeholder={t.orCustomAmount}
                className="w-full pl-8 pr-4 py-2.5 bg-zinc-900/90 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500 transition-colors font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.processing}</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                <span>{t.applyBoostBtn(formatCurrency(calculation.enteredAmountUSD, currency))}</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
