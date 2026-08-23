import { existsSync, readFileSync } from "node:fs";

const checkoutPage = readFileSync(new URL("../src/app/checkout/page.tsx", import.meta.url), "utf8");
const purchaseModal = readFileSync(new URL("../src/components/PurchaseModal.tsx", import.meta.url), "utf8");
const checkoutRoute = readFileSync(new URL("../src/app/api/checkout/route.ts", import.meta.url), "utf8");
const translations = readFileSync(new URL("../src/lib/i18n.ts", import.meta.url), "utf8");
const uploadRoute = new URL("../src/app/api/upload/route.ts", import.meta.url);

for (const [name, source] of [["checkout page", checkoutPage], ["purchase modal", purchaseModal]]) {
  if (source.includes('type="file"')) throw new Error(`${name} still exposes a file input`);
  if (source.includes("FormData") || source.includes("/api/upload")) throw new Error(`${name} still uploads files`);
  if (!source.includes('type="url"')) throw new Error(`${name} does not expose an image URL field`);
  if (!source.includes("getFaviconUrl")) throw new Error(`${name} lost the website favicon fallback`);
}

if (existsSync(uploadRoute)) throw new Error("Upload API route still exists");
if (!checkoutRoute.includes("isValidHttpUrl")) throw new Error("Checkout API does not validate external image URLs");
if (!checkoutRoute.includes("customLogoUrl || getFaviconUrl(domain)")) throw new Error("Checkout API lost the favicon fallback");
if (/chooseFile|uploadingImage|File Upload|Subir archivo|Upload ou URL/.test(translations)) {
  throw new Error("Upload copy still exists in translations");
}

console.log("Image URL OK: no file upload, HTTP(S) validation, optional external URL, favicon fallback");
