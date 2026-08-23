import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export const isStripeConfigured = Boolean(
  process.env.STRIPE_SECRET_KEY?.startsWith("sk_")
);

export function getStripe() {
  const apiKey = process.env.STRIPE_SECRET_KEY;

  if (!apiKey?.startsWith("sk_")) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  stripeClient ??= new Stripe(apiKey, {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
    httpClient: Stripe.createFetchHttpClient(),
    maxNetworkRetries: 0,
    timeout: 10_000,
  });

  return stripeClient;
}
