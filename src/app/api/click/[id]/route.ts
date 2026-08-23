import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { ensureUrlProtocol } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withDb(async (pool) => {
    const { id } = await params;
    if (!id) return NextResponse.redirect(new URL("/", request.url));
    const result = await pool.query<{ websiteUrl: string; domain: string }>(
      `select "websiteUrl", domain from public."Brand" where id = $1 and "isActive" = true limit 1`, [id],
    );
    const brand = result.rows[0];
    if (!brand) return NextResponse.redirect(new URL("/", request.url));

    const db = await pool.connect();
    try {
      await db.query("begin");
      await db.query(`update public."Brand" set "clicksCount" = "clicksCount" + 1, "updatedAt" = now() where id = $1`, [id]);
      await db.query(
        `insert into public."ClickEvent" (id, "brandId", referrer, "userAgent", "createdAt") values ($1,$2,$3,$4,now())`,
        [randomUUID(), id, request.headers.get("referer"), request.headers.get("user-agent")],
      );
      await db.query("commit");
    } catch (error) {
      await db.query("rollback");
      console.error("Failed to update click counter:", error);
    } finally {
      db.release();
    }

    const response = NextResponse.redirect(ensureUrlProtocol(brand.websiteUrl || brand.domain), { status: 307 });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  });
}
