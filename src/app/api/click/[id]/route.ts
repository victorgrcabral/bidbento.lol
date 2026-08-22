import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureUrlProtocol } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: brandId } = await params;

    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const referrer = request.headers.get("referer") || null;
    const userAgent = request.headers.get("user-agent") || null;

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

    const targetUrl = ensureUrlProtocol(brand.websiteUrl);
    return NextResponse.redirect(targetUrl, { status: 307 });
  } catch (error) {
    console.error("Error logging click:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
