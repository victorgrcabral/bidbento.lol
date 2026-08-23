import { readFileSync } from "node:fs";

const stripe = readFileSync(new URL("../src/lib/stripe.ts", import.meta.url), "utf8");
const checkout = readFileSync(new URL("../src/app/api/checkout/route.ts", import.meta.url), "utf8");
const boost = readFileSync(new URL("../src/app/api/boost/route.ts", import.meta.url), "utf8");
const webhook = readFileSync(new URL("../src/app/api/webhook/stripe/route.ts", import.meta.url), "utf8");

if (stripe.includes("sk_test_mock_key")) throw new Error("Stripe mock key fallback remains");
if (checkout.includes("Direct / Dev mode")) throw new Error("Checkout can still grant space without payment");
if (boost.includes("Direct update")) throw new Error("Boost can still be applied without payment");
if (!checkout.includes("isStripeConfigured")) throw new Error("Checkout does not require Stripe configuration");
if (!webhook.includes("stripeSessionId")) throw new Error("Webhook is not idempotent by Stripe session");
if (!stripe.includes("createFetchHttpClient")) throw new Error("Stripe must use the Fetch client on Cloudflare Workers");
if (!webhook.includes("constructEventAsync") || !webhook.includes("createSubtleCryptoProvider")) {
  throw new Error("Stripe webhook must use Web Crypto on Cloudflare Workers");
}
if (!checkout.includes('payment_method_types: ["card"]') || !boost.includes('payment_method_types: ["card"]')) {
  throw new Error("Checkout and boost must accept card payments");
}
if (checkout.includes('currency: "usd"') || boost.includes('currency: "usd"')) {
  throw new Error("Checkout is still charging every customer in USD");
}
if (!checkout.includes("normalizedAmountUsd") || !boost.includes("normalizedAmountUsd")) {
  throw new Error("Checkout must preserve the normalized USD amount for ranking");
}
if (!webhook.includes("normalizedAmountUsd") || !webhook.includes("paidAmount")) {
  throw new Error("Webhook must separate paid currency amount from normalized ranking amount");
}
if (checkout.includes('payment_method_types: ["boleto"]') || boost.includes('payment_method_types: ["boleto"]')) {
  throw new Error("Boleto must not be enabled as a payment method");
}

if (checkout.includes('"pix"') || boost.includes('"pix"') || checkout.includes('"boleto"') || boost.includes('"boleto"')) {
  throw new Error("Pix and boleto must not be enabled");
}

console.log("Stripe safety OK: national cards in BRL, no Pix or boleto, paid fulfillment, normalized ranking, idempotent webhook");
