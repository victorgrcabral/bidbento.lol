import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { withDb } from "@/lib/db";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { normalizeDomain, ensureUrlProtocol } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!isStripeConfigured || !signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook Stripe não configurado." }, { status: 503 });
  }

  let event: Stripe.Event;
  try {
    event = await getStripe().webhooks.constructEventAsync(
      await request.text(),
      signature,
      webhookSecret,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch {
    return NextResponse.json({ error: "Assinatura Stripe inválida." }, { status: 400 });
  }

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return NextResponse.json({ received: true });
  }
  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid" || !session.amount_total) return NextResponse.json({ received: true });

  return withDb(async (pool) => {
    const db = await pool.connect();
    try {
      await db.query("begin");
      const processed = await db.query(
        `select id from public."Payment" where "stripeSessionId" = $1 limit 1`,
        [session.id],
      );
      if (processed.rowCount) {
        await db.query("commit");
        return NextResponse.json({ received: true });
      }

      const metadata = session.metadata || {};
      const domain = metadata.domain ? normalizeDomain(metadata.domain) : "";
      if (!domain) throw new Error("Stripe session is missing a valid domain");
      const paidAmount = session.amount_total! / 100;
      const normalizedAmountUsd = Number.parseFloat(metadata.normalizedAmountUsd || "");
      const amountUsd = Number.isFinite(normalizedAmountUsd) && normalizedAmountUsd > 0
        ? normalizedAmountUsd
        : session.currency === "usd"
          ? paidAmount
          : Number.NaN;
      if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
        throw new Error("Stripe session is missing a valid normalized USD amount");
      }
      const brandResult = metadata.brandId
        ? await db.query<{ id: string }>(`select id from public."Brand" where id = $1 limit 1`, [metadata.brandId])
        : await db.query<{ id: string }>(`select id from public."Brand" where domain = $1 limit 1`, [domain]);
      let brandId = brandResult.rows[0]?.id;

      if (brandId) {
        await db.query(
          `update public."Brand" set
            "totalAmount" = "totalAmount" + $2,
            "lastPaymentAt" = now(), "updatedAt" = now(),
            name = coalesce(nullif($3, ''), name),
            "websiteUrl" = coalesce(nullif($4, ''), "websiteUrl"),
            "logoUrl" = coalesce(nullif($5, ''), "logoUrl"),
            tagline = coalesce(nullif($6, ''), tagline),
            category = coalesce(nullif($7, ''), category),
            color = coalesce(nullif($8, ''), color),
            "isActive" = true
          where id = $1`,
          [brandId, amountUsd, metadata.name || "", metadata.websiteUrl ? ensureUrlProtocol(metadata.websiteUrl) : "", metadata.logoUrl || "", metadata.tagline || "", metadata.category || "", metadata.color || ""],
        );
      } else {
        brandId = randomUUID();
        await db.query(
          `insert into public."Brand"
            (id, name, domain, "websiteUrl", "logoUrl", tagline, category, color, "totalAmount", "clicksCount", "isActive", "createdAt", "updatedAt", "lastPaymentAt")
          values ($1,$2,$3,$4,$5,$6,$7,$8,$9,0,true,now(),now(),now())`,
          [brandId, metadata.name || domain, domain, ensureUrlProtocol(metadata.websiteUrl || domain), metadata.logoUrl || null, metadata.tagline || null, metadata.category || "SaaS", metadata.color || "#7c3aed", amountUsd],
        );
      }

      await db.query(
        `insert into public."Payment" (id, "brandId", amount, currency, "stripeSessionId", "sessionId", status, "createdAt")
         values ($1,$2,$3,$4,$5,$6,'completed',now())`,
        [randomUUID(), brandId, paidAmount, session.currency || "usd", session.id, metadata.sessionId || null],
      );
      await db.query("commit");
      return NextResponse.json({ received: true });
    } catch (error) {
      await db.query("rollback");
      console.error("Stripe webhook fulfillment failed:", error);
      throw error;
    } finally {
      db.release();
    }
  });
}
