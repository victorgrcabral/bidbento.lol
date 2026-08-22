import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { clicksCount: "desc" },
    });

    const totalClicks = brands.reduce((sum, b) => sum + b.clicksCount, 0);
    const totalPool = brands.reduce((sum, b) => sum + b.totalAmount, 0);
    
    // Total simulated visitors + click ratio
    const baseVisitors = 1181912;
    const liveOnline = Math.floor(650 + Math.random() * 80);

    const hourlyTraffic = [
      { time: "00:00", visitors: 2800 },
      { time: "02:00", visitors: 3400 },
      { time: "04:00", visitors: 2900 },
      { time: "06:00", visitors: 2700 },
      { time: "08:00", visitors: 3100 },
      { time: "10:00", visitors: 3800 },
      { time: "12:00", visitors: 4200 },
      { time: "14:00", visitors: 5800 },
      { time: "16:00", visitors: 5100 },
      { time: "18:00", visitors: 6900 },
      { time: "20:00", visitors: 5600 },
      { time: "22:00", visitors: 3800 },
    ];

    const channels = [
      { name: "Direct", percentage: 72, count: "57.4k", color: "#3b82f6" },
      { name: "Organic Search", percentage: 14, count: "11.2k", color: "#10b981" },
      { name: "Social (X, LinkedIn)", percentage: 9, count: "7.1k", color: "#8b5cf6" },
      { name: "Referrals", percentage: 5, count: "4.0k", color: "#f59e0b" },
    ];

    const topPages = [
      { page: "/", name: "Home (Main Canvas)", views: "74.2k", pct: 72 },
      { page: "/category/developer-tools", name: "Developer Tools", views: "14.8k", pct: 14 },
      { page: "/category/saas", name: "SaaS", views: "11.2k", pct: 11 },
      { page: "/rules", name: "Rules & Guidelines", views: "6.4k", pct: 6 },
      { page: "/checkout", name: "Claim Bento Checkout", views: "4.8k", pct: 5 },
    ];

    return NextResponse.json(
      {
        totalVisitors: baseVisitors,
        visitorsLast24h: 75480,
        liveOnline,
        totalClicks,
        totalPool,
        totalBrands: brands.length,
        avgSessionTime: "0m 58s",
        bounceRate: "28%",
        conversionRate: "16.4%",
        hourlyTraffic,
        channels,
        topPages,
        topBrands: brands.slice(0, 8),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
