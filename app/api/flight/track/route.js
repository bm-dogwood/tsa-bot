/**
 * GET /api/flight/track?flight=AA100
 *
 * Tracks a specific flight with live position data via FlightAware AeroAPI.
 *
 * SETUP: Add to .env.local:
 *   FLIGHTAWARE_API_KEY=your_key_here
 *
 * Endpoints used:
 *   GET /flights/{ident}          — get flight info
 *   GET /flights/{id}/position    — get current live position
 *   GET /flights/{id}/route       — get planned route
 *
 * This combines multiple FA API calls into one rich response for the map.
 */

const FA_BASE = "https://aeroapi.flightaware.com/aeroapi";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const flightIdent = (searchParams.get("flight") || "").trim().toUpperCase();

  if (!flightIdent) {
    return Response.json(
      { error: "Flight identifier required (e.g. AA100)" },
      { status: 400 }
    );
  }

  const apiKey = process.env.FLIGHTAWARE_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error: "FLIGHTAWARE_API_KEY not configured in .env.local",
        flight: null,
      },
      { status: 503 }
    );
  }

  const headers = {
    "x-apikey": apiKey,
    Accept: "application/json; charset=UTF-8",
  };

  try {
    // Step 1: Get flight info (returns most recent flight for this ident)
    const flightRes = await fetch(
      `${FA_BASE}/flights/${flightIdent}?max_pages=1`,
      {
        headers,
        next: { revalidate: 30 },
      }
    );

    if (flightRes.status === 401) {
      return Response.json(
        { error: "Invalid FlightAware API key" },
        { status: 401 }
      );
    }
    if (flightRes.status === 404) {
      return Response.json(
        { error: `Flight ${flightIdent} not found` },
        { status: 404 }
      );
    }
    if (!flightRes.ok) {
      throw new Error(`FlightAware API error: ${flightRes.status}`);
    }

    const flightData = await flightRes.json();
    const flights = flightData.flights || [];

    if (!flights.length) {
      return Response.json(
        { error: `No flight data found for ${flightIdent}` },
        { status: 404 }
      );
    }

    // Get the most recent/active flight
    const activeFlight =
      flights.find((f) => f.status === "En Route" || f.status === "In Air") ||
      flights[0];

    const fa_id = activeFlight.fa_flight_id;

    // Step 2: Fetch live position (parallel with route)
    const [posRes, routeRes] = await Promise.allSettled([
      fetch(`${FA_BASE}/flights/${fa_id}/position`, {
        headers,
        next: { revalidate: 30 },
      }),
      fetch(`${FA_BASE}/flights/${fa_id}/route`, {
        headers,
        next: { revalidate: 300 },
      }),
    ]);

    let livePosition = null;
    let routeWaypoints = [];

    if (posRes.status === "fulfilled" && posRes.value.ok) {
      const posData = await posRes.value.json();
      livePosition = posData.last_position || posData.position || null;
    }

    if (routeRes.status === "fulfilled" && routeRes.value.ok) {
      const routeData = await routeRes.value.json();
      routeWaypoints = routeData.waypoints || [];
    }

    // Step 3: Enrich origin/destination with coordinates
    // FA AeroAPI includes lat/lon on origin and destination in flight response
    const flight = {
      fa_flight_id: fa_id,
      ident: activeFlight.ident,
      ident_iata: activeFlight.ident_iata,
      ident_icao: activeFlight.ident_icao,
      operator: activeFlight.operator,
      operator_iata: activeFlight.operator_iata,
      operator_icao: activeFlight.operator_icao,
      aircraft_type: activeFlight.aircraft_type,
      registration: activeFlight.registration,
      status: activeFlight.status,

      origin: enrichAirport(activeFlight.origin),
      destination: enrichAirport(activeFlight.destination),

      // Timing
      scheduled_out: activeFlight.scheduled_out,
      estimated_out: activeFlight.estimated_out,
      actual_out: activeFlight.actual_out,
      scheduled_off: activeFlight.scheduled_off,
      estimated_off: activeFlight.estimated_off,
      actual_off: activeFlight.actual_off,
      scheduled_in: activeFlight.scheduled_in,
      estimated_in: activeFlight.estimated_in,
      actual_in: activeFlight.actual_in,

      // Gate/terminal
      gate_origin: activeFlight.gate_origin,
      terminal_origin: activeFlight.terminal_origin,
      gate_destination: activeFlight.gate_destination,
      terminal_destination: activeFlight.terminal_destination,

      // Delays
      departure_delay: activeFlight.departure_delay,
      arrival_delay: activeFlight.arrival_delay,

      // Route
      route_distance: activeFlight.route_distance,
      filed_altitude: activeFlight.filed_altitude,
      filed_airspeed: activeFlight.filed_airspeed,
      route: activeFlight.route,
      progress_percent: activeFlight.progress_percent,

      // Live position from separate endpoint (more accurate)
      last_position: livePosition || activeFlight.last_position,

      // Route waypoints for map
      route_waypoints: routeWaypoints,

      type: activeFlight.type,
    };

    return Response.json({
      flight,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

function enrichAirport(ap) {
  if (!ap) return null;
  return {
    code: ap.code,
    code_iata: ap.code_iata,
    code_icao: ap.code_icao,
    name: ap.name,
    city: ap.city,
    timezone: ap.timezone,
    latitude: ap.latitude,
    longitude: ap.longitude,
  };
}
