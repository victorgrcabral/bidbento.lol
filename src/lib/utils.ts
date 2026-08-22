import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes website URL to base domain string (e.g. https://www.supabase.com/docs -> supabase.com)
 */
export function normalizeDomain(rawUrl: string): string {
  try {
    let formatted = rawUrl.trim();
    if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
      formatted = "https://" + formatted;
    }
    const url = new URL(formatted);
    let host = url.hostname.toLowerCase();
    if (host.startsWith("www.")) {
      host = host.slice(4);
    }
    return host;
  } catch {
    return rawUrl.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].trim();
  }
}

/**
 * Ensures URL starts with https:// or http://
 */
export function ensureUrlProtocol(rawUrl: string): string {
  let formatted = rawUrl.trim();
  if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
    formatted = "https://" + formatted;
  }
  return formatted;
}

/**
 * Formats relative time (e.g. 'há 2 minutos', 'há 3 horas', 'há 5 dias')
 */
export function formatTimeAgo(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "recentemente";

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "agora mesmo";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `há ${diffInMinutes} min`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `há ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `há ${diffInDays} ${diffInDays === 1 ? "dia" : "dias"}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `há ${diffInMonths} ${diffInMonths === 1 ? "mês" : "meses"}`;
}

/**
 * Returns Google Favicon service URL for a given domain as high quality fallback
 */
export function getFaviconUrl(domainOrUrl: string): string {
  const domain = normalizeDomain(domainOrUrl);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

/**
 * Calculates optimal text color (#ffffff or #09090b) based on background hex
 */
export function getContrastTextColor(hexColor?: string | null): string {
  if (!hexColor || !hexColor.startsWith("#")) return "#ffffff";
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140 ? "#09090b" : "#ffffff";
}
