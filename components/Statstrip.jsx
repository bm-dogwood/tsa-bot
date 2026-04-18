"use client";
export default function StatStrip({ stats }) {
  const items = [
    {
      label: "Active delays",
      value: stats.delays,
      sub: "FAA ATCSCC",
      color: "amber",
    },
    {
      label: "Ground stops",
      value: stats.groundStops,
      sub: "right now",
      color: "red",
    },
    {
      label: "Avg TSA wait",
      value: stats.avgWait,
      sub: "selected airport",
      color: "blue",
    },
    {
      label: "Departures",
      value: stats.departures,
      sub: "last search",
      color: "green",
    },
    {
      label: "TSA alerts",
      value: stats.alerts,
      sub: "tsa.gov RSS",
      color: "purple",
    },
  ];

  const colors = {
    amber: { val: "var(--amber)", bg: "rgba(251,191,36,.06)" },
    red: { val: "var(--red)", bg: "rgba(248,113,113,.06)" },
    blue: { val: "var(--accent2)", bg: "rgba(79,142,247,.06)" },
    green: { val: "var(--green)", bg: "rgba(52,211,153,.06)" },
    purple: { val: "var(--purple)", bg: "rgba(167,139,250,.06)" },
  };

  return (
    <div className="stat-strip">
      {items.map((item) => {
        const c = colors[item.color];
        return (
          <div
            className="stat-card"
            key={item.label}
            style={{ background: c.bg }}
          >
            <div className="stat-label">{item.label}</div>
            <div className="stat-value" style={{ color: c.val }}>
              {item.value}
            </div>
            <div className="stat-sub">{item.sub}</div>
          </div>
        );
      })}

      <style jsx>{`
        .stat-strip {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          margin-bottom: 16px;
        }
        .stat-card {
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px 16px;
        }
        .stat-label {
          font-size: 10px;
          color: var(--text3);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 6px;
        }
        .stat-value {
          font-family: var(--mono);
          font-size: 24px;
          font-weight: 600;
          line-height: 1;
        }
        .stat-sub {
          font-size: 10px;
          color: var(--text3);
          margin-top: 4px;
        }
        @media (max-width: 960px) {
          .stat-strip {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 600px) {
          .stat-strip {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
