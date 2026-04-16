import { NextResponse } from "next/server";
import { fetchWithTimeout } from "@/lib/fetcher";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const origin = searchParams.get("origin");
  const dest = searchParams.get("dest");

  const data = await fetchWithTimeout(
    `https://aeroapi.flightaware.com/aeroapi/airports/${origin}/flights/to/${dest}`,
    {
      headers: {
        "x-apikey": process.env.FLIGHTAWARE_API_KEY,
      },
    }
  );

  return NextResponse.json(data);
}
