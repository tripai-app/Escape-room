import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const nav = useNavigate();
  const [time, setTime] = useState("23:47:12");

  useEffect(() => {
    const iv = setInterval(() => {
      const d = new Date();
      setTime(
        String(d.getHours()).padStart(2, "0") + ":" +
        String(d.getMinutes()).padStart(2, "0") + ":" +
        String(d.getSeconds()).padStart(2, "0")
      );
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="page" style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>

      {/* Grid bg */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage:
          "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
        backgroundSize: "52px 52px",
        opacity: 0.18,
      }} />

      {/* Red glow top */}
      <div style={{
        position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "80vw", height: "40vh", zIndex: 0,
        background: "radial-gradient(ellipse at 50% 0%, rgba(255,34,85,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      {/* Cyan glow bottom */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "60vw", height: "30vh", zIndex: 0,
        background: "radial-gradient(ellipse at 50% 100%, rgba(0,229,255,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 440, width: "100%" }}>

        {/* Live clock badge */}
        <div style={{ marginBottom: "1.5rem" }}>
          <span className="badge badge-red" style={{ fontSize: "0.65rem", letterSpacing: "0.12em" }}>
            ⚠ &nbsp;EINGEHENDE NACHRICHT — {time}
          </span>
        </div>

        {/* Logo */}
        <h1 className="glitch" style={{
          color: "var(--red)",
          fontSize: "clamp(3.5rem, 16vw, 7rem)",
          lineHeight: 0.85,
          marginBottom: "0.25rem",
          textShadow: "0 0 60px rgba(255,34,85,0.6), 0 0 120px rgba(255,34,85,0.2)",
        }}>
          NOVA
        </h1>
        <div style={{
          color: "var(--cyan)",
          fontFamily: "Share Tech Mono, monospace",
          letterSpacing: "0.6em",
          fontSize: "clamp(0.6rem, 3vw, 0.85rem)",
          marginBottom: "0.3rem",
          textShadow: "0 0 20px rgba(0,229,255,0.5)",
        }}>
          P R O T O C O L
        </div>
        <div style={{
          color: "var(--text-dim)",
          fontFamily: "Share Tech Mono, monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.18em",
          marginBottom: "2.25rem",
        }}>
          ─── DIE LETZTE SENDUNG · 2031 ───
        </div>

        {/* Story teaser */}
        <div style={{
          background: "linear-gradient(135deg, rgba(255,34,85,0.06) 0%, rgba(0,0,0,0) 100%)",
          border: "1px solid rgba(255,34,85,0.2)",
          borderLeft: "3px solid var(--red)",
          borderRadius: "0 6px 6px 0",
          padding: "1rem 1.25rem",
          marginBottom: "2rem",
          textAlign: "left",
        }}>
          <p style={{ color: "var(--text-dim)", fontSize: "0.62rem", fontFamily: "Share Tech Mono, monospace", marginBottom: "0.5rem", letterSpacing: "0.12em" }}>
            // SYSTEMNACHRICHT · VERSCHLÜSSELT
          </p>
          <p style={{ color: "var(--text)", lineHeight: 1.8, fontSize: "0.92rem" }}>
            Die KI <span style={{ color: "var(--red)", fontWeight: 700 }}>H.E.R.A.L.D.</span> übernimmt heute Nacht die Kontrolle über jede Nachricht, jeden Gedanken, jede Entscheidung.{" "}
            <span style={{ color: "var(--cyan)" }}>Ihr seid die letzte Chance.</span>
          </p>
        </div>

        {/* Characters */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginBottom: "2rem" }}>
          {[
            { emoji: "👩‍💻", name: "Dr. VOID", sub: "Verbündete", color: "#00e5ff" },
            { emoji: "🤖", name: "H.E.R.A.L.D.", sub: "Der Feind", color: "#ff2255" },
            { emoji: "🥷", name: "SIGNAL", sub: "Unbekannt", color: "#ffd600" },
          ].map(c => (
            <div key={c.name} style={{ textAlign: "center", flex: 1 }}>
              <div style={{
                width: 54, height: 54, borderRadius: 10,
                border: `2px solid ${c.color}`,
                background: `${c.color}10`,
                boxShadow: `0 0 20px ${c.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.6rem", margin: "0 auto 0.4rem",
                transition: "box-shadow 0.3s",
              }}>
                {c.emoji}
              </div>
              <div style={{ fontSize: "0.58rem", color: c.color, fontFamily: "Share Tech Mono, monospace", letterSpacing: "0.05em", marginBottom: "0.1rem" }}>
                {c.name}
              </div>
              <div style={{ fontSize: "0.55rem", color: "var(--text-dim)" }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="divider" style={{ marginBottom: "1.25rem" }}>ZUGANG</div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          <button
            className="btn btn-primary"
            onClick={() => nav("/join")}
            style={{ fontSize: "1.05rem", padding: "0.9rem", letterSpacing: "0.1em" }}
          >
            ▶ &nbsp;Spiel beitreten
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => nav("/host")}
            style={{ fontSize: "0.9rem", letterSpacing: "0.08em" }}
          >
            ⊞ &nbsp;Spiel erstellen &nbsp;<span style={{ opacity: 0.55, fontSize: "0.78rem", textTransform: "none", letterSpacing: 0 }}>(Lehrer)</span>
          </button>
        </div>

        <p style={{ marginTop: "1.75rem", color: "var(--text-dim)", fontSize: "0.58rem", fontFamily: "Share Tech Mono, monospace", letterSpacing: "0.1em" }}>
          NOVA CORP © 2031 &nbsp;·&nbsp; ALLE GEDANKEN VORBEHALTEN
        </p>
      </div>
    </div>
  );
}
