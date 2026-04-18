"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";

const TYPE_META = {
  "Ground Stop": { badge: "badge-red", dot: "dot-red", label: "GND STOP" },
  "Ground Delay": {
    badge: "badge-amber",
    dot: "dot-amber",
    label: "GND DELAY",
  },
  Delay: { badge: "badge-amber", dot: "dot-amber", label: "DELAY" },
  Closure: { badge: "badge-purple", dot: "dot-blue", label: "CLOSURE" },
};

function getMeta(type = "") {
  for (const [k, v] of Object.entries(TYPE_META))
    if (type.toLowerCase().includes(k.toLowerCase())) return v;
  return TYPE_META["Delay"];
}

export default function DelayTracker({ onStatsUpdate, compact }) {
  const [delays, setDelays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [lastUpdated, setLastUpdated] = useState(null);
  const timerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const timeoutRef = useRef(null);

  // Use a ref to store the onStatsUpdate callback to prevent dependency changes
  const onStatsUpdateRef = useRef(onStatsUpdate);
  useEffect(() => {
    onStatsUpdateRef.current = onStatsUpdate;
  }, [onStatsUpdate]);

  const fetchDelays = useCallback(async () => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setError(null);

    try {
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          controller.abort();
          reject(new Error("Request timeout"));
        }, 9000);
      });

      // Race between fetch and timeout
      const fetchPromise = fetch("/api/faa/delays", {
        signal: controller.signal,
      });

      const r = await Promise.race([fetchPromise, timeoutPromise]);

      // Clear timeout since fetch completed
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (!r.ok) {
        throw new Error(`HTTP ${r.status}: ${r.statusText}`);
      }

      const j = await r.json();
      const data = Array.isArray(j.data) ? j.data : Array.isArray(j) ? j : [];
      setDelays(data);
      setLastUpdated(new Date());

      // Use the ref instead of the prop directly
      if (onStatsUpdateRef.current) {
        const gs = data.filter((d) =>
          (d.type || "").toLowerCase().includes("ground stop")
        ).length;
        onStatsUpdateRef.current(data.length, gs);
      }
    } catch (err) {
      // Don't set error if it was an abort
      if (err.name === "AbortError") {
        console.log("Request aborted");
        return;
      }

      console.error("FAA delay fetch error:", err);
      setError(
        err.message?.includes("timeout")
          ? "FAA feed timeout - please try again"
          : "Unable to reach FAA ATCSCC feed"
      );
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, []); // Empty dependency array - function doesn't depend on any props/state

  useEffect(() => {
    fetchDelays();
    timerRef.current = setInterval(fetchDelays, 5 * 60 * 1000);

    return () => {
      clearInterval(timerRef.current);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [fetchDelays]); // fetchDelays is stable now

  // Memoize filtered results
  const filtered = useMemo(() => {
    return delays.filter((d) => {
      const q = search.toUpperCase();
      const matchQ =
        !q ||
        (d.airport || "").toUpperCase().includes(q) ||
        (d.reason || "").toUpperCase().includes(q);

      const matchF =
        filter === "all" ||
        (filter === "ground" &&
          (d.type || "").toLowerCase().includes("ground")) ||
        (filter === "delay" &&
          (d.type || "").toLowerCase().includes("delay")) ||
        (filter === "closure" && (d.type || "").toLowerCase().includes("clos"));

      return matchQ && matchF;
    });
  }, [delays, search, filter]);

  const FILTERS = [
    { key: "all", label: "All" },
    { key: "ground", label: "Ground" },
    { key: "delay", label: "Delays" },
    { key: "closure", label: "Closures" },
  ];

  const handleRefresh = () => {
    setLoading(true);
    fetchDelays();
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value.toUpperCase());
  };

  return (
    <div className="card" role="region" aria-label="FAA Delay Tracker">
      <div className="card-hd">
        <div className="card-hd-l">
          <div className="card-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4c-2 0-4 2-4 2l-8.5-1.5-3.5 3.5L11 9.5" />
              <path d="m5 19 1.5-1.5M8 16.5l5 5" />
            </svg>
          </div>
          <div>
            <h2 className="card-title">FAA Delay Tracker</h2>
            <div className="card-sub" aria-live="polite">
              nasstatus.faa.gov
              {lastUpdated &&
                ` · ${lastUpdated.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {!loading && (
            <span
              className={
                delays.length === 0 ? "badge badge-green" : "badge badge-amber"
              }
              role="status"
              aria-label={`${delays.length} active delays`}
            >
              {delays.length === 0 ? "ALL CLEAR" : `${delays.length} ACTIVE`}
            </span>
          )}
          <button
            className="btn"
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Refresh delay data"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 12a9 9 0 0 1 15-6.7L21 9M21 3v6h-6M21 12a9 9 0 0 1-15 6.7L3 15M3 21v-6h6" />
            </svg>
            REFRESH
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar" role="search">
        <label htmlFor="airport-search" className="sr-only">
          Search airport
        </label>
        <input
          id="airport-search"
          className="filter-search"
          placeholder="Search airport…"
          value={search}
          onChange={handleSearchChange}
          aria-label="Filter delays by airport code or reason"
        />
        <div
          className="filter-pills"
          role="tablist"
          aria-label="Filter delay types"
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`pill${filter === f.key ? " active" : ""}`}
              onClick={() => setFilter(f.key)}
              role="tab"
              aria-selected={filter === f.key}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="delay-list" role="feed" aria-busy={loading}>
        {loading && (
          <div className="loading-wrap" role="status">
            <div className="spinner" aria-hidden="true" />
            <span>QUERYING FAA ATCSCC…</span>
          </div>
        )}
        {error && !loading && (
          <div className="err-box" role="alert">
            {error}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="empty" role="status">
            {delays.length === 0 ? (
              <>
                <span
                  style={{
                    color: "var(--green)",
                    fontSize: 15,
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  All systems normal
                </span>
                No active delays per FAA ATCSCC
              </>
            ) : (
              "No results — try adjusting filters"
            )}
          </div>
        )}
        {!loading &&
          filtered.map((item, i) => {
            const meta = getMeta(item.type);
            return (
              <article
                key={`${item.airport}-${i}`}
                className="delay-row"
                style={{ animationDelay: `${i * 30}ms` }}
                aria-label={`${item.airport} - ${meta.label}: ${
                  item.reason || "General advisory"
                }`}
              >
                <span className={`dot ${meta.dot}`} aria-hidden="true" />
                <div className="dl-code">{item.airport}</div>
                <div className="dl-body">
                  <span
                    className={`badge ${meta.badge}`}
                    style={{
                      fontSize: 9,
                      marginBottom: 3,
                      display: "inline-flex",
                    }}
                  >
                    {meta.label}
                  </span>
                  <div className="dl-reason">
                    {item.reason || "General advisory"}
                  </div>
                </div>
                {item.avgDelay && (
                  <div
                    className="dl-delay"
                    aria-label={`Average delay ${item.avgDelay} minutes`}
                  >
                    <div className="dl-min">{item.avgDelay}</div>
                    <div className="dl-min-label">min</div>
                  </div>
                )}
              </article>
            );
          })}
      </div>

      <style jsx>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
        .filter-bar {
          padding: 10px 18px;
          border-bottom: 1px solid var(--border);
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
          background: var(--bg3);
        }
        .filter-search {
          flex: 1;
          min-width: 120px;
          max-width: 200px;
          font-family: var(--mono);
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 6px 10px;
        }
        .filter-pills {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .pill {
          padding: 4px 10px;
          border-radius: 20px;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text3);
          font-size: 11px;
          font-weight: 600;
          font-family: var(--sans);
          cursor: pointer;
          transition: all 0.15s;
        }
        .pill:hover {
          border-color: var(--border2);
          color: var(--text2);
        }
        .pill.active {
          background: rgba(79, 142, 247, 0.12);
          border-color: rgba(79, 142, 247, 0.3);
          color: var(--accent2);
        }
        .delay-list {
          max-height: ${compact ? "280px" : "460px"};
          overflow-y: auto;
        }
        .delay-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 18px;
          border-bottom: 1px solid var(--border);
          transition: background 0.1s;
          cursor: default;
          animation: rowIn 0.25s ease both;
        }
        @keyframes rowIn {
          from {
            opacity: 0;
            transform: translateX(-6px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .delay-row:hover {
          background: var(--bg3);
        }
        .delay-row:last-child {
          border-bottom: none;
        }
        .dl-code {
          font-family: var(--mono);
          font-size: 15px;
          font-weight: 600;
          color: var(--text);
          min-width: 40px;
        }
        .dl-body {
          flex: 1;
          min-width: 0;
        }
        .dl-reason {
          font-size: 12px;
          color: var(--text2);
          line-height: 1.4;
        }
        .dl-delay {
          text-align: right;
          flex-shrink: 0;
        }
        .dl-min {
          font-family: var(--mono);
          font-size: 20px;
          font-weight: 700;
          color: var(--amber);
          line-height: 1;
        }
        .dl-min-label {
          font-size: 9px;
          color: var(--text3);
          text-align: center;
          letter-spacing: 0.06em;
        }
      `}</style>
    </div>
  );
}
