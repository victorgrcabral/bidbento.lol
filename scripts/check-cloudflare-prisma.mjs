import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const db = readFileSync(new URL("../src/lib/db.ts", import.meta.url), "utf8");
const apiRoot = fileURLToPath(new URL("../src/app/api", import.meta.url));

function collectFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(path) : path.endsWith(".ts") ? [path] : [];
  });
}

const apiSource = collectFiles(apiRoot).map((file) => readFileSync(file, "utf8")).join("\n");

if (!db.includes('from "pg"')) throw new Error("Cloudflare database layer must use node-postgres");
if (!db.includes("withDb")) throw new Error("Request-scoped database helper is missing");
if (apiSource.includes("@/lib/prisma")) throw new Error("A production API still imports Prisma WASM");
if (apiSource.includes("@/generated/prisma")) throw new Error("A production API still imports the generated Prisma client");

console.log("Cloudflare database config OK: APIs use pg without Prisma WASM");
