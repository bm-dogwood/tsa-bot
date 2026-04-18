"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Navbar";
import StatStrip from "../../components/Statstrip";
import DelayTracker from "../../components/DelayTracker";
import TSAAlerts from "../../components/TsaAlerts";
import FlightDepartures from "../../components/FlightDeparture";
import TSAWaitTimes from "../../components/TsaWaittimes";
import FlightTracker from "../../components/FlightTracker";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [globalStats, setGlobalStats] = useState({
    delays: "—",
    groundStops: "—",
    avgWait: "—",
    departures: "—",
    alerts: "—",
  });

  const updateStat = (key, val) =>
    setGlobalStats((prev) => ({ ...prev, [key]: val }));

  const NAV = [
    { id: "overview", label: "Overview" },
    { id: "tracker", label: "Live Flight Tracker" },
    { id: "departures", label: "Departures" },
    { id: "delays", label: "Delays" },
    { id: "waittimes", label: "TSA Wait Times" },
    { id: "alerts", label: "Alerts" },
  ];

  return (
    <div className="app-root">
      <Header />

      {/* ── Top nav ── */}
      <div className="top-nav">
        <div className="top-nav-inner">
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`nav-btn${activeSection === n.id ? " active" : ""}`}
              onClick={() => setActiveSection(n.id)}
            >
              {n.label}
              {n.id === "tracker" && <span className="live-pip" />}
            </button>
          ))}
        </div>
      </div>

      <main className="main-content">
        {/* Always visible stats */}
        <StatStrip stats={globalStats} />

        {/* Sections */}
        {activeSection === "overview" && (
          <div className="overview-grid">
            <div className="col-wide">
              <DelayTracker
                onStatsUpdate={(d, g) => {
                  updateStat("delays", d);
                  updateStat("groundStops", g);
                }}
              />
            </div>
            <div className="col-narrow">
              <TSAWaitTimes
                onAvgWait={(v) => updateStat("avgWait", v)}
                compact
              />
              <TSAAlerts onCount={(v) => updateStat("alerts", v)} compact />
            </div>
          </div>
        )}

        {activeSection === "tracker" && <FlightTracker />}

        {activeSection === "departures" && (
          <FlightDepartures onCount={(v) => updateStat("departures", v)} />
        )}

        {activeSection === "delays" && (
          <DelayTracker
            onStatsUpdate={(d, g) => {
              updateStat("delays", d);
              updateStat("groundStops", g);
            }}
          />
        )}

        {activeSection === "waittimes" && (
          <TSAWaitTimes onAvgWait={(v) => updateStat("avgWait", v)} />
        )}

        {activeSection === "alerts" && (
          <TSAAlerts onCount={(v) => updateStat("alerts", v)} />
        )}
      </main>

      <style jsx global>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        :root {
          --bg: #0c0e14;
          --bg2: #13151f;
          --bg3: #1a1d2a;
          --bg4: #222536;
          --border: rgba(255, 255, 255, 0.07);
          --border2: rgba(255, 255, 255, 0.12);
          --text: #e8eaf2;
          --text2: #8b8fa8;
          --text3: #565a73;
          --accent: #4f8ef7;
          --accent2: #6ea8ff;
          --green: #34d399;
          --amber: #fbbf24;
          --red: #f87171;
          --purple: #a78bfa;
          --mono: "JetBrains Mono", "Fira Code", monospace;
          --sans: "DM Sans", "Inter", sans-serif;
        }
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap");

        html,
        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--sans);
          min-height: 100vh;
        }

        .app-root {
          min-height: 100vh;
        }

        .top-nav {
          position: sticky;
          top: 0;
          z-index: 40;
          background: rgba(12, 14, 20, 0.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
        }
        .top-nav-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          gap: 0;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .top-nav-inner::-webkit-scrollbar {
          display: none;
        }
        .nav-btn {
          padding: 12px 18px;
          background: none;
          border: none;
          font-family: var(--sans);
          font-size: 13px;
          font-weight: 500;
          color: var(--text2);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.15s;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 6px;
          position: relative;
        }
        .nav-btn:hover {
          color: var(--text);
        }
        .nav-btn.active {
          color: var(--accent2);
          border-bottom-color: var(--accent);
        }
        .live-pip {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--green);
          animation: pipPulse 2s ease-in-out infinite;
        }
        @keyframes pipPulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px 24px 60px;
        }

        .overview-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 16px;
          margin-top: 16px;
        }
        .col-wide {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .col-narrow {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Card base */
        .card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
        }
        .card-hd {
          padding: 14px 18px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .card-hd-l {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .card-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: var(--bg3);
          border: 1px solid var(--border2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .card-icon svg {
          width: 14px;
          height: 14px;
          stroke: var(--text2);
          fill: none;
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .card-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
        }
        .card-sub {
          font-size: 11px;
          color: var(--text3);
          margin-top: 2px;
        }

        /* Badges */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.04em;
        }
        .badge-green {
          background: rgba(52, 211, 153, 0.12);
          color: var(--green);
          border: 1px solid rgba(52, 211, 153, 0.25);
        }
        .badge-amber {
          background: rgba(251, 191, 36, 0.12);
          color: var(--amber);
          border: 1px solid rgba(251, 191, 36, 0.25);
        }
        .badge-red {
          background: rgba(248, 113, 113, 0.12);
          color: var(--red);
          border: 1px solid rgba(248, 113, 113, 0.25);
        }
        .badge-blue {
          background: rgba(79, 142, 247, 0.12);
          color: var(--accent2);
          border: 1px solid rgba(79, 142, 247, 0.25);
        }
        .badge-purple {
          background: rgba(167, 139, 250, 0.12);
          color: var(--purple);
          border: 1px solid rgba(167, 139, 250, 0.25);
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .dot-green {
          background: var(--green);
        }
        .dot-amber {
          background: var(--amber);
        }
        .dot-red {
          background: var(--red);
        }
        .dot-blue {
          background: var(--accent);
        }

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          background: var(--bg3);
          border: 1px solid var(--border2);
          color: var(--text2);
          font-size: 11px;
          font-weight: 600;
          font-family: var(--sans);
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: all 0.15s;
        }
        .btn:hover {
          background: var(--bg4);
          color: var(--text);
          border-color: var(--border2);
        }
        .btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .btn svg {
          width: 12px;
          height: 12px;
          stroke: currentColor;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
        }
        .btn-accent {
          background: rgba(79, 142, 247, 0.12);
          border-color: rgba(79, 142, 247, 0.3);
          color: var(--accent2);
        }
        .btn-accent:hover {
          background: rgba(79, 142, 247, 0.2);
        }

        /* Inputs */
        input,
        select {
          background: var(--bg3);
          border: 1px solid var(--border2);
          border-radius: 8px;
          padding: 8px 12px;
          color: var(--text);
          font-family: var(--sans);
          font-size: 13px;
          outline: none;
          transition: border-color 0.15s;
        }
        input:focus,
        select:focus {
          border-color: var(--accent);
        }
        select option {
          background: var(--bg3);
        }

        /* Empty / loading */
        .empty {
          padding: 40px;
          text-align: center;
          color: var(--text3);
          font-size: 13px;
        }
        .loading-wrap {
          padding: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: var(--text3);
          font-size: 12px;
          letter-spacing: 0.06em;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid var(--bg4);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        .err-box {
          margin: 12px 18px;
          padding: 10px 14px;
          border-radius: 8px;
          background: rgba(248, 113, 113, 0.08);
          border: 1px solid rgba(248, 113, 113, 0.2);
          color: var(--red);
          font-size: 12px;
        }

        @media (max-width: 960px) {
          .overview-grid {
            grid-template-columns: 1fr;
          }
          .col-narrow {
            flex-direction: row;
            flex-wrap: wrap;
          }
          .col-narrow > * {
            flex: 1 1 300px;
          }
        }
      `}</style>
    </div>
  );
}
