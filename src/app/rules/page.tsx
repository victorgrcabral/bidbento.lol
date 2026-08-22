"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  TrendingUp,
  AlertTriangle,
  MousePointerClick,
  ChevronLeft,
  Sparkles,
  HelpCircle,
} from "lucide-react";

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-600 selection:text-white p-4 sm:p-8 md:p-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Top Navigation */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white bg-zinc-900 border border-white/10 px-4 py-2 rounded-full transition-all hover:border-violet-500/50"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar ao MySpace</span>
          </Link>

          <span className="text-xs font-mono text-violet-400 bg-violet-950/60 border border-violet-500/30 px-3 py-1 rounded-full">
            Regras & Diretrizes
          </span>
        </div>

        {/* Header Hero */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex p-3 rounded-2xl bg-violet-600/20 text-violet-400 border border-violet-500/30 mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Regras de Funcionamento do MySpace
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            O MySpace é um experimento público de visualização e monetização de espaço de tela. Abaixo estão as regras oficiais e diretrizes de convivência e lances.
          </p>
        </div>

        {/* Rules Grid */}
        <div className="space-y-6">
          {/* Rule 1: The Screen Space Dynamics */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                1. Dinâmica de Espaço & Algoritmo Treemap
              </h2>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              A área da tela é calculada matematicamente através do algoritmo <strong>Squarified Treemap</strong>. Cada marca ocupa um retângulo cuja área percentual é exatamente proporcional ao valor total aportado sobre o total geral do pote da página.
            </p>
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5 font-mono text-xs text-violet-300">
              Fatia da Tela (%) = (Valor Total Investido pela Marca / Valor Total da Página) × 100
            </div>
          </div>

          {/* Rule 2: Bids, Dilution & Minimum Value */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                2. Lances, Boost e Diluição Contínua
              </h2>
            </div>
            <ul className="space-y-3 text-sm text-zinc-300 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0" />
                <span>
                  <strong>Valor Mínimo:</strong> O valor mínimo para adquirir espaço ou dar boost é de <strong>$1.00 USD</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0" />
                <span>
                  <strong>Agrupamento Automático por Domínio:</strong> Múltiplos aportes para o mesmo domínio/URL somam o valor total, expandindo imediatamente a fatia ocupada pela marca.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0" />
                <span>
                  <strong>Diluição Natural:</strong> Conforme novos anunciantes entram, o espaço de todas as marcas é recalculado em tempo real. Para reconquistar território, basta utilizar o botão <em>Boost</em>.
                </span>
              </li>
            </ul>
          </div>

          {/* Rule 3: Prohibited Content & Moderation */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-red-500/20 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                3. Conteúdo Proibido & Moderação
              </h2>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">
              Para manter um ecossistema seguro e de alto valor, são estritamente <strong>proibidos</strong>:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
              <li className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 flex items-center gap-2">
                <span className="text-red-400 font-bold">✕</span> Conteúdo adulto / NSFW / Explícito
              </li>
              <li className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 flex items-center gap-2">
                <span className="text-red-400 font-bold">✕</span> Malware, phishing ou vírus
              </li>
              <li className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 flex items-center gap-2">
                <span className="text-red-400 font-bold">✕</span> Golpes financeiros, pirâmides e scams
              </li>
              <li className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 flex items-center gap-2">
                <span className="text-red-400 font-bold">✕</span> Discurso de ódio ou atividades ilegais
              </li>
            </ul>
            <p className="text-xs text-zinc-400 mt-4 leading-relaxed">
              * Anúncios que violem estas diretrizes serão removidos instantaneamente pela equipe de moderação sem direito a reembolso.
            </p>
          </div>

          {/* Rule 4: Click Tracking & Analytics */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <MousePointerClick className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                4. Rastreamento de Cliques & Estatísticas
              </h2>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Cada clique realizado nos blocos é auditado e computado em tempo real no banco de dados. As métricas de cliques são públicas e transparentes para comprovar o tráfego gerado para cada marca.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Perguntas Frequentes (FAQ)
              </h2>
            </div>

            <div className="space-y-4 text-sm">
              <div className="border-b border-white/5 pb-4">
                <h3 className="font-bold text-white mb-1">
                  Quanto tempo dura o meu espaço na tela?
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  O espaço é vitalício e contínuo. Conforme novas marcas entram, seu percentual é suavemente diluído, mas você permanece visível na página correspondente ao seu ranking e pode dar boost a qualquer momento.
                </p>
              </div>

              <div className="border-b border-white/5 pb-4">
                <h3 className="font-bold text-white mb-1">
                  Como funciona a divisão em páginas?
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  A tela é dividida em páginas de 12 marcas. A Página 1 sempre reúne as 12 maiores marcas em valor investido. Você pode navegar entre as páginas ou filtrar por setor da empresa.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white mb-1">
                  Posso trocar o logo ou slogan depois de pagar?
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  Sim! Ao realizar um novo lance para o mesmo domínio, você pode atualizar o slogan, logo e cor de destaque da sua marca.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center pb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-xl shadow-violet-600/30 transition-all active:scale-95"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Voltar e Conquistar Espaço na Tela</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
