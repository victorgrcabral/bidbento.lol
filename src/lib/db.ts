import { Pool } from "pg";

export type DbPool = Pool;

export type BrandRecord = {
  id: string;
  name: string;
  domain: string;
  websiteUrl: string;
  logoUrl: string | null;
  tagline: string | null;
  category: string;
  color: string | null;
  totalAmount: number | string;
  clicksCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastPaymentAt: Date;
};

export function normalizeBrand(row: BrandRecord) {
  return {
    ...row,
    totalAmount: Number(row.totalAmount),
    clicksCount: Number(row.clicksCount),
  };
}

export async function withDb<T>(operation: (pool: DbPool) => Promise<T>): Promise<T> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured");

  const pool = new Pool({
    connectionString,
    max: 1,
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 10_000,
    allowExitOnIdle: true,
  });

  try {
    return await operation(pool);
  } finally {
    await pool.end();
  }
}
