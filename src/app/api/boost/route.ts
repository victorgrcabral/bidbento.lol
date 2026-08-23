import { NextRequest, NextResponse } from "next/server";
import { BrandRecord, normalizeBrand, withDb } from "@/lib/db";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  if (!isStripeConfigured) {
    return NextResponse.json({ error: "Boost temporariamente indisponível. A Stripe ainda não foi configurada." }, { status: 503 });
  }

  return withDb(async (db) => {
    try {
      const { brandId, amount, sessionId } = await request.json();
      const parsedAmount = Number.parseFloat(amount);
      if (!Number.isFinite(parsedAmount) || parsedAmount < 1) {
        return NextResponse.json({ error: "O valor mínimo de boost é de $1.00 USD." }, { status: 400 });
      }

      const result = await db.query<BrandRecord>(`select * from public."Brand" where id = $1 limit 1`, [brandId]);
      if (!result.rows[0]) return NextResponse.json({ error: "Marca não encontrada." }, { status: 404 });
      const brand = normalizeBrand(result.rows[0]);
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bidbento.lol";
      const checkoutSession = await getStripe().checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: { name: `Boost no bidbento.lol para ${brand.name}`, description: `Ampliação do espaço visual de ${brand.domain}`, images: brand.logoUrl ? [brand.logoUrl] : undefined },
            unit_amount: Math.round(parsedAmount * 100),
          },
          quantity: 1,
        }],
        mode: "payment",
        success_url: `${appUrl}?success=true&boost=true&session_id={CHECKOUT_SESSION_ID}&domain=${encodeURIComponent(brand.domain)}`,
        cancel_url: `${appUrl}?canceled=true`,
        metadata: { brandId: brand.id, domain: brand.domain, name: brand.name, websiteUrl: brand.websiteUrl, isBoost: "true", sessionId: typeof sessionId === "string" ? sessionId.slice(0, 80) : "" },
      });
      return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
      console.error("Error creating Stripe boost checkout:", error);
      return NextResponse.json({ error: "Não foi possível iniciar o boost. Tente novamente." }, { status: 500 });
    }
  });
}
