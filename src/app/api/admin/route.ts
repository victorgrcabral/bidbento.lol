import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "myspace-secret-admin-key-2026";

function verifyAdmin(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  return secret === ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const brands = await prisma.brand.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      payments: true,
      _count: { select: { clicks: true } },
    },
  });

  return NextResponse.json({ brands });
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { brandId, isActive, name, tagline, color } = await req.json();

  const updated = await prisma.brand.update({
    where: { id: brandId },
    data: {
      ...(typeof isActive === "boolean" && { isActive }),
      ...(name && { name }),
      ...(tagline !== undefined && { tagline }),
      ...(color && { color }),
    },
  });

  return NextResponse.json({ brand: updated });
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const brandId = searchParams.get("id");

  if (!brandId) {
    return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  }

  await prisma.brand.delete({
    where: { id: brandId },
  });

  return NextResponse.json({ success: true });
}
