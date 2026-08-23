import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outputDir = path.join(root, "public", "og");
const outputPath = path.join(outputDir, "bidbento-link-preview-v1.png");

await mkdir(outputDir, { recursive: true });

const logo = await sharp(path.join(root, "public", "logo.svg"))
  .resize({ width: 430 })
  .png()
  .toBuffer();
const mascot = await sharp(path.join(root, "public", "github", "bidbento-mascot.svg"))
  .resize({ width: 456 })
  .png()
  .toBuffer();

const logoUri = `data:image/png;base64,${logo.toString("base64")}`;
const mascotUri = `data:image/png;base64,${mascot.toString("base64")}`;

const artwork = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#050508"/>
    <rect x="24" y="24" width="1152" height="582" rx="24" fill="none" stroke="#27272a" stroke-width="2"/>

    <circle cx="1008" cy="136" r="104" fill="#8b5cf6" fill-opacity=".08"/>
    <circle cx="888" cy="458" r="172" fill="#10b981" fill-opacity=".06"/>

    <rect x="748" y="72" width="372" height="138" rx="24" fill="#8b5cf6" fill-opacity=".82"/>
    <rect x="748" y="222" width="216" height="112" rx="20" fill="#10b981" fill-opacity=".72"/>
    <rect x="976" y="222" width="144" height="112" rx="20" fill="#3b82f6" fill-opacity=".72"/>

    <image href="${logoUri}" x="72" y="56" width="430" height="86"/>
    <text x="74" y="188" fill="#34d399" font-family="Consolas, monospace" font-size="18" letter-spacing="2">SCREEN SHARE = BID / TOTAL BIDS</text>

    <text x="72" y="274" fill="#ffffff" font-family="Geist, Segoe UI, sans-serif" font-size="64" font-weight="700">Proportional</text>
    <text x="72" y="344" fill="#ffffff" font-family="Geist, Segoe UI, sans-serif" font-size="64" font-weight="700">screen visibility.</text>

    <text x="76" y="402" fill="#a1a1aa" font-family="Geist, Segoe UI, sans-serif" font-size="24">Your bid does not need to be the biggest</text>
    <text x="76" y="438" fill="#a1a1aa" font-family="Geist, Segoe UI, sans-serif" font-size="24">to claim a block worth noticing.</text>

    <rect x="72" y="492" width="300" height="64" rx="16" fill="#10b981"/>
    <text x="222" y="532" text-anchor="middle" fill="#04110d" font-family="Geist, Segoe UI, sans-serif" font-size="22" font-weight="700">Claim your Bento from $1</text>

    <image href="${mascotUri}" x="708" y="320" width="456" height="257"/>
  </svg>`;

await sharp(Buffer.from(artwork))
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toFile(outputPath);

console.log(`Generated ${path.relative(root, outputPath)}`);
