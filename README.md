<div align="center">
  <img src="public/logo.png" alt="bidbento.lol Logo" width="360" />
  <br />
  <br />

  [![Next.js](https://img.shields.io/badge/Next.js-15.5+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
  [![Stripe](https://img.shields.io/badge/Stripe-Live_Ready-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

  <p align="center">
    <strong>The Real-Time Visual Screen Domination & Advertising Engine</strong>
    <br />
    <em>Compete for screen territory, drive direct traffic to your SaaS, and claim visual dominance worldwide.</em>
  </p>

  <p align="center">
    <a href="https://bidbento.lol"><strong>🌐 Live Website: bidbento.lol</strong></a> •
    <a href="https://bidbento.lol/rules"><strong>📜 Official Rules</strong></a> •
    <a href="https://bidbento.lol/checkout"><strong>💳 Direct Checkout</strong></a>
  </p>
</div>

---

## 🌟 Key Features

- 📐 **Squarified Treemap Layout Engine:** Mathematical real-time screen partitioning ensuring optimal aspect ratios. Every brand's rectangular area is strictly proportional to its cumulative bid compared to the active page pool.
- ⚡ **Continuous Real-Time Dilution:** As new advertisers place bids, existing slots resize smoothly with fluid **Framer Motion** layout transitions without layout popping.
- 🌍 **Global Multi-Language Support (i18n):**
  - 🇺🇸 **English** (Default global standard)
  - 🇪🇸 **Español**
  - 🇧🇷 **Português**
  - Instant live language switcher with locale auto-detection and persistence.
- 🌓 **Dark & Light Mode:**
  - Default deep-space obsidian dark theme with neon ambient glows.
  - Crisp high-contrast light mode for clean daytime readability.
- 📱 **Mobile-First Gesture Navigation:**
  - Vertical swipe / scroll gestures on mobile effortlessly navigate between bento pages (`< Page 1/2 >`).
  - Desktop wheel scrolling support with debounce.
- 🤖 **Interactive Empty State Mascot:**
  - Engaging animated looping space character ("Bento Pioneer") for empty categories with radar scanner, bobbing animations, and persuasive $1.00 conquest copy.
- 💳 **Production-Ready Stripe Integration:**
  - Instant Stripe Checkout Sessions with direct webhook listener (`checkout.session.completed`).
  - Automatic domain aggregation: multiple bids for the same website sum together to expand territory.
- 🏷️ **Smart Categorization & Pagination:**
  - Category filters (*Developer Tools, SaaS, AI / ML, Design, Fintech, Crypto, Productivity, E-commerce*).
  - 12 brands per page limit ensuring optimal visibility and legibility.
- 🖼️ **Multipart Image Upload & Custom Color Picker:**
  - Direct file upload (PNG, JPEG, SVG, WebP) with instant preview.
  - Color palette with support for custom **HEX**, **RGB**, and **CMYK** color inputs.
- 🛡️ **Built-in Moderation Dashboard:**
  - Dedicated `/admin` route protected with `ADMIN_SECRET` to review, hide, or ban inappropriate domains.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 15.5 (App Router), React 19, TypeScript |
| **Styling & UI** | Tailwind CSS, Framer Motion, Lucide Icons, Custom SVG Engine |
| **State & i18n** | React Hooks, Multi-language Dictionary System, Locale Storage Sync |
| **Backend & APIs** | Next.js Route Handlers, Stripe Node SDK, Multipart Form Handlers |
| **Database & ORM** | Prisma ORM, PostgreSQL (Supabase AWS Cloud) / SQLite (Local Dev) |
| **Security** | Zero vulnerabilities (`npm audit` verified), Protected Admin Endpoints |

---

## 🚀 Getting Started Locally

### 1. Clone the repository:
```bash
git clone https://github.com/victorgrcabral/bidbento.lol.git
cd bidbento.lol
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Setup environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
ADMIN_SECRET="your-admin-secret-key"
```

### 4. Sync Database & Seed Demo Data:
```bash
npx prisma db push
node prisma/seed.js
```

### 5. Start Development Server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

- `npm run dev`: Launches Next.js dev server.
- `npm run build`: Generates optimized production build with Prisma generation.
- `npm run start`: Runs the production server.
- `npm run prisma:push`: Synchronizes Prisma schema to PostgreSQL database.
- `npm run prisma:seed`: Seeds sample tech brands into the database.
- `npm run reset:production`: Cleans all demo data for official live launch.

---

## 🔒 Security & Privacy

- Secret keys (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `ADMIN_SECRET`, and `DATABASE_URL`) are strictly isolated in environment variables and excluded from git tracking.
- All dependencies are audited with overrides ensuring **0 vulnerabilities**.

---

## 📄 License & Attribution

Designed and developed for **[bidbento.lol](https://bidbento.lol)**. Inspired by the viral dynamics of screen-space real-estate platforms.
