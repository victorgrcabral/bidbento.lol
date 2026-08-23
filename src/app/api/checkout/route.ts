import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import {
  fromMinorUnits,
  isCurrencyCode,
  normalizeAmountToUSD,
  toMinorUnits,
} from "@/lib/currency";
import { normalizeDomain, ensureUrlProtocol, getFaviconUrl } from "@/lib/utils";

export async function POST(request: NextRequest) {
  if (!isStripeConfigured) {
    return NextResponse.json(
      { error: "Checkout temporariamente indisponível. A Stripe ainda não foi configurada." },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const { name, websiteUrl, logoUrl, tagline, category, color, amount, sessionId } = body;
    const currency = isCurrencyCode(body.currency) ? body.currency : "USD";
    const parsedAmount = Number(amount);
    const amountMinorUnits = toMinorUnits(parsedAmount);
    const chargedAmount = fromMinorUnits(amountMinorUnits);
    const normalizedAmountUsd = normalizeAmountToUSD(chargedAmount, currency);

    if (!Number.isFinite(parsedAmount) || !Number.isSafeInteger(amountMinorUnits) || !Number.isFinite(normalizedAmountUsd) || normalizedAmountUsd < 1) {
      return NextResponse.json(
        { error: "O valor mínimo permitido equivale a $1.00 USD." },
        { status: 400 },
      );
    }

    if (!name?.trim() || !websiteUrl?.trim()) {
      return NextResponse.json(
        { error: "Nome e URL do website são obrigatórios." },
        { status: 400 },
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bidbento.lol";
    const domain = normalizeDomain(websiteUrl);
    const formattedUrl = ensureUrlProtocol(websiteUrl);
    const finalLogo = logoUrl?.trim() || getFaviconUrl(domain);
    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `Espaço no bidbento.lol para ${name.trim()}`,
              description: `Presença visual e tráfego direto para ${domain}`,
              images: finalLogo ? [finalLogo] : undefined,
            },
            unit_amount: amountMinorUnits,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}?success=true&session_id={CHECKOUT_SESSION_ID}&domain=${encodeURIComponent(domain)}`,
      cancel_url: `${appUrl}?canceled=true`,
      metadata: {
        name: name.trim(),
        domain,
        websiteUrl: formattedUrl,
        logoUrl: finalLogo || "",
        tagline: tagline?.trim() || "",
        category: category?.trim() || "SaaS",
        color: color || "#7c3aed",
        normalizedAmountUsd: normalizedAmountUsd.toFixed(6),
        paymentCurrency: currency.toLowerCase(),
        sessionId: typeof sessionId === "string" ? sessionId.slice(0, 80) : "",
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Error creating Stripe checkout:", error);
    return NextResponse.json(
      { error: "Não foi possível iniciar o checkout. Tente novamente." },
      { status: 500 },
    );
  }
}
