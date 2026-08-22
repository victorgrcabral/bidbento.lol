import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brandId, amount } = body;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 1.0) {
      return NextResponse.json(
        { error: "O valor mínimo de boost é de $1.00 USD." },
        { status: 400 }
      );
    }

    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return NextResponse.json(
        { error: "Marca não encontrada." },
        { status: 404 }
      );
    }

    if (isStripeConfigured) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Boost on bidbento.lol - ${brand.name}`,
                description: `Expand visual dominance for ${brand.domain}`,
                images: brand.logoUrl ? [brand.logoUrl] : undefined,
              },
              unit_amount: Math.round(parsedAmount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${appUrl}?success=true&boost=true&domain=${encodeURIComponent(brand.domain)}`,
        cancel_url: `${appUrl}?canceled=true`,
        metadata: {
          brandId: brand.id,
          domain: brand.domain,
          name: brand.name,
          websiteUrl: brand.websiteUrl,
          amount: parsedAmount.toString(),
          isBoost: "true",
        },
      });

      return NextResponse.json({ url: session.url });
    }

    // Direct update
    const updatedBrand = await prisma.brand.update({
      where: { id: brandId },
      data: {
        totalAmount: { increment: parsedAmount },
        lastPaymentAt: new Date(),
        isActive: true,
      },
    });

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
      brand: updatedBrand,
      message: "Boost aplicado com sucesso!",
    });
  } catch (error) {
    console.error("Error applying boost:", error);
    return NextResponse.json(
      { error: "Erro ao processar boost de marca" },
      { status: 500 }
    );
  }
}
