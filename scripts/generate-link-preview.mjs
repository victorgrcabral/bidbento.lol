import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const publicOutputDir = path.join(root, "public", "og");
const deliveryOutputDir = path.join(root, "outputs", "brand");
const previewPath = path.join(publicOutputDir, "bidbento-robot-link-preview-v2.jpg");
const highResolutionPath = path.join(deliveryOutputDir, "bidbento-robot-high-resolution.jpg");

await Promise.all([
  mkdir(publicOutputDir, { recursive: true }),
  mkdir(deliveryOutputDir, { recursive: true }),
]);

const mascotPath = path.join(root, "public", "github", "bidbento-mascot.svg");
const mascotSource = await readFile(mascotPath, "utf8");
const highResolutionSvg = mascotSource
  .replace(
    'width="480" height="270" viewBox="0 0 480 270"',
    'width="2400" height="1260" viewBox="100 0 280 270" preserveAspectRatio="xMidYMid meet"',
  )
  .replaceAll("#050508", "#000000");

const highResolution = await sharp(Buffer.from(highResolutionSvg))
  .flatten({ background: "#000000" })
  .jpeg({ quality: 95, chromaSubsampling: "4:4:4", mozjpeg: true })
  .toBuffer();

await writeFile(highResolutionPath, highResolution);
await sharp(highResolution)
  .resize(1200, 630, { fit: "fill", kernel: sharp.kernel.lanczos3 })
  .jpeg({ quality: 92, chromaSubsampling: "4:4:4", mozjpeg: true })
  .toFile(previewPath);

console.log(`Generated ${path.relative(root, previewPath)}`);
console.log(`Generated ${path.relative(root, highResolutionPath)}`);
