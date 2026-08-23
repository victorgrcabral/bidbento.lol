import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const imagePath = path.join(root, "public", "og", "bidbento-link-preview-v1.png");
const layoutPath = path.join(root, "src", "app", "layout.tsx");
const [metadata, layout] = await Promise.all([
  sharp(imagePath).metadata(),
  readFile(layoutPath, "utf8"),
]);

if (metadata.width !== 1200 || metadata.height !== 630) {
  throw new Error(`Expected a 1200x630 preview, received ${metadata.width}x${metadata.height}`);
}

for (const required of [
  "bidbento-link-preview-v1.png",
  'card: "summary_large_image"',
  'canonical: "/"',
  "width: 1200",
  "height: 630",
]) {
  if (!layout.includes(required)) {
    throw new Error(`Missing social preview metadata: ${required}`);
  }
}

console.log("Social preview asset and metadata are valid");
