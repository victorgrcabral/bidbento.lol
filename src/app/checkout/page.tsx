"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { BrandSpace } from "@/types";
import { CurrencyCode, formatCurrency } from "@/lib/currency";
import { normalizeDomain, getFaviconUrl } from "@/lib/utils";
import { parseCustomColor } from "@/lib/colors";
import { Language, getTranslation } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
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

const PRESET_AMOUNTS = [5, 15, 30, 50, 100, 250, 500];

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

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("bidbento_lang") as Language;
      if (savedLang && (savedLang === "en" || savedLang === "es" || savedLang === "pt")) {
        setLanguage(savedLang);
      } else {
        const userLocale = navigator.language.toLowerCase();
        if (userLocale.startsWith("pt")) {
          setLanguage("pt");
          setCurrency("BRL");
        } else if (userLocale.startsWith("es")) {
          setLanguage("es");
          setCurrency("EUR");
        }
      }
    } catch {}
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem("bidbento_lang", lang);
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
  const [amount, setAmount] = useState<number>(50);
  const [totalPoolAmount, setTotalPoolAmount] = useState<number>(0);
  const [existingBrands, setExistingBrands] = useState<BrandSpace[]>([]);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const validAmount = Math.max(1, amount || 0);
    const existingAmount = existingBrand ? existingBrand.totalAmount : 0;
    const finalBrandAmount = existingAmount + validAmount;
    const newTotalPool = totalPoolAmount + validAmount;

    const projectedPercentage =
      newTotalPool > 0
        ? Number(((finalBrandAmount / newTotalPool) * 100).toFixed(1))
        : 100;

    const simulatedList = [
      ...existingBrands.filter((b) => b.domain !== detectedDomain),
      { totalAmount: finalBrandAmount },
    ].sort((a, b) => b.totalAmount - a.totalAmount);

    const projectedRank =
      simulatedList.findIndex((item) => item.totalAmount === finalBrandAmount) + 1;

    return {
      finalBrandAmount,
      newTotalPool,
      projectedPercentage,
      projectedRank: projectedRank > 0 ? projectedRank : 1,
    };
  }, [amount, existingBrand, existingBrands, totalPoolAmount, detectedDomain]);

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
      setErrorMessage("A imagem deve ter menos de 5MB.");
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

    if (!amount || amount < 1.0) {
      setErrorMessage(t.minAmountError);
      return;
    }

    try {
      setIsSubmitting(true);
      let finalLogoUrl = logoUrl.trim();

      if (uploadedFile) {
        const formData = new FormData();
        formData.append("file", uploadedFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        if (uploadRes.ok) {
          const up = await uploadRes.json();
          finalLogoUrl = up.url;
        }
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
          amount,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao processar pagamento.");

      if (data.url) {
        window.location.href = data.url;
      } else {
        window.location.href = `/?success=true&domain=${encodeURIComponent(detectedDomain || name)}`;
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Erro de conexão.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 md:p-12 overflow-y-auto selection:bg-violet-600">
      <div className="max-w-4xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white bg-zinc-900 border border-white/10 px-4 py-2 rounded-full transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t.backToHome}</span>
          </Link>

          <div className="flex items-center gap-3">
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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                {t.modalTitle}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400">
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
                  {t.investmentAmount}
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-2">
                  {PRESET_AMOUNTS.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`py-2.5 rounded-xl font-bold font-mono text-xs text-center border transition-all ${
                        amount === val
                          ? "bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-600/40 scale-105"
                          : "bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800"
                      }`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  step="any"
                  placeholder={t.orCustomAmount}
                  value={amount || ""}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 font-mono text-sm"
                />
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
                    className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 px-4 py-2.5 rounded-xl text-xs font-semibold shrink-0"
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
                    className="text-[11px] text-violet-400 hover:text-violet-300 font-medium underline"
                  >
                    {isCustomColor ? t.paletteToggle : t.customColorToggle}
                  </button>
                </div>

                {!isCustomColor ? (
                  <div className="flex items-center gap-2">
                    {PRESET_COLORS.map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          color === c ? "scale-125 border-white" : "border-transparent"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Ex: #7c3aed, rgb(124, 58, 237), cmyk(48, 76, 0, 7)"
                      value={customColorInput}
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      className="flex-1 bg-zinc-900/90 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-xs font-mono"
                    />
                    <div
                      className="w-8 h-8 rounded-xl border border-white/20 shrink-0"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base shadow-2xl shadow-violet-600/40 border border-violet-400/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t.processing}</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>{t.payAndClaim(formatCurrency(calculation.finalBrandAmount, currency))}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Live Preview & Projection */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Projection Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-950/60 via-zinc-900/70 to-zinc-950 border border-violet-500/30 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> {t.projectionTitle}
                </span>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                  {t.projectedRank(calculation.projectedRank)}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-black text-white tracking-tight">
                  ~{calculation.projectedPercentage}%
                </span>
                <span className="text-xs text-zinc-300">{t.ofTheScreen}</span>
              </div>

              {existingBrand && (
                <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 shrink-0" />
                  {t.domainExistsNote(existingBrand.name, formatCurrency(existingBrand.totalAmount, currency))}
                </p>
              )}
            </div>

            {/* Live Block Preview Card */}
            <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                {t.cardPreviewTitle}
              </h3>

              <div
                className="w-full h-44 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-4 border transition-all"
                style={{
                  borderColor: `${color}60`,
                  background: `radial-gradient(circle at center, ${color}30 0%, #09090b 80%)`,
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 p-2 flex items-center justify-center mb-2 overflow-hidden shadow-lg"
                  style={{ borderColor: `${color}60` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      uploadedFilePreview ||
                      logoUrl ||
                      getFaviconUrl(detectedDomain || "google.com")
                    }
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </div>

                <h4 className="font-bold text-base text-white truncate max-w-full">
                  {name || "Sua Marca"}
                </h4>
                <p className="text-xs text-zinc-400 font-mono truncate max-w-full">
                  {detectedDomain || "seusite.com"}
                </p>
                {tagline && (
                  <p className="text-[11px] text-zinc-300 mt-1 line-clamp-1 italic text-center max-w-full px-2">
                    &ldquo;{tagline}&rdquo;
                  </p>
                )}
              </div>

              <div className="space-y-2 text-xs text-zinc-400">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>{t.projectedShare}</span>
                  <span className="font-bold text-violet-400">~{calculation.projectedPercentage}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>{t.instantActivation}</span>
                  <span className="text-emerald-400 font-medium">{t.instantActivationDesc}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
