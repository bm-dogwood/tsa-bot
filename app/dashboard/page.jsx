"use client";

/**
 * TSABotDashboard — Main page component (Light Theme)
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
import Header from "../../components/Header";
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
        color: "#64748b",
        fontFamily: "monospace",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        padding: "6px 16px",
        borderRadius: 30,
        border: "1px solid rgba(37, 99, 235, 0.15)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          color: "#10b981",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "#10b981",
            boxShadow: "0 0 8px #10b981",
            animation: "tick-pulse 2s ease-in-out infinite",
          }}
        />
        <style>{`@keyframes tick-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.2)}}`}</style>
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
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Header />
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          position: "relative",
          paddingTop: "100px",
        }}
      >
        {/* ── Animated gradient background with image overlay ── */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            backgroundImage: `
         
              url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            backgroundRepeat: "no-repeat",
            transform: `translateY(${scrollY * 0.1}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />

        {/* ── Animated particles ── */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          <style>{`
          @keyframes float-particle-1 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
            33% { transform: translate(30px, -20px) scale(1.2); opacity: 0.3; }
            66% { transform: translate(-20px, 15px) scale(0.9); opacity: 0.2; }
          }
          @keyframes float-particle-2 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.1; }
            50% { transform: translate(-40px, 25px) scale(1.1); opacity: 0.25; }
          }
          @keyframes float-particle-3 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.08; }
            25% { transform: translate(25px, -30px) scale(1.3); opacity: 0.2; }
            75% { transform: translate(-35px, 20px) scale(0.85); opacity: 0.12; }
          }
        `}</style>
          <div
            style={{
              position: "absolute",
              top: "10%",
              right: "5%",
              width: 200,
              height: 200,
              backgroundImage:
                "radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, transparent 70%)",
              borderRadius: "50%",
              animation: "float-particle-1 20s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "20%",
              left: "3%",
              width: 300,
              height: 300,
              backgroundImage:
                "radial-gradient(circle, rgba(16, 185, 129, 0.04) 0%, transparent 70%)",
              borderRadius: "50%",
              animation: "float-particle-2 25s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "15%",
              width: 150,
              height: 150,
              backgroundImage:
                "radial-gradient(circle, rgba(37, 99, 235, 0.04) 0%, transparent 70%)",
              borderRadius: "50%",
              animation: "float-particle-3 18s ease-in-out infinite",
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 2,
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
                  {/* Logo mark with glow effect */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      backgroundImage:
                        "linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(37, 99, 235, 0.05))",
                      border: "1px solid rgba(37, 99, 235, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 30px rgba(37, 99, 235, 0.1)",
                      backdropFilter: "blur(10px)",
                      animation: "glow-pulse 3s ease-in-out infinite",
                    }}
                  >
                    <style>{`
                    @keyframes glow-pulse {
                      0%, 100% { boxShadow: 0 0 30px rgba(37, 99, 235, 0.1); }
                      50% { boxShadow: 0 0 50px rgba(37, 99, 235, 0.2); }
                    }
                  `}</style>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2563eb"
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
                        fontSize: 28,
                        fontWeight: 800,
                        color: "#0f172a",
                        letterSpacing: "-0.03em",
                        lineHeight: 1,
                      }}
                    >
                      TSA
                      <span style={{ color: "#2563eb" }}>.BOT</span>
                    </h1>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color: "#64748b",
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
                backgroundImage:
                  "linear-gradient(90deg, rgba(37, 99, 235, 0.3), rgba(37, 99, 235, 0.1), transparent)",
              }}
            />
          </header>

          {/* ── Tab navigation ── */}
          <nav
            style={{
              display: "flex",
              gap: 4,
              marginBottom: 20,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(37, 99, 235, 0.1)",
              borderRadius: 14,
              padding: 4,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
            }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  backgroundImage:
                    activeTab === tab.id
                      ? "linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(37, 99, 235, 0.04))"
                      : "none",
                  backgroundColor: "transparent",
                  border:
                    activeTab === tab.id
                      ? "1px solid rgba(37, 99, 235, 0.2)"
                      : "1px solid transparent",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  color: activeTab === tab.id ? "#2563eb" : "#64748b",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  backdropFilter: activeTab === tab.id ? "blur(10px)" : "none",
                  boxShadow:
                    activeTab === tab.id
                      ? "0 2px 8px rgba(37, 99, 235, 0.08)"
                      : "none",
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.backgroundImage = "none";
                    e.target.style.backgroundColor = "rgba(37, 99, 235, 0.04)";
                    e.target.style.color = "#475569";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#64748b";
                  }
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
          <div
            key={activeTab}
            style={{
              animation: "tab-fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(20px)",
              borderRadius: 16,
              border: "1px solid rgba(37, 99, 235, 0.1)",
              padding: "20px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
            }}
          >
            <style>{`
            @keyframes tab-fade-in {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
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
              borderTop: "1px solid rgba(37, 99, 235, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 20,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {[
                { label: "FAA ATCSCC", href: "https://nasstatus.faa.gov" },
                { label: "TSA MyTSA", href: "https://apps.tsa.dhs.gov/mytsa" },
                {
                  label: "FlightAware",
                  href: "https://flightaware.com/aeroapi",
                },
                { label: "TSA.gov", href: "https://www.tsa.gov" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 11,
                    color: "#94a3b8",
                    textDecoration: "none",
                    letterSpacing: "0.04em",
                    transition: "all 0.2s",
                    padding: "4px 8px",
                    borderRadius: 6,
                    backgroundColor: "rgba(37, 99, 235, 0.02)",
                    border: "1px solid rgba(37, 99, 235, 0.05)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#2563eb";
                    e.target.style.backgroundColor = "rgba(37, 99, 235, 0.06)";
                    e.target.style.borderColor = "rgba(37, 99, 235, 0.15)";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#94a3b8";
                    e.target.style.backgroundColor = "rgba(37, 99, 235, 0.02)";
                    e.target.style.borderColor = "rgba(37, 99, 235, 0.05)";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
            <p
              style={{
                textAlign: "center",
                margin: "14px 0 0",
                fontSize: 10,
                color: "#cbd5e1",
                letterSpacing: "0.04em",
              }}
            >
              Data sourced from public APIs and official government feeds.
              Updated in real time.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
