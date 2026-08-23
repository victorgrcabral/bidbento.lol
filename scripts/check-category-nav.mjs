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
if (!filter.includes("min-h-11") || !filter.includes("px-4 py-2")) throw new Error("Category controls do not meet the 44px touch target with balanced padding");
if (!filter.includes("min-h-14")) throw new Error("Desktop category container does not leave room around 44px items");
if (home.includes("hidden lg:block")) throw new Error("Logo is still hidden on mobile");

console.log("Category navigation OK: mobile logo space, 44px controls, balanced padding, one-line desktop overflow");
