# 🚀 MySpace — Visual Screen Domination Platform

> Compre espaço na tela para sua marca, software ou SaaS em tempo real. Inspirado na mecânica viral do `outbid.lol` e potencializado com **Squarified Treemap Layout**, diluição natural e alta conversão.

---

## 🌟 Funcionalidades Principais

- **Algoritmo Squarified Treemap em Tempo Real:** Divisão matemática da área da tela proporcionalmente ao valor investido por cada anunciante.
- **Diluição Cumulativa:** Novos lances aumentam o pote total e redistribuem a área suavemente via **Framer Motion**.
- **Hover Pop-up de Inteligência de Marca:** Exibe logo, nome, métricas de cliques reais gerados, tempo desde o último aporte, total investido e atalho de boost com 1 clique.
- **Barra Inferior de Alta Conversão:** Copy dinâmica e rotativa com gatilhos de urgência e prova social, seletor de moedas (USD, BRL, EUR) e Ranking (Hall da Fama).
- **Modal & Página de Checkout Dedicada:** Calculadora preditiva que projeta em tempo real a dominância percentual antes do pagamento.
- **Upload de Logotipo & Cor Customizada:** Upload direto de arquivos de imagem (PNG, JPG, SVG, WebP) e seletor de cor com suporte a HEX, RGB e CMYK.
- **Paginação Inteligente & Filtros por Setor:** Divisão em páginas de 12 marcas e filtros por categorias (SaaS, Developer Tools, IA, Design, Fintech, etc.).
- **Página de Regras Completa:** Rota `/rules` com termos e diretrizes de moderação.
- **Painel de Moderação Protegido:** Rota `/admin` com chave secreta para gestão e segurança.

---

## 🛠️ Stack Tecnológica

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend:** Next.js Route Handlers, Stripe API & Webhooks.
- **Banco de Dados & ORM:** Prisma ORM com SQLite (Dev) e compatível com PostgreSQL / Supabase / Neon (Produção).

---

## 🚀 Como Rodar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/myspace.git
   cd myspace
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie o arquivo `.env`:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ADMIN_SECRET="sua-chave-secreta-admin"
   ```

4. **Inicialize o Banco de Dados e execute o Seed:**
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```

5. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse: `http://localhost:3000`

---

## 📦 Deploy para Produção (Cloudflare Pages / Vercel)

1. Crie um banco PostgreSQL gratuito (ex: [Supabase](https://supabase.com) ou [Neon](https://neon.tech)).
2. Atualize o `provider = "postgresql"` no `prisma/schema.prisma` e adicione a `DATABASE_URL` nas variáveis do Cloudflare Pages / Vercel.
3. Adicione suas chaves reais do Stripe (`STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET`).
4. Conecte seu repositório no Cloudflare Pages ou Vercel e adicione seu domínio personalizado.
