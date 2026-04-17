import { NextResponse } from "next/server";
import { fetchWithTimeout } from "@/lib/fetcher";
import { normalizeFlight } from "@/lib/flight";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const origin = searchParams.get("origin");
  const dest = searchParams.get("dest");

  if (!origin || !dest) {
    return NextResponse.json(
      { error: "origin and dest required" },
      { status: 400 }
    );
  }

  try {
    const data = await fetchWithTimeout(
      `https://aeroapi.flightaware.com/aeroapi/airports/${origin}/flights/departures`,
      {
        headers: {
          "x-apikey": process.env.FLIGHTAWARE_API_KEY,
        },
      }
    );

    const flights =
      data?.departures?.filter(
        (f) => f.destination?.code === dest || f.destination?.iata === dest
      ) || [];

    return NextResponse.json({
      departures: flights.map(normalizeFlight),
    });
  } catch (err) {
    console.error("ROUTE API ERROR:", err);

    return NextResponse.json(
      { error: "Failed to fetch route flights" },
      { status: 500 }
    );
  }
}
