"use client";
import { useState } from "react";

const STATUS_META = {
  "On Time": { cls: "badge-green", dot: "dot-green" },
  Scheduled: { cls: "badge-blue", dot: "dot-blue" },
  "En Route": { cls: "badge-blue", dot: "dot-blue" },
  "In Air": { cls: "badge-blue", dot: "dot-blue" },
  Delayed: { cls: "badge-amber", dot: "dot-amber" },
  Cancelled: { cls: "badge-red", dot: "dot-red" },
  Landed: { cls: "badge-purple", dot: "dot-blue" },
  Diverted: { cls: "badge-red", dot: "dot-red" },
};
function getStatus(s = "") {
  for (const [k, v] of Object.entries(STATUS_META))
    if (s.toLowerCase().includes(k.toLowerCase())) return v;
  return STATUS_META["Scheduled"];
}
function fmtT(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    });
  } catch {
    return null;
  }
}
function fmtDelay(m) {
  if (!m || m <= 0) return null;
  const h = Math.floor(m / 60),
    mn = m % 60;
  return h ? `+${h}h ${mn}m` : `+${mn}m`;
}

const POPULAR = [
  "JFK",
  "LAX",
  "ORD",
  "DFW",
  "SFO",
  "MIA",
  "ATL",
  "BOS",
  "SEA",
  "DEN",
  "LHR",
  "DXB",
  "SIN",
  "KTM",
  "NRT",
];

export default function FlightDepartures({ onCount }) {
  const [airport, setAirport] = useState("");
  const [flights, setFlights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);

  const search = async (ap) => {
    const code = (ap || airport).trim().toUpperCase();
    if (!code) return;
    setLoading(true);
    setError(null);
    setFlights(null);
    setSearched(true);
    setSelectedFlight(null);
    try {
      const r = await fetch(`/api/flight/departures?airport=${code}`, {
        signal: AbortSignal.timeout(15000),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Request failed");
      const arr = j.departures || j.flights || [];
      setFlights(arr);
      if (onCount) onCount(arr.length);
    } catch (e) {
      setError(e.message);
      // demo
      const demo = genDemo(code);
      setFlights(demo);
      if (onCount) onCount(demo.length);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="card-hd">
        <div className="card-hd-l">
          <div className="card-icon">
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <div>
            <div className="card-title">Airport Departures</div>
            <div className="card-sub">
              FlightAware AeroAPI · real-time departure board
            </div>
          </div>
        </div>
        {flights && (
          <span className="badge badge-blue">{flights.length} flights</span>
        )}
      </div>

      {/* Search */}
      <div className="dep-search-bar">
        <input
          placeholder="Airport code (KTM, JFK, LAX…)"
          value={airport}
          onChange={(e) => setAirport(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && search()}
          style={{
            flex: 1,
            fontFamily: "var(--mono)",
            fontWeight: 600,
            letterSpacing: ".06em",
            fontSize: 14,
            textTransform: "uppercase",
          }}
        />
        <button
          className="btn btn-accent"
          onClick={() => search()}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner" style={{ width: 12, height: 12 }} />
              SEARCHING…
            </>
          ) : (
            <>SEARCH DEPARTURES</>
          )}
        </button>
      </div>

      {/* Quick airports */}
      <div className="quick-aps">
        {POPULAR.map((ap) => (
          <button
            key={ap}
            className={`ap-chip${airport === ap ? " active" : ""}`}
            onClick={() => {
              setAirport(ap);
              search(ap);
            }}
          >
            {ap}
          </button>
        ))}
      </div>

      {/* Error banner */}
      {error && !loading && (
        <div className="err-box" style={{ margin: "10px 18px" }}>
          {error} — showing demo data
        </div>
      )}

      {/* Results */}
      <div className="dep-list">
        {loading && (
          <div className="loading-wrap">
            <div className="spinner" />
            <span>QUERYING FLIGHTAWARE AEROAPI…</span>
          </div>
        )}

        {!loading && !searched && (
          <div className="empty">
            <div style={{ fontSize: 24, marginBottom: 8, opacity: 0.3 }}>✈</div>
            Enter an airport code to see live departures
          </div>
        )}

        {!loading && searched && flights?.length === 0 && (
          <div className="empty">No departures found for this airport</div>
        )}

        {!loading && flights && flights.length > 0 && (
          <>
            <div className="dep-header-row">
              <span>Flight</span>
              <span>Route</span>
              <span>Scheduled</span>
              <span>Estimated</span>
              <span>Gate</span>
              <span>Status</span>
            </div>
            {flights.map((f, i) => {
              const id = f.ident_iata || f.ident || "—";
              const op = f.operator_iata || f.operator || "";
              const orig = f.origin?.code_iata || f.origin?.code || "???";
              const dest =
                f.destination?.code_iata || f.destination?.code || "???";
              const destCity = f.destination?.city || f.destination?.name || "";
              const sched = fmtT(f.scheduled_out || f.scheduled_off);
              const est = fmtT(f.estimated_out || f.estimated_off);
              const delay = fmtDelay(f.departure_delay);
              const gate = f.gate_origin || "—";
              const term = f.terminal_origin;
              const statusMeta = getStatus(f.status || "Scheduled");
              const isSelected = selectedFlight === i;

              return (
                <div
                  key={i}
                  className={`dep-row${isSelected ? " selected" : ""}`}
                  style={{ animationDelay: `${i * 20}ms` }}
                  onClick={() => setSelectedFlight(isSelected ? null : i)}
                >
                  <div className="dep-flight">
                    <div className="dep-id">{id}</div>
                    <div className="dep-op">{op}</div>
                  </div>
                  <div className="dep-route">
                    <span className="dep-code">{orig}</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--text3)"
                      strokeWidth="1.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    <span className="dep-code">{dest}</span>
                    {destCity && <span className="dep-city">{destCity}</span>}
                  </div>
                  <div className="dep-time">{sched || "—"}</div>
                  <div
                    className="dep-time"
                    style={{ color: delay ? "var(--amber)" : "var(--text2)" }}
                  >
                    {est || sched || "—"}
                    {delay && <span className="dep-delay">{delay}</span>}
                  </div>
                  <div className="dep-gate">
                    {gate !== "—" ? (
                      <>
                        <span>{gate}</span>
                        {term && <span className="dep-term">T{term}</span>}
                      </>
                    ) : (
                      <span style={{ color: "var(--text3)" }}>—</span>
                    )}
                  </div>
                  <div>
                    <span
                      className={`badge ${statusMeta.cls}`}
                      style={{ fontSize: 10 }}
                    >
                      {f.status || "Scheduled"}
                    </span>
                  </div>

                  {/* Expanded row */}
                  {isSelected && (
                    <div className="dep-expanded">
                      <div className="dep-exp-grid">
                        {f.aircraft_type && (
                          <div>
                            <div className="exp-label">Aircraft</div>
                            <div className="exp-val">{f.aircraft_type}</div>
                          </div>
                        )}
                        {f.registration && (
                          <div>
                            <div className="exp-label">Registration</div>
                            <div className="exp-val">{f.registration}</div>
                          </div>
                        )}
                        {f.route_distance && (
                          <div>
                            <div className="exp-label">Distance</div>
                            <div className="exp-val">{f.route_distance} NM</div>
                          </div>
                        )}
                        {f.scheduled_in && (
                          <div>
                            <div className="exp-label">Sched arrival</div>
                            <div className="exp-val">
                              {fmtT(f.scheduled_in)}
                            </div>
                          </div>
                        )}
                        {f.estimated_in && (
                          <div>
                            <div className="exp-label">Est. arrival</div>
                            <div className="exp-val">
                              {fmtT(f.estimated_in)}
                            </div>
                          </div>
                        )}
                        {f.fa_flight_id && (
                          <div>
                            <div className="exp-label">FA Flight ID</div>
                            <div
                              className="exp-val"
                              style={{
                                fontFamily: "var(--mono)",
                                fontSize: 11,
                              }}
                            >
                              {f.fa_flight_id}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      <style jsx>{`
        .dep-search-bar {
          padding: 12px 18px;
          border-bottom: 1px solid var(--border);
          display: flex;
          gap: 8px;
          align-items: center;
          background: var(--bg3);
        }
        .quick-aps {
          padding: 8px 18px 10px;
          border-bottom: 1px solid var(--border);
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          background: var(--bg3);
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
        .ap-chip.active {
          background: rgba(79, 142, 247, 0.12);
          border-color: rgba(79, 142, 247, 0.3);
          color: var(--accent2);
        }
        .dep-list {
          max-height: 600px;
          overflow-y: auto;
        }
        .dep-header-row {
          display: grid;
          grid-template-columns: 90px 1fr 90px 90px 80px 110px;
          gap: 10px;
          padding: 8px 18px;
          font-size: 10px;
          color: var(--text3);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          border-bottom: 1px solid var(--border);
          background: var(--bg3);
          position: sticky;
          top: 0;
        }
        .dep-row {
          display: grid;
          grid-template-columns: 90px 1fr 90px 90px 80px 110px;
          gap: 10px;
          padding: 10px 18px;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: background 0.1s;
          animation: rowIn 0.2s ease both;
          grid-column: 1 / -1;
        }
        @keyframes rowIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .dep-row:hover {
          background: var(--bg3);
        }
        .dep-row.selected {
          background: rgba(79, 142, 247, 0.05);
          border-color: rgba(79, 142, 247, 0.15);
        }
        .dep-flight {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .dep-id {
          font-family: var(--mono);
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
        }
        .dep-op {
          font-size: 10px;
          color: var(--text3);
        }
        .dep-route {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .dep-code {
          font-family: var(--mono);
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
        }
        .dep-city {
          font-size: 10px;
          color: var(--text3);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 80px;
        }
        .dep-time {
          font-family: var(--mono);
          font-size: 13px;
          color: var(--text2);
        }
        .dep-delay {
          display: block;
          font-size: 10px;
          color: var(--amber);
          margin-top: 2px;
        }
        .dep-gate {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .dep-gate span {
          font-family: var(--mono);
          font-size: 12px;
          color: var(--text2);
        }
        .dep-term {
          font-size: 10px;
          color: var(--text3);
        }
        .dep-expanded {
          grid-column: 1 / -1;
          padding: 10px 0 4px;
          border-top: 1px solid var(--border);
          margin-top: 4px;
        }
        .dep-exp-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        .exp-label {
          font-size: 10px;
          color: var(--text3);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 2px;
        }
        .exp-val {
          font-size: 12px;
          color: var(--text);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}

function genDemo(ap) {
  const routes = [
    ["JFK", "LAX"],
    ["LAX", "ORD"],
    ["ORD", "DFW"],
    ["DFW", "MIA"],
    ["MIA", "ATL"],
    ["ATL", "BOS"],
    ["BOS", "SEA"],
    ["SEA", "SFO"],
    ["SFO", "DEN"],
    ["DEN", "LAS"],
    ["LAS", "PHX"],
    ["PHX", "EWR"],
    ["EWR", "DCA"],
    ["DCA", "IAD"],
    ["IAD", "CLT"],
  ];
  const carriers = ["AA", "UA", "DL", "WN", "B6", "AS", "NK", "F9", "G4", "SY"];
  const statuses = [
    "On Time",
    "On Time",
    "On Time",
    "Delayed",
    "Scheduled",
    "En Route",
    "Scheduled",
  ];
  return Array.from({ length: 14 }, (_, i) => {
    const [orig, dest] = routes[i % routes.length];
    const carrier = carriers[i % carriers.length];
    const flightNum = (i + 1) * 100 + Math.floor(Math.random() * 99);
    const depTime = new Date(Date.now() + i * 3600000);
    const delay = Math.random() > 0.7 ? Math.floor(Math.random() * 90) : 0;
    return {
      ident_iata: `${carrier}${flightNum}`,
      operator_iata: carrier,
      origin: { code_iata: ap || orig, city: "Origin City" },
      destination: {
        code_iata: dest,
        city: ["New York", "Los Angeles", "Chicago", "Dallas", "Miami"][i % 5],
      },
      scheduled_out: depTime.toISOString(),
      estimated_out: delay
        ? new Date(depTime.getTime() + delay * 60000).toISOString()
        : depTime.toISOString(),
      scheduled_in: new Date(
        depTime.getTime() + (2 + (i % 4)) * 3600000
      ).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      gate_origin:
        String.fromCharCode(65 + Math.floor(Math.random() * 8)) +
        (Math.floor(Math.random() * 30) + 1),
      terminal_origin: String(Math.floor(Math.random() * 4) + 1),
      departure_delay: delay,
      aircraft_type: ["B738", "A320", "E175", "B77W", "A321"][i % 5],
    };
  });
}
