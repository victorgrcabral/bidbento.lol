import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { normalizeDomain, ensureUrlProtocol, getFaviconUrl } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, websiteUrl, logoUrl, tagline, category, color, amount } = body;

    // Validation
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 1.0) {
      return NextResponse.json(
        { error: "O valor mínimo permitido é de $1.00 USD." },
        { status: 400 }
      );
    }

    if (!name || !websiteUrl) {
      return NextResponse.json(
        { error: "Nome e URL do website são obrigatórios." },
        { status: 400 }
      );
    }

    const domain = normalizeDomain(websiteUrl);
    const formattedUrl = ensureUrlProtocol(websiteUrl);
    const finalLogo = logoUrl && logoUrl.trim().length > 0 ? logoUrl.trim() : getFaviconUrl(domain);
    const finalColor = color || "#7c3aed";
    const finalCategory = category && category.trim().length > 0 ? category.trim() : "SaaS";

    // If Stripe is configured
    if (isStripeConfigured) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Space on bidbento.lol - ${name}`,
                description: `Claim your visual space for ${domain}`,
                images: finalLogo ? [finalLogo] : undefined,
              },
              unit_amount: Math.round(parsedAmount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${appUrl}?success=true&domain=${encodeURIComponent(domain)}`,
        cancel_url: `${appUrl}?canceled=true`,
        metadata: {
          name,
          domain,
          websiteUrl: formattedUrl,
          logoUrl: finalLogo,
          tagline: tagline || "",
          category: finalCategory,
          color: finalColor,
          amount: parsedAmount.toString(),
        },
      });

      return NextResponse.json({ url: session.url });
    }

    // Direct / Dev mode
    let brand = await prisma.brand.findUnique({
      where: { domain },
    });

    if (brand) {
      brand = await prisma.brand.update({
        where: { domain },
        data: {
          name: name.trim(),
          websiteUrl: formattedUrl,
          logoUrl: finalLogo,
          tagline: tagline ? tagline.trim() : brand.tagline,
          category: finalCategory,
          color: finalColor,
          totalAmount: { increment: parsedAmount },
          lastPaymentAt: new Date(),
          isActive: true,
        },
      });
    } else {
      brand = await prisma.brand.create({
        data: {
          name: name.trim(),
          domain,
          websiteUrl: formattedUrl,
          logoUrl: finalLogo,
          tagline: tagline ? tagline.trim() : null,
          category: finalCategory,
          color: finalColor,
          totalAmount: parsedAmount,
          lastPaymentAt: new Date(),
          isActive: true,
        },
      });
    }

    await prisma.payment.create({
      data: {
        brandId: brand.id,
        amount: parsedAmount,
        currency: "usd",
        status: "completed",
      },
    });

    return NextResponse.json({
      success: true,
      brand,
      message: "Espaço adquirido com sucesso!",
    });
  } catch (error) {
    console.error("Error creating checkout:", error);
    return NextResponse.json(
      { error: "Erro ao processar compra de espaço" },
      { status: 500 }
    );
  }
}
