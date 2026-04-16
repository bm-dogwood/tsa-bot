"use client";

import { useState, useEffect, useCallback } from "react";

export default function TSAAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const fetchAlerts = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/tsa/alerts", {
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      // Your route returns raw xml2js output: json.rss.channel.item
      const items = json?.rss?.channel?.item ?? json?.alerts ?? [];
      setAlerts(Array.isArray(items) ? items.slice(0, 8) : [items]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const formatDate = (raw) => {
    if (!raw) return "";
    try {
      return new Date(raw).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <div
      style={{
        background: "#0a0f1e",
        borderRadius: 20,
        border: "1px solid rgba(255,165,2,0.15)",
        overflow: "hidden",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.04), 0 24px 64px rgba(0,0,0,0.6)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "18px 22px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, rgba(255,165,2,0.07) 0%, transparent 60%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "rgba(255,165,2,0.12)",
              border: "1px solid rgba(255,165,2,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffa502"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3z" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
              TSA Alerts
            </span>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              tsa.gov RSS feed
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            fetchAlerts();
          }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,0.3)",
            padding: 4,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 12a9 9 0 0 1 15-6.7L21 9M21 3v6h-6M21 12a9 9 0 0 1-15 6.7L3 15M3 21v-6h6" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "12px 0" }}>
        {loading && (
          <div
            style={{
              padding: "24px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "rgba(255,255,255,0.3)",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              style={{ animation: "alertSpin 0.75s linear infinite" }}
            >
              <style>{`@keyframes alertSpin{to{transform:rotate(360deg)}}`}</style>
              <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                stroke="#ffa502"
                strokeWidth="2.5"
                strokeOpacity="0.2"
              />
              <path
                d="M12 3a9 9 0 0 1 9 9"
                fill="none"
                stroke="#ffa502"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <span style={{ fontSize: 12 }}>Loading alerts…</span>
          </div>
        )}

        {error && !loading && (
          <div
            style={{
              padding: "12px 22px",
              fontSize: 12,
              color: "rgba(255,71,87,0.7)",
            }}
          >
            Failed to load alerts: {error}
          </div>
        )}

        {!loading && alerts.length === 0 && !error && (
          <div
            style={{
              padding: "20px 22px",
              fontSize: 12,
              color: "rgba(255,255,255,0.25)",
              textAlign: "center",
            }}
          >
            No current TSA alerts
          </div>
        )}

        {!loading &&
          alerts.map((alert, i) => {
            const title = alert.title?._cdata ?? alert.title ?? "";
            const desc = alert.description?._cdata ?? alert.description ?? "";
            const pubDate = alert.pubDate ?? "";
            const link = alert.link?._cdata ?? alert.link ?? "#";
            const isOpen = expanded === i;

            return (
              <div
                key={i}
                style={{
                  borderBottom:
                    i < alerts.length - 1
                      ? "1px solid rgba(255,255,255,0.05)"
                      : "none",
                }}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : i)}
                  style={{
                    width: "100%",
                    padding: "11px 22px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    background: isOpen ? "rgba(255,165,2,0.05)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s",
                  }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#ffa502",
                      flexShrink: 0,
                      marginTop: 6,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        color: "#fff",
                        fontWeight: 500,
                        lineHeight: 1.4,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: isOpen ? "normal" : "nowrap",
                      }}
                    >
                      {title}
                    </p>
                    {isOpen && desc && (
                      <p
                        style={{
                          margin: "6px 0 0",
                          fontSize: 12,
                          color: "rgba(255,255,255,0.45)",
                          lineHeight: 1.5,
                        }}
                      >
                        {desc.replace(/<[^>]*>/g, "").slice(0, 300)}
                        {desc.length > 300 ? "…" : ""}
                      </p>
                    )}
                    {isOpen && link && link !== "#" && (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          marginTop: 6,
                          fontSize: 11,
                          color: "#ffa502",
                          textDecoration: "none",
                        }}
                      >
                        Read more →
                      </a>
                    )}
                  </div>
                  {pubDate && (
                    <span
                      style={{
                        fontSize: 10,
                        color: "rgba(255,255,255,0.2)",
                        flexShrink: 0,
                        fontFamily: "monospace",
                        marginTop: 2,
                      }}
                    >
                      {formatDate(pubDate)}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}
