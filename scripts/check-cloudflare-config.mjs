import { readFileSync } from "node:fs";

const config = readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8");

const workerName = config.match(/"name"\s*:\s*"([^"]+)"/)?.[1];
const selfReference = config.match(
  /"binding"\s*:\s*"WORKER_SELF_REFERENCE"[\s\S]*?"service"\s*:\s*"([^"]+)"/,
)?.[1];

if (!workerName || !selfReference) {
  throw new Error("Cloudflare Worker name or self-reference binding is missing");
}

if (workerName !== "bidbento-lol") {
  throw new Error(`Expected Worker name bidbento-lol, received ${workerName}`);
}

if (selfReference !== workerName) {
  throw new Error(
    `WORKER_SELF_REFERENCE must target ${workerName}, received ${selfReference}`,
  );
}

if (!config.includes('"pattern": "bidbento.lol/*"')) {
  throw new Error("Cloudflare route bidbento.lol/* is missing");
}

if (!config.match(/"workers_dev"\s*:\s*true/)) {
  throw new Error("workers.dev preview URL must remain enabled");
}

console.log(`Cloudflare config OK: ${workerName} -> ${selfReference}`);
