import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { normalizeDomain, ensureUrlProtocol } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Webhook secret ou assinatura ausente" },
      { status: 400 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const metadata = session.metadata;

    if (metadata) {
      const amount = parseFloat(metadata.amount || "0");
      const domain = metadata.domain ? normalizeDomain(metadata.domain) : "";
      const name = metadata.name;
      const websiteUrl = ensureUrlProtocol(metadata.websiteUrl);
      const logoUrl = metadata.logoUrl || null;
      const tagline = metadata.tagline || null;
      const color = metadata.color || "#7c3aed";

      if (domain && amount > 0) {
        let brand = await prisma.brand.findUnique({
          where: { domain },
        });

        if (brand) {
          brand = await prisma.brand.update({
            where: { domain },
            data: {
              totalAmount: { increment: amount },
              lastPaymentAt: new Date(),
              name: name || brand.name,
              websiteUrl: websiteUrl || brand.websiteUrl,
              logoUrl: logoUrl || brand.logoUrl,
              tagline: tagline || brand.tagline,
              color: color || brand.color,
              isActive: true,
            },
          });
        } else {
          brand = await prisma.brand.create({
            data: {
              name: name || domain,
              domain,
              websiteUrl,
              logoUrl,
              tagline,
              color,
              totalAmount: amount,
              lastPaymentAt: new Date(),
              isActive: true,
            },
          });
        }

        await prisma.payment.create({
          data: {
            brandId: brand.id,
            amount,
            currency: session.currency || "usd",
            stripeSessionId: session.id,
            status: "completed",
          },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
