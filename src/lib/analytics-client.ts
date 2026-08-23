const SESSION_KEY = "bidbento_session_id";

export function getAnonymousSessionId() {
  if (typeof window === "undefined") return "";

  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const sessionId = window.crypto.randomUUID();
  window.localStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
}

export function detectTrafficSource() {
  if (typeof window === "undefined") return "Direct";

  const params = new URLSearchParams(window.location.search);
  const campaignSource = params.get("utm_source");
  if (campaignSource) return campaignSource.slice(0, 80);

  if (!document.referrer) return "Direct";

  try {
    const host = new URL(document.referrer).hostname.toLowerCase();
    if (host.includes("google.") || host.includes("bing.") || host.includes("duckduckgo.")) return "Organic Search";
    if (["linkedin.com", "instagram.com", "facebook.com", "t.co", "x.com", "youtube.com"].some((domain) => host.includes(domain))) return "Social";
    if (host === window.location.hostname) return "Direct";
    return "Referral";
  } catch {
    return "Referral";
  }
}
