import { existsSync, readFileSync } from "node:fs";

const layout = readFileSync(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
const assets = [
  new URL("../public/favicon.svg", import.meta.url),
  new URL("../public/favicon-32.png", import.meta.url),
  new URL("../public/apple-touch-icon.png", import.meta.url),
];

for (const asset of assets) {
  if (!existsSync(asset)) throw new Error(`Missing favicon asset: ${asset.pathname}`);
}

if (!layout.includes("/favicon.svg?v=2")) throw new Error("Versioned SVG favicon link is missing");
if (!layout.includes("/favicon-32.png?v=2")) throw new Error("Versioned shortcut favicon link is missing");
if (!layout.includes("/apple-touch-icon.png?v=2")) throw new Error("Versioned Apple touch icon link is missing");

console.log("Favicon assets OK: SVG, 32px shortcut and Apple touch icon are present and versioned");
