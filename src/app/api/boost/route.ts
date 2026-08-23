import { NextRequest, NextResponse } from "next/server";
import { BrandRecord, normalizeBrand, withDb } from "@/lib/db";
import {
  fromMinorUnits,
  isCurrencyCode,
  normalizeAmountToUSD,
  toMinorUnits,
} from "@/lib/currency";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  if (!isStripeConfigured) {
    return NextResponse.json({ error: "Boost temporariamente indisponível. A Stripe ainda não foi configurada." }, { status: 503 });
  }

  return withDb(async (db) => {
    try {
      const { brandId, amount, currency: requestedCurrency, sessionId } = await request.json();
      const currency = isCurrencyCode(requestedCurrency) ? requestedCurrency : "USD";
      const parsedAmount = Number(amount);
      const amountMinorUnits = toMinorUnits(parsedAmount);
      const chargedAmount = fromMinorUnits(amountMinorUnits);
      const normalizedAmountUsd = normalizeAmountToUSD(chargedAmount, currency);
      if (!Number.isFinite(parsedAmount) || !Number.isSafeInteger(amountMinorUnits) || !Number.isFinite(normalizedAmountUsd) || normalizedAmountUsd < 1) {
        return NextResponse.json({ error: "O valor mínimo de boost equivale a $1.00 USD." }, { status: 400 });
      }

      const result = await db.query<BrandRecord>(`select * from public."Brand" where id = $1 limit 1`, [brandId]);
      if (!result.rows[0]) return NextResponse.json({ error: "Marca não encontrada." }, { status: 404 });
      const brand = normalizeBrand(result.rows[0]);
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bidbento.lol";
      const checkoutSession = await getStripe().checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { name: `Boost no bidbento.lol para ${brand.name}`, description: `Ampliação do espaço visual de ${brand.domain}`, images: brand.logoUrl ? [brand.logoUrl] : undefined },
            unit_amount: amountMinorUnits,
          },
          quantity: 1,
        }],
        mode: "payment",
        success_url: `${appUrl}?success=true&boost=true&session_id={CHECKOUT_SESSION_ID}&domain=${encodeURIComponent(brand.domain)}`,
        cancel_url: `${appUrl}?canceled=true`,
        metadata: {
          brandId: brand.id,
          domain: brand.domain,
          name: brand.name,
          websiteUrl: brand.websiteUrl,
          isBoost: "true",
          normalizedAmountUsd: normalizedAmountUsd.toFixed(6),
          paymentCurrency: currency.toLowerCase(),
          sessionId: typeof sessionId === "string" ? sessionId.slice(0, 80) : "",
        },
      });
      return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
      console.error("Error creating Stripe boost checkout:", error);
      return NextResponse.json({ error: "Não foi possível iniciar o boost. Tente novamente." }, { status: 500 });
    }
  });
}
