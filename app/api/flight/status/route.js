import { NextResponse } from "next/server";
import { fetchWithTimeout } from "@/lib/fetcher";
import { normalizeFlight } from "@/lib/flight";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const flight = searchParams.get("flight");

  if (!flight) {
    return NextResponse.json({ error: "flight required" }, { status: 400 });
  }

  try {
    const query = `ident ${flight} AND (-12h OR +12h)`;

    const data = await fetchWithTimeout(
      `https://aeroapi.flightaware.com/aeroapi/flights/search?query=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          "x-apikey": process.env.FLIGHTAWARE_API_KEY,
        },
      }
    );

    const flightData = data?.flights?.[0];

    if (!flightData) {
      return NextResponse.json({ error: "No flight found" }, { status: 404 });
    }

    return NextResponse.json(normalizeFlight(flightData));
  } catch (err) {
    console.error("STATUS API ERROR:", err);

    return NextResponse.json(
      { error: "Failed to fetch flight data" },
      { status: 500 }
    );
  }
}
