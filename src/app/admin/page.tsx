"use client";

import React, { useState, useEffect } from "react";
import { formatTimeAgo, getFaviconUrl } from "@/lib/utils";
import { Shield, Eye, EyeOff, Trash2, Key, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminPage() {
  const [adminSecret, setAdminSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin", {
        headers: { "x-admin-secret": adminSecret },
      });
      if (res.ok) {
        const data = await res.json();
        setBrands(data.brands);
        setIsAuthenticated(true);
      } else {
        setMessage("Chave de administração inválida.");
      }
    } catch {
      setMessage("Erro ao conectar com a API.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (brandId: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({ brandId, isActive: !currentActive }),
      });
      if (res.ok) {
        fetchBrands();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (brandId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta marca e seus registros?")) return;
    try {
      const res = await fetch(`/api/admin?id=${brandId}`, {
        method: "DELETE",
        headers: { "x-admin-secret": adminSecret },
      });
      if (res.ok) {
        fetchBrands();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 sm:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Painel de Moderação - MySpace</h1>
              <p className="text-xs text-zinc-400">Gerenciamento seguro de marcas e conteúdo</p>
            </div>
          </div>

          {isAuthenticated && (
            <button
              onClick={fetchBrands}
              disabled={isLoading}
              className="flex items-center gap-1.5 text-xs bg-zinc-900 border border-white/10 px-3 py-2 rounded-xl hover:bg-zinc-800 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Atualizar</span>
            </button>
          )}
        </div>

        {!isAuthenticated ? (
          <div className="max-w-md mx-auto p-8 rounded-3xl bg-zinc-900/60 border border-white/10 text-center">
            <Key className="w-10 h-10 text-violet-400 mx-auto mb-4" />
            <h2 className="text-lg font-bold mb-2">Acesso Restrito</h2>
            <p className="text-xs text-zinc-400 mb-6">
              Insira a chave secreta configurada em <code className="text-violet-300">ADMIN_SECRET</code>.
            </p>

            {message && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchBrands();
              }}
              className="space-y-4"
            >
              <input
                type="password"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                placeholder="Digite a ADMIN_SECRET..."
                className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500"
              />
              <button
                type="submit"
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 font-bold text-sm rounded-xl transition-all shadow-lg shadow-violet-600/30"
              >
                Entrar no Painel
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xs text-zinc-400">Total de {brands.length} marcas registradas</div>

            <div className="space-y-3">
              {brands.map((b) => {
                const logo = b.logoUrl || getFaviconUrl(b.domain);
                return (
                  <div
                    key={b.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      b.isActive
                        ? "bg-zinc-900/60 border-white/10"
                        : "bg-red-950/20 border-red-500/30 opacity-70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-white/10 p-2 flex items-center justify-center shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logo} alt={b.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-base">{b.name}</h3>
                          {!b.isActive && (
                            <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full font-bold">
                              OCULTO
                            </span>
                          )}
                        </div>
                        <a
                          href={b.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-violet-400 hover:underline font-mono"
                        >
                          {b.websiteUrl}
                        </a>
                        {b.tagline && <p className="text-xs text-zinc-400 mt-0.5">{b.tagline}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="text-right text-xs">
                        <div className="font-bold text-zinc-200 font-mono">${b.totalAmount} USD</div>
                        <div className="text-zinc-400">{b.clicksCount} cliques</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleActive(b.id, b.isActive)}
                          className={`p-2.5 rounded-xl border transition-colors ${
                            b.isActive
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                          }`}
                          title={b.isActive ? "Ocultar da tela" : "Publicar na tela"}
                        >
                          {b.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 transition-colors"
                          title="Excluir marca permanentemente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
