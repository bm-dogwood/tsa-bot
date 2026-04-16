import { NextResponse } from "next/server";
import { fetchWithTimeout } from "@/lib/fetcher";
import { parseFAA } from "@/lib/faa";
import { getCache, setCache } from "@/lib/cache";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const airport = searchParams.get("airport");

  const cacheKey = "faa_delays";
  let data = getCache(cacheKey);

  if (!data) {
    const xml = await fetchWithTimeout(
      "https://nasstatus.faa.gov/api/airport-status-information"
    );
    data = await parseFAA(xml);
    setCache(cacheKey, data, 300);
  }

  const filtered = airport ? data.filter((d) => d.airport === airport) : data;

  return NextResponse.json({ data: filtered });
}
