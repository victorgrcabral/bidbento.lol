import { NextResponse } from "next/server";
import { BrandRecord, normalizeBrand, withDb } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SummaryRow = { totalPageViews: number; totalVisitors: number; visitorsLast24h: number; liveOnline: number };
type HourRow = { time: string; visitors: number };
type ChannelRow = { name: string; count: number };
type PageRow = { page: string; views: number };
type PaymentStatsRow = { completedPayments: number; totalRevenue: number | string | null };

const CHANNEL_COLORS: Record<string, string> = {
  Direct: "#3b82f6",
  "Organic Search": "#10b981",
  Social: "#8b5cf6",
  Referral: "#f59e0b",
};

export async function GET() {
  return withDb(async (db) => {
    try {
      const summaryResult = await db.query<SummaryRow>(`
        select count(*)::int as "totalPageViews",
          count(distinct "sessionId")::int as "totalVisitors",
          count(distinct "sessionId") filter (where "createdAt" >= now() - interval '24 hours')::int as "visitorsLast24h",
          count(distinct "sessionId") filter (where "createdAt" >= now() - interval '5 minutes')::int as "liveOnline"
        from public."SiteVisit"
      `);
      const summary = summaryResult.rows[0] || { totalPageViews: 0, totalVisitors: 0, visitorsLast24h: 0, liveOnline: 0 };

      const hourlyResult = await db.query<HourRow>(`
        with hours as (
          select generate_series(date_trunc('hour', now()) - interval '23 hours', date_trunc('hour', now()), interval '1 hour') as hour
        )
        select to_char(hours.hour, 'HH24:00') as time, count(distinct visits."sessionId")::int as visitors
        from hours left join public."SiteVisit" visits
          on visits."createdAt" >= hours.hour and visits."createdAt" < hours.hour + interval '1 hour'
        group by hours.hour order by hours.hour
      `);
      const channelsResult = await db.query<ChannelRow>(`
        select source as name, count(*)::int as count
        from public."SiteVisit" where "createdAt" >= now() - interval '30 days'
        group by source order by count desc
      `);
      const pagesResult = await db.query<PageRow>(`
        select path as page, count(*)::int as views
        from public."SiteVisit" where "createdAt" >= now() - interval '30 days'
        group by path order by views desc limit 8
      `);
      const brandsResult = await db.query<BrandRecord>(`
        select * from public."Brand" where "isActive" = true order by "clicksCount" desc
      `);
      const paymentResult = await db.query<PaymentStatsRow>(`
        select count(*)::int as "completedPayments", coalesce(sum(amount), 0) as "totalRevenue"
        from public."Payment" where status = 'completed'
      `);

      const brands = brandsResult.rows.map(normalizeBrand);
      const totalClicks = brands.reduce((sum, brand) => sum + brand.clicksCount, 0);
      const channelTotal = channelsResult.rows.reduce((sum, channel) => sum + channel.count, 0);
      const channels = channelsResult.rows.map((channel) => ({
        ...channel,
        percentage: channelTotal ? Number(((channel.count / channelTotal) * 100).toFixed(1)) : 0,
        color: CHANNEL_COLORS[channel.name] || "#71717a",
      }));
      const topViews = pagesResult.rows[0]?.views || 0;
      const topPages = pagesResult.rows.map((page) => ({
        ...page,
        name: page.page === "/" ? "Home" : page.page,
        pct: topViews ? Number(((page.views / topViews) * 100).toFixed(1)) : 0,
      }));
      const payments = paymentResult.rows[0] || { completedPayments: 0, totalRevenue: 0 };

      return NextResponse.json({
        ...summary,
        totalClicks,
        totalBrands: brands.length,
        totalRevenue: Number(payments.totalRevenue || 0),
        completedPayments: payments.completedPayments,
        clickThroughRate: summary.totalPageViews ? Number(((totalClicks / summary.totalPageViews) * 100).toFixed(2)) : 0,
        purchaseConversionRate: summary.totalVisitors ? Number(((payments.completedPayments / summary.totalVisitors) * 100).toFixed(2)) : 0,
        hourlyTraffic: hourlyResult.rows,
        channels,
        topPages,
        topBrands: brands.slice(0, 8),
      }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } });
    } catch (error) {
      console.error("Error fetching real stats:", error);
      return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
  });
}
