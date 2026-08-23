import { existsSync, readFileSync } from "node:fs";

const bottomBar = readFileSync(new URL("../src/components/BottomConversionBar.tsx", import.meta.url), "utf8");
const emptyState = readFileSync(new URL("../src/components/EmptyCategoryPlaceholder.tsx", import.meta.url), "utf8");
const homePage = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const mascotUrl = new URL("../public/bidbento-mascot-transparent.svg", import.meta.url);
const mascot = readFileSync(mascotUrl, "utf8");

if (!bottomBar.includes('grid grid-cols-3')) throw new Error("Mobile page navigation is not a three-column grid");
if (!bottomBar.includes("min-h-11")) throw new Error("Mobile navigation targets are smaller than 44px");
if (!bottomBar.includes('min-h-12 w-full')) throw new Error("Mobile CTA is not full-width with a 48px touch target");
if (!bottomBar.includes("safe-area-inset-bottom")) throw new Error("Bottom bar does not respect the mobile safe area");
if (bottomBar.includes('<span className="hidden sm:inline">{t.stats}</span>')) throw new Error("Stats label is still hidden on mobile");
if (bottomBar.includes('<span className="hidden sm:inline">{t.rules}</span>')) throw new Error("Rules label is still hidden on mobile");
if (bottomBar.includes('<span className="hidden sm:inline">{t.ranking}</span>')) throw new Error("Ranking label is still hidden on mobile");
if (!emptyState.includes('/bidbento-mascot-transparent.svg')) throw new Error("Empty state does not use the supplied transparent mascot");
if (!emptyState.includes('w-56') || !emptyState.includes('max-height:700px')) throw new Error("Mascot does not scale down for short mobile viewports");
if (!homePage.includes('pb-40') || !homePage.includes('md:pb-20')) throw new Error("Main content does not reserve the full mobile bottom-bar height");
if (!existsSync(mascotUrl)) throw new Error("Transparent mascot asset is missing");
if (!mascot.trimStart().startsWith("<svg")) throw new Error("Mascot asset is not a valid SVG source");
if (mascot.includes('<rect width="480" height="270"')) throw new Error("Mascot background rectangle was not removed");

console.log("Mobile UX OK: labeled pages, safe-area spacing, large touch targets, full-width CTA, supplied mascot");
