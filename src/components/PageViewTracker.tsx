"use client";

import { useEffect } from "react";
import { detectTrafficSource, getAnonymousSessionId } from "@/lib/analytics-client";

export function PageViewTracker() {
  useEffect(() => {
    const controller = new AbortController();

    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: getAnonymousSessionId(),
        path: window.location.pathname,
        source: detectTrafficSource(),
      }),
      keepalive: true,
      signal: controller.signal,
    }).catch(() => undefined);

    return () => controller.abort();
  }, []);

  return null;
}
