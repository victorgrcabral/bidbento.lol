import { readFileSync } from "node:fs";

const schema = readFileSync(new URL("../prisma/schema.prisma", import.meta.url), "utf8");
const route = readFileSync(new URL("../src/app/api/stats/route.ts", import.meta.url), "utf8");
const tracker = readFileSync(new URL("../src/app/api/track/route.ts", import.meta.url), "utf8");
const page = readFileSync(new URL("../src/app/stats/page.tsx", import.meta.url), "utf8");
const pill = readFileSync(new URL("../src/components/LiveStatsPill.tsx", import.meta.url), "utf8");

const combined = `${route}\n${page}\n${pill}`;
const banned = ["1181912", "75480", "Math.random()", "16.4%", "57.4k", "677"];

for (const value of banned) {
  if (combined.includes(value)) throw new Error(`Fake stat remains in source: ${value}`);
}

if (!schema.includes("model SiteVisit")) throw new Error("SiteVisit model is missing");
if (!route.includes('"SiteVisit"') || !tracker.includes('"SiteVisit"')) {
  throw new Error("Stats tracking is not persisted and queried");
}
if (!route.includes("status = 'completed'")) throw new Error("Stats API does not use confirmed payments");

console.log("Real stats config OK: persisted visits, clicks, and confirmed payments");
