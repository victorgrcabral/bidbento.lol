"use client";

import React, { useState, useMemo, useRef } from "react";
import { BrandSpace } from "@/types";
import { CurrencyCode, formatCurrency } from "@/lib/currency";
import { normalizeDomain, getFaviconUrl } from "@/lib/utils";
import { parseCustomColor } from "@/lib/colors";
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

const CATEGORIES = [
  "SaaS",
  "Developer Tools",
  "IA / Machine Learning",
  "Design & UI",
  "Fintech",
  "Crypto / Web3",
  "E-commerce",
  "Produtividade",
  "Outros",
];

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  totalPoolAmount,
  existingBrands,
  currency,
  onSuccess,
}) => {
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
  const [amount, setAmount] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto detect domain and existing brand investment
  const detectedDomain = useMemo(() => {
    if (!websiteUrl || websiteUrl.trim().length < 3) return "";
    return normalizeDomain(websiteUrl);
  }, [websiteUrl]);

  const existingBrand = useMemo(() => {
    if (!detectedDomain) return null;
    return existingBrands.find((b) => b.domain === detectedDomain) || null;
  }, [detectedDomain, existingBrands]);

  // Real-time predictive calculation
  const calculation = useMemo(() => {
    const validAmount = Math.max(1, amount || 0);
    const existingAmount = existingBrand ? existingBrand.totalAmount : 0;
    const finalBrandAmount = existingAmount + validAmount;
    const newTotalPool = totalPoolAmount + validAmount;

    const projectedPercentage =
      newTotalPool > 0
        ? Number(((finalBrandAmount / newTotalPool) * 100).toFixed(1))
        : 100;

    const simulatedBrands = existingBrands.map((b) => {
      if (b.domain === detectedDomain) {
        return { ...b, totalAmount: finalBrandAmount };
      }
      return b;
    });

    if (!existingBrand && detectedDomain) {
      simulatedBrands.push({
        id: "temp",
        name: name || detectedDomain,
        domain: detectedDomain,
        websiteUrl,
        totalAmount: validAmount,
        clicksCount: 0,
        isActive: true,
        percentage: projectedPercentage,
        rank: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastPaymentAt: new Date(),
      });
    }

    simulatedBrands.sort((a, b) => b.totalAmount - a.totalAmount);
    const projectedRank =
      simulatedBrands.findIndex((b) => b.domain === detectedDomain) + 1;

    return {
      projectedPercentage,
      projectedRank: projectedRank > 0 ? projectedRank : 1,
      finalBrandAmount,
    };
  }, [amount, existingBrand, totalPoolAmount, existingBrands, detectedDomain, name, websiteUrl]);

  // Handle custom color input changes
  const handleCustomColorChange = (val: string) => {
    setCustomColorInput(val);
    const parsed = parseCustomColor(val);
    if (parsed.isValid) {
      setColor(parsed.hex);
    }
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setErrorMessage("A imagem deve ter no máximo 4MB.");
      return;
    }

    setUploadedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setUploadedFilePreview(objectUrl);
  };

  const previewLogo =
    uploadedFilePreview ||
    (logoUrl && logoUrl.trim().length > 0 ? logoUrl.trim() : null) ||
    (detectedDomain ? getFaviconUrl(detectedDomain) : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Por favor, digite o nome da sua marca ou SaaS.");
      return;
    }

    if (!websiteUrl.trim()) {
      setErrorMessage("Por favor, insira a URL do seu website.");
      return;
    }

    if (!amount || amount < 1.0) {
      setErrorMessage("O valor mínimo é de $1.00 USD.");
      return;
    }

    try {
      setIsSubmitting(true);
      let finalLogoUrl = logoUrl.trim();

      // If user uploaded a file, upload it first to /api/upload
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
          amount,
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
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-xl bg-zinc-950 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-violet-950/30 text-white relative my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2.5 rounded-2xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
            <Zap className="w-5 h-5 fill-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Comprar Espaço na Tela</h2>
            <p className="text-xs text-zinc-400">
              Dispute a dominância visual e receba tráfego direto para o seu projeto.
            </p>
          </div>
        </div>

        {/* Live Projection Box */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-violet-950/50 via-zinc-900/60 to-zinc-950 border border-violet-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-violet-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> Projeção de Dominância em Tempo Real
            </span>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
              Posição #{calculation.projectedRank}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tight">
              ~{calculation.projectedPercentage}%
            </span>
            <span className="text-xs text-zinc-300">
              de toda a área útil na tela do MySpace!
            </span>
          </div>

          {existingBrand && (
            <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-medium">
              <Check className="w-3.5 h-3.5" />
              Domínio já existente ({existingBrand.name}). O valor será somado aos seus {formatCurrency(existingBrand.totalAmount, currency)}!
            </p>
          )}
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Valor do Investimento ($ USD)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-2">
              {PRESET_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    amount === val
                      ? "bg-violet-600 border-violet-400 text-white shadow-md shadow-violet-600/40"
                      : "bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  ${val}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">
                $
              </span>
              <input
                type="number"
                min="1"
                step="1"
                value={amount || ""}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                placeholder="Ou digite outro valor..."
                className="w-full pl-8 pr-4 py-2.5 bg-zinc-900/90 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500 transition-colors font-mono"
              />
            </div>
          </div>

          {/* Name & Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Nome da Marca / SaaS *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Supabase, Linear..."
                className="w-full px-3.5 py-2.5 bg-zinc-900/90 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                URL do Website / Destino *
              </label>
              <input
                type="text"
                required
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="Ex: https://meusaas.com"
                className="w-full px-3.5 py-2.5 bg-zinc-900/90 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          {/* Category & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Setor / Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900/90 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-zinc-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Slogan / Descrição Curta
              </label>
              <input
                type="text"
                maxLength={80}
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Ex: The Firebase Alternative"
                className="w-full px-3.5 py-2.5 bg-zinc-900/90 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          {/* Logo File Upload OR URL */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Logotipo da Marca (Upload de Arquivo ou URL)
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              {/* File Upload Button */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900/90 border border-dashed border-white/20 hover:border-violet-500/50 rounded-xl text-xs text-zinc-300 hover:text-white transition-all"
              >
                <Upload className="w-4 h-4 text-violet-400 shrink-0" />
                <span className="truncate">
                  {uploadedFile ? uploadedFile.name : "Escolher arquivo (PNG, JPEG, SVG...)"}
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* URL fallback */}
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => {
                  setLogoUrl(e.target.value);
                  setUploadedFile(null);
                  setUploadedFilePreview(null);
                }}
                placeholder="Ou cole a URL direta..."
                className="w-full sm:w-48 px-3.5 py-2.5 bg-zinc-900/90 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
              />

              {/* Logo Preview */}
              {previewLogo && (
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/15 p-1.5 flex items-center justify-center shrink-0 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewLogo}
                    alt="Logo preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Custom Brand Color (Presets + Custom HEX / RGB / CMYK) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-300">
                Cor de Destaque da Marca
              </label>
              <button
                type="button"
                onClick={() => setIsCustomColor(!isCustomColor)}
                className="text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1"
              >
                <Palette className="w-3.5 h-3.5" />
                {isCustomColor ? "Usar Paleta Padrão" : "Cor Personalizada (HEX/RGB/CMYK)"}
              </button>
            </div>

            {!isCustomColor ? (
              <div className="flex items-center gap-2 flex-wrap">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform flex items-center justify-center ${
                      color === c
                        ? "border-white scale-110 shadow-lg"
                        : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                  >
                    {color === c && <Check className="w-3.5 h-3.5 text-white filter drop-shadow" />}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color.startsWith("#") && color.length === 7 ? color : "#7c3aed"}
                  onChange={(e) => {
                    setColor(e.target.value);
                    setCustomColorInput(e.target.value);
                  }}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={customColorInput}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  placeholder="Ex: #FF0055, rgb(255,0,85) ou cmyk(0,100,67,0)"
                  className="flex-1 px-3.5 py-2.5 bg-zinc-900/90 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                />
                <div
                  className="w-10 h-10 rounded-xl border border-white/20 shadow-inner shrink-0"
                  style={{ backgroundColor: color }}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="w-full mt-3 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
          >
            {isSubmitting || isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isUploading ? "Enviando imagem..." : "Processando..."}</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                <span>Garantir Espaço por {formatCurrency(amount, currency)}</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
