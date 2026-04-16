import { NextResponse } from "next/server";
import { fetchWithTimeout } from "@/lib/fetcher";
import { parseClear } from "@/lib/clear";

export async function GET() {
  const html = await fetchWithTimeout("https://www.clearme.com/locations");
  const data = parseClear(html);

  return NextResponse.json(data);
}
