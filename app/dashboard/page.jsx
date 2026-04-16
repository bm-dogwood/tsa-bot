"use client";

/**
 * TSABotDashboard — Main page component
 *
 * Drop into: app/page.jsx  OR  app/dashboard/page.jsx
 *
 * API routes consumed (your existing Next.js routes):
 *   /api/faa/delays[?airport=XXX]        → AirportDelayTracker
 *   /api/tsa/waittimes?airport=XXX       → TSAWaitTimes
 *   /api/flight/status?flight=XXNNN      → FlightStatusLookup (flight mode)
 *   /api/flight/search?origin=XXX&dest=YYY → FlightStatusLookup (route mode)
 *   /api/tsa/alerts                      → TSAAlerts
 *   /api/clear/locations                 → (optional, used by ClearLocations if added)
 */

import { useState, useEffect } from "react";

import AirportDelayTracker from "../../components/AirportDelayTracker";
import TSAWaitTimes from "../../components/TsaWaittimes";
import FlightStatusLookup from "../../components/FlightStatusLookup";
import TSAAlerts from "../../components/TsaAlerts";

// ─── Shared ticker component ──────────────────────────────────────────────────

function LiveTicker() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        fontSize: 11,
        letterSpacing: "0.08em",
        color: "rgba(255,255,255,0.3)",
        fontFamily: "monospace",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          color: "#2ed573",
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#2ed573",
            boxShadow: "0 0 6px #2ed573",
            animation: "tick-pulse 2s ease-in-out infinite",
          }}
        />
        <style>{`@keyframes tick-pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
        LIVE
      </span>
      <span>{time.toLocaleTimeString("en-US", { hour12: false })}</span>
      <span>
        UTC
        {time
          .toLocaleString("en-US", { timeZoneName: "short" })
          .split(" ")
          .pop()}
      </span>
    </div>
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  {
    id: "delays",
    label: "Delays",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4c-2 0-4 2-4 2l-8.5-1.5-3.5 3.5L11 9.5" />
      </svg>
    ),
  },
  {
    id: "waittimes",
    label: "Wait Times",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: "flights",
    label: "Flights",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    id: "alerts",
    label: "Alerts",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3z" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
];

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function TSABotDashboard() {
  const [activeTab, setActiveTab] = useState("delays");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060b16",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      {/* ── Subtle grid background ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `
          linear-gradient(rgba(56,182,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56,182,255,0.025) 1px, transparent 1px)
        `,
          backgroundSize: "40px 40px",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 900,
          margin: "0 auto",
          padding: "24px 20px 60px",
        }}
      >
        {/* ── Site header ── */}
        <header style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 6,
                }}
              >
                {/* Logo mark */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background:
                      "linear-gradient(135deg, rgba(56,182,255,0.25), rgba(56,182,255,0.08))",
                    border: "1px solid rgba(56,182,255,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 20px rgba(56,182,255,0.15)",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#38b6ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4c-2 0-4 2-4 2l-8.5-1.5-3.5 3.5L11 9.5" />
                    <path d="m5 19 1.5-1.5" />
                  </svg>
                </div>
                <div>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: 26,
                      fontWeight: 800,
                      color: "#fff",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                    }}
                  >
                    TSA
                    <span style={{ color: "#38b6ff" }}>.BOT</span>
                  </h1>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "rgba(255,255,255,0.3)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Real-time airport intelligence
                  </p>
                </div>
              </div>
            </div>
            <LiveTicker />
          </div>

          {/* Divider */}
          <div
            style={{
              marginTop: 20,
              height: 1,
              background:
                "linear-gradient(90deg, rgba(56,182,255,0.3), transparent)",
            }}
          />
        </header>

        {/* ── Tab navigation ── */}
        <nav
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 20,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12,
            padding: 4,
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "9px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background:
                  activeTab === tab.id
                    ? "rgba(56,182,255,0.12)"
                    : "transparent",
                border:
                  activeTab === tab.id
                    ? "1px solid rgba(56,182,255,0.2)"
                    : "1px solid transparent",
                borderRadius: 9,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.04em",
                color:
                  activeTab === tab.id ? "#38b6ff" : "rgba(255,255,255,0.35)",
                transition: "all 0.15s",
              }}
            >
              <span style={{ color: "inherit", display: "flex" }}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* ── Active panel ── */}
        <div key={activeTab} style={{ animation: "tab-fade-in 0.2s ease" }}>
          <style>{`@keyframes tab-fade-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
          {activeTab === "delays" && <AirportDelayTracker />}
          {activeTab === "waittimes" && <TSAWaitTimes />}
          {activeTab === "flights" && <FlightStatusLookup />}
          {activeTab === "alerts" && <TSAAlerts />}
        </div>

        {/* ── Footer sources ── */}
        <footer
          style={{
            marginTop: 32,
            paddingTop: 20,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[
              { label: "FAA ATCSCC", href: "https://nasstatus.faa.gov" },
              { label: "TSA MyTSA", href: "https://apps.tsa.dhs.gov/mytsa" },
              { label: "FlightAware", href: "https://flightaware.com/aeroapi" },
              { label: "TSA.gov", href: "https://www.tsa.gov" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.2)",
                  textDecoration: "none",
                  letterSpacing: "0.04em",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.color = "rgba(255,255,255,0.5)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = "rgba(255,255,255,0.2)")
                }
              >
                {s.label} ↗
              </a>
            ))}
          </div>
          <p
            style={{
              textAlign: "center",
              margin: "10px 0 0",
              fontSize: 10,
              color: "rgba(255,255,255,0.12)",
              letterSpacing: "0.04em",
            }}
          >
            Data sourced from public APIs and official government feeds. Updated
            in real time.
          </p>
        </footer>
      </div>
    </div>
  );
}
