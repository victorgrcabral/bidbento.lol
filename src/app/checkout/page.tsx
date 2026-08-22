"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { BrandSpace } from "@/types";
import { CurrencyCode, formatCurrency } from "@/lib/currency";
import { normalizeDomain, getFaviconUrl } from "@/lib/utils";
import { parseCustomColor } from "@/lib/colors";
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
  ExternalLink,
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

export default function CheckoutPage() {
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

    return {
      projectedPercentage,
      finalBrandAmount,
    };
  }, [amount, existingBrand, totalPoolAmount]);

  const handleCustomColorChange = (val: string) => {
    setCustomColorInput(val);
    const parsed = parseCustomColor(val);
    if (parsed.isValid) {
      setColor(parsed.hex);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setErrorMessage("A imagem deve ter no máximo 4MB.");
      return;
    }
    setUploadedFile(file);
    setUploadedFilePreview(URL.createObjectURL(file));
  };

  const previewLogo =
    uploadedFilePreview ||
    (logoUrl && logoUrl.trim().length > 0 ? logoUrl.trim() : null) ||
    (detectedDomain ? getFaviconUrl(detectedDomain) : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !websiteUrl.trim()) {
      setErrorMessage("Nome e URL do website são obrigatórios.");
      return;
    }

    if (!amount || amount < 1.0) {
      setErrorMessage("O valor mínimo é de $1.00 USD.");
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
            <span>Voltar ao BidBento.lol</span>
          </Link>

          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Checkout Seguro
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                Conquistar Espaço na Tela
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400">
                Preencha os dados da sua empresa ou software para preencher a tela imediatamente.
              </p>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount Presets */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  Valor do Lance ($ USD) *
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 mb-2">
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
                    placeholder="Outro valor em dólares..."
                    className="w-full pl-8 pr-4 py-2.5 bg-zinc-900/90 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500 font-mono"
                  />
                </div>
              </div>

              {/* Brand Name & URL */}
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
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    URL do Website *
                  </label>
                  <input
                    type="text"
                    required
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://meusaas.com"
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
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
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
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
                    Slogan / Tagline Curta
                  </label>
                  <input
                    type="text"
                    maxLength={80}
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Ex: O melhor banco de dados para Next.js"
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Upload Logo */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Logotipo (Arquivo PNG/JPEG ou URL)
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 border border-dashed border-white/20 hover:border-violet-500/50 rounded-xl text-xs text-zinc-300 hover:text-white transition-all"
                  >
                    <Upload className="w-4 h-4 text-violet-400 shrink-0" />
                    <span className="truncate">
                      {uploadedFile ? uploadedFile.name : "Escolher arquivo de imagem..."}
                    </span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => {
                      setLogoUrl(e.target.value);
                      setUploadedFile(null);
                      setUploadedFilePreview(null);
                    }}
                    placeholder="Ou cole a URL..."
                    className="w-full sm:w-48 px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Color Customizer */}
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
                    {isCustomColor ? "Usar Paleta" : "HEX / RGB / CMYK"}
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
                          color === c ? "border-white scale-110 shadow-lg" : "border-transparent opacity-80"
                        }`}
                      >
                        {color === c && <Check className="w-3.5 h-3.5 text-white" />}
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
                      className="w-10 h-10 rounded-xl cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={customColorInput}
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      placeholder="#FF0055, rgb(255,0,85) ou cmyk(0,100,67,0)"
                      className="flex-1 px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 py-4 px-6 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Conectando ao Stripe...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pagar ${amount}.00 USD e Ativar Espaço</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Live Preview Box */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl sticky top-8">
              <h3 className="font-bold text-sm text-zinc-300 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-violet-400" /> Pré-Visualização do seu Card
              </h3>

              {/* Simulated Card */}
              <div
                className="w-full h-48 rounded-2xl border p-4 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all shadow-xl bg-zinc-900"
                style={{
                  borderColor: color,
                  boxShadow: `0 0 30px ${color}30`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
                  }}
                />

                <span className="absolute top-3 right-3 text-xs font-bold text-violet-300 bg-violet-950/80 border border-violet-500/30 px-2 py-0.5 rounded-md">
                  ~{calculation.projectedPercentage}% da tela
                </span>

                <div
                  className="w-14 h-14 rounded-xl bg-zinc-950 border border-white/10 p-2 flex items-center justify-center mb-2 overflow-hidden shadow-lg"
                  style={{ borderColor: `${color}60` }}
                >
                  {previewLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewLogo} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Globe className="w-6 h-6 text-zinc-500" />
                  )}
                </div>

                <h4 className="font-bold text-base text-white truncate max-w-full">
                  {name || "Sua Marca"}
                </h4>
                <p className="text-xs text-zinc-400 truncate max-w-xs mt-0.5">
                  {tagline || "Seu slogan aparecerá aqui"}
                </p>
              </div>

              {/* Impact Stats */}
              <div className="mt-5 space-y-2.5 text-xs text-zinc-400">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span>Dominância Projetada:</span>
                  <span className="font-bold text-white font-mono">~{calculation.projectedPercentage}%</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span>Total Acumulado da Marca:</span>
                  <span className="font-bold text-white font-mono">${calculation.finalBrandAmount}.00 USD</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ativação:</span>
                  <span className="font-bold text-emerald-400">Instantânea via Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
