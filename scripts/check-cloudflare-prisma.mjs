import { readFileSync } from "node:fs";

const schema = readFileSync(new URL("../prisma/schema.prisma", import.meta.url), "utf8");
const client = readFileSync(new URL("../src/lib/prisma.ts", import.meta.url), "utf8");

const expectations = [
  [schema.includes('provider = "prisma-client"'), "Prisma must use the Rust-free prisma-client generator"],
  [schema.includes('runtime  = "cloudflare"'), "Prisma client runtime must target Cloudflare"],
  [client.includes('from "@prisma/adapter-pg"'), "Prisma must use the PostgreSQL driver adapter"],
  [client.includes("withPrisma"), "API handlers need a request-scoped Prisma helper"],
  [!client.includes('from "@prisma/client"'), "The legacy native Prisma client must not be imported"],
];

for (const [passes, message] of expectations) {
  if (!passes) throw new Error(message);
}

console.log("Cloudflare Prisma config OK: Rust-free client + pg adapter");
