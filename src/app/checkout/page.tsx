"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { BrandSpace } from "@/types";
import { CurrencyCode, formatCurrency, SUPPORTED_CURRENCIES } from "@/lib/currency";
import { normalizeDomain, getFaviconUrl } from "@/lib/utils";
import { parseCustomColor } from "@/lib/colors";
import { Language, getTranslation } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { CurrencyToggle } from "@/components/CurrencyToggle";
import { BidBentoLogo } from "@/components/BidBentoLogo";
import {
  Zap,
  TrendingUp,
  Globe,
  Upload,
  Check,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ShieldCheck,
  CreditCard,
  Palette,
} from "lucide-react";

const PRESET_AMOUNTS_USD = [5, 15, 30, 50, 100, 250, 500];
const PRESET_AMOUNTS_EUR = [5, 15, 30, 50, 100, 250, 500];
const PRESET_AMOUNTS_BRL = [25, 75, 150, 250, 500, 1000, 2500];

const PRESET_COLORS = [
  "#7c3aed",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
  "#000000",
];

export default function CheckoutPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  useEffect(() => {
    try {
      document.documentElement.classList.add("dark");
      const savedLang = localStorage.getItem("bidbento_lang") as Language;
      if (savedLang && (savedLang === "en" || savedLang === "es" || savedLang === "pt")) {
        setLanguage(savedLang);
      }
      const savedCurr = localStorage.getItem("bidbento_currency") as CurrencyCode;
      if (savedCurr && (savedCurr === "USD" || savedCurr === "EUR" || savedCurr === "BRL")) {
        setCurrency(savedCurr);
      }
    } catch {}
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem("bidbento_lang", lang);
    } catch {}
  };

  const handleCurrencyChange = (curr: CurrencyCode) => {
    setCurrency(curr);
    try {
      localStorage.setItem("bidbento_currency", curr);
    } catch {}
  };

  const t = getTranslation(language);

  const categories = [
    { key: "SaaS", label: t.categories.saas },
    { key: "Developer Tools", label: t.categories.devTools },
    { key: "IA / Machine Learning", label: t.categories.ai },
    { key: "Design & UI", label: t.categories.design },
    { key: "Fintech", label: t.categories.fintech },
    { key: "Crypto / Web3", label: t.categories.crypto },
    { key: "E-commerce", label: t.categories.ecommerce },
    { key: "Produtividade", label: t.categories.productivity },
    { key: "Outros", label: t.categories.other },
  ];

  const presets = useMemo(() => {
    if (currency === "BRL") return PRESET_AMOUNTS_BRL;
    if (currency === "EUR") return PRESET_AMOUNTS_EUR;
    return PRESET_AMOUNTS_USD;
  }, [currency]);

  const currencySymbol = SUPPORTED_CURRENCIES[currency]?.symbol || "$";
  const currencyRate = SUPPORTED_CURRENCIES[currency]?.rateAgainstUSD || 1.0;

  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string | null>(null);
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState("SaaS");
  const [color, setColor] = useState("#7c3aed");
  const [isCustomColor, setIsCustomColor] = useState(false);
  const [customColorInput, setCustomColorInput] = useState("#7c3aed");
  const [amount, setAmount] = useState<number>(presets[2] || 30);
  const [totalPoolAmount, setTotalPoolAmount] = useState<number>(0);
  const [existingBrands, setExistingBrands] = useState<BrandSpace[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAmount(presets[2] || 30);
  }, [presets]);

  // Fetch current pool data
  useEffect(() => {
    fetch("/api/spaces")
      .then((res) => res.json())
      .then((data) => {
        if (data.totalAmount) setTotalPoolAmount(data.totalAmount);
        if (data.brands) setExistingBrands(data.brands);
      })
      .catch((e) => console.error(e));
  }, []);

  const detectedDomain = useMemo(() => {
    if (!websiteUrl || websiteUrl.trim().length < 3) return "";
    return normalizeDomain(websiteUrl);
  }, [websiteUrl]);

  const existingBrand = useMemo(() => {
    if (!detectedDomain) return null;
    return existingBrands.find((b) => b.domain === detectedDomain) || null;
  }, [detectedDomain, existingBrands]);

  // Live calculation
  const calculation = useMemo(() => {
    const rawVal = Math.max(1, amount || 0);
    const enteredAmountUSD = currency === "USD" ? rawVal : rawVal / currencyRate;
    const existingAmountUSD = existingBrand ? existingBrand.totalAmount : 0;
    const finalBrandAmountUSD = existingAmountUSD + enteredAmountUSD;
    const newTotalPoolUSD = totalPoolAmount + enteredAmountUSD;

    const projectedPercentage =
      newTotalPoolUSD > 0
        ? Number(((finalBrandAmountUSD / newTotalPoolUSD) * 100).toFixed(1))
        : 100;

    const simulatedList = [
      ...existingBrands.filter((b) => b.domain !== detectedDomain),
      { totalAmount: finalBrandAmountUSD },
    ].sort((a, b) => b.totalAmount - a.totalAmount);

    const projectedRank =
      simulatedList.findIndex((item) => item.totalAmount === finalBrandAmountUSD) + 1;

    return {
      enteredAmountUSD,
      finalBrandAmountUSD,
      newTotalPoolUSD,
      projectedPercentage,
      projectedRank: projectedRank > 0 ? projectedRank : 1,
    };
  }, [amount, existingBrand, existingBrands, totalPoolAmount, detectedDomain, currency, currencyRate]);

  const handleCustomColorChange = (value: string) => {
    setCustomColorInput(value);
    const parsed = parseCustomColor(value);
    if (parsed.isValid) {
      setColor(parsed.hex);
      setErrorMessage(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image must be under 5MB.");
      return;
    }

    setUploadedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setUploadedFilePreview(previewUrl);
    setLogoUrl("");
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
      let finalLogoUrl = logoUrl.trim();

      if (uploadedFile) {
        const formData = new FormData();
        formData.append("file", uploadedFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.error || "Failed to upload image.");
        }

        const uploadData = await uploadRes.json();
        finalLogoUrl = uploadData.url;
      }

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
          amount: calculation.enteredAmountUSD,
          currency,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process checkout.");

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        window.location.href = `/?success=true&domain=${encodeURIComponent(detectedDomain || name)}`;
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Connection error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white p-4 sm:p-8 md:p-12 overflow-y-auto selection:bg-violet-600">
      <div className="max-w-4xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8 flex-wrap gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white bg-zinc-900 border border-white/10 px-4 py-2 rounded-full transition-all hover:border-violet-500/50"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t.backToHome}</span>
          </Link>

          <div className="flex items-center gap-3">
            <CurrencyToggle
              currentCurrency={currency}
              onCurrencyChange={handleCurrencyChange}
            />
            <LanguageToggle
              language={language}
              onLanguageChange={handleLanguageChange}
            />

            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> {t.secureCheckout}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="mb-4">
                <BidBentoLogo withBadge={true} size="md" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {t.modalTitle}
              </h1>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                {t.modalDesc}
              </p>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-semibold text-zinc-200 mb-2">
                  {t.investmentAmount} ({currency})
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-2">
                  {presets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`py-2.5 rounded-xl font-bold font-mono text-xs text-center border transition-all cursor-pointer ${
                        amount === val
                          ? "bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-600/40 scale-105"
                          : "bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800"
                      }`}
                    >
                      {currencySymbol}{val}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold font-mono text-xs">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    placeholder={t.orCustomAmount}
                    value={amount || ""}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2.5 bg-zinc-900/90 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 font-mono text-sm"
                  />
                </div>
              </div>

              {/* Name & URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    {t.brandName}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.brandNamePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    {t.websiteUrl}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder={t.websiteUrlPlaceholder}
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-xs sm:text-sm font-mono"
                    />
                    <Globe className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Category & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    {t.categoryLabel}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500"
                  >
                    {categories.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    {t.taglineLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={t.taglinePlaceholder}
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Logo Upload & Custom Color */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  {t.logoLabel}
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 px-4 py-2.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-violet-400" />
                    <span>{uploadedFile ? uploadedFile.name : t.chooseFile}</span>
                  </button>

                  <input
                    type="url"
                    placeholder={t.orLogoUrl}
                    value={logoUrl}
                    onChange={(e) => {
                      setLogoUrl(e.target.value);
                      setUploadedFile(null);
                      setUploadedFilePreview(null);
                    }}
                    className="flex-1 bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-violet-400" /> {t.brandColorLabel}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomColor(!isCustomColor)}
                    className="text-xs text-violet-400 hover:text-violet-300 underline font-medium cursor-pointer"
                  >
                    {isCustomColor ? t.paletteToggle : t.customColorToggle}
                  </button>
                </div>

                {isCustomColor ? (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl border border-white/20 shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <input
                      type="text"
                      placeholder="#7c3aed"
                      value={customColorInput}
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      className="flex-1 bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 font-mono text-xs sm:text-sm"
                    />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-8 h-8 rounded-xl border transition-transform cursor-pointer ${
                          color === c
                            ? "border-white scale-110 shadow-lg shadow-white/20 ring-2 ring-violet-500"
                            : "border-white/10 hover:scale-105"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-violet-600/40 border border-violet-400/40 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 active:scale-98 cursor-pointer pt-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t.processing}</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>{t.payAndClaim(formatCurrency(calculation.enteredAmountUSD, currency))}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Live Dominance & Card Preview */}
          <div className="lg:col-span-5 space-y-6">
            {/* Projection Widget */}
            <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-violet-300 mb-2">
                <span className="flex items-center gap-1.5 font-semibold">
                  <TrendingUp className="w-4 h-4" /> {t.projectionTitle}
                </span>
                <span className="font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-md border border-white/5">
                  {t.projectedRank(calculation.projectedRank)}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-black text-white">
                  {calculation.projectedPercentage}%
                </span>
                <span className="text-xs text-zinc-400">{t.ofTheScreen}</span>
              </div>

              {existingBrand && (
                <p className="text-xs text-amber-400/90 mt-2 font-medium">
                  {t.domainExistsNote(existingBrand.name, formatCurrency(existingBrand.totalAmount, currency))}
                </p>
              )}
            </div>

            {/* Live Card Preview */}
            <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl">
              <span className="text-xs text-zinc-400 uppercase font-mono tracking-wider block mb-4 font-bold">
                {t.cardPreviewTitle}
              </span>

              <div
                className="p-4 rounded-2xl bg-zinc-900 border border-white/10 flex items-center gap-3.5 relative overflow-hidden"
                style={{ borderColor: `${color}60` }}
              >
                <div
                  className="w-12 h-12 rounded-xl bg-zinc-950 border border-white/10 p-2 flex items-center justify-center shrink-0 overflow-hidden"
                  style={{ borderColor: `${color}40` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      uploadedFilePreview ||
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
                  <p className="text-xs text-zinc-400 font-mono truncate">
                    {detectedDomain || "yourbrand.com"}
                  </p>
                  {tagline && (
                    <p className="text-xs text-zinc-300 italic truncate mt-0.5">
                      &ldquo;{tagline}&rdquo;
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-violet-400 block font-mono">
                    {calculation.projectedPercentage}%
                  </span>
                  <span className="text-xs text-emerald-400 font-mono font-semibold">
                    Rank #{calculation.projectedRank}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
