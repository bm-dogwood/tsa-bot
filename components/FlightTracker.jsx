"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ────────────────────────────────────────────────────────────
   FlightTracker — Live flight map using Leaflet + FlightAware
   ──────────────────────────────────────────────────────────── */

const STATUS_META = {
  "On Time": { cls: "badge-green", color: "#34d399" },
  Scheduled: { cls: "badge-blue", color: "#4f8ef7" },
  "En Route": { cls: "badge-blue", color: "#4f8ef7" },
  "In Air": { cls: "badge-blue", color: "#4f8ef7" },
  Delayed: { cls: "badge-amber", color: "#fbbf24" },
  Cancelled: { cls: "badge-red", color: "#f87171" },
  Landed: { cls: "badge-purple", color: "#a78bfa" },
  Diverted: { cls: "badge-red", color: "#f87171" },
};
function getStatusMeta(s = "") {
  for (const [k, v] of Object.entries(STATUS_META))
    if (s.toLowerCase().includes(k.toLowerCase())) return v;
  return STATUS_META["Scheduled"];
}
function fmtT(iso) {
  if (!iso) return "—";
  try {
    return (
      new Date(iso).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
      }) + " UTC"
    );
  } catch {
    return "—";
  }
}

// ── Map component (loads Leaflet client-side only) ──────────
function FlightMap({ flight, route }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layersRef = useRef([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    const loadLeaflet = async () => {
      if (window.L) return initMap();
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => {
          initMap();
          resolve();
        };
        document.head.appendChild(script);
      });
    };

    const initMap = () => {
      if (!mapRef.current || mapInstance.current) return;
      const L = window.L;

      mapInstance.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([20, 0], 2);

      // Dark tile layer
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          attribution: "© CartoDB",
        }
      ).addTo(mapInstance.current);

      L.control.zoom({ position: "bottomright" }).addTo(mapInstance.current);
      L.control
        .attribution({
          position: "bottomleft",
          prefix: "© CartoDB, © OpenStreetMap",
        })
        .addTo(mapInstance.current);
    };

    loadLeaflet();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Draw route & plane when data changes
  useEffect(() => {
    if (!mapInstance.current || !window.L) return;
    const L = window.L;
    const map = mapInstance.current;

    // Clear old layers
    layersRef.current.forEach((l) => {
      try {
        map.removeLayer(l);
      } catch {}
    });
    layersRef.current = [];

    if (!flight) return;

    const origin = flight.origin;
    const dest = flight.destination;
    const pos = flight.last_position;

    const originCoords =
      origin?.latitude && origin?.longitude
        ? [origin.latitude, origin.longitude]
        : null;
    const destCoords =
      dest?.latitude && dest?.longitude
        ? [dest.latitude, dest.longitude]
        : null;
    const planeCoords =
      pos?.latitude && pos?.longitude ? [pos.latitude, pos.longitude] : null;

    // Airport markers
    const airportIcon = (code, type) =>
      L.divIcon({
        className: "",
        html: `<div style="
        background: ${
          type === "origin" ? "rgba(52,211,153,0.9)" : "rgba(248,113,113,0.9)"
        };
        border: 2px solid ${type === "origin" ? "#34d399" : "#f87171"};
        border-radius: 50%;
        width: 10px; height: 10px;
        box-shadow: 0 0 8px ${type === "origin" ? "#34d399" : "#f87171"};
      "></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });

    const airportLabel = (code, name, type) =>
      L.divIcon({
        className: "",
        html: `<div style="
        background: rgba(19,21,31,0.92);
        border: 1px solid ${
          type === "origin" ? "rgba(52,211,153,.4)" : "rgba(248,113,113,.4)"
        };
        color: ${type === "origin" ? "#34d399" : "#f87171"};
        font-size: 10px; font-weight: 700; letter-spacing: .06em;
        padding: 2px 7px; border-radius: 4px;
        font-family: 'JetBrains Mono', monospace;
        white-space: nowrap;
        margin-top: -30px; margin-left: 6px;
      ">${code}</div>`,
        iconSize: [40, 20],
        iconAnchor: [0, 10],
      });

    if (originCoords) {
      const m = L.marker(originCoords, {
        icon: airportIcon(origin.code_iata, "origin"),
      }).addTo(map);
      const lbl = L.marker(originCoords, {
        icon: airportLabel(
          origin.code_iata || origin.code,
          origin.name,
          "origin"
        ),
      }).addTo(map);
      layersRef.current.push(m, lbl);
    }
    if (destCoords) {
      const m = L.marker(destCoords, {
        icon: airportIcon(dest.code_iata, "dest"),
      }).addTo(map);
      const lbl = L.marker(destCoords, {
        icon: airportLabel(dest.code_iata || dest.code, dest.name, "dest"),
      }).addTo(map);
      layersRef.current.push(m, lbl);
    }

    // Great circle route line
    if (originCoords && destCoords) {
      const gcPoints = greatCirclePoints(originCoords, destCoords, 60);
      const dashed = L.polyline(gcPoints, {
        color: "rgba(79,142,247,0.3)",
        weight: 1.5,
        dashArray: "6 6",
      }).addTo(map);
      layersRef.current.push(dashed);
    }

    // Route flown so far (if we have plane position)
    if (originCoords && planeCoords) {
      const flownPoints = greatCirclePoints(originCoords, planeCoords, 30);
      const flown = L.polyline(flownPoints, {
        color: "rgba(79,142,247,0.7)",
        weight: 2,
      }).addTo(map);
      layersRef.current.push(flown);
    }

    // Airplane icon
    if (planeCoords) {
      const heading = pos.heading || 0;
      const planeIcon = L.divIcon({
        className: "",
        html: `<div style="transform: rotate(${heading}deg); font-size: 22px; line-height: 1; filter: drop-shadow(0 0 6px #4f8ef7); color: #6ea8ff;">✈</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      const planeMkr = L.marker(planeCoords, { icon: planeIcon })
        .bindPopup(
          `
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; background: #13151f; color: #e8eaf2; border: 1px solid #222536; border-radius: 8px; padding: 10px;">
            <b style="font-size: 14px; color: #6ea8ff">${
              flight.ident_iata || flight.ident
            }</b><br>
            Alt: ${
              pos.altitude ? pos.altitude.toLocaleString() + " ft" : "—"
            }<br>
            GS: ${pos.groundspeed ? pos.groundspeed + " kt" : "—"}<br>
            HDG: ${pos.heading ? pos.heading + "°" : "—"}
          </div>
        `,
          {
            className: "dark-popup",
            maxWidth: 200,
          }
        )
        .addTo(map);
      layersRef.current.push(planeMkr);

      // Fit map to show all points
      const bounds = [planeCoords];
      if (originCoords) bounds.push(originCoords);
      if (destCoords) bounds.push(destCoords);
      map.fitBounds(L.latLngBounds(bounds), { padding: [60, 60] });
    } else if (originCoords && destCoords) {
      map.fitBounds(L.latLngBounds([originCoords, destCoords]), {
        padding: [60, 60],
      });
    }
  }, [flight]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100%", borderRadius: 0 }}
    />
  );
}

// Great-circle interpolation
function greatCirclePoints([lat1, lon1], [lat2, lon2], n) {
  const toRad = (d) => (d * Math.PI) / 180;
  const toDeg = (r) => (r * 180) / Math.PI;
  const φ1 = toRad(lat1),
    λ1 = toRad(lon1);
  const φ2 = toRad(lat2),
    λ2 = toRad(lon2);
  const Δλ = λ2 - λ1;
  const d = Math.acos(
    Math.sin(φ1) * Math.sin(φ2) + Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ)
  );
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const f = i / n;
    const A = Math.sin((1 - f) * d) / Math.sin(d),
      B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
    const z = A * Math.sin(φ1) + B * Math.sin(φ2);
    pts.push([
      toDeg(Math.atan2(z, Math.sqrt(x * x + y * y))),
      toDeg(Math.atan2(y, x)),
    ]);
  }
  return pts;
}

// ── Main FlightTracker component ────────────────────────────
export default function FlightTracker() {
  const [query, setQuery] = useState("");
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [route, setRoute] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const intervalRef = useRef(null);

  const DEMO_FLIGHTS = [
    "AA100",
    "UA900",
    "DL401",
    "BA175",
    "EK203",
    "QR701",
    "SQ21",
    "LH400",
    "AF009",
    "KL601",
  ];

  const trackFlight = useCallback(
    async (flt) => {
      const code = (flt || query).trim().toUpperCase().replace(/\s/g, "");
      if (!code) return;
      setLoading(true);
      setError(null);
      try {
        const r = await fetch(
          `/api/flight/track?flight=${encodeURIComponent(code)}`,
          { signal: AbortSignal.timeout(15000) }
        );
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Flight not found");
        setFlight(j.flight || j);
      } catch (e) {
        // Show demo flight
        setFlight(generateDemoFlight(code));
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh && flight) {
      intervalRef.current = setInterval(
        () => trackFlight(flight.ident_iata || flight.ident || query),
        30000
      );
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh, flight, trackFlight, query]);

  const pos = flight?.last_position;
  const progress = flight?.progress_percent;

  return (
    <div className="tracker-root">
      {/* Search bar */}
      <div className="tracker-search">
        <div className="card-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4c-2 0-4 2-4 2l-8.5-1.5-3.5 3.5L11 9.5" />
          </svg>
        </div>
        <input
          className="tracker-input"
          placeholder="Flight number (AA100, UA900, BA175…)"
          value={query}
          onChange={(e) => setQuery(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && trackFlight()}
        />
        <button
          className="btn btn-accent"
          onClick={() => trackFlight()}
          disabled={loading}
        >
          {loading ? (
            <>
              <div
                className="spinner"
                style={{
                  width: 12,
                  height: 12,
                  borderTopColor: "var(--accent2)",
                }}
              />
              TRACKING…
            </>
          ) : (
            "TRACK FLIGHT"
          )}
        </button>
        <label className="auto-toggle">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          <span className="toggle-track">
            <span className="toggle-thumb" />
          </span>
          <span className="toggle-label">Live</span>
        </label>
      </div>

      {/* Demo quick picks */}
      <div className="demo-picks">
        <span className="demo-label">Try:</span>
        {DEMO_FLIGHTS.map((f) => (
          <button
            key={f}
            className="ap-chip"
            onClick={() => {
              setQuery(f);
              trackFlight(f);
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {error && (
        <div className="err-box" style={{ margin: "0 0 12px" }}>
          {error} — showing demo data
        </div>
      )}

      {/* Main layout */}
      <div className="tracker-body">
        {/* Map */}
        <div className="map-wrap">
          {!flight && !loading && (
            <div className="map-placeholder">
              <div className="map-ph-icon">✈</div>
              <div>Enter a flight number to track live position</div>
              <div
                style={{ fontSize: 11, color: "var(--text3)", marginTop: 6 }}
              >
                Powered by FlightAware AeroAPI
              </div>
            </div>
          )}
          {loading && (
            <div className="map-placeholder">
              <div className="spinner" style={{ width: 28, height: 28 }} />
              <div>Locating flight…</div>
            </div>
          )}
          {flight && !loading && <FlightMap flight={flight} route={route} />}

          {/* Map overlays */}
          {flight && !loading && pos && (
            <div className="map-hud">
              <div className="hud-row">
                <div className="hud-item">
                  <div className="hud-label">ALTITUDE</div>
                  <div className="hud-val">
                    {pos.altitude ? `${pos.altitude.toLocaleString()} ft` : "—"}
                  </div>
                </div>
                <div className="hud-item">
                  <div className="hud-label">GND SPEED</div>
                  <div className="hud-val">
                    {pos.groundspeed ? `${pos.groundspeed} kt` : "—"}
                  </div>
                </div>
                <div className="hud-item">
                  <div className="hud-label">HEADING</div>
                  <div className="hud-val">
                    {pos.heading ? `${pos.heading}°` : "—"}
                  </div>
                </div>
                {progress !== undefined && (
                  <div className="hud-item">
                    <div className="hud-label">PROGRESS</div>
                    <div className="hud-val">{Math.round(progress)}%</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Progress bar overlay */}
          {flight && progress !== undefined && (
            <div className="map-progress-bar">
              <div
                className="mpb-fill"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        {flight && !loading && (
          <div className="tracker-sidebar">
            {/* Flight header */}
            <div className="sb-section">
              <div className="sb-flight-id">
                {flight.ident_iata || flight.ident}
                <span
                  className={`badge ${getStatusMeta(flight.status || "").cls}`}
                  style={{ fontSize: 10, marginLeft: 8 }}
                >
                  {flight.status || "UNKNOWN"}
                </span>
              </div>
              {flight.operator && (
                <div className="sb-airline">{flight.operator}</div>
              )}
              {flight.aircraft_type && (
                <div className="sb-aircraft">
                  {flight.aircraft_type}
                  {flight.registration ? ` · ${flight.registration}` : ""}
                </div>
              )}
            </div>

            {/* Route */}
            <div className="sb-section">
              <div className="sb-section-label">Route</div>
              <div className="sb-route">
                <div className="sb-airport">
                  <div className="sb-ap-code">
                    {flight.origin?.code_iata || flight.origin?.code || "—"}
                  </div>
                  <div className="sb-ap-name">
                    {flight.origin?.name || flight.origin?.city || ""}
                  </div>
                  <div className="sb-ap-time">
                    <div className="sb-time-row">
                      <span className="time-label">Sched</span>
                      <span className="time-val">
                        {fmtT(flight.scheduled_out || flight.scheduled_off)}
                      </span>
                    </div>
                    {flight.actual_out && (
                      <div className="sb-time-row">
                        <span className="time-label">Actual</span>
                        <span className="time-val green">
                          {fmtT(flight.actual_out)}
                        </span>
                      </div>
                    )}
                  </div>
                  {(flight.gate_origin || flight.terminal_origin) && (
                    <div className="sb-gate">
                      {flight.gate_origin && (
                        <span>Gate {flight.gate_origin}</span>
                      )}
                      {flight.terminal_origin && (
                        <span>T{flight.terminal_origin}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Flight path vis */}
                <div className="sb-route-mid">
                  {progress !== undefined && (
                    <div className="route-progress">
                      <div className="rp-dot origin" />
                      <div className="rp-line">
                        <div
                          className="rp-fill"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                        <div
                          className="rp-plane"
                          style={{ left: `${Math.min(progress, 96)}%` }}
                        >
                          ✈
                        </div>
                      </div>
                      <div className="rp-dot dest" />
                    </div>
                  )}
                  {flight.route_distance && (
                    <div className="sb-distance">
                      {flight.route_distance} NM
                    </div>
                  )}
                </div>

                <div className="sb-airport">
                  <div className="sb-ap-code">
                    {flight.destination?.code_iata ||
                      flight.destination?.code ||
                      "—"}
                  </div>
                  <div className="sb-ap-name">
                    {flight.destination?.name || flight.destination?.city || ""}
                  </div>
                  <div className="sb-ap-time">
                    <div className="sb-time-row">
                      <span className="time-label">Sched</span>
                      <span className="time-val">
                        {fmtT(flight.scheduled_in || flight.scheduled_on)}
                      </span>
                    </div>
                    {flight.estimated_in && (
                      <div className="sb-time-row">
                        <span className="time-label">Est.</span>
                        <span className="time-val amber">
                          {fmtT(flight.estimated_in)}
                        </span>
                      </div>
                    )}
                    {flight.actual_in && (
                      <div className="sb-time-row">
                        <span className="time-label">Actual</span>
                        <span className="time-val green">
                          {fmtT(flight.actual_in)}
                        </span>
                      </div>
                    )}
                  </div>
                  {(flight.gate_destination || flight.terminal_destination) && (
                    <div className="sb-gate">
                      {flight.gate_destination && (
                        <span>Gate {flight.gate_destination}</span>
                      )}
                      {flight.terminal_destination && (
                        <span>T{flight.terminal_destination}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Live position */}
            {pos && (
              <div className="sb-section">
                <div className="sb-section-label">Live position</div>
                <div className="sb-stats-grid">
                  <div className="sb-stat">
                    <div className="sb-stat-label">Latitude</div>
                    <div className="sb-stat-val">
                      {pos.latitude?.toFixed(4)}°
                    </div>
                  </div>
                  <div className="sb-stat">
                    <div className="sb-stat-label">Longitude</div>
                    <div className="sb-stat-val">
                      {pos.longitude?.toFixed(4)}°
                    </div>
                  </div>
                  <div className="sb-stat">
                    <div className="sb-stat-label">Altitude</div>
                    <div className="sb-stat-val">
                      {pos.altitude
                        ? `${pos.altitude.toLocaleString()} ft`
                        : "—"}
                    </div>
                  </div>
                  <div className="sb-stat">
                    <div className="sb-stat-label">Ground speed</div>
                    <div className="sb-stat-val">
                      {pos.groundspeed ? `${pos.groundspeed} kt` : "—"}
                    </div>
                  </div>
                  <div className="sb-stat">
                    <div className="sb-stat-label">Heading</div>
                    <div className="sb-stat-val">
                      {pos.heading ? `${pos.heading}°` : "—"}
                    </div>
                  </div>
                  {pos.timestamp && (
                    <div className="sb-stat">
                      <div className="sb-stat-label">Last update</div>
                      <div className="sb-stat-val">{fmtT(pos.timestamp)}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Delays */}
            {(flight.departure_delay > 0 || flight.arrival_delay > 0) && (
              <div className="sb-section">
                <div className="sb-section-label">Delays</div>
                {flight.departure_delay > 0 && (
                  <div className="delay-chip">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Departure delayed {flight.departure_delay} min
                  </div>
                )}
                {flight.arrival_delay > 0 && (
                  <div className="delay-chip">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Arrival delayed {flight.arrival_delay} min
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="sb-footer">
              <span>FlightAware AeroAPI</span>
              {autoRefresh && (
                <span className="auto-badge">
                  <span className="auto-dot" />
                  Auto-refresh 30s
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .tracker-root {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-top: 16px;
        }
        .tracker-search {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 14px 14px 0 0;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid var(--border);
        }
        .tracker-input {
          flex: 1;
          font-family: var(--mono);
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .demo-picks {
          background: var(--bg3);
          border-left: 1px solid var(--border);
          border-right: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 8px 18px;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .demo-label {
          font-size: 10px;
          color: var(--text3);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .ap-chip {
          padding: 3px 8px;
          border-radius: 5px;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text3);
          font-size: 10px;
          font-family: var(--mono);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.12s;
        }
        .ap-chip:hover {
          border-color: var(--border2);
          color: var(--text2);
        }
        .tracker-body {
          display: grid;
          grid-template-columns: 1fr 320px;
          background: var(--bg2);
          border: 1px solid var(--border);
          border-top: none;
          border-radius: 0 0 14px 14px;
          overflow: hidden;
          min-height: 520px;
        }
        .map-wrap {
          position: relative;
          border-right: 1px solid var(--border);
          min-height: 520px;
          background: #0c0e14;
        }
        .map-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: var(--text3);
          font-size: 13px;
          background: var(--bg);
        }
        .map-ph-icon {
          font-size: 36px;
          opacity: 0.2;
        }
        .map-hud {
          position: absolute;
          bottom: 40px;
          left: 12px;
          z-index: 999;
          background: rgba(13, 15, 22, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border2);
          border-radius: 8px;
          padding: 8px 14px;
        }
        .hud-row {
          display: flex;
          gap: 20px;
        }
        .hud-item {
          text-align: center;
        }
        .hud-label {
          font-size: 9px;
          color: var(--text3);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .hud-val {
          font-family: var(--mono);
          font-size: 14px;
          font-weight: 600;
          color: var(--accent2);
          margin-top: 2px;
        }
        .map-progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--bg4);
          z-index: 999;
        }
        .mpb-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          transition: width 0.5s ease;
        }

        /* Sidebar */
        .tracker-sidebar {
          overflow-y: auto;
          max-height: 520px;
        }
        .sb-section {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
        }
        .sb-section:last-child {
          border-bottom: none;
        }
        .sb-section-label {
          font-size: 10px;
          color: var(--text3);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 10px;
        }
        .sb-flight-id {
          font-family: var(--mono);
          font-size: 20px;
          font-weight: 700;
          color: var(--text);
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
        }
        .sb-airline {
          font-size: 12px;
          color: var(--text2);
          margin-top: 4px;
        }
        .sb-aircraft {
          font-size: 11px;
          color: var(--text3);
          margin-top: 2px;
          font-family: var(--mono);
        }
        .sb-route {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .sb-airport {
        }
        .sb-ap-code {
          font-family: var(--mono);
          font-size: 22px;
          font-weight: 700;
          color: var(--text);
          line-height: 1;
        }
        .sb-ap-name {
          font-size: 10px;
          color: var(--text3);
          margin-top: 2px;
        }
        .sb-ap-time {
          margin-top: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .sb-time-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .time-label {
          font-size: 9px;
          color: var(--text3);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          min-width: 36px;
        }
        .time-val {
          font-family: var(--mono);
          font-size: 11px;
          color: var(--text2);
        }
        .time-val.green {
          color: var(--green);
        }
        .time-val.amber {
          color: var(--amber);
        }
        .sb-gate {
          display: flex;
          gap: 6px;
          margin-top: 5px;
        }
        .sb-gate span {
          font-family: var(--mono);
          font-size: 10px;
          color: var(--text3);
          padding: 2px 6px;
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 4px;
        }
        .sb-route-mid {
          padding: 4px 0;
        }
        .route-progress {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .rp-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .rp-dot.origin {
          background: var(--green);
        }
        .rp-dot.dest {
          background: var(--red);
        }
        .rp-line {
          flex: 1;
          height: 2px;
          background: var(--bg4);
          border-radius: 1px;
          position: relative;
        }
        .rp-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: var(--accent);
          border-radius: 1px;
          transition: width 0.5s;
        }
        .rp-plane {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          color: var(--accent2);
          line-height: 1;
          margin-top: -1px;
        }
        .sb-distance {
          font-size: 10px;
          color: var(--text3);
          margin-top: 4px;
          text-align: center;
          font-family: var(--mono);
        }
        .sb-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .sb-stat {
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 7px 10px;
        }
        .sb-stat-label {
          font-size: 9px;
          color: var(--text3);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .sb-stat-val {
          font-family: var(--mono);
          font-size: 12px;
          font-weight: 600;
          color: var(--accent2);
          margin-top: 3px;
        }
        .delay-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          background: rgba(251, 191, 36, 0.08);
          color: var(--amber);
          border: 1px solid rgba(251, 191, 36, 0.2);
          margin-bottom: 4px;
        }
        .sb-footer {
          padding: 10px 16px;
          font-size: 10px;
          color: var(--text3);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .auto-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--green);
        }
        .auto-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--green);
          animation: livePulse 2s infinite;
        }
        @keyframes livePulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.2;
          }
        }

        /* Toggle */
        .auto-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          flex-shrink: 0;
        }
        .auto-toggle input {
          display: none;
        }
        .toggle-track {
          width: 32px;
          height: 18px;
          background: var(--bg4);
          border: 1px solid var(--border2);
          border-radius: 9px;
          position: relative;
          transition: background 0.2s;
          display: block;
        }
        .auto-toggle input:checked ~ .toggle-track {
          background: rgba(52, 211, 153, 0.3);
          border-color: var(--green);
        }
        .toggle-thumb {
          width: 12px;
          height: 12px;
          background: var(--text3);
          border-radius: 50%;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: all 0.2s;
          display: block;
        }
        .auto-toggle input:checked ~ .toggle-track .toggle-thumb {
          left: 16px;
          background: var(--green);
        }
        .toggle-label {
          font-size: 11px;
          color: var(--text2);
        }

        @media (max-width: 900px) {
          .tracker-body {
            grid-template-columns: 1fr;
          }
          .map-wrap {
            min-height: 350px;
            border-right: none;
            border-bottom: 1px solid var(--border);
          }
          .tracker-sidebar {
            max-height: none;
          }
        }
      `}</style>

      <style global jsx>{`
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
        }
        .leaflet-popup-tip-container {
          display: none;
        }
        .leaflet-control-zoom a {
          background: rgba(19, 21, 31, 0.92) !important;
          color: #e8eaf2 !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(34, 37, 54, 0.95) !important;
        }
        .leaflet-control-attribution {
          background: rgba(13, 15, 22, 0.8) !important;
          color: rgba(255, 255, 255, 0.3) !important;
          font-size: 9px !important;
        }
      `}</style>
    </div>
  );
}

function generateDemoFlight(code) {
  const flights = {
    AA100: {
      ident_iata: "AA100",
      operator: "American Airlines",
      aircraft_type: "B77W",
      registration: "N720AN",
      status: "En Route",
      origin: {
        code_iata: "JFK",
        name: "John F. Kennedy Intl",
        city: "New York",
        latitude: 40.6413,
        longitude: -73.7781,
      },
      destination: {
        code_iata: "LHR",
        name: "Heathrow Airport",
        city: "London",
        latitude: 51.477,
        longitude: -0.461,
      },
      last_position: {
        latitude: 52.5,
        longitude: -30.2,
        altitude: 35000,
        groundspeed: 520,
        heading: 55,
        timestamp: new Date().toISOString(),
      },
      scheduled_out: new Date(Date.now() - 4 * 3600000).toISOString(),
      scheduled_in: new Date(Date.now() + 3 * 3600000).toISOString(),
      progress_percent: 57,
      route_distance: 3450,
    },
    UA900: {
      ident_iata: "UA900",
      operator: "United Airlines",
      aircraft_type: "B789",
      registration: "N27964",
      status: "En Route",
      origin: {
        code_iata: "SFO",
        name: "San Francisco Intl",
        city: "San Francisco",
        latitude: 37.6213,
        longitude: -122.379,
      },
      destination: {
        code_iata: "NRT",
        name: "Narita Intl",
        city: "Tokyo",
        latitude: 35.7647,
        longitude: 140.386,
      },
      last_position: {
        latitude: 48.2,
        longitude: 170.5,
        altitude: 37000,
        groundspeed: 547,
        heading: 295,
        timestamp: new Date().toISOString(),
      },
      scheduled_out: new Date(Date.now() - 6 * 3600000).toISOString(),
      scheduled_in: new Date(Date.now() + 4 * 3600000).toISOString(),
      progress_percent: 70,
      route_distance: 5135,
    },
    EK203: {
      ident_iata: "EK203",
      operator: "Emirates",
      aircraft_type: "A388",
      registration: "A6-EDA",
      status: "En Route",
      origin: {
        code_iata: "DXB",
        name: "Dubai Intl",
        city: "Dubai",
        latitude: 25.2532,
        longitude: 55.3657,
      },
      destination: {
        code_iata: "JFK",
        name: "John F. Kennedy Intl",
        city: "New York",
        latitude: 40.6413,
        longitude: -73.7781,
      },
      last_position: {
        latitude: 45.1,
        longitude: 25.3,
        altitude: 39000,
        groundspeed: 562,
        heading: 310,
        timestamp: new Date().toISOString(),
      },
      scheduled_out: new Date(Date.now() - 8 * 3600000).toISOString(),
      scheduled_in: new Date(Date.now() + 5 * 3600000).toISOString(),
      progress_percent: 62,
      route_distance: 6836,
    },
  };

  // Return known demo or generate random
  if (flights[code]) return flights[code];

  const origins = [
    {
      code_iata: "LAX",
      name: "Los Angeles Intl",
      city: "Los Angeles",
      latitude: 33.9425,
      longitude: -118.408,
    },
    {
      code_iata: "ATL",
      name: "Hartsfield-Jackson",
      city: "Atlanta",
      latitude: 33.6407,
      longitude: -84.4277,
    },
    {
      code_iata: "DFW",
      name: "Dallas/Fort Worth",
      city: "Dallas",
      latitude: 32.8998,
      longitude: -97.0403,
    },
  ];
  const dests = [
    {
      code_iata: "CDG",
      name: "Charles de Gaulle",
      city: "Paris",
      latitude: 49.0097,
      longitude: 2.5478,
    },
    {
      code_iata: "FRA",
      name: "Frankfurt Airport",
      city: "Frankfurt",
      latitude: 50.0379,
      longitude: 8.5622,
    },
    {
      code_iata: "SYD",
      name: "Kingsford Smith",
      city: "Sydney",
      latitude: -33.9399,
      longitude: 151.175,
    },
  ];
  const o = origins[Math.floor(Math.random() * origins.length)];
  const d = dests[Math.floor(Math.random() * dests.length)];
  const midLat = (o.latitude + d.latitude) / 2;
  const midLon = (o.longitude + d.longitude) / 2;
  return {
    ident_iata: code,
    operator: "Demo Airline",
    aircraft_type: "B738",
    status: "En Route",
    origin: o,
    destination: d,
    last_position: {
      latitude: midLat,
      longitude: midLon,
      altitude: 35000,
      groundspeed: 498,
      heading: 45,
      timestamp: new Date().toISOString(),
    },
    scheduled_out: new Date(Date.now() - 3 * 3600000).toISOString(),
    scheduled_in: new Date(Date.now() + 3 * 3600000).toISOString(),
    progress_percent: 48,
    route_distance: 4200,
  };
}
