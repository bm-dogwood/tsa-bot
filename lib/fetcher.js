// lib/fetcher.js - Complete rewrite for TSA API
import axios from "axios";

export async function fetchWithTimeout(url, options = {}, timeout = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await axios.get(url, {
      ...options,
      signal: controller.signal,
      responseType: "text",
      timeout: timeout - 1000,
      headers: {
        "User-Agent": "MyTSA/2.5.0 (iPhone; iOS 16.0; Scale/3.00)",
        Accept:
          "application/json application/rss+xml, application/xml, text/xml",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        ...(options.headers || {}),
      },
    });

    return res.data;
  } catch (err) {
    console.error("❌ Fetch failed:", err.message);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
