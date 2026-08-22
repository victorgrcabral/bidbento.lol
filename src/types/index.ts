export interface Brand {
  id: string;
  name: string;
  domain: string;
  websiteUrl: string;
  logoUrl?: string | null;
  tagline?: string | null;
  category?: string;
  color?: string | null;
  totalAmount: number;
  clicksCount: number;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  lastPaymentAt: string | Date;
}

export interface TreemapRect {
  x: number; // percentage (0 to 100) or pixel
  y: number; // percentage (0 to 100) or pixel
  w: number; // width percentage (0 to 100)
  h: number; // height percentage (0 to 100)
}

export interface BrandSpace extends Brand {
  percentage: number; // 0 to 100
  rect?: TreemapRect;
  rank: number;
  lastPaymentFormatted?: string;
  totalAmountFormatted?: string;
}

export interface SpacesResponse {
  brands: BrandSpace[];
  totalAmount: number;
  totalBrands: number;
  totalClicks: number;
  page: number;
  totalPages: number;
  limit: number;
  category: string;
  availableCategories: string[];
  leader: BrandSpace | null;
  lastBid: {
    brandName: string;
    amount: number;
    timeAgo: string;
  } | null;
}

export interface CreateSpacePayload {
  name: string;
  websiteUrl: string;
  logoUrl?: string;
  tagline?: string;
  category?: string;
  color?: string;
  amount: number;
}

export interface BoostPayload {
  brandId?: string;
  domain?: string;
  amount: number;
}
