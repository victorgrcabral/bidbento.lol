"use client";

import React, { useState, useMemo, useRef } from "react";
import { BrandSpace } from "@/types";
import { CurrencyCode, formatCurrency } from "@/lib/currency";
import { normalizeDomain, getFaviconUrl } from "@/lib/utils";
import { parseCustomColor } from "@/lib/colors";
import { Language, getTranslation } from "@/lib/i18n";
import {
  X,
  Zap,
  TrendingUp,
  Globe,
  Upload,
  Check,
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
  onSuccess: () => void;
}

const PRESET_AMOUNTS = [5, 15, 30, 50, 100, 250];

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
  currency,
  language = "en",
  onSuccess,
}) => {
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
  const [customColorInput, setCustomColorInput] = useState("");
  const [customColorError, setCustomColorError] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(15);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const detectedDomain = useMemo(() => {
    if (!websiteUrl.trim()) return "";
    return normalizeDomain(websiteUrl);
  }, [websiteUrl]);

  const existingBrand = useMemo(() => {
    if (!detectedDomain) return null;
    return existingBrands.find((b) => b.domain === detectedDomain) || null;
  }, [detectedDomain, existingBrands]);

  const calculation = useMemo(() => {
    const enteredAmount = customAmount ? parseFloat(customAmount) || 0 : amount;
    const existingAmount = existingBrand ? existingBrand.totalAmount : 0;
    const newBrandTotal = existingAmount + enteredAmount;
    const newTotalPool = existingBrand
      ? totalPoolAmount + enteredAmount
      : totalPoolAmount + enteredAmount;

    const projectedPercentage =
      newTotalPool > 0
        ? Number(((newBrandTotal / newTotalPool) * 100).toFixed(1))
        : 100;

    const simulatedList = [
      ...existingBrands.filter((b) => b.domain !== detectedDomain),
      { totalAmount: newBrandTotal },
    ].sort((a, b) => b.totalAmount - a.totalAmount);

    const projectedRank =
      simulatedList.findIndex((item) => item.totalAmount === newBrandTotal) + 1;

    return {
      enteredAmount,
      newBrandTotal,
      newTotalPool,
      projectedPercentage,
      projectedRank: projectedRank > 0 ? projectedRank : 1,
    };
  }, [amount, customAmount, existingBrand, existingBrands, totalPoolAmount, detectedDomain]);

  const handleCustomColorChange = (value: string) => {
    setCustomColorInput(value);
    const parsed = parseCustomColor(value);
    if (parsed.isValid) {
      setColor(parsed.hex);
      setCustomColorError(null);
    } else if (value.trim()) {
      setCustomColorError("Formato inválido. Use HEX (#7c3aed), RGB (rgb(124, 58, 237)) ou CMYK.");
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

    if (calculation.enteredAmount < 1.0) {
      setErrorMessage(t.minAmountError);
      return;
    }

    try {
      setIsSubmitting(true);
      let finalLogoUrl = logoUrl.trim();

      if (uploadedFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", uploadedFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.error || "Erro ao fazer upload da imagem.");
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
          amount: calculation.enteredAmount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao processar checkout.");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Falha na comunicação com o servidor.");
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-lg bg-zinc-950 border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl text-white relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
            <Zap className="w-6 h-6 fill-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{t.modalTitle}</h2>
            <p className="text-xs text-zinc-400">
              {t.modalDesc}
            </p>
          </div>
        </div>

        {/* Live Projection Box */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-violet-950/50 via-zinc-900/60 to-zinc-950 border border-violet-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-violet-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> {t.projectionTitle}
            </span>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
              {t.projectedRank(calculation.projectedRank)}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tight">
              ~{calculation.projectedPercentage}%
            </span>
            <span className="text-xs text-zinc-300">
              {t.ofTheScreen}
            </span>
          </div>

          {existingBrand && (
            <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-medium">
              <Check className="w-3.5 h-3.5" />
              {t.domainExistsNote(existingBrand.name, formatCurrency(existingBrand.totalAmount, currency))}
            </p>
          )}
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Purchase Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Amount Presets */}
          <div>
            <label className="block text-zinc-300 font-semibold mb-2">
              {t.investmentAmount}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
              {PRESET_AMOUNTS.map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => {
                    setAmount(val);
                    setCustomAmount("");
                  }}
                  className={`py-2 px-3 rounded-xl font-bold font-mono text-center border transition-all ${
                    amount === val && !customAmount
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
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setAmount(0);
              }}
              className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 font-mono text-xs"
            />
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

          {/* Logo Upload & URL */}
          <div>
            <label className="block text-zinc-300 font-semibold mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-violet-400" /> {t.logoLabel}
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
                className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 px-3 py-2 rounded-xl text-xs font-semibold shrink-0"
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
                className="flex-1 bg-zinc-900/90 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-xs"
              />

              {(uploadedFilePreview || logoUrl || detectedDomain) && (
                <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      uploadedFilePreview ||
                      logoUrl ||
                      getFaviconUrl(detectedDomain || "google.com")
                    }
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Brand Color & Custom Color Picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-zinc-300 font-semibold flex items-center gap-1.5">
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
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      color === c ? "scale-125 border-white" : "border-transparent"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-1.5">
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
                {customColorError && (
                  <p className="text-[11px] text-red-400">{customColorError}</p>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="w-full mt-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-2xl shadow-xl shadow-violet-600/40 border border-violet-400/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting || isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isUploading ? t.uploadingImage : t.processing}</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                <span>
                  {t.payAndClaim(formatCurrency(calculation.enteredAmount, currency))}
                </span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
