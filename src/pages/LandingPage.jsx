import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const nav = useNavigate();

  return (
    <div className="page" style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Animated grid bg */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage:
          "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        opacity: 0.25,
      }} />
      {/* Radial glow */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,34,85,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 420, width: "100%" }}>

        {/* Top badge */}
        <div style={{ marginBottom: "1.25rem" }}>
          <span className="badge badge-red" style={{ fontSize: "0.65rem", letterSpacing: "0.15em" }}>
            ⚠ &nbsp;EINGEHENDE NACHRICHT — 23:47:12
          </span>
        </div>

        {/* Logo block */}
        <h1 className="glitch" style={{
          color: "var(--red)",
          fontSize: "clamp(3rem, 14vw, 6rem)",
          lineHeight: 0.9,
          marginBottom: "0.2rem",
          textShadow: "0 0 40px rgba(255,34,85,0.5)",
        }}>
          NOVA
        </h1>
        <div style={{
          color: "var(--cyan)",
          fontFamily: "Share Tech Mono, monospace",
          letterSpacing: "0.55em",
          fontSize: "clamp(0.65rem, 3vw, 0.9rem)",
          marginBottom: "0.3rem",
          textShadow: "0 0 15px rgba(0,229,255,0.4)",
        }}>
          P R O T O C O L
        </div>
        <div style={{
          color: "var(--text-dim)",
          fontFamily: "Share Tech Mono, monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          marginBottom: "2rem",
        }}>
          ─── DIE LETZTE SENDUNG · 2031 ───
        </div>

        {/* Story teaser */}
        <div style={{
          background: "rgba(255,34,85,0.05)",
          border: "1px solid rgba(255,34,85,0.2)",
          borderRadius: 4,
          padding: "1rem 1.25rem",
          marginBottom: "1.75rem",
          textAlign: "left",
        }}>
          <p style={{ color: "var(--text-dim)", fontSize: "0.7rem", fontFamily: "Share Tech Mono, monospace", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>
            // SYSTEMNACHRICHT
          </p>
          <p style={{ color: "var(--text)", lineHeight: 1.75, fontSize: "0.95rem" }}>
            Die KI <span style={{ color: "var(--red)", fontWeight: 700 }}>HERALD</span> übernimmt heute Nacht die Kontrolle — durch perfekte Werbung. Ihr seid die letzte Chance.
          </p>
        </div>

        {/* Character row */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { icon: "◈", name: "SIGNAL", color: "#ffd600", sub: "Unbekannt" },
            { icon: "▲", name: "HERALD", color: "#ff2255", sub: "Die KI" },
            { icon: "◉", name: "Dr. VOID", color: "#00e5ff", sub: "Verbündete" },
          ].map(c => (
            <div key={c.name} style={{ textAlign: "center", flex: 1 }}>
              <div style={{
                width: 50, height: 50, borderRadius: 8,
                border: `2px solid ${c.color}`,
                background: `${c.color}12`,
                boxShadow: `0 0 18px ${c.color}35`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.5rem", color: c.color, margin: "0 auto 0.35rem",
              }}>
                {c.icon}
              </div>
              <div style={{ fontSize: "0.6rem", color: c.color, fontFamily: "Share Tech Mono, monospace", letterSpacing: "0.06em" }}>
                {c.name}
              </div>
              <div style={{ fontSize: "0.58rem", color: "var(--text-dim)" }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          <button
            className="btn btn-primary"
            onClick={() => nav("/join")}
            style={{ fontSize: "1.05rem", padding: "0.85rem" }}
          >
            ▶ &nbsp;Spiel beitreten
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => nav("/host")}
            style={{ fontSize: "0.95rem" }}
          >
            ⊞ &nbsp;Spiel erstellen &nbsp;<span style={{ opacity: 0.6, fontSize: "0.8rem" }}>(Lehrer)</span>
          </button>
        </div>

        <p style={{ marginTop: "1.5rem", color: "var(--text-dim)", fontSize: "0.62rem", fontFamily: "Share Tech Mono, monospace", letterSpacing: "0.1em" }}>
          NOVA CORP © 2031 — ALLE GEDANKEN VORBEHALTEN
        </p>
      </div>
    </div>
  );
}
