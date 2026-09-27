/**
 * Analytics helpers for GA4 event tracking via @next/third-parties.
 * Uses the gtag function injected by GoogleAnalytics component.
 */

declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

/**
 * Send a GA4 event. Safe to call even when GA is not configured (no-ops).
 * Use this for all custom event tracking to keep analytics consistent.
 */
export function sendGAEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined" || !window.gtag) return;
  
  try {
    window.gtag("event", eventName, params);
  } catch (err) {
    // Silently fail in case gtag errors out
    console.warn("[analytics] Failed to send event:", eventName, err);
  }
}
