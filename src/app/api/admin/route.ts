import { NextRequest, NextResponse } from "next/server";
import { BrandRecord, normalizeBrand, withDb } from "@/lib/db";

function verifyAdmin(request: NextRequest) {
  const configured = process.env.ADMIN_SECRET;
  return Boolean(configured) && request.headers.get("x-admin-secret") === configured;
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  return withDb(async (db) => {
    const brandsResult = await db.query<BrandRecord>(`select * from public."Brand" order by "createdAt" desc`);
    const paymentsResult = await db.query(`select * from public."Payment" order by "createdAt" desc`);
    const clicksResult = await db.query<{ brandId: string; count: number }>(`select "brandId", count(*)::int as count from public."ClickEvent" group by "brandId"`);
    const payments = new Map<string, unknown[]>();
    for (const payment of paymentsResult.rows) payments.set(payment.brandId, [...(payments.get(payment.brandId) || []), payment]);
    const clicks = new Map(clicksResult.rows.map((row) => [row.brandId, row.count]));
    return NextResponse.json({ brands: brandsResult.rows.map((row) => ({ ...normalizeBrand(row), payments: payments.get(row.id) || [], _count: { clicks: clicks.get(row.id) || 0 } })) });
  });
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdmin(request)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  return withDb(async (db) => {
    const { brandId, isActive, name, tagline, color } = await request.json();
    const result = await db.query<BrandRecord>(
      `update public."Brand" set "isActive"=coalesce($2,"isActive"), name=coalesce(nullif($3,''),name), tagline=coalesce($4,tagline), color=coalesce(nullif($5,''),color), "updatedAt"=now() where id=$1 returning *`,
      [brandId, typeof isActive === "boolean" ? isActive : null, name || "", tagline ?? null, color || ""],
    );
    return NextResponse.json({ brand: result.rows[0] ? normalizeBrand(result.rows[0]) : null });
  });
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdmin(request)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  return withDb(async (db) => {
    await db.query(`delete from public."Brand" where id = $1`, [id]);
    return NextResponse.json({ success: true });
  });
}
