import { NextResponse } from "next/server";
import { fetchWithTimeout } from "@/lib/fetcher";
import { normalizeFlight } from "@/lib/flight";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const flight = searchParams.get("flight");

  if (!flight) {
    return NextResponse.json({ error: "flight required" }, { status: 400 });
  }

  const data = await fetchWithTimeout(
    `https://aeroapi.flightaware.com/aeroapi/flights/${flight}`,
    {
      headers: {
        "x-apikey": process.env.FLIGHTAWARE_API_KEY,
      },
    }
  );

  return NextResponse.json(normalizeFlight(data.flights[0]));
}
