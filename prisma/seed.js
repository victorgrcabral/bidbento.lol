const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const initialBrands = [
  {
    name: "Supabase",
    domain: "supabase.com",
    websiteUrl: "https://supabase.com",
    logoUrl: "https://supabase.com/favicon/favicon-196x196.png",
    tagline: "The Open Source Firebase Alternative",
    category: "Developer Tools",
    color: "#3ECF8E",
    totalAmount: 320.0,
    clicksCount: 423,
    lastPaymentAt: new Date(Date.now() - 1000 * 60 * 20),
  },
  {
    name: "Next.js",
    domain: "nextjs.org",
    websiteUrl: "https://nextjs.org",
    logoUrl: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png",
    tagline: "The React Framework for the Web",
    category: "Developer Tools",
    color: "#000000",
    totalAmount: 260.0,
    clicksCount: 388,
    lastPaymentAt: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    name: "Linear",
    domain: "linear.app",
    websiteUrl: "https://linear.app",
    logoUrl: "https://linear.app/static/apple-touch-icon.png",
    tagline: "The issue tracker built for high-performance teams",
    category: "SaaS",
    color: "#5E6AD2",
    totalAmount: 210.0,
    clicksCount: 298,
    lastPaymentAt: new Date(Date.now() - 1000 * 60 * 90),
  },
  {
    name: "Midjourney",
    domain: "midjourney.com",
    websiteUrl: "https://midjourney.com",
    logoUrl: "https://www.midjourney.com/favicon.ico",
    tagline: "Explore the new mediums of thought and AI imagination",
    category: "IA / Machine Learning",
    color: "#ffffff",
    totalAmount: 175.0,
    clicksCount: 245,
    lastPaymentAt: new Date(Date.now() - 1000 * 60 * 180),
  },
  {
    name: "Stripe",
    domain: "stripe.com",
    websiteUrl: "https://stripe.com",
    logoUrl: "https://stripe.com/favicon.ico",
    tagline: "Financial infrastructure for the internet",
    category: "Fintech",
    color: "#635BFF",
    totalAmount: 130.0,
    clicksCount: 154,
    lastPaymentAt: new Date(Date.now() - 1000 * 60 * 300),
  },
  {
    name: "Figma",
    domain: "figma.com",
    websiteUrl: "https://figma.com",
    logoUrl: "https://static.figma.com/app/icon/1/favicon.svg",
    tagline: "How teams design and build together",
    category: "Design & UI",
    color: "#F24E1E",
    totalAmount: 95.0,
    clicksCount: 120,
    lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 7),
  },
  {
    name: "Raycast",
    domain: "raycast.com",
    websiteUrl: "https://raycast.com",
    logoUrl: "https://www.raycast.com/favicon-production.png",
    tagline: "Supercharged productivity for Mac and Windows",
    category: "Produtividade",
    color: "#FF6363",
    totalAmount: 70.0,
    clicksCount: 89,
    lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  {
    name: "Resend",
    domain: "resend.com",
    websiteUrl: "https://resend.com",
    logoUrl: "https://resend.com/static/favicons/favicon.ico",
    tagline: "Email for developers",
    category: "Developer Tools",
    color: "#000000",
    totalAmount: 55.0,
    clicksCount: 76,
    lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
  },
  {
    name: "Claude",
    domain: "anthropic.com",
    websiteUrl: "https://anthropic.com",
    logoUrl: "https://anthropic.com/favicon.ico",
    tagline: "Next-generation AI assistant and models",
    category: "IA / Machine Learning",
    color: "#D97706",
    totalAmount: 45.0,
    clicksCount: 62,
    lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 22),
  },
  {
    name: "Tailwind CSS",
    domain: "tailwindcss.com",
    websiteUrl: "https://tailwindcss.com",
    logoUrl: "https://tailwindcss.com/favicons/favicon.ico",
    tagline: "Rapidly build modern websites without ever leaving your HTML",
    category: "Developer Tools",
    color: "#06B6D4",
    totalAmount: 35.0,
    clicksCount: 51,
    lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 28),
  },
  {
    name: "Uniswap",
    domain: "uniswap.org",
    websiteUrl: "https://uniswap.org",
    logoUrl: "https://uniswap.org/favicon.ico",
    tagline: "Swap tokens and trade crypto seamlessly",
    category: "Crypto / Web3",
    color: "#FF007A",
    totalAmount: 25.0,
    clicksCount: 38,
    lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
  },
  {
    name: "V0 by Vercel",
    domain: "v0.dev",
    websiteUrl: "https://v0.dev",
    logoUrl: "https://v0.dev/favicon.ico",
    tagline: "Generative UI system powered by AI",
    category: "IA / Machine Learning",
    color: "#7C3AED",
    totalAmount: 18.0,
    clicksCount: 29,
    lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 40),
  },
  // Page 2 items
  {
    name: "Shopify",
    domain: "shopify.com",
    websiteUrl: "https://shopify.com",
    logoUrl: "https://shopify.com/favicon.ico",
    tagline: "The global commerce platform",
    category: "E-commerce",
    color: "#96BF48",
    totalAmount: 12.0,
    clicksCount: 22,
    lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    name: "PostHog",
    domain: "posthog.com",
    websiteUrl: "https://posthog.com",
    logoUrl: "https://posthog.com/favicon.ico",
    tagline: "Product analytics, session recording, feature flags",
    category: "Developer Tools",
    color: "#FFC000",
    totalAmount: 8.0,
    clicksCount: 15,
    lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 55),
  },
  {
    name: "Dribbble",
    domain: "dribbble.com",
    websiteUrl: "https://dribbble.com",
    logoUrl: "https://dribbble.com/favicon.ico",
    tagline: "The world's destination for design",
    category: "Design & UI",
    color: "#EA4C89",
    totalAmount: 5.0,
    clicksCount: 11,
    lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 60),
  },
  {
    name: "Dub.co",
    domain: "dub.co",
    websiteUrl: "https://dub.co",
    logoUrl: "https://dub.co/favicon.ico",
    tagline: "Modern link management for marketing teams",
    category: "SaaS",
    color: "#000000",
    totalAmount: 3.0,
    clicksCount: 8,
    lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
  },
];

async function main() {
  console.log("🌱 Populando banco com marcas e categorias...");

  await prisma.clickEvent.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.brand.deleteMany({});

  for (const b of initialBrands) {
    const brand = await prisma.brand.create({
      data: {
        name: b.name,
        domain: b.domain,
        websiteUrl: b.websiteUrl,
        logoUrl: b.logoUrl,
        tagline: b.tagline,
        category: b.category,
        color: b.color,
        totalAmount: b.totalAmount,
        clicksCount: b.clicksCount,
        lastPaymentAt: b.lastPaymentAt,
        isActive: true,
      },
    });

    await prisma.payment.create({
      data: {
        brandId: brand.id,
        amount: b.totalAmount,
        currency: "usd",
        status: "completed",
        createdAt: b.lastPaymentAt,
      },
    });
  }

  console.log("✅ Seed concluído!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
