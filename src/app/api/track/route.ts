import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { withDb } from "@/lib/db";

const SESSION_ID_PATTERN = /^[a-f0-9-]{16,80}$/i;

export async function POST(request: NextRequest) {
  return withDb(async (db) => {
    const { sessionId, path, source } = await request.json();
    if (typeof sessionId !== "string" || !SESSION_ID_PATTERN.test(sessionId)) {
      return NextResponse.json({ error: "Sessão inválida." }, { status: 400 });
    }
    if (typeof path !== "string" || !path.startsWith("/") || path.length > 200) {
      return NextResponse.json({ error: "Página inválida." }, { status: 400 });
    }

    await db.query(
      `insert into public."SiteVisit" (id, "sessionId", path, source) values ($1, $2, $3, $4)`,
      [randomUUID(), sessionId, path, typeof source === "string" && source.trim() ? source.trim().slice(0, 80) : "Direct"],
    );
    return new NextResponse(null, { status: 204 });
  });
}
