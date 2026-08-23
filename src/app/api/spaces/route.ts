import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";
import { formatTimeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  return withPrisma(async (prisma) => {
    try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "12", 10));
    const category = searchParams.get("category") || "all";

    const whereClause: any = { isActive: true };
    if (category && category !== "all") {
      whereClause.category = category;
    }

    // Fetch all active brands for overall metrics and available categories
    const allActiveBrands = await prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { totalAmount: "desc" },
    });

    const totalGlobalAmount = allActiveBrands.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalClicks = allActiveBrands.reduce((sum, b) => sum + b.clicksCount, 0);
    const availableCategories = Array.from(
      new Set(allActiveBrands.map((b) => b.category).filter(Boolean))
    );

    // Fetch filtered brands
    const filteredBrands = await prisma.brand.findMany({
      where: whereClause,
      orderBy: { totalAmount: "desc" },
    });

    const totalFiltered = filteredBrands.length;
    const totalPages = Math.ceil(totalFiltered / limit) || 1;
    const safePage = Math.min(page, totalPages);

    // Paginate
    const startIndex = (safePage - 1) * limit;
    const paginatedBrands = filteredBrands.slice(startIndex, startIndex + limit);

    // Calculate percentage relative to the current visible page/pool
    const pageTotalAmount = paginatedBrands.reduce((sum, b) => sum + b.totalAmount, 0);

    const formattedBrands = paginatedBrands.map((b, index) => {
      const percentage =
        pageTotalAmount > 0
          ? Number(((b.totalAmount / pageTotalAmount) * 100).toFixed(2))
          : 0;

      // Calculate global rank
      const globalRank = allActiveBrands.findIndex((item) => item.id === b.id) + 1;

      return {
        id: b.id,
        name: b.name,
        domain: b.domain,
        websiteUrl: b.websiteUrl,
        logoUrl: b.logoUrl,
        tagline: b.tagline,
        category: b.category,
        color: b.color || "#7c3aed",
        totalAmount: b.totalAmount,
        clicksCount: b.clicksCount,
        isActive: b.isActive,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
        lastPaymentAt: b.lastPaymentAt,
        percentage,
        rank: globalRank,
        lastPaymentFormatted: formatTimeAgo(b.lastPaymentAt),
      };
    });

    const leader = allActiveBrands.length > 0 ? {
      ...allActiveBrands[0],
      percentage: totalGlobalAmount > 0 ? Number(((allActiveBrands[0].totalAmount / totalGlobalAmount) * 100).toFixed(2)) : 0,
      rank: 1,
      lastPaymentFormatted: formatTimeAgo(allActiveBrands[0].lastPaymentAt)
    } : null;

    // Get last payment
    const lastPayment = await prisma.payment.findFirst({
      where: { status: "completed" },
      orderBy: { createdAt: "desc" },
      include: { brand: true },
    });

    const response = {
      brands: formattedBrands,
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
            brandName: lastPayment.brand?.name || "Anônimo",
            amount: lastPayment.amount,
            timeAgo: formatTimeAgo(lastPayment.createdAt),
          }
        : null,
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
    } catch (error) {
      console.error("Error fetching spaces:", error);
      return NextResponse.json(
        { error: "Erro ao buscar dados dos espaços" },
        { status: 500 }
      );
    }
  });
}
