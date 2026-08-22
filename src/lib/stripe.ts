import Stripe from "stripe";

const stripeApiKey = process.env.STRIPE_SECRET_KEY || "sk_test_mock_key";

export const stripe = new Stripe(stripeApiKey, {
  apiVersion: "2024-11-20.acacia" as any,
  typescript: true,
});

export const isStripeConfigured = Boolean(
  process.env.STRIPE_SECRET_KEY &&
    !process.env.STRIPE_SECRET_KEY.includes("mock") &&
    process.env.STRIPE_SECRET_KEY.startsWith("sk_")
);
