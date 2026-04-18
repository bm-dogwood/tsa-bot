"use client";
import { useState, useEffect } from "react";

export default function Header() {
  const [time, setTime] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setTime(new Date());
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (d) =>
    d
      ? d.toLocaleTimeString("en-US", { hour12: false, timeZone: "UTC" }) +
        " UTC"
      : "--:--:-- UTC";

  const navItems = [
    { label: "Workflow", href: "/#workflow" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Infrastructure", href: "#infrastructure" },
    { label: "Comparison", href: "#comparison" },
    { label: "Contact", href: "#contact" },
  ];

  const handleNavClick = (href) => {
    setIsMenuOpen(false);
    if (href.startsWith("/#")) {
      const element = document.getElementById(href.substring(2));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (href.startsWith("#")) {
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.location.href = href;
    }
  };

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          {/* Logo */}
          <div className="logo-wrap">
            <div className="logo-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4c-2 0-4 2-4 2l-8.5-1.5-3.5 3.5L11 9.5" />
                <path d="m5 19 1.5-1.5M8 16.5l5 5M3 19l1.5-1.5" />
              </svg>
            </div>
            <div>
              <div className="logo-text">
                TSA<span>.BOT</span>
              </div>
              <div className="logo-tagline">Real-time airport intelligence</div>
            </div>
          </div>

          {/* Right side */}
          <div className="header-right">
            <div className="live-indicator">
              <span className="live-dot" />
              <span>LIVE</span>
            </div>
            <div className="clock">{fmt(time)}</div>
            <div className="data-sources">
              <span>FAA ATCSCC</span>
              <span className="sep">·</span>
              <span>FlightAware</span>
              <span className="sep">·</span>
              <span>TSA MyTSA</span>
            </div>

            {/* Hamburger Button - visible on all screens */}
            <button
              className="hamburger"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`} />
              <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`} />
              <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Drawer */}
      <div className={`nav-drawer ${isMenuOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="drawer-logo">
            <div className="logo-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4c-2 0-4 2-4 2l-8.5-1.5-3.5 3.5L11 9.5" />
                <path d="m5 19 1.5-1.5M8 16.5l5 5M3 19l1.5-1.5" />
              </svg>
            </div>
            <div>
              <div className="logo-text">
                TSA<span>.BOT</span>
              </div>
              <div className="logo-tagline">Navigation</div>
            </div>
          </div>
          <button
            className="drawer-close"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="drawer-nav">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
              className="drawer-nav-link"
            >
              <span className="nav-icon">
                {item.label === "Workflow" && ""}
                {item.label === "Dashboard" && ""}
                {item.label === "Infrastructure" && ""}
                {item.label === "Comparison" && ""}
                {item.label === "Contact" && ""}
              </span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="drawer-footer">
          <div className="drawer-time">
            <span className="footer-label">Current Time</span>
            <span className="drawer-time-value">{fmt(time)}</span>
          </div>
          <div className="drawer-data-sources">
            <span className="footer-label">Data Sources</span>
            <div className="sources-list">
              <span>FAA ATCSCC</span>
              <span>FlightAware</span>
              <span>TSA MyTSA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div className="drawer-overlay" onClick={() => setIsMenuOpen(false)} />
      )}

      <style jsx>{`
        .site-header {
          background: var(--bg2);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .site-header-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: rgba(79, 142, 247, 0.1);
          border: 1px solid rgba(79, 142, 247, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent2);
          flex-shrink: 0;
        }
        .logo-icon svg {
          width: 16px;
          height: 16px;
        }
        .logo-text {
          font-size: 17px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .logo-text span {
          color: var(--accent2);
        }
        .logo-tagline {
          font-size: 10px;
          color: var(--text3);
          margin-top: 2px;
          letter-spacing: 0.04em;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .live-indicator {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 700;
          color: var(--green);
          letter-spacing: 0.08em;
        }
        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--green);
          animation: livePulse 2s ease-in-out infinite;
        }
        @keyframes livePulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.2;
          }
        }
        .clock {
          font-family: var(--mono);
          font-size: 12px;
          font-weight: 500;
          color: var(--text2);
          letter-spacing: 0.04em;
        }
        .data-sources {
          font-size: 10px;
          color: var(--text3);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .sep {
          color: var(--border2);
        }

        /* Hamburger Button */
        .hamburger {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 22px;
          height: 18px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 101;
        }
        .hamburger-line {
          width: 100%;
          height: 2px;
          background: var(--text);
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .hamburger-line.open:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }
        .hamburger-line.open:nth-child(2) {
          opacity: 0;
        }
        .hamburger-line.open:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }

        /* Navigation Drawer */
        .nav-drawer {
          position: fixed;
          top: 0;
          right: -100%;
          width: 320px;
          max-width: 85vw;
          height: 100vh;
          background: var(--bg2);
          border-left: 1px solid var(--border);
          z-index: 100;
          transition: right 0.3s ease;
          display: flex;
          flex-direction: column;
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
        }
        .nav-drawer.open {
          right: 0;
        }
        .drawer-header {
          padding: 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .drawer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .drawer-close {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text2);
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .drawer-close:hover {
          background: var(--bg3);
          color: var(--text);
        }
        .drawer-nav {
          flex: 1;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .drawer-nav-link {
          color: var(--text);
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          padding: 12px 16px;
          transition: all 0.2s;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .drawer-nav-link:hover {
          background: var(--bg3);
          color: var(--accent2);
          transform: translateX(4px);
        }
        .nav-icon {
          font-size: 20px;
          width: 28px;
        }
        .drawer-footer {
          padding: 20px;
          border-top: 1px solid var(--border);
          font-size: 12px;
          color: var(--text3);
        }
        .drawer-time {
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .drawer-time-value {
          font-family: var(--mono);
          color: var(--text2);
          font-weight: 500;
        }
        .footer-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text3);
        }
        .sources-list {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .sources-list span {
          font-size: 12px;
          color: var(--text2);
        }
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 99;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Responsive - hide data sources on smaller screens */
        @media (max-width: 680px) {
          .clock {
            display: none;
          }
          .data-sources {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
