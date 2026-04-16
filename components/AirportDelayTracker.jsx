"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Shared design tokens ─────────────────────────────────────────────────────
// Dark aviation aesthetic: deep navy bg, amber/green accents, monospace data

const DELAY_TYPES = {
  "Ground Stop": {
    color: "#ff4757",
    glow: "rgba(255,71,87,0.3)",
    dot: "#ff4757",
    label: "GND STOP",
  },
  "Ground Delay": {
    color: "#ffa502",
    glow: "rgba(255,165,2,0.3)",
    dot: "#ffa502",
    label: "GND DELAY",
  },
  Delay: {
    color: "#ffa502",
    glow: "rgba(255,165,2,0.3)",
    dot: "#ffa502",
    label: "DELAY",
  },
  Closure: {
    color: "#a29bfe",
    glow: "rgba(162,155,254,0.3)",
    dot: "#a29bfe",
    label: "CLOSURE",
  },
  Normal: {
    color: "#2ed573",
    glow: "rgba(46,213,115,0.3)",
    dot: "#2ed573",
    label: "NORMAL",
  },
};

function getDelayStyle(type = "") {
  for (const [key, val] of Object.entries(DELAY_TYPES)) {
    if (type.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return DELAY_TYPES["Delay"];
}

function PulseDot({ color, glow }) {
  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        width: 10,
        height: 10,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: color,
          opacity: 0.4,
          animation: "tsaPulse 1.8s ease-out infinite",
        }}
      />
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: color,
          position: "relative",
        }}
      />
      <style>{`@keyframes tsaPulse{0%{transform:scale(1);opacity:.4}70%{transform:scale(2.2);opacity:0}100%{transform:scale(2.2);opacity:0}}`}</style>
    </span>
  );
}

function Spinner({ size = 18, color = "#38b6ff" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ animation: "tsaSpin 0.75s linear infinite", flexShrink: 0 }}
    >
      <style>{`@keyframes tsaSpin{to{transform:rotate(360deg)}}`}</style>
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeOpacity="0.2"
      />
      <path
        d="M12 3a9 9 0 0 1 9 9"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AirportDelayTracker() {
  const [delays, setDelays] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const timerRef = useRef(null);

  const fetchDelays = useCallback(async (airport) => {
    setError(null);
    try {
      const url = airport
        ? `/api/faa/delays?airport=${encodeURIComponent(airport)}`
        : "/api/faa/delays";
      const res = await fetch(url, { signal: AbortSignal.timeout(9000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const data = json.data ?? json ?? [];
      setDelays(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
      setFadeIn(false);
      requestAnimationFrame(() => setFadeIn(true));
    } catch (e) {
      setError(e.message || "Unable to reach FAA status feed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDelays();
    timerRef.current = setInterval(() => fetchDelays(), 5 * 60 * 1000);
    return () => clearInterval(timerRef.current);
  }, [fetchDelays]);

  // Apply filters
  useEffect(() => {
    let out = delays;
    if (search.trim()) {
      const q = search.trim().toUpperCase();
      out = out.filter(
        (d) =>
          (d.airport || "").toUpperCase().includes(q) ||
          (d.reason || "").toUpperCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      out = out.filter((d) =>
        (d.type || "").toLowerCase().includes(statusFilter.toLowerCase())
      );
    }
    setFiltered(out);
  }, [delays, search, statusFilter]);

  const counts = {
    all: delays.length,
    ground: delays.filter((d) =>
      (d.type || "").toLowerCase().includes("ground")
    ).length,
    delay: delays.filter((d) => (d.type || "").toLowerCase().includes("delay"))
      .length,
    closure: delays.filter((d) => (d.type || "").toLowerCase().includes("clos"))
      .length,
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
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4c-2 0-4 2-4 2l-8.5-1.5-3.5 3.5L11 9.5" />
                <path d="m5 19 1.5-1.5M8 16.5l5 5M3 19l1.5-1.5" />
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
              Airport Delay Tracker
            </span>
            {!loading && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  padding: "2px 8px",
                  borderRadius: 20,
                  background:
                    delays.length === 0
                      ? "rgba(46,213,115,0.15)"
                      : "rgba(255,165,2,0.15)",
                  color: delays.length === 0 ? "#2ed573" : "#ffa502",
                  border: `1px solid ${
                    delays.length === 0
                      ? "rgba(46,213,115,0.3)"
                      : "rgba(255,165,2,0.3)"
                  }`,
                }}
              >
                {delays.length === 0 ? "ALL CLEAR" : `${delays.length} ACTIVE`}
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
            FAA ATCSCC · nasstatus.faa.gov
            {lastUpdated &&
              ` · ${lastUpdated.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`}
          </p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            fetchDelays();
          }}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 14px",
            borderRadius: 8,
            cursor: loading ? "not-allowed" : "pointer",
            background: "rgba(56,182,255,0.08)",
            border: "1px solid rgba(56,182,255,0.18)",
            color: "#38b6ff",
            fontSize: 12,
            fontWeight: 600,
            opacity: loading ? 0.5 : 1,
            transition: "all 0.15s",
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
              <path d="M3 12a9 9 0 0 1 15-6.7L21 9M21 3v6h-6M21 12a9 9 0 0 1-15 6.7L3 15M3 21v-6h6" />
            </svg>
          )}
          REFRESH
        </button>
      </div>

      {/* ── Filters ── */}
      <div
        style={{
          padding: "14px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 180px", minWidth: 140 }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            style={{
              position: "absolute",
              left: 11,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            placeholder="Airport code…"
            value={search}
            onChange={(e) => setSearch(e.target.value.toUpperCase())}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "8px 12px 8px 32px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              color: "#fff",
              fontSize: 13,
              outline: "none",
              fontFamily: "inherit",
              letterSpacing: "0.05em",
            }}
          />
        </div>
        {/* Status pills */}
        {[
          { key: "all", label: "All", count: counts.all },
          { key: "ground", label: "Ground", count: counts.ground },
          { key: "delay", label: "Delays", count: counts.delay },
          { key: "closure", label: "Closures", count: counts.closure },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            style={{
              padding: "7px 12px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.03em",
              background:
                statusFilter === f.key
                  ? "rgba(56,182,255,0.15)"
                  : "rgba(255,255,255,0.04)",
              color:
                statusFilter === f.key ? "#38b6ff" : "rgba(255,255,255,0.4)",
              border: `1px solid ${
                statusFilter === f.key
                  ? "rgba(56,182,255,0.3)"
                  : "rgba(255,255,255,0.06)"
              }`,
              transition: "all 0.15s",
            }}
          >
            {f.label}
            {f.count > 0 && (
              <span
                style={{
                  marginLeft: 5,
                  fontSize: 10,
                  padding: "1px 5px",
                  borderRadius: 10,
                  background:
                    statusFilter === f.key
                      ? "rgba(56,182,255,0.25)"
                      : "rgba(255,255,255,0.08)",
                  color:
                    statusFilter === f.key
                      ? "#38b6ff"
                      : "rgba(255,255,255,0.3)",
                }}
              >
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{ padding: "16px 24px 20px", minHeight: 200 }}>
        {loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "40px 0",
              gap: 14,
            }}
          >
            <Spinner size={30} />
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.3)",
                fontSize: 13,
                letterSpacing: "0.05em",
              }}
            >
              QUERYING FAA ATCSCC…
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
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ff4757"
              strokeWidth="2"
              style={{ flexShrink: 0, marginTop: 1 }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <p
                style={{
                  margin: "0 0 2px",
                  color: "#ff4757",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Connection failed
              </p>
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,71,87,0.7)",
                  fontSize: 12,
                }}
              >
                {error}
              </p>
            </div>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "36px 0" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                margin: "0 auto 16px",
                background: "rgba(46,213,115,0.1)",
                border: "1px solid rgba(46,213,115,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2ed573"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p
              style={{
                margin: "0 0 4px",
                color: "#2ed573",
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              {search || statusFilter !== "all"
                ? "No results"
                : "No Active Delays"}
            </p>
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.25)",
                fontSize: 12,
              }}
            >
              {search || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "All systems operating normally per FAA ATCSCC"}
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              opacity: fadeIn ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            {filtered.map((item, i) => (
              <DelayRow key={i} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DelayRow({ item, index }) {
  const s = getDelayStyle(item.type);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "72px 1fr auto",
        gap: 14,
        alignItems: "center",
        padding: "13px 16px",
        background: "rgba(255,255,255,0.028)",
        border: `1px solid rgba(255,255,255,0.06)`,
        borderLeft: `3px solid ${s.color}`,
        borderRadius: 10,
        animation: `tsa-row-in 0.3s ease ${index * 0.04}s both`,
      }}
    >
      <style>{`@keyframes tsa-row-in{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}`}</style>

      {/* Airport code */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span
          style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: 18,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          {item.airport}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <PulseDot color={s.color} />
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: s.color,
            }}
          >
            {s.label}
          </span>
        </div>
      </div>

      {/* Reason */}
      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: "rgba(255,255,255,0.55)",
          lineHeight: 1.5,
        }}
      >
        {item.reason || "General advisory"}
      </p>

      {/* Delay time */}
      {item.avgDelay ? (
        <div
          style={{
            textAlign: "center",
            background: `rgba(${
              s.color === "#ffa502" ? "255,165,2" : "255,71,87"
            },0.1)`,
            border: `1px solid ${s.color}30`,
            borderRadius: 8,
            padding: "6px 12px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: s.color,
              fontFamily: "monospace",
              lineHeight: 1,
            }}
          >
            {item.avgDelay}
          </div>
          <div
            style={{
              fontSize: 9,
              color: s.color,
              opacity: 0.7,
              letterSpacing: "0.06em",
              marginTop: 2,
            }}
          >
            MIN
          </div>
        </div>
      ) : null}
    </div>
  );
}
