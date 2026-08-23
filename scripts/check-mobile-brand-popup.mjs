import { readFileSync } from "node:fs";

const card = readFileSync(new URL("../src/components/BrandHoverCard.tsx", import.meta.url), "utf8");
const treemap = readFileSync(new URL("../src/components/ScreenTreemap.tsx", import.meta.url), "utf8");

if (card.includes('fixed top-1/2 left-1/2')) throw new Error("Mobile card still centers itself with a transform that Framer Motion overrides");
if (!card.includes('relative z-[90] w-full max-w-sm')) throw new Error("Mobile card does not defer centering to the overlay");
if (!card.includes('max-h-[calc(100dvh-2rem)]')) throw new Error("Mobile card is not constrained to the dynamic viewport height");
if (!card.includes('role={isMobileModal ? "dialog"')) throw new Error("Mobile card is missing dialog semantics");
if (!card.includes('min-h-11 min-w-11')) throw new Error("Mobile close target is smaller than 44px");
if (!treemap.includes('items-center justify-center')) throw new Error("Mobile overlay does not center its card");
if (!treemap.includes('safe-area-inset-bottom')) throw new Error("Mobile overlay does not respect the bottom safe area");
if (!treemap.includes('event.key === "Escape"')) throw new Error("Mobile dialog cannot be dismissed with Escape");

console.log("Brand popup OK: overlay-centered, dynamic viewport bound, safe-area aware, accessible close behavior");
