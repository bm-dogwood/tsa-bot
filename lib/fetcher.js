// lib/fetcher.js

export async function fetchWithTimeout(url, options = {}, timeout = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (MyTSA-App)",
        Accept: "*/*",
        "Cache-Control": "no-cache",
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("FlightAware error body:", text);
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const contentType = res.headers.get("content-type") || "";

    // Auto-handle JSON
    if (contentType.includes("application/json")) {
      return await res.json();
    }

    // Default → text (XML/HTML/RSS)
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}
