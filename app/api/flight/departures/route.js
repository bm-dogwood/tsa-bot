import { NextResponse } from "next/server";
import { fetchWithTimeout } from "@/lib/fetcher";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const airport = searchParams.get("airport");

  if (!airport) {
    return NextResponse.json({ error: "airport required" }, { status: 400 });
  }

  try {
    const data = await fetchWithTimeout(
      `https://aeroapi.flightaware.com/aeroapi/airports/${airport}/flights/departures`,
      {
        headers: {
          "x-apikey": process.env.FLIGHTAWARE_API_KEY,
        },
      }
    );

    return NextResponse.json(data);
  } catch (err) {
    console.error("Departure API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch departures" },
      { status: 500 }
    );
  }
}
