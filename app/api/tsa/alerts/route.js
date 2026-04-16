import { NextResponse } from "next/server";
import xml2js from "xml2js";
import { fetchWithTimeout } from "@/lib/fetcher";

export async function GET() {
  const xml = await fetchWithTimeout("https://www.tsa.gov/news/releases/rss");

  const parsed = await xml2js.parseStringPromise(xml, {
    explicitArray: false,
  });

  return NextResponse.json(parsed);
}
