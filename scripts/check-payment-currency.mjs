import assert from "node:assert/strict";
import {
  fromMinorUnits,
  isCurrencyCode,
  normalizeAmountToUSD,
  toMinorUnits,
} from "../src/lib/currency.ts";

assert.equal(isCurrencyCode("USD"), true);
assert.equal(isCurrencyCode("EUR"), true);
assert.equal(isCurrencyCode("BRL"), true);
assert.equal(isCurrencyCode("brl"), false);
assert.equal(isCurrencyCode("BOLETO"), false);

assert.equal(normalizeAmountToUSD(10, "USD"), 10);
assert.equal(normalizeAmountToUSD(0.92, "EUR"), 1);
assert.equal(normalizeAmountToUSD(54, "BRL"), 10);
assert.equal(toMinorUnits(25.999), 2600);
assert.equal(fromMinorUnits(2600), 26);
assert.equal(normalizeAmountToUSD(fromMinorUnits(toMinorUnits(5.404)), "BRL"), 1);

console.log("Payment currency OK: BRL is charged in reais and normalized safely for ranking");
