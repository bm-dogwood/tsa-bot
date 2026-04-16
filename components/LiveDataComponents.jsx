/**
 * TSA.BOT - Live Data Components
 *
 * Components:
 *  1. AirportDelayTracker   — FAA ATCSCC API (free, no key)
 *  2. TSAWaitTimes          — Scraped via backend proxy from apps.tsa.dhs.gov/mytsa
 *  3. FlightStatusLookup    — FlightAware AeroAPI (free tier) + FAA fallback
 *
 * Backend proxy endpoints assumed:
 *  GET /api/faa/delays           → FAA NASSTATUS data
 *  GET /api/tsa/waittimes?airport=XXX  → Scraped TSA wait times
 *  GET /api/flight/status?flight=XX123 → FlightAware AeroAPI
 *  GET /api/flight/search?origin=XXX&dest=YYY → route search
 */

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Shared Utilities ─────────────────────────────────────────────────────────

const STATUS_COLORS = {
  Normal: { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
  Delay: { bg: "#fff8e1", text: "#f57f17", border: "#ffe082" },
  "Ground Stop": { bg: "#fce4ec", text: "#c62828", border: "#f48fb1" },
  "Ground Delay": { bg: "#fff3e0", text: "#e65100", border: "#ffcc80" },
  Closed: { bg: "#f3e5f5", text: "#6a1b9a", border: "#ce93d8" },
  Unknown: { bg: "#f5f5f5", text: "#616161", border: "#bdbdbd" },
};

const getStatusStyle = (status) => {
  for (const key of Object.keys(STATUS_COLORS)) {
    if (status?.toLowerCase().includes(key.toLowerCase())) {
      return STATUS_COLORS[key];
    }
  }
  return STATUS_COLORS.Normal;
};

const Spinner = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{ animation: "tsabot-spin 0.8s linear infinite" }}
  >
    <style>{`@keyframes tsabot-spin { to { transform: rotate(360deg); } }`}</style>
    <circle
      cx="12"
      cy="12"
      r="10"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeDasharray="31.4 31.4"
      strokeLinecap="round"
      opacity="0.3"
    />
    <path
      d="M12 2a10 10 0 0 1 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const Badge = ({ label, status }) => {
  const s = getStatusStyle(status);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
        letterSpacing: "0.02em",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.text,
          flexShrink: 0,
          boxShadow:
            status === "Normal"
              ? `0 0 0 2px ${s.bg}, 0 0 0 3px ${s.text}`
              : "none",
        }}
      />
      {label}
    </span>
  );
};

const cardStyle = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
};

const headerStyle = (color = "#0f172a") => ({
  background: color,
  padding: "18px 24px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

// ══════════════════════════════════════════════════════════════════════════════
// 1. AIRPORT DELAY TRACKER
// ══════════════════════════════════════════════════════════════════════════════

/**
 * AirportDelayTracker
 *
 * Data source: FAA ATCSCC NASSTATUS API
 * Endpoint: https://nasstatus.faa.gov/api/airport-status-information
 * No API key required.
 *
 * Backend proxy at /api/faa/delays fetches and normalizes this data.
 * The component also supports direct FAA fetch as fallback.
 */
export function AirportDelayTracker() {
  const [delays, setDelays] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const intervalRef = useRef(null);

  const fetchDelays = useCallback(async () => {
    try {
      setError(null);
      // Try backend proxy first
      let data = null;
      try {
        const res = await fetch("/api/faa/delays", {
          signal: AbortSignal.timeout(8000),
        });
        if (res.ok) data = await res.json();
      } catch (_) {}

      // Fallback: direct FAA API (CORS permissive on their end)
      if (!data) {
        const res = await fetch(
          "https://nasstatus.faa.gov/api/airport-status-information",
          { signal: AbortSignal.timeout(8000) }
        );
        const xml = await res.text();
        data = parseFAAXML(xml);
      }

      setDelays(data);
      setLastUpdated(new Date());
    } catch (e) {
      setError("Unable to fetch live delay data. Retrying shortly…");
    } finally {
      setLoading(false);
    }
  }, []);

  // Parse FAA XML response into normalized array
  const parseFAAXML = (xmlText) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlText, "text/xml");
      const items = [];
      doc.querySelectorAll("Delay, Closure").forEach((node) => {
        const airport =
          node.querySelector("ARPT")?.textContent ||
          node.querySelector("Airport")?.textContent ||
          "";
        const reason =
          node.querySelector("Reason")?.textContent ||
          node.querySelector("Cause")?.textContent ||
          "General delay";
        const type =
          node.tagName === "Closure"
            ? "Closed"
            : node.querySelector("Type")?.textContent || "Delay";
        const avgDelay =
          node.querySelector("Avg")?.textContent ||
          node.querySelector("AvgDelay")?.textContent ||
          "";
        items.push({ airport, reason, type, avgDelay });
      });
      return items;
    } catch {
      return [];
    }
  };

  useEffect(() => {
    fetchDelays();
    intervalRef.current = setInterval(fetchDelays, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(intervalRef.current);
  }, [fetchDelays]);

  useEffect(() => {
    let results = delays;
    if (search.trim()) {
      const q = search.trim().toUpperCase();
      results = results.filter(
        (d) =>
          d.airport?.toUpperCase().includes(q) ||
          d.reason?.toUpperCase().includes(q)
      );
    }
    if (filterStatus !== "all") {
      results = results.filter((d) =>
        d.type?.toLowerCase().includes(filterStatus.toLowerCase())
      );
    }
    setFiltered(results);
  }, [delays, search, filterStatus]);

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={headerStyle("#0f172a")}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4c-2 0-4 2-4 2l-8.5-1.5-3.5 3.5L11 9.5" />
              <path d="m5 19 1.5-1.5M8 16.5l5 5M3 19l1.5-1.5M10.5 13l1 1" />
            </svg>
          </div>
          <div>
            <div
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: "-0.01em",
              }}
            >
              Airport Delay Tracker
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 12,
                marginTop: 1,
              }}
            >
              Live FAA ATCSCC data
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {lastUpdated && (
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
              {lastUpdated.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
          <button
            onClick={fetchDelays}
            disabled={loading}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8,
              padding: "6px 12px",
              color: "#fff",
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? <Spinner size={14} /> : "↻"}
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          padding: "14px 24px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
          background: "#f8fafc",
        }}
      >
        <input
          type="text"
          placeholder="Search airport (e.g. LAX, JFK)…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: "1 1 200px",
            minWidth: 160,
            padding: "8px 14px",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            fontSize: 14,
            outline: "none",
            background: "#fff",
          }}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            fontSize: 14,
            background: "#fff",
            cursor: "pointer",
          }}
        >
          <option value="all">All Statuses</option>
          <option value="delay">Delays Only</option>
          <option value="ground">Ground Stops</option>
          <option value="closed">Closures</option>
        </select>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 24px", minHeight: 200 }}>
        {loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "40px 0",
              gap: 12,
              color: "#94a3b8",
            }}
          >
            <Spinner size={28} />
            <span style={{ fontSize: 14 }}>Fetching live FAA status data…</span>
          </div>
        )}

        {error && !loading && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 10,
              padding: "14px 18px",
              color: "#991b1b",
              fontSize: 14,
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: 18 }}>⚠</span>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                Data unavailable
              </div>
              <div style={{ opacity: 0.8 }}>{error}</div>
            </div>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: "#64748b",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 10 }}>✈</div>
            <div
              style={{
                fontWeight: 600,
                fontSize: 15,
                marginBottom: 4,
                color: "#22c55e",
              }}
            >
              {delays.length === 0
                ? "No active delays reported"
                : "No results for your search"}
            </div>
            <div style={{ fontSize: 13 }}>
              {delays.length === 0
                ? "All major airports operating normally per FAA ATCSCC"
                : "Try a different airport code or clear your filter"}
            </div>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((item, i) => (
              <DelayCard key={i} item={item} />
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          padding: "12px 24px",
          borderTop: "1px solid #f1f5f9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#f8fafc",
        }}
      >
        <span style={{ fontSize: 11, color: "#94a3b8" }}>
          Source: FAA ATCSCC NASSTATUS · nasstatus.faa.gov
        </span>
        <span style={{ fontSize: 11, color: "#94a3b8" }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

function DelayCard({ item }) {
  const s = getStatusStyle(item.type);
  return (
    <div
      style={{
        border: `1px solid ${s.border}`,
        borderRadius: 12,
        padding: "14px 18px",
        background: s.bg,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: "-0.02em",
              color: s.text,
              fontFamily: "monospace",
            }}
          >
            {item.airport}
          </span>
          <Badge label={item.type} status={item.type} />
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: s.text,
            opacity: 0.8,
            lineHeight: 1.5,
          }}
        >
          {item.reason}
        </p>
      </div>
      {item.avgDelay && (
        <div
          style={{
            textAlign: "center",
            flexShrink: 0,
            background: "rgba(255,255,255,0.5)",
            borderRadius: 10,
            padding: "8px 14px",
            border: `1px solid ${s.border}`,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: s.text,
              lineHeight: 1,
            }}
          >
            {item.avgDelay}
          </div>
          <div
            style={{ fontSize: 10, color: s.text, opacity: 0.7, marginTop: 2 }}
          >
            avg min
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. TSA WAIT TIMES
// ══════════════════════════════════════════════════════════════════════════════

/**
 * TSAWaitTimes
 *
 * Data source: Scraped from apps.tsa.dhs.gov/mytsa/cso_index.xml
 * (MyTSA app public feed — no auth required but requires server-side fetch due to CORS)
 *
 * Backend proxy: GET /api/tsa/waittimes?airport=LAX
 *
 * The backend should:
 *   1. Fetch https://apps.tsa.dhs.gov/mytsa/cso_index.xml
 *   2. Parse XML for the requested airport
 *   3. Return normalized JSON: { airport, checkpoints: [{ name, waitMins, status }] }
 *
 * Scraping note: TSA MyTSA feed URL structure:
 *   https://apps.tsa.dhs.gov/mytsa/cso_index.xml  (all airports)
 *   Fields: <AirportName>, <Checkpoints>, <WaitTime>
 */
export function TSAWaitTimes() {
  const POPULAR_AIRPORTS = [
    "ATL",
    "LAX",
    "ORD",
    "DFW",
    "DEN",
    "JFK",
    "SFO",
    "SEA",
    "LAS",
    "MCO",
    "CLT",
    "PHX",
    "MIA",
    "EWR",
    "MSP",
    "BOS",
    "DTW",
    "FLL",
    "PHL",
    "BWI",
  ];

  const [airport, setAirport] = useState("LAX");
  const [inputVal, setInputVal] = useState("LAX");
  const [waitData, setWaitData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWaitTimes = useCallback(async (ap) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/tsa/waittimes?airport=${encodeURIComponent(ap)}`,
        {
          signal: AbortSignal.timeout(10000),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setWaitData(data);
      setLastUpdated(new Date());
    } catch (e) {
      setError(
        "Live TSA wait times unavailable. This data requires our server-side scraper to be running. " +
          "See backend setup instructions."
      );
      // Show demo data so UI is visible
      setWaitData(generateDemoData(ap));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWaitTimes(airport);
  }, [airport, fetchWaitTimes]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const code = inputVal.trim().toUpperCase().slice(0, 3);
    if (code.length === 3) setAirport(code);
  };

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={headerStyle("#1e3a5f")}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <div
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: "-0.01em",
              }}
            >
              TSA Wait Times
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 12,
                marginTop: 1,
              }}
            >
              Real-time checkpoint data via MyTSA
            </div>
          </div>
        </div>
        {lastUpdated && (
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
            Updated{" "}
            {lastUpdated.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>

      {/* Search */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #f1f5f9",
          background: "#f8fafc",
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            maxLength={3}
            placeholder="Airport code (LAX, JFK…)"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value.toUpperCase())}
            style={{
              flex: 1,
              padding: "9px 14px",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              fontSize: 14,
              outline: "none",
              background: "#fff",
              letterSpacing: "0.08em",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "9px 20px",
              background: "#1e3a5f",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Check
          </button>
        </form>

        {/* Quick select */}
        <div
          style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 5 }}
        >
          {POPULAR_AIRPORTS.slice(0, 10).map((ap) => (
            <button
              key={ap}
              onClick={() => {
                setInputVal(ap);
                setAirport(ap);
              }}
              style={{
                padding: "4px 10px",
                background: airport === ap ? "#1e3a5f" : "#fff",
                color: airport === ap ? "#fff" : "#475569",
                border: "1px solid",
                borderColor: airport === ap ? "#1e3a5f" : "#e2e8f0",
                borderRadius: 6,
                fontSize: 12,
                cursor: "pointer",
                fontWeight: airport === ap ? 600 : 400,
                fontFamily: "monospace",
              }}
            >
              {ap}
            </button>
          ))}
        </div>
      </div>

      {/* Wait time display */}
      <div style={{ padding: "20px 24px" }}>
        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "24px 0",
              color: "#94a3b8",
            }}
          >
            <Spinner size={22} />
            <span style={{ fontSize: 14 }}>
              Fetching TSA checkpoint data for {airport}…
            </span>
          </div>
        )}

        {!loading && waitData && (
          <>
            <div
              style={{
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0f172a",
                  letterSpacing: "-0.01em",
                }}
              >
                {waitData.airportName || airport}
              </h3>
              {error && (
                <span
                  style={{
                    fontSize: 11,
                    color: "#b45309",
                    background: "#fef3c7",
                    padding: "3px 8px",
                    borderRadius: 6,
                    border: "1px solid #fde68a",
                  }}
                >
                  Demo data
                </span>
              )}
            </div>

            {waitData.checkpoints?.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 12,
                }}
              >
                {waitData.checkpoints.map((cp, i) => (
                  <CheckpointCard key={i} checkpoint={cp} />
                ))}
              </div>
            ) : (
              <div
                style={{ color: "#64748b", fontSize: 14, padding: "20px 0" }}
              >
                No checkpoint data available for {airport}.
              </div>
            )}

            {waitData.source && (
              <p style={{ margin: "16px 0 0", fontSize: 11, color: "#94a3b8" }}>
                Source: {waitData.source}
              </p>
            )}
          </>
        )}
      </div>

      <div
        style={{
          padding: "12px 24px",
          borderTop: "1px solid #f1f5f9",
          background: "#f8fafc",
          fontSize: 11,
          color: "#94a3b8",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Source: TSA MyTSA · apps.tsa.dhs.gov/mytsa</span>
        <span>Updates every 10 min</span>
      </div>
    </div>
  );
}

function CheckpointCard({ checkpoint }) {
  const wait = parseInt(checkpoint.waitMins) || 0;
  const level = wait < 15 ? "low" : wait < 30 ? "medium" : "high";
  const colors = {
    low: { bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d", bar: "#22c55e" },
    medium: {
      bg: "#fffbeb",
      border: "#fde68a",
      text: "#92400e",
      bar: "#f59e0b",
    },
    high: { bg: "#fef2f2", border: "#fecaca", text: "#991b1b", bar: "#ef4444" },
  }[level];

  return (
    <div
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        padding: "14px 16px",
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: 13,
          color: "#0f172a",
          marginBottom: 8,
        }}
      >
        {checkpoint.name}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 4,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: colors.text,
            lineHeight: 1,
          }}
        >
          {wait}
        </span>
        <span style={{ fontSize: 13, color: colors.text, opacity: 0.7 }}>
          min wait
        </span>
      </div>
      {/* Progress bar */}
      <div
        style={{ height: 4, background: "rgba(0,0,0,0.08)", borderRadius: 2 }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min((wait / 60) * 100, 100)}%`,
            background: colors.bar,
            borderRadius: 2,
            transition: "width 0.4s ease",
          }}
        />
      </div>
      {checkpoint.status && (
        <div
          style={{
            marginTop: 8,
            fontSize: 11,
            color: colors.text,
            opacity: 0.8,
          }}
        >
          {checkpoint.status}
        </div>
      )}
    </div>
  );
}

function generateDemoData(airport) {
  const terminals = {
    LAX: ["Terminal 1", "Terminal 2", "Terminal 3", "TBIT"],
    JFK: ["Terminal 1", "Terminal 4", "Terminal 5", "Terminal 8"],
    ORD: ["Terminal 1 H", "Terminal 2 F/G", "Terminal 3 K/L"],
    ATL: ["North", "South", "International"],
    DFW: ["Terminal A", "Terminal B", "Terminal C", "Terminal D"],
  };
  const checkpoints = (
    terminals[airport] || ["Checkpoint A", "Checkpoint B", "Checkpoint C"]
  ).map((name) => ({
    name,
    waitMins: String(Math.floor(Math.random() * 40 + 5)),
    status:
      Math.random() > 0.7 ? "TSA PreCheck available" : "Standard screening",
  }));
  return {
    airportName: `${airport} Airport`,
    checkpoints,
    source: "TSA MyTSA app (demo data — live scraper required)",
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. FLIGHT STATUS LOOKUP
// ══════════════════════════════════════════════════════════════════════════════

/**
 * FlightStatusLookup
 *
 * Data sources:
 *  Primary: FlightAware AeroAPI — https://flightaware.com/aeroapi/
 *           GET /flights/{ident} — free tier: 100 req/month
 *  Fallback: FAA NASSTATUS for delay information
 *
 * Backend proxy: GET /api/flight/status?flight=UA123
 *                GET /api/flight/search?origin=LAX&dest=JFK
 *
 * The backend should pass your FlightAware API key server-side.
 * Never expose the API key client-side.
 */
export function FlightStatusLookup() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("flight"); // "flight" | "route"
  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      let url;
      if (searchType === "flight") {
        if (!query.trim()) throw new Error("Enter a flight number");
        url = `/api/flight/status?flight=${encodeURIComponent(
          query.trim().toUpperCase()
        )}`;
      } else {
        if (!origin.trim() || !dest.trim())
          throw new Error("Enter both origin and destination");
        url = `/api/flight/search?origin=${origin
          .trim()
          .toUpperCase()}&dest=${dest.trim().toUpperCase()}`;
      }
      const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResults(data);
    } catch (e) {
      setError(e.message || "Flight lookup failed");
      // Show demo data
      setResults(
        generateFlightDemo(
          searchType === "flight" ? query : `${origin}-${dest}`
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={headerStyle("#1a1a2e")}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <div
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: "-0.01em",
              }}
            >
              Flight Status Lookup
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 12,
                marginTop: 1,
              }}
            >
              FlightAware AeroAPI + FAA data
            </div>
          </div>
        </div>
      </div>

      {/* Search type toggle */}
      <div
        style={{
          padding: "14px 24px",
          borderBottom: "1px solid #f1f5f9",
          background: "#f8fafc",
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {["flight", "route"].map((type) => (
          <button
            key={type}
            onClick={() => setSearchType(type)}
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              background: searchType === type ? "#1a1a2e" : "#fff",
              color: searchType === type ? "#fff" : "#475569",
              border: `1px solid ${
                searchType === type ? "#1a1a2e" : "#e2e8f0"
              }`,
            }}
          >
            {type === "flight" ? "✈ Flight #" : "🗺 Route"}
          </button>
        ))}
      </div>

      {/* Search form */}
      <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9" }}>
        <form onSubmit={handleSearch}>
          {searchType === "flight" ? (
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                placeholder="Flight number (e.g. UA123, AA456)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  fontSize: 14,
                  outline: "none",
                  background: "#fff",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "10px 22px",
                  background: "#1a1a2e",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: "pointer",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {loading ? <Spinner size={14} /> : null}
                Search
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="From (e.g. LAX)"
                value={origin}
                maxLength={3}
                onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                style={{
                  flex: "1 1 120px",
                  padding: "10px 14px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  fontSize: 14,
                  outline: "none",
                  background: "#fff",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              />
              <span
                style={{ alignSelf: "center", color: "#94a3b8", fontSize: 18 }}
              >
                →
              </span>
              <input
                type="text"
                placeholder="To (e.g. JFK)"
                value={dest}
                maxLength={3}
                onChange={(e) => setDest(e.target.value.toUpperCase())}
                style={{
                  flex: "1 1 120px",
                  padding: "10px 14px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  fontSize: 14,
                  outline: "none",
                  background: "#fff",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "10px 22px",
                  background: "#1a1a2e",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: "pointer",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {loading ? <Spinner size={14} /> : null}
                Search
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Results */}
      <div style={{ padding: "20px 24px", minHeight: 160 }}>
        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "24px 0",
              color: "#94a3b8",
            }}
          >
            <Spinner size={22} />
            <span style={{ fontSize: 14 }}>Querying FlightAware AeroAPI…</span>
          </div>
        )}

        {!loading && searched && !results && !error && (
          <div
            style={{
              color: "#64748b",
              fontSize: 14,
              padding: "20px 0",
              textAlign: "center",
            }}
          >
            No flight data found. Check the flight number and try again.
          </div>
        )}

        {!loading && results && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {error && (
              <div
                style={{
                  fontSize: 11,
                  color: "#b45309",
                  background: "#fef3c7",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #fde68a",
                  marginBottom: 4,
                }}
              >
                ⚠ Using demo data — backend connection required for live results
              </div>
            )}
            {Array.isArray(results) ? (
              results.map((f, i) => <FlightCard key={i} flight={f} />)
            ) : (
              <FlightCard flight={results} />
            )}
          </div>
        )}

        {!searched && !loading && (
          <div
            style={{ textAlign: "center", padding: "30px 0", color: "#94a3b8" }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
            <div style={{ fontSize: 14 }}>
              Enter a flight number or route to get live status
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          padding: "12px 24px",
          borderTop: "1px solid #f1f5f9",
          background: "#f8fafc",
          fontSize: 11,
          color: "#94a3b8",
        }}
      >
        Source: FlightAware AeroAPI (flightaware.com/aeroapi) · FAA NASSTATUS
      </div>
    </div>
  );
}

function FlightCard({ flight }) {
  const statusColors = {
    "On Time": { bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d" },
    Delayed: { bg: "#fff8e1", border: "#ffe082", text: "#b45309" },
    Cancelled: { bg: "#fef2f2", border: "#fecaca", text: "#991b1b" },
    "In Air": { bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af" },
    Landed: { bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d" },
  };
  const sc = statusColors[flight.status] || {
    bg: "#f8fafc",
    border: "#e2e8f0",
    text: "#475569",
  };

  return (
    <div
      style={{
        border: `1px solid ${sc.border}`,
        borderRadius: 14,
        background: sc.bg,
        padding: "16px 18px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <div>
          <span
            style={{
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: "-0.01em",
              color: "#0f172a",
              fontFamily: "monospace",
            }}
          >
            {flight.flightNumber}
          </span>
          {flight.airline && (
            <span style={{ marginLeft: 8, fontSize: 13, color: "#64748b" }}>
              {flight.airline}
            </span>
          )}
        </div>
        <Badge label={flight.status} status={flight.status} />
      </div>

      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Origin */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontWeight: 800,
              fontSize: 22,
              fontFamily: "monospace",
              color: "#0f172a",
            }}
          >
            {flight.origin}
          </div>
          {flight.departureTime && (
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
              {flight.departureTime}
            </div>
          )}
          {flight.departureActual && (
            <div style={{ fontSize: 11, color: sc.text }}>
              Actual: {flight.departureActual}
            </div>
          )}
        </div>

        {/* Flight path visual */}
        <div
          style={{
            flex: 1,
            minWidth: 60,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div style={{ flex: 1, height: 1, background: "#cbd5e1" }} />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#64748b">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4c-2 0-4 2-4 2l-8.5-1.5-3.5 3.5L11 9.5" />
          </svg>
          <div style={{ flex: 1, height: 1, background: "#cbd5e1" }} />
        </div>

        {/* Destination */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontWeight: 800,
              fontSize: 22,
              fontFamily: "monospace",
              color: "#0f172a",
            }}
          >
            {flight.destination}
          </div>
          {flight.arrivalTime && (
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
              {flight.arrivalTime}
            </div>
          )}
          {flight.arrivalActual && (
            <div style={{ fontSize: 11, color: sc.text }}>
              Actual: {flight.arrivalActual}
            </div>
          )}
        </div>
      </div>

      {flight.delay && (
        <div
          style={{
            marginTop: 12,
            padding: "8px 12px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(0,0,0,0.05)",
            fontSize: 12,
            color: sc.text,
            fontWeight: 500,
          }}
        >
          ⏱ {flight.delay} delay · {flight.delayReason || "No reason given"}
        </div>
      )}

      {flight.gate && (
        <div style={{ marginTop: 8, fontSize: 12, color: "#64748b" }}>
          Gate: <strong>{flight.gate}</strong>
          {flight.terminal && (
            <>
              {" "}
              · Terminal: <strong>{flight.terminal}</strong>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function generateFlightDemo(query) {
  const statuses = ["On Time", "Delayed", "In Air"];
  const airlines = [
    "United Airlines",
    "American Airlines",
    "Delta Air Lines",
    "Southwest Airlines",
  ];
  const airports = ["LAX", "JFK", "ORD", "ATL", "DFW", "SFO", "MIA", "SEA"];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  return {
    flightNumber: query.replace(/[^A-Z0-9]/g, "").toUpperCase() || "UA123",
    airline: airlines[Math.floor(Math.random() * airlines.length)],
    status,
    origin: airports[Math.floor(Math.random() * airports.length)],
    destination: airports[Math.floor(Math.random() * airports.length)],
    departureTime: "10:30 AM",
    arrivalTime: "3:45 PM",
    delay: status === "Delayed" ? "45 min" : null,
    delayReason: status === "Delayed" ? "Late arriving aircraft" : null,
    gate: "B" + Math.floor(Math.random() * 40 + 1),
    terminal: String(Math.floor(Math.random() * 4 + 1)),
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// 4. COMBINED DASHBOARD (export all together)
// ══════════════════════════════════════════════════════════════════════════════

export function TSABotDashboard() {
  const [activeTab, setActiveTab] = useState("delays");
  const tabs = [
    { id: "delays", label: "Airport Delays", icon: "✈" },
    { id: "waittimes", label: "TSA Wait Times", icon: "👥" },
    { id: "flights", label: "Flight Status", icon: "🔍" },
  ];

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 20,
          background: "#f1f5f9",
          borderRadius: 12,
          padding: 4,
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "10px 16px",
              background: activeTab === tab.id ? "#fff" : "transparent",
              border: "none",
              borderRadius: 9,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? "#0f172a" : "#64748b",
              boxShadow:
                activeTab === tab.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 14 }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Active component */}
      {activeTab === "delays" && <AirportDelayTracker />}
      {activeTab === "waittimes" && <TSAWaitTimes />}
      {activeTab === "flights" && <FlightStatusLookup />}
    </div>
  );
}

export default TSABotDashboard;
