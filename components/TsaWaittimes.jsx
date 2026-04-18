"use client";
import { useState, useEffect, useCallback, useRef } from "react";

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

function waitColor(mins) {
  const n = parseInt(mins) || 0;
  if (n < 15) return "var(--green)";
  if (n < 30) return "var(--accent2)";
  if (n < 45) return "var(--amber)";
  return "var(--red)";
}

function waitLabel(mins) {
  const n = parseInt(mins) || 0;
  if (n < 15) return { cls: "badge-green", text: "SHORT" };
  if (n < 30) return { cls: "badge-blue", text: "MODERATE" };
  if (n < 45) return { cls: "badge-amber", text: "BUSY" };
  return { cls: "badge-red", text: "LONG" };
}

export default function TSAWaitTimes({ onAvgWait, compact }) {
  const [airport, setAirport] = useState("LAX");
  const [input, setInput] = useState("LAX");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const timeoutRef = useRef(null);

  // Use ref for onAvgWait to prevent dependency changes
  const onAvgWaitRef = useRef(onAvgWait);
  useEffect(() => {
    onAvgWaitRef.current = onAvgWait;
  }, [onAvgWait]);

  const fetchWaits = useCallback(async (ap) => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          controller.abort();
          reject(new Error("Request timeout"));
        }, 10000);
      });

      // Race between fetch and timeout
      const fetchPromise = fetch(
        `/api/tsa/waittimes?airport=${encodeURIComponent(ap)}`,
        { signal: controller.signal }
      );

      const r = await Promise.race([fetchPromise, timeoutPromise]);

      // Clear timeout since fetch completed
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (!r.ok) throw new Error(`HTTP ${r.status}`);

      const j = await r.json();
      setData(j);

      const cps = j.data ?? j.checkpoints ?? [];
      if (cps.length && onAvgWaitRef.current) {
        const avg = Math.round(
          cps.reduce(
            (s, c) => s + (parseInt(c.waitMins || c.wait_minutes || 0) || 0),
            0
          ) / cps.length
        );
        onAvgWaitRef.current(`${avg} min`);
      }
    } catch (err) {
      // Don't set error if it was an abort
      if (err.name === "AbortError") {
        console.log("Request aborted");
        return;
      }

      setError("TSA feed unavailable");

      // demo fallback data
      const demoMap = {
        LAX: ["Terminal 1", "Terminal 2", "Terminal 3", "TBIT"],
        JFK: ["Terminal 1", "Terminal 4", "Terminal 5", "Terminal 8"],
        ORD: ["Terminal 1 H", "Terminal 2 F/G", "Terminal 3 K/L"],
        ATL: ["North", "South", "International"],
        DFW: ["Terminal A", "Terminal B", "Terminal C", "Terminal D"],
      };
      const names = demoMap[ap] || [
        "Checkpoint A",
        "Checkpoint B",
        "Checkpoint C",
      ];
      const demo = {
        data: names.map((n) => ({
          name: n,
          waitMins: String(Math.floor(Math.random() * 40 + 5)),
        })),
      };
      setData(demo);

      if (onAvgWaitRef.current) {
        onAvgWaitRef.current("~20 min");
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, []); // Empty dependency array - stable reference

  useEffect(() => {
    fetchWaits(airport);
  }, [airport, fetchWaits]); // fetchWaits is now stable

  const checkpoints = data?.data ?? data?.checkpoints ?? [];
  const avg = checkpoints.length
    ? Math.round(
        checkpoints.reduce(
          (s, c) => s + (parseInt(c.waitMins || c.wait_minutes || 0) || 0),
          0
        ) / checkpoints.length
      )
    : null;

  return (
    <div className="card">
      <div className="card-hd">
        <div className="card-hd-l">
          <div className="card-icon">
            <svg viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <div className="card-title">TSA Wait Times</div>
            <div className="card-sub">TSA MyTSA · {airport}</div>
          </div>
        </div>
        {avg !== null && (
          <span className={`badge ${waitLabel(avg).cls}`}>avg {avg} min</span>
        )}
      </div>

      {/* Airport selector */}
      <div className="ap-bar">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const c = input.trim().toUpperCase().slice(0, 3);
            if (c.length === 3) setAirport(c);
          }}
          style={{ display: "flex", gap: 6 }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            maxLength={3}
            placeholder="Airport code"
            style={{
              width: 110,
              fontFamily: "var(--mono)",
              fontWeight: 600,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              fontSize: 13,
            }}
          />
          <button
            type="submit"
            className="btn btn-accent"
            style={{ padding: "6px 12px" }}
          >
            CHECK
          </button>
        </form>
        <div className="ap-chips">
          {AIRPORTS.slice(0, compact ? 8 : 20).map((ap) => (
            <button
              key={ap}
              className={`ap-chip${airport === ap ? " active" : ""}`}
              onClick={() => {
                setInput(ap);
                setAirport(ap);
              }}
            >
              {ap}
            </button>
          ))}
        </div>
      </div>

      {/* Checkpoints */}
      <div className="cp-body">
        {loading && (
          <div className="loading-wrap">
            <div className="spinner" />
            <span>LOADING {airport} CHECKPOINTS…</span>
          </div>
        )}
        {error && !loading && (
          <div
            style={{ padding: "8px 16px", fontSize: 11, color: "var(--amber)" }}
          >
            ⚠ {error} — showing estimated data
          </div>
        )}
        {!loading && checkpoints.length === 0 && !error && (
          <div className="empty">No data for {airport}</div>
        )}
        {!loading &&
          checkpoints.map((cp, i) => {
            const mins =
              parseInt(cp.waitMins ?? cp.wait_minutes ?? cp.wait ?? 0) || 0;
            const pct = Math.min((mins / 60) * 100, 100);
            const col = waitColor(mins);
            const lbl = waitLabel(mins);
            return (
              <div
                key={i}
                className="cp-row"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="cp-meta">
                  <span className="cp-name">
                    {cp.name || cp.checkpointName || "Checkpoint"}
                  </span>
                  <span className={`badge ${lbl.cls}`} style={{ fontSize: 9 }}>
                    {lbl.text}
                  </span>
                </div>
                <div className="cp-bar-track">
                  <div
                    className="cp-bar-fill"
                    style={{ width: `${pct}%`, background: col }}
                  />
                </div>
                <div className="cp-val" style={{ color: col }}>
                  {mins}
                  <span style={{ fontSize: 9, color: "var(--text3)" }}>
                    {" "}
                    min
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      <style jsx>{`
        .ap-bar {
          padding: 10px 16px;
          border-bottom: 1px solid var(--border);
          background: var(--bg3);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .ap-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .ap-chip {
          padding: 3px 7px;
          border-radius: 5px;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text3);
          font-size: 10px;
          font-family: var(--mono);
          font-weight: 600;
          letter-spacing: 0.04em;
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
        .cp-body {
          padding: 8px 16px 14px;
        }
        .cp-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 0;
          border-bottom: 1px solid var(--border);
          animation: rowIn 0.25s ease both;
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
        .cp-row:last-child {
          border-bottom: none;
        }
        .cp-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 120px;
          flex-shrink: 0;
        }
        .cp-name {
          font-size: 11px;
          color: var(--text2);
        }
        .cp-bar-track {
          flex: 1;
          height: 4px;
          background: var(--bg4);
          border-radius: 2px;
          overflow: hidden;
        }
        .cp-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.5s ease;
        }
        .cp-val {
          font-family: var(--mono);
          font-size: 14px;
          font-weight: 600;
          min-width: 44px;
          text-align: right;
        }
      `}</style>
    </div>
  );
}
