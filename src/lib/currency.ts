export type CurrencyCode = "USD" | "BRL" | "EUR";

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
  BRL: {
    code: "BRL",
    symbol: "R$",
    rateAgainstUSD: 5.4, // Standard conversion rate estimate
    label: "BRL (R$)",
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    rateAgainstUSD: 0.92,
    label: "EUR (€)",
  },
};

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
