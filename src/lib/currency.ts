export type CurrencyCode = "USD" | "EUR" | "BRL";

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  rateAgainstUSD: number; // 1 USD = X Currency
  label: string;
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyRate> = {
  USD: {
    code: "USD",
    symbol: "$",
    rateAgainstUSD: 1.0,
    label: "USD ($)",
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    rateAgainstUSD: 0.92,
    label: "EUR (€)",
  },
  BRL: {
    code: "BRL",
    symbol: "R$",
    rateAgainstUSD: 5.4, // Standard conversion rate estimate
    label: "BRL (R$)",
  },
};

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return value === "USD" || value === "EUR" || value === "BRL";
}

export function normalizeAmountToUSD(amount: number, currency: CurrencyCode): number {
  return amount / SUPPORTED_CURRENCIES[currency].rateAgainstUSD;
}

export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

export function fromMinorUnits(amount: number): number {
  return amount / 100;
}

export function formatCurrency(
  amountInUSD: number,
  currency: CurrencyCode = "USD"
): string {
  const info = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;
  const converted = amountInUSD * info.rateAgainstUSD;

  if (currency === "BRL") {
    return `R$ ${converted.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  if (currency === "EUR") {
    return `€${converted.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `$${converted.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
