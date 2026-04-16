"use client";

import { useState, useEffect, useCallback } from "react";

const AIRPORTS = [
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

function Spinner({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ animation: "tsaSpin2 0.75s linear infinite", flexShrink: 0 }}
    >
      <style>{`@keyframes tsaSpin2{to{transform:rotate(360deg)}}`}</style>
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

// Color scheme based on wait time
function getWaitTheme(mins) {
  const n = parseInt(mins) || 0;
  if (n < 10)
    return {
      bar: "#2ed573",
      bg: "rgba(46,213,115,0.08)",
      border: "rgba(46,213,115,0.2)",
      text: "#2ed573",
      label: "SHORT",
    };
  if (n < 20)
    return {
      bar: "#38b6ff",
      bg: "rgba(56,182,255,0.08)",
      border: "rgba(56,182,255,0.2)",
      text: "#38b6ff",
      label: "MODERATE",
    };
  if (n < 35)
    return {
      bar: "#ffa502",
      bg: "rgba(255,165,2,0.08)",
      border: "rgba(255,165,2,0.2)",
      text: "#ffa502",
      label: "BUSY",
    };
  return {
    bar: "#ff4757",
    bg: "rgba(255,71,87,0.08)",
    border: "rgba(255,71,87,0.2)",
    text: "#ff4757",
    label: "LONG",
  };
}

export default function TSAWaitTimes() {
  const [airport, setAirport] = useState("LAX");
  const [inputVal, setInputVal] = useState("LAX");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWaits = useCallback(async (ap) => {
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
      const json = await res.json();
      // Your API returns { airport, data: [...checkpoints] }
      setData(json);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWaits(airport);
  }, [airport, fetchWaits]);

  const checkpoints = data?.data ?? [];
  // After line ~125 where you render the header, add:
  {
    data?.fallback && (
      <div
        style={{
          marginTop: 4,
          fontSize: 11,
          color: "#ffa502",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span>⚠️</span>
        <span>Using estimated wait times (TSA feed unavailable)</span>
      </div>
    );
  }
  {
    data?.cached && !data?.fallback && (
      <div
        style={{
          marginTop: 4,
          fontSize: 11,
          color: "#38b6ff",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span>📦</span>
        <span>Cached data {data?.stale ? "(stale)" : ""}</span>
      </div>
    );
  }
  // Compute average wait
  const avgWait =
    checkpoints.length > 0
      ? Math.round(
          checkpoints.reduce(
            (s, c) => s + (parseInt(c.waitMins || c.wait_minutes || 0) || 0),
            0
          ) / checkpoints.length
        )
      : null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    const code = inputVal.trim().toUpperCase().slice(0, 3);
    if (code.length === 3) setAirport(code);
  };

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
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, rgba(56,182,255,0.07) 0%, transparent 60%)",
        }}
      >
        <div>
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
                strokeLinecap="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
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
              TSA Wait Times
            </span>
            {avgWait !== null && !loading && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  padding: "2px 8px",
                  borderRadius: 20,
                  background: getWaitTheme(avgWait).bg,
                  color: getWaitTheme(avgWait).text,
                  border: `1px solid ${getWaitTheme(avgWait).border}`,
                }}
              >
                AVG {avgWait} MIN
              </span>
            )}
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.02em",
            }}
          >
            TSA MyTSA · apps.tsa.dhs.gov
            {lastUpdated &&
              ` · ${lastUpdated.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`}
          </p>
        </div>
      </div>

      {/* ── Search + Airport Selector ── */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", gap: 8, marginBottom: 12 }}
        >
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              maxLength={3}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value.toUpperCase())}
              placeholder="Enter airport code"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 14px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 9,
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.1em",
                outline: "none",
                fontFamily: "monospace",
                textTransform: "uppercase",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              background: "rgba(56,182,255,0.15)",
              border: "1px solid rgba(56,182,255,0.3)",
              borderRadius: 9,
              color: "#38b6ff",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.06em",
              cursor: "pointer",
            }}
          >
            CHECK
          </button>
        </form>

        {/* Quick-select airport grid */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {AIRPORTS.map((ap) => (
            <button
              key={ap}
              onClick={() => {
                setInputVal(ap);
                setAirport(ap);
              }}
              style={{
                padding: "4px 9px",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.05em",
                fontFamily: "monospace",
                background:
                  airport === ap
                    ? "rgba(56,182,255,0.2)"
                    : "rgba(255,255,255,0.04)",
                color: airport === ap ? "#38b6ff" : "rgba(255,255,255,0.35)",
                border: `1px solid ${
                  airport === ap
                    ? "rgba(56,182,255,0.35)"
                    : "rgba(255,255,255,0.07)"
                }`,
                transition: "all 0.12s",
              }}
            >
              {ap}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results ── */}
      <div style={{ padding: "16px 24px 20px", minHeight: 180 }}>
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
              LOADING {airport} CHECKPOINTS…
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
            Failed to load wait times — {error}
          </div>
        )}

        {!loading && !error && checkpoints.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <p
              style={{
                margin: "0 0 4px",
                color: "rgba(255,255,255,0.4)",
                fontSize: 14,
              }}
            >
              No checkpoint data for {airport}
            </p>
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.2)",
                fontSize: 12,
              }}
            >
              This airport may not report to TSA MyTSA
            </p>
          </div>
        )}

        {!loading && checkpoints.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 10,
            }}
          >
            {checkpoints.map((cp, i) => {
              const waitMins =
                parseInt(cp.waitMins ?? cp.wait_minutes ?? cp.wait ?? 0) || 0;
              const theme = getWaitTheme(waitMins);
              const pct = Math.min((waitMins / 60) * 100, 100);
              return (
                <div
                  key={i}
                  style={{
                    background: theme.bg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 12,
                    padding: "16px",
                    animation: `tsa-cp-in 0.3s ease ${i * 0.05}s both`,
                  }}
                >
                  <style>{`@keyframes tsa-cp-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.7)",
                        letterSpacing: "0.02em",
                        lineHeight: 1.3,
                        flex: 1,
                        paddingRight: 8,
                      }}
                    >
                      {cp.name || cp.checkpointName || "Checkpoint"}
                    </p>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: `${theme.bar}22`,
                        color: theme.text,
                        border: `1px solid ${theme.border}`,
                        flexShrink: 0,
                      }}
                    >
                      {theme.label}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 4,
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 38,
                        fontWeight: 800,
                        lineHeight: 1,
                        color: theme.text,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                      }}
                    >
                      {waitMins}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.35)",
                        fontWeight: 500,
                      }}
                    >
                      min
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{
                      height: 3,
                      background: "rgba(255,255,255,0.07)",
                      borderRadius: 2,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: theme.bar,
                        borderRadius: 2,
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>

                  {(cp.precheck ||
                    cp.status?.toLowerCase().includes("precheck")) && (
                    <div
                      style={{
                        marginTop: 8,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        color: "rgba(255,255,255,0.4)",
                        fontSize: 11,
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
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      TSA PreCheck available
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
