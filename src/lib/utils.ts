import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Language } from "./i18n";

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
 * Formats relative time (English, Spanish, Portuguese)
 */
export function formatTimeAgo(
  dateInput: string | Date | null | undefined,
  lang: Language = "en"
): string {
  if (!dateInput) {
    if (lang === "pt") return "recentemente";
    if (lang === "es") return "recientemente";
    return "recently";
  }

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    if (lang === "pt") return "agora mesmo";
    if (lang === "es") return "ahora mismo";
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    if (lang === "pt") return `há ${diffInMinutes} min`;
    if (lang === "es") return `hace ${diffInMinutes} min`;
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    if (lang === "pt") return `há ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
    if (lang === "es") return `hace ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    if (lang === "pt") return `há ${diffInDays} ${diffInDays === 1 ? "dia" : "dias"}`;
    if (lang === "es") return `hace ${diffInDays} ${diffInDays === 1 ? "día" : "días"}`;
    return `${diffInDays}d ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (lang === "pt") return `há ${diffInMonths} ${diffInMonths === 1 ? "mês" : "meses"}`;
  if (lang === "es") return `hace ${diffInMonths} ${diffInMonths === 1 ? "mes" : "meses"}`;
  return `${diffInMonths}mo ago`;
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
