import { NextResponse } from "next/server";
import xml2js from "xml2js";
import { fetchWithTimeout } from "@/lib/fetcher";

export async function GET() {
  try {
    // ✅ Correct TSA RSS feed (NOT HTML page)
    const url = "https://www.tsa.gov/rss.xml";

    const xml = await fetchWithTimeout(url);

    const parsed = await xml2js.parseStringPromise(xml, {
      explicitArray: false,
      trim: true,
      normalizeTags: true,
    });

    return NextResponse.json({
      success: true,
      source: url,
      data: parsed,
    });
  } catch (err) {
    console.error("TSA API Error:", err);

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
