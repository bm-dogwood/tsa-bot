"use client";

import { useState } from "react";

function Spinner({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ animation: "fltSpin 0.75s linear infinite", flexShrink: 0 }}
    >
      <style>{`@keyframes fltSpin{to{transform:rotate(360deg)}}`}</style>
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="#38b6ff"
        strokeWidth="2.5"
        strokeOpacity="0.2"
      />
      <path
        d="M12 3a9 9 0 0 1 9 9"
        fill="none"
        stroke="#38b6ff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const STATUS_MAP = {
  "On Time": {
    color: "#2ed573",
    bg: "rgba(46,213,115,0.1)",
    border: "rgba(46,213,115,0.2)",
    dot: "#2ed573",
  },
  Delayed: {
    color: "#ffa502",
    bg: "rgba(255,165,2,0.1)",
    border: "rgba(255,165,2,0.2)",
    dot: "#ffa502",
  },
  Cancelled: {
    color: "#ff4757",
    bg: "rgba(255,71,87,0.1)",
    border: "rgba(255,71,87,0.2)",
    dot: "#ff4757",
  },
  "In Air": {
    color: "#38b6ff",
    bg: "rgba(56,182,255,0.1)",
    border: "rgba(56,182,255,0.2)",
    dot: "#38b6ff",
  },
  Landed: {
    color: "#a29bfe",
    bg: "rgba(162,155,254,0.1)",
    border: "rgba(162,155,254,0.2)",
    dot: "#a29bfe",
  },
  Diverted: {
    color: "#fd79a8",
    bg: "rgba(253,121,168,0.1)",
    border: "rgba(253,121,168,0.2)",
    dot: "#fd79a8",
  },
};

function getStatusTheme(status = "") {
  for (const [k, v] of Object.entries(STATUS_MAP)) {
    if (status.toLowerCase().includes(k.toLowerCase())) return v;
  }
  return {
    color: "rgba(255,255,255,0.4)",
    bg: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.1)",
    dot: "rgba(255,255,255,0.4)",
  };
}

function FlightProgressBar({ pct = 0 }) {
  return (
    <div
      style={{
        position: "relative",
        height: 2,
        background: "rgba(255,255,255,0.08)",
        borderRadius: 1,
        margin: "10px 0",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: `${Math.min(pct, 100)}%`,
          background: "#38b6ff",
          borderRadius: 1,
          transition: "width 0.6s ease",
        }}
      />
      {pct > 0 && pct < 100 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${Math.min(pct, 95)}%`,
            transform: "translate(-50%, -50%)",
            width: 8,
            height: 8,
          }}
        >
          <svg viewBox="0 0 24 24" fill="#38b6ff" width="8" height="8">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4c-2 0-4 2-4 2l-8.5-1.5-3.5 3.5L11 9.5" />
          </svg>
        </div>
      )}
    </div>
  );
}

function FlightCard({ flight, index }) {
  const theme = getStatusTheme(flight.status);
  const pct = flight.progressPercent ?? 0;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.028)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderTop: `2px solid ${theme.color}`,
        borderRadius: 12,
        padding: "18px 20px",
        animation: `flt-card-in 0.35s ease ${index * 0.06}s both`,
      }}
    >
      <style>{`@keyframes flt-card-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>

      {/* Top row: flight # + status */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: 20,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.04em",
            }}
          >
            {flight.flightNumber ?? flight.ident}
          </span>
          {flight.airline && (
            <span
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.35)",
                fontWeight: 500,
              }}
            >
              {flight.airline}
            </span>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 20,
            background: theme.bg,
            border: `1px solid ${theme.border}`,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: theme.dot,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: theme.color,
            }}
          >
            {flight.status ?? "UNKNOWN"}
          </span>
        </div>
      </div>

      {/* Route row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 2,
        }}
      >
        {/* Origin */}
        <div style={{ textAlign: "center", minWidth: 56 }}>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 24,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}
          >
            {flight.origin}
          </div>
          {flight.departureTime && (
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                marginTop: 3,
              }}
            >
              {flight.departureTime}
            </div>
          )}
          {flight.departureActual && (
            <div style={{ fontSize: 10, color: theme.color, marginTop: 1 }}>
              Act: {flight.departureActual}
            </div>
          )}
        </div>

        {/* Path */}
        <div style={{ flex: 1 }}>
          {pct > 0 ? (
            <FlightProgressBar pct={pct} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,0.12)",
                }}
              />
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="rgba(255,255,255,0.3)"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,0.12)",
                }}
              />
            </div>
          )}
          {flight.aircraft && (
            <div
              style={{
                textAlign: "center",
                fontSize: 10,
                color: "rgba(255,255,255,0.2)",
                marginTop: 4,
                fontFamily: "monospace",
              }}
            >
              {flight.aircraft}
            </div>
          )}
        </div>

        {/* Destination */}
        <div style={{ textAlign: "center", minWidth: 56 }}>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 24,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}
          >
            {flight.destination}
          </div>
          {flight.arrivalTime && (
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                marginTop: 3,
              }}
            >
              {flight.arrivalTime}
            </div>
          )}
          {flight.arrivalActual && (
            <div style={{ fontSize: 10, color: theme.color, marginTop: 1 }}>
              Act: {flight.arrivalActual}
            </div>
          )}
        </div>
      </div>

      {/* Delay + Gate row */}
      {(flight.delay || flight.gate || flight.terminal) && (
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 12,
            flexWrap: "wrap",
          }}
        >
          {flight.delay && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 10px",
                borderRadius: 6,
                background: "rgba(255,165,2,0.1)",
                border: "1px solid rgba(255,165,2,0.2)",
                fontSize: 11,
                color: "#ffa502",
                fontWeight: 600,
              }}
            >
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
              {flight.delay} delay
              {flight.delayReason && (
                <span style={{ opacity: 0.7, fontWeight: 400 }}>
                  {" "}
                  · {flight.delayReason}
                </span>
              )}
            </div>
          )}
          {flight.gate && (
            <div
              style={{
                padding: "5px 10px",
                borderRadius: 6,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
                fontWeight: 600,
                fontFamily: "monospace",
              }}
            >
              GATE {flight.gate}
              {flight.terminal && (
                <span style={{ opacity: 0.6 }}> · TERM {flight.terminal}</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FlightStatusLookup() {
  const [mode, setMode] = useState("flight"); // "flight" | "route"
  const [flightNum, setFlightNum] = useState("");
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
    setResults(null);
    try {
      let url;
      if (mode === "flight") {
        if (!flightNum.trim()) throw new Error("Enter a flight number");
        // → /api/flight/status?flight=UA123 → normalizeFlight(data.flights[0])
        url = `/api/flight/status?flight=${encodeURIComponent(
          flightNum.trim().toUpperCase()
        )}`;
      } else {
        if (!origin.trim() || !dest.trim())
          throw new Error("Enter both airports");
        // → /api/flight/search?origin=LAX&dest=JFK → data.departures[]
        url = `/api/flight/search?origin=${origin
          .trim()
          .toUpperCase()}&dest=${dest.trim().toUpperCase()}`;
      }

      const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      // Normalize: single flight or array
      if (Array.isArray(json)) {
        setResults(json.slice(0, 10));
      } else if (json.departures) {
        setResults(json.departures.slice(0, 10));
      } else if (json.flights) {
        setResults(json.flights.slice(0, 10));
      } else {
        setResults([json]);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const flights = Array.isArray(results) ? results : results ? [results] : [];

  return (
    <div
      style={{
        background: "#0a0f1e",
        borderRadius: 20,
        border: "1px solid rgba(56,182,255,0.12)",
        overflow: "hidden",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.04), 0 24px 64px rgba(0,0,0,0.6)",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: "20px 24px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background:
            "linear-gradient(135deg, rgba(56,182,255,0.07) 0%, transparent 60%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(56,182,255,0.12)",
              border: "1px solid rgba(56,182,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#38b6ff"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <span
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            Flight Status Lookup
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
          FlightAware AeroAPI · aeroapi.flightaware.com
        </p>
      </div>

      {/* ── Mode toggle ── */}
      <div style={{ padding: "14px 24px 0", display: "flex", gap: 6 }}>
        {[
          { id: "flight", icon: "✈", label: "Flight #" },
          { id: "route", icon: "🗺", label: "Route" },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.04em",
              background:
                mode === m.id
                  ? "rgba(56,182,255,0.15)"
                  : "rgba(255,255,255,0.04)",
              color: mode === m.id ? "#38b6ff" : "rgba(255,255,255,0.4)",
              border: `1px solid ${
                mode === m.id
                  ? "rgba(56,182,255,0.3)"
                  : "rgba(255,255,255,0.07)"
              }`,
              transition: "all 0.15s",
            }}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* ── Search form ── */}
      <div
        style={{
          padding: "14px 24px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <form
          onSubmit={handleSearch}
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {mode === "flight" ? (
            <input
              type="text"
              placeholder="Flight number (UA123, AA456…)"
              value={flightNum}
              onChange={(e) => setFlightNum(e.target.value.toUpperCase())}
              style={{
                flex: 1,
                minWidth: 180,
                padding: "10px 14px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 9,
                color: "#fff",
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                outline: "none",
              }}
            />
          ) : (
            <>
              <input
                type="text"
                placeholder="FROM"
                maxLength={3}
                value={origin}
                onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                style={{
                  width: 80,
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 9,
                  color: "#fff",
                  fontSize: 15,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textAlign: "center",
                  textTransform: "uppercase",
                  outline: "none",
                }}
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <input
                type="text"
                placeholder="TO"
                maxLength={3}
                value={dest}
                onChange={(e) => setDest(e.target.value.toUpperCase())}
                style={{
                  width: 80,
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 9,
                  color: "#fff",
                  fontSize: 15,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textAlign: "center",
                  textTransform: "uppercase",
                  outline: "none",
                }}
              />
            </>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 22px",
              background: "rgba(56,182,255,0.15)",
              border: "1px solid rgba(56,182,255,0.3)",
              borderRadius: 9,
              color: "#38b6ff",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.06em",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            {loading ? (
              <Spinner size={13} />
            ) : (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            )}
            SEARCH
          </button>
        </form>
      </div>

      {/* ── Results ── */}
      <div style={{ padding: "16px 24px 20px", minHeight: 160 }}>
        {loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "36px 0",
              gap: 12,
            }}
          >
            <Spinner size={28} />
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.3)",
                fontSize: 12,
                letterSpacing: "0.06em",
              }}
            >
              QUERYING FLIGHTAWARE AEROAPI…
            </p>
          </div>
        )}

        {error && !loading && (
          <div
            style={{
              background: "rgba(255,71,87,0.08)",
              border: "1px solid rgba(255,71,87,0.2)",
              borderRadius: 12,
              padding: "14px 18px",
              color: "rgba(255,71,87,0.8)",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {!loading && searched && flights.length === 0 && !error && (
          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
              color: "rgba(255,255,255,0.3)",
              fontSize: 13,
            }}
          >
            No flights found. Check the flight number and try again.
          </div>
        )}

        {!loading && !searched && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                margin: "0 auto 12px",
                background: "rgba(56,182,255,0.07)",
                border: "1px solid rgba(56,182,255,0.15)",
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
                stroke="#38b6ff"
                strokeWidth="1.5"
                strokeOpacity="0.5"
              >
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4c-2 0-4 2-4 2l-8.5-1.5-3.5 3.5L11 9.5" />
              </svg>
            </div>
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.25)",
                fontSize: 13,
              }}
            >
              Enter a flight number or route to check live status
            </p>
          </div>
        )}

        {!loading && flights.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {flights.map((f, i) => (
              <FlightCard key={i} flight={f} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
