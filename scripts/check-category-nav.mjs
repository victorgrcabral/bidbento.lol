import { readFileSync } from "node:fs";

const filter = readFileSync(new URL("../src/components/CategoryFilter.tsx", import.meta.url), "utf8");
const categories = readFileSync(new URL("../src/lib/categories.ts", import.meta.url), "utf8");
const home = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");

if (filter.includes("overflow-x-auto")) throw new Error("Category navigation still scrolls horizontally");
if (!filter.includes("flex-wrap")) throw new Error("Desktop categories must wrap");
if (!filter.includes("<select")) throw new Error("Mobile category selector is missing");
if (!categories.includes('key: "Indústria"')) throw new Error("Industry category is missing");
if (home.includes("<LiveStatsPill")) throw new Error("Stats pill still competes with category navigation");

console.log("Category navigation OK: no horizontal scroll and Industry is available");
