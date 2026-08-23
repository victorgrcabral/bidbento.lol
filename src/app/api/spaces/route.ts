import { NextRequest, NextResponse } from "next/server";
import { BrandRecord, normalizeBrand, withDb } from "@/lib/db";
import { formatTimeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type LastPaymentRow = {
  amount: number | string;
  createdAt: Date;
  brandName: string;
};

export async function GET(request: NextRequest) {
  return withDb(async (db) => {
    try {
      const { searchParams } = new URL(request.url);
      const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10));
      const limit = Math.max(1, Number.parseInt(searchParams.get("limit") || "12", 10));
      const category = searchParams.get("category") || "all";

      const allResult = await db.query<BrandRecord>(
        `select * from public."Brand" where "isActive" = true order by "totalAmount" desc`,
      );
      const allActiveBrands = allResult.rows.map(normalizeBrand);
      const filteredBrands = category === "all"
        ? allActiveBrands
        : allActiveBrands.filter((brand) => brand.category === category);
      const totalGlobalAmount = allActiveBrands.reduce((sum, brand) => sum + brand.totalAmount, 0);
      const totalClicks = allActiveBrands.reduce((sum, brand) => sum + brand.clicksCount, 0);
      const availableCategories = Array.from(new Set(allActiveBrands.map((brand) => brand.category).filter(Boolean)));
      const totalPages = Math.max(1, Math.ceil(filteredBrands.length / limit));
      const safePage = Math.min(page, totalPages);
      const startIndex = (safePage - 1) * limit;
      const paginatedBrands = filteredBrands.slice(startIndex, startIndex + limit);
      const pageTotalAmount = paginatedBrands.reduce((sum, brand) => sum + brand.totalAmount, 0);

      const brands = paginatedBrands.map((brand) => ({
        ...brand,
        percentage: pageTotalAmount ? Number(((brand.totalAmount / pageTotalAmount) * 100).toFixed(2)) : 0,
        rank: allActiveBrands.findIndex((candidate) => candidate.id === brand.id) + 1,
        lastPaymentFormatted: formatTimeAgo(brand.lastPaymentAt),
      }));
      const firstBrand = allActiveBrands[0];
      const leader = firstBrand
        ? {
            ...firstBrand,
            percentage: totalGlobalAmount ? Number(((firstBrand.totalAmount / totalGlobalAmount) * 100).toFixed(2)) : 0,
            rank: 1,
            lastPaymentFormatted: formatTimeAgo(firstBrand.lastPaymentAt),
          }
        : null;

      const lastPaymentResult = await db.query<LastPaymentRow>(`
        select payment.amount, payment."createdAt", brand.name as "brandName"
        from public."Payment" payment
        join public."Brand" brand on brand.id = payment."brandId"
        where payment.status = 'completed'
        order by payment."createdAt" desc
        limit 1
      `);
      const lastPayment = lastPaymentResult.rows[0];

      return NextResponse.json(
        {
          brands,
          totalAmount: totalGlobalAmount,
          totalBrands: allActiveBrands.length,
          totalClicks,
          page: safePage,
          totalPages,
          limit,
          category,
          availableCategories,
          leader,
          lastBid: lastPayment
            ? {
                brandName: lastPayment.brandName,
                amount: Number(lastPayment.amount),
                timeAgo: formatTimeAgo(lastPayment.createdAt),
              }
            : null,
        },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } },
      );
    } catch (error) {
      console.error("Error fetching spaces:", error);
      return NextResponse.json({ error: "Erro ao buscar dados dos espaços" }, { status: 500 });
    }
  });
}
