"use client";

import React, { useState, useMemo, useEffect } from "react";
import { BrandSpace } from "@/types";
import { CurrencyCode, formatCurrency, SUPPORTED_CURRENCIES } from "@/lib/currency";
import { normalizeDomain, getFaviconUrl } from "@/lib/utils";
import { parseCustomColor } from "@/lib/colors";
import { Language, getTranslation } from "@/lib/i18n";
import { getCategoryOptions } from "@/lib/categories";
import { getAnonymousSessionId } from "@/lib/analytics-client";
import {
  X,
  Zap,
  TrendingUp,
  Globe,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Palette,
  Tag,
} from "lucide-react";
import { motion } from "framer-motion";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPoolAmount: number;
  existingBrands: BrandSpace[];
  currency: CurrencyCode;
  language?: Language;
  initialCategory?: string;
  onSuccess: () => void;
}

const PRESET_AMOUNTS_USD = [5, 15, 30, 50, 100, 250];
const PRESET_AMOUNTS_EUR = [5, 15, 30, 50, 100, 250];
const PRESET_AMOUNTS_BRL = [25, 75, 150, 250, 500, 1000];

const PRESET_COLORS = [
  "#7c3aed", // Violet
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#000000", // Black
];

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  totalPoolAmount,
  existingBrands,
  currency = "USD",
  language = "en",
  initialCategory = "SaaS",
  onSuccess,
}) => {
  const t = getTranslation(language);

  const categories = getCategoryOptions(language);

  const activePresets = useMemo(() => {
    if (currency === "BRL") return PRESET_AMOUNTS_BRL;
    if (currency === "EUR") return PRESET_AMOUNTS_EUR;
    return PRESET_AMOUNTS_USD;
  }, [currency]);

  const currencySymbol = SUPPORTED_CURRENCIES[currency]?.symbol || "$";
  const currencyRate = SUPPORTED_CURRENCIES[currency]?.rateAgainstUSD || 1.0;

  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState("SaaS");

  useEffect(() => {
    if (initialCategory && initialCategory !== "all") {
      setCategory(initialCategory);
    }
  }, [initialCategory, isOpen]);

  const [color, setColor] = useState("#7c3aed");
  const [customColorInput, setCustomColorInput] = useState("");
  const [isCustomColorMode, setIsCustomColorMode] = useState(false);
  const [customColorError, setCustomColorError] = useState<string | null>(null);

  const [amount, setAmount] = useState<number>(activePresets[1] || 15);
  const [customAmount, setCustomAmount] = useState<string>("");

  useEffect(() => {
    setAmount(activePresets[1] || 15);
    setCustomAmount("");
  }, [currency, activePresets]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-detect existing brand by domain
  const detectedDomain = useMemo(() => {
    if (!websiteUrl.trim()) return null;
    return normalizeDomain(websiteUrl);
  }, [websiteUrl]);

  const existingBrand = useMemo(() => {
    if (!detectedDomain) return null;
    return existingBrands.find((b) => b.domain === detectedDomain);
  }, [detectedDomain, existingBrands]);

  // Autofill if domain exists
  useEffect(() => {
    if (existingBrand) {
      setName(existingBrand.name);
      if (existingBrand.logoUrl) setLogoUrl(existingBrand.logoUrl);
      if (existingBrand.color) setColor(existingBrand.color);
      if (existingBrand.category) setCategory(existingBrand.category);
    }
  }, [existingBrand]);

  // Real-time Treemap Dominance Calculation (normalized in USD for calculation)
  const calculation = useMemo(() => {
    const rawVal = customAmount ? parseFloat(customAmount) || 0 : amount;
    // Normalize to USD for math percentage calculation
    const enteredAmountUSD = currency === "USD" ? rawVal : rawVal / currencyRate;
    const existingAmountUSD = existingBrand?.totalAmount || 0;
    const newBrandTotalUSD = existingAmountUSD + enteredAmountUSD;

    const newTotalPoolUSD = existingBrand
      ? totalPoolAmount + enteredAmountUSD
      : totalPoolAmount + enteredAmountUSD;

    const projectedPercentage =
      newTotalPoolUSD > 0
        ? Number(((newBrandTotalUSD / newTotalPoolUSD) * 100).toFixed(1))
        : 100;

    const simulatedList = [
      ...existingBrands.filter((b) => b.domain !== detectedDomain),
      { totalAmount: newBrandTotalUSD },
    ].sort((a, b) => b.totalAmount - a.totalAmount);

    const projectedRank =
      simulatedList.findIndex((item) => item.totalAmount === newBrandTotalUSD) + 1;

    return {
      enteredAmountRaw: rawVal,
      enteredAmountUSD,
      newBrandTotalUSD,
      newTotalPoolUSD,
      projectedPercentage,
      projectedRank: projectedRank > 0 ? projectedRank : 1,
    };
  }, [amount, customAmount, existingBrand, existingBrands, totalPoolAmount, detectedDomain, currency, currencyRate]);

  const handleCustomColorChange = (value: string) => {
    setCustomColorInput(value);
    const parsed = parseCustomColor(value);
    if (parsed.isValid) {
      setColor(parsed.hex);
      setCustomColorError(null);
    } else if (value.trim()) {
      setCustomColorError("Invalid format. Use HEX (#7c3aed), RGB (rgb(124, 58, 237)) or CMYK.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !websiteUrl.trim()) {
      setErrorMessage(t.requiredFieldsError);
      return;
    }

    if (calculation.enteredAmountUSD < 1.0) {
      setErrorMessage(t.minAmountError);
      return;
    }

    try {
      setIsSubmitting(true);
      const finalLogoUrl = logoUrl.trim();

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          websiteUrl: websiteUrl.trim(),
          logoUrl: finalLogoUrl || undefined,
          tagline: tagline.trim() || undefined,
          category,
          color,
          amount: calculation.enteredAmountRaw,
          currency,
          sessionId: getAnonymousSessionId(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process checkout");
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl text-white relative max-h-[92vh] overflow-y-auto my-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <Zap className="w-4 h-4 fill-violet-400" />
            </span>
            <h2 className="text-xl font-bold tracking-tight">{t.modalTitle}</h2>
          </div>
          <p className="text-xs text-zinc-400">{t.modalDesc}</p>
        </div>

        {/* Real-Time Dominance Projection Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 via-zinc-900 to-zinc-900 border border-violet-500/30 mb-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-violet-300 mb-1">
            <span className="flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> {t.projectionTitle}
            </span>
            <span className="font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-md border border-white/5">
              {t.projectedRank(calculation.projectedRank)}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {calculation.projectedPercentage}%
            </span>
            <span className="text-xs text-zinc-400">{t.ofTheScreen}</span>
          </div>

          {existingBrand && (
            <p className="text-[11px] text-amber-400/90 mt-1 font-medium">
              {t.domainExistsNote(existingBrand.name, formatCurrency(existingBrand.totalAmount, currency))}
            </p>
          )}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Purchase Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Amount Presets with Current Currency */}
          <div>
            <label className="block text-zinc-300 font-semibold mb-2">
              {t.investmentAmount} ({currency})
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
              {activePresets.map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => {
                    setAmount(val);
                    setCustomAmount("");
                  }}
                  className={`py-2 px-2 rounded-xl font-bold font-mono text-center border transition-all cursor-pointer ${
                    amount === val && !customAmount
                      ? "bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-600/40 scale-105"
                      : "bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  {currencySymbol}{val}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold font-mono text-xs">
                {currencySymbol}
              </span>
              <input
                type="number"
                min="1"
                step="any"
                placeholder={t.orCustomAmount}
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount(0);
                }}
                className="w-full pl-8 pr-3 py-2 bg-zinc-900/90 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 font-mono text-xs"
              />
            </div>
          </div>

          {/* Brand Name & URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                {t.brandName}
              </label>
              <input
                type="text"
                required
                placeholder={t.brandNamePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                {t.websiteUrl}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={t.websiteUrlPlaceholder}
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-xs font-mono"
                />
                <Globe className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Category & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-violet-400" /> {t.categoryLabel}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-violet-500"
              >
                {categories.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                {t.taglineLabel}
              </label>
              <input
                type="text"
                placeholder={t.taglinePlaceholder}
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-xs"
              />
            </div>
          </div>

          {/* Optional external logo URL */}
          <div>
            <label className="block text-zinc-300 font-semibold mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-violet-400" /> {t.logoLabel}
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="url"
                placeholder={t.logoUrlPlaceholder}
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="flex-1 bg-zinc-900/90 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-xs"
              />

              {(logoUrl || detectedDomain) && (
                <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoUrl || getFaviconUrl(detectedDomain || "google.com")}
                    alt="Logo preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getFaviconUrl(detectedDomain || websiteUrl);
                    }}
                  />
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-zinc-500 text-pretty">{t.logoUrlHelp}</p>
          </div>

          {/* Brand Highlight Color */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-zinc-300 font-semibold flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-violet-400" /> {t.brandColorLabel}
              </label>
              <button
                type="button"
                onClick={() => setIsCustomColorMode(!isCustomColorMode)}
                className="text-[11px] text-violet-400 hover:text-violet-300 underline font-medium cursor-pointer"
              >
                {isCustomColorMode ? t.paletteToggle : t.customColorToggle}
              </button>
            </div>

            {isCustomColorMode ? (
              <div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-xl border border-white/20 shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <input
                    type="text"
                    placeholder="e.g. #00ffff, rgb(0, 255, 255), cmyk(100, 0, 0, 0)"
                    value={customColorInput}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    className="flex-1 bg-zinc-900/90 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 font-mono text-xs"
                  />
                </div>
                {customColorError && (
                  <p className="text-[11px] text-rose-400 mt-1">{customColorError}</p>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setColor(c);
                      setCustomColorInput("");
                      setCustomColorError(null);
                    }}
                    style={{ backgroundColor: c }}
                    className={`w-7 h-7 rounded-xl border transition-transform cursor-pointer ${
                      color === c
                        ? "border-white scale-110 shadow-lg shadow-white/20 ring-2 ring-violet-500"
                        : "border-white/10 hover:scale-105"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Live Preview Card */}
          <div className="pt-2 border-t border-white/10">
            <span className="text-[11px] text-zinc-400 uppercase font-mono tracking-wider block mb-2 font-bold">
              {t.cardPreviewTitle}
            </span>
            <div
              className="p-3.5 rounded-2xl bg-zinc-900 border border-white/10 flex items-center gap-3 relative overflow-hidden"
              style={{ borderColor: `${color}60` }}
            >
              <div
                className="w-11 h-11 rounded-xl bg-zinc-950 border border-white/10 p-1.5 flex items-center justify-center shrink-0 overflow-hidden"
                style={{ borderColor: `${color}40` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    logoUrl ||
                    (detectedDomain ? getFaviconUrl(detectedDomain) : "/logo.png")
                  }
                  alt="Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/logo.png";
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm truncate">
                    {name || "Your Brand"}
                  </h4>
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                    {category}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono truncate">
                  {detectedDomain || "yourbrand.com"}
                </p>
                {tagline && (
                  <p className="text-[11px] text-zinc-300 italic truncate mt-0.5">
                    &ldquo;{tagline}&rdquo;
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-violet-400 block font-mono">
                  {calculation.projectedPercentage}%
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                  Rank #{calculation.projectedRank}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-violet-600/40 border border-violet-400/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98 cursor-pointer mt-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.processing}</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                <span>
                  {t.payAndClaim(formatCurrency(calculation.enteredAmountUSD, currency))}
                </span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
