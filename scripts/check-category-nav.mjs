import { readFileSync } from "node:fs";

const filter = readFileSync(new URL("../src/components/CategoryFilter.tsx", import.meta.url), "utf8");
const categories = readFileSync(new URL("../src/lib/categories.ts", import.meta.url), "utf8");
const home = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");

if (filter.includes("overflow-x-auto")) throw new Error("Category navigation still scrolls horizontally");
if (filter.includes("flex-wrap")) throw new Error("Desktop categories must stay on one line");
if (!filter.includes("<select")) throw new Error("Mobile category selector is missing");
if (!categories.includes('key: "Indústria"')) throw new Error("Industry category is missing");
if (home.includes("<LiveStatsPill")) throw new Error("Stats pill still competes with category navigation");
if (!filter.includes("categoryTotals")) throw new Error("Categories are not ordered by confirmed investment");
if (!filter.includes("Ver mais categorias")) throw new Error("Overflow category dropdown is missing");

console.log("Category navigation OK: one line, investment order, and overflow dropdown");
