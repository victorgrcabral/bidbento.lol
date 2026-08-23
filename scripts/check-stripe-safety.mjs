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

console.log("Stripe safety OK: no unpaid fallback and webhook is idempotent");
