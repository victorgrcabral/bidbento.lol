import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";
import { ensureUrlProtocol } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPrisma(async (prisma) => {
    try {
    const { id: brandId } = await params;

    if (!brandId) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const referrer = request.headers.get("referer") || null;
    const userAgent = request.headers.get("user-agent") || null;

    // Increment click counter and register click event
    try {
      await prisma.$transaction([
        prisma.brand.update({
          where: { id: brandId },
          data: { clicksCount: { increment: 1 } },
        }),
        prisma.clickEvent.create({
          data: {
            brandId,
            referrer,
            userAgent,
          },
        }),
      ]);
    } catch (dbErr) {
      console.error("Failed to update click counter in DB:", dbErr);
    }

    const targetUrl = ensureUrlProtocol(brand.websiteUrl || brand.domain);
    const response = NextResponse.redirect(targetUrl, { status: 307 });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
    } catch (error) {
      console.error("Error logging click:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  });
}
