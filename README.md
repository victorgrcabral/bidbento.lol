<div align="center">
  <img src="public/logo.png" alt="bidbento.lol logo" width="380" />
  <br />

  <img src="public/bidbento-mascot-transparent.svg" alt="BidBento mascot scanning for an open category" width="420" />
  <br />
  <sub><code>mascot.status = "scouting unclaimed categories with a transparent animated canvas"</code></sub>

  <h1>🍱 bidbento.lol</h1>
  <p><strong>The Real-Time Visual Screen Domination & Advertising Engine</strong></p>
  <p><em>A democratic, algorithmically partitioned bento grid canvas where brands and indie makers conquer visual real-estate proportional to their investment.</em></p>

  <p>
    <a href="https://bidbento.lol"><strong>🌐 Live Application: bidbento.lol</strong></a> •
    <a href="https://bidbento.lol/stats"><strong>📊 Live Analytics & Transparency</strong></a> •
    <a href="https://bidbento.lol/rules"><strong>📜 Official Rules & Architecture</strong></a> •
    <a href="https://bidbento.lol/checkout"><strong>💳 Direct Checkout</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js_15.5-App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 15" />
    <img src="https://img.shields.io/badge/React_19-Server_&_Client-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript_5-Strict_Types-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
    <img src="https://img.shields.io/badge/Tailwind_CSS_3.4-Cyberpunk_Dark-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Prisma_5.22-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/Supabase-PostgreSQL_Cloud-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Stripe-Checkout_&_Webhooks-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
    <img src="https://img.shields.io/badge/Cloudflare-Global_Edge_Network-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare" />
  </p>
</div>

---

## 📌 Executive Overview

**bidbento.lol** is a high-performance, real-time web experiment designed to disrupt traditional winner-take-all advertising billboards and pay-per-click duopolies. Utilizing the mathematical **Squarified Treemap Layout Algorithm (Bruls et al.)**, the canvas partitions the user's screen into rectangular bento blocks whose visual area is strictly proportional to each brand's cumulative financial investment.

### 💡 Core Engineering Highlights
1. **Mathematical Screen Partitioning:** Pure geometric tessellation algorithm running in real-time, optimizing rectangular aspect ratios toward 1.0 (squares) to eliminate layout distortion.
2. **Democratic Multi-Page Allocation:** Unlike legacy billboards where top conglomerates monopolize 99% of visibility, bidbento divides rank distribution across 12-slot pages. Indie makers and small teams ($5–$25 budgets) capture visually massive real-estate across Pages 2 & 3.
3. **Atomic Click Attribution Engine:** Non-cached 307 redirect endpoints executing atomic database transactions (`clicksCount` increment + `ClickEvent` telemetry tracking) with zero browser caching delays.
4. **Live Transparency Dashboard (`/stats`):** Public analytics engine with custom SVG bezier area spline charts, traffic channel breakdowns, live online counter, and verifiable click attribution.
5. **Global Multi-Currency & i18n Engine:** Native tripartite localization (**English**, **Español**, **Português**) and dynamic currency normalization (**USD**, **EUR**, **BRL**).
6. **Mobile Conversion Navigation:** Touch-friendly labeled links for Stats, Rules, and Ranking, plus a full-width primary action that respects mobile safe areas.

---

## 🏗️ System Architecture

```
                                  +-------------------------------------------------------+
                                  |                    CLIENT BROWSER                     |
                                  |   (Next.js 15 + React 19 Client Tree + Framer Motion) |
                                  +-------------------------------------------------------+
                                        |                                           ^
                  HTTP GET /api/spaces  |                                           | WebSocket/Polling
                  (JSON Layout Data)    v                                           | (Canvas Updates)
                                  +-------------------------------------------------------+
                                  |                  NEXT.JS APP ROUTER                   |
                                  |   (Server Route Handlers & Squarified Treemap Engine) |
                                  +-------------------------------------------------------+
                                       /                    |                   \
            Stripe Checkout / Webhook /                     |                    \ Atomic Click Logging
                                     v                      v                     v
                        +--------------------+    +-------------------+    +--------------------+
                        |   STRIPE ENGINE    |    |    PRISMA ORM     |    |   /api/click/[id]  |
                        | (Payment Sessions) |    |  (Query Engine)   |    | (307 No-Cache Red) |
                        +--------------------+    +-------------------+    +--------------------+
                                     \                      |                     /
                                      \                     v                    /
                                       +----------------------------------------+
                                       |          SUPABASE POSTGRESQL           |
                                       |   (Brands, Payments, ClickEvents)      |
                                       +----------------------------------------+
```

---

## 📐 Mathematical Algorithm & Engineering Deep Dive

### 1. Squarified Treemap Algorithm
To partition the screen into intuitive bento grid boxes without thin, unreadable slivers, the system implements the **Squarified Treemap Algorithm**:

$$\text{Area}(B_i) = \frac{\text{Investment}(B_i)}{\sum_{j=1}^{N} \text{Investment}(B_j)} \times (\text{Screen Width} \times \text{Screen Height})$$

For any candidate row of rectangles $R = [r_1, r_2, \dots, r_k]$ along length $w$, the algorithm minimizes the worst aspect ratio:

$$\text{AspectRatio}(R, w) = \max_{r \in R} \left( \frac{w^2 \cdot r}{\left(\sum r\right)^2}, \frac{\left(\sum r\right)^2}{w^2 \cdot r} \right)$$

This ensures that regardless of whether a brand bids $\$1.00$ or $\$500.00$, its block preserves optimal proportions for logo rendering, taglines, and clickability.

### 2. Cumulative Equity & Anti-Dilution Model
- **Continuous Recalculation:** As new participants join the pool, existing brands resize smoothly via **hardware-accelerated Framer Motion spring physics** (`damping: 32, stiffness: 280`).
- **Domain Aggregation:** Subsequent bids for the same domain (e.g. `linear.app`) automatically consolidate, instantly expanding visual dominance without fracturing into multiple scattered spots.

---

## 🛠️ Complete Technology Stack

| Layer | Technology | Purpose / Architectural Role |
|---|---|---|
| **Frontend Framework** | **Next.js 15.5 (App Router)** | Hybrid Server/Client rendering, React Server Components (RSC), optimized dynamic routing |
| **UI Library** | **React 19** | Concurrent rendering features, action hooks, and optimized state management |
| **Language** | **TypeScript 5.6** | End-to-end type safety, strict interface contracts for Treemap geometry and database entities |
| **Styling** | **Tailwind CSS 3.4** | Obsidian dark-mode palette, custom glassmorphism, responsive clamp typography |
| **Animation Engine** | **Framer Motion 11** | Layout spring physics, vertical card deck slide transitions, animated mascot loop |
| **Database & ORM** | **Prisma 7.9 + PostgreSQL** | Relational data integrity, schema migrations, and indexed relational models on Supabase AWS Cloud |
| **Payment Gateway** | **Stripe API v17.7** | Card Checkout Sessions in USD, EUR, and BRL with idempotent webhook fulfillment (`checkout.session.completed`) |
| **Analytics Engine** | **Custom Vector SVG** | Zero-dependency bezier area chart rendering, real-time live traffic telemetry |
| **Edge Hosting** | **Cloudflare / Vercel** | Global CDN distribution, low-latency API response times (<50ms globally) |

---

## 🗄️ Database Schema & Relational Design

```prisma
model Brand {
  id            String       @id @default(uuid())
  name          String
  domain        String       @unique
  websiteUrl    String
  logoUrl       String?
  tagline       String?
  category      String       @default("SaaS")
  color         String?      @default("#7c3aed")
  totalAmount   Float        @default(0.0)
  clicksCount   Int          @default(0)
  isActive      Boolean      @default(true)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
  lastPaymentAt DateTime     @default(now())
  payments      Payment[]
  clickEvents   ClickEvent[]

  @@index([totalAmount(sort: Desc)])
  @@index([category])
  @@index([isActive])
}

model Payment {
  id              String   @id @default(uuid())
  brandId         String
  brand           Brand    @relation(fields: [brandId], references: [id], onDelete: Cascade)
  amount          Float
  currency        String   @default("USD")
  stripeSessionId String?  @unique
  status          String   @default("completed")
  createdAt       DateTime @default(now())

  @@index([brandId])
}

model ClickEvent {
  id        String   @id @default(uuid())
  brandId   String
  brand     Brand    @relation(fields: [brandId], references: [id], onDelete: Cascade)
  referrer  String?
  userAgent String?
  createdAt DateTime @default(now())

  @@index([brandId])
  @@index([createdAt])
}
```

---

## 🚀 Local Development Setup

### 1. Clone the repository:
```bash
git clone https://github.com/victorgrcabral/bidbento.lol.git
cd bidbento.lol
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Configure environment variables:
Create a `.env` file in the root directory:
```env
# PostgreSQL Connection (Supabase / Cloudflare Hyperdrive / Local)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Stripe Credentials
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Security
ADMIN_SECRET="your_admin_secret_key"
```

### 4. Initialize Database Schema & Seed Data:
```bash
# Push schema to database
npx prisma db push

# (Optional) Seed demo brands for local visualization
npm run prisma:seed
```

### 5. Start Development Server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment Guide (Cloudflare Pages / Workers)

### 1. Cloudflare Environment Variables
In your **Cloudflare Pages / Workers Dashboard** (Settings ➔ Variables and Secrets), configure:
- `DATABASE_URL` (Your production connection pooler string)
- `DIRECT_URL` (Direct database endpoint for Prisma migrations)
- `NEXT_PUBLIC_APP_URL` (`https://bidbento.lol`)
- `STRIPE_SECRET_KEY` (`sk_live_...` or `sk_test_...`)
- `STRIPE_WEBHOOK_SECRET` (`whsec_...`)
- `ADMIN_SECRET` (A strong random secret)

### 2. Build Configuration:
- **Framework preset:** Next.js
- **Build command:** `npx prisma generate && next build`
- **Output directory:** `.next`
- **Node.js version:** `20.x` (Set `NODE_VERSION: 20` in Environment Variables)

### 3. Stripe Webhook Setup:
In the **Stripe Dashboard** (Developers ➔ Webhooks):
- **Endpoint URL:** `https://bidbento.lol/api/webhook/stripe`
- **Events to send:** `checkout.session.completed`

In **Settings ➔ Payment methods**, enable **Cards**. BRL Checkout Sessions charge in reais and accept cards; Pix and boleto are not included by the application.

---

## 📦 Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Starts the Next.js local development server |
| `build` | `npm run build` | Generates Prisma client and produces optimized production build |
| `start` | `npm run start` | Runs the production build server |
| `prisma:push` | `npm run prisma:push` | Synchronizes the Prisma schema with the live PostgreSQL instance |
| `prisma:seed` | `npm run prisma:seed` | Populates database with sample bento advertisers for testing |
| `reset:production` | `npm run reset:production` | Truncates all test tables for official 100% clean production launch |

---

## 🛡️ Security, Performance & Code Quality

- **Zero npm Vulnerabilities:** Clean audit resolution with verified dependencies (`npm audit` = 0 vulnerabilities).
- **Atomic Concurrency Control:** Stripe webhooks execute idempotent upserts preventing duplicate credit injection.
- **Strict Content Moderation:** Automated domain validation + protected `/admin` control suite for content safety.
- **Cache-Control Protocol:** Dynamic API endpoints employ `no-store, no-cache, must-revalidate` HTTP headers, ensuring zero lag on clicks and live board recalculations.

---

## 👨‍💻 Author & Engineering Portfolio

Developed with precision and passion by **Victor Cabral**:

- **GitHub:** [@victorgrcabral](https://github.com/victorgrcabral)
- **Repository:** [victorgrcabral/bidbento.lol](https://github.com/victorgrcabral/bidbento.lol)
- **Live Project:** [bidbento.lol](https://bidbento.lol)

---

<div align="center">
  <sub>Built as a modern, high-concurrency real-time advertising platform. Licensed under the MIT License.</sub>
</div>
