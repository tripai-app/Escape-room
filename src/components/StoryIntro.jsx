import { useState } from "react";
import CharacterDialogue from "./CharacterDialogue";
import { STORY_SCENES } from "../data/characters";

export default function StoryIntro({ onDone }) {
  const [phase, setPhase] = useState("title"); // "title" | "dialogue" | "countdown"
  const [count, setCount] = useState(3);

  function startDialogue() {
    setPhase("dialogue");
  }

  function handleDialogueDone() {
    setPhase("countdown");
    let c = 3;
    const t = setInterval(() => {
      c--;
      setCount(c);
      if (c <= 0) {
        clearInterval(t);
        onDone();
      }
    }, 900);
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: phase === "dialogue" ? "flex-start" : "center",
      padding: "1.5rem",
      overflowY: "auto",
    }}>
      {/* Animated background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "radial-gradient(ellipse at 30% 50%, rgba(255,34,85,0.07) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(0,229,255,0.05) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 560, width: "100%", position: "relative", zIndex: 1 }}>

        {/* ── PHASE: Title ── */}
        {phase === "title" && (
          <div style={{ textAlign: "center" }} className="fade-up">
            <div style={{ marginBottom: "0.5rem" }}>
              <span className="badge badge-red">EINGEHENDE NACHRICHT</span>
            </div>

            <h1 className="glitch" style={{
              color: "var(--red)",
              fontSize: "clamp(2.5rem, 10vw, 5rem)",
              marginBottom: "0.1rem",
              lineHeight: 1,
            }}>
              NOVA
            </h1>
            <div style={{
              color: "var(--cyan)",
              fontFamily: "Share Tech Mono, monospace",
              letterSpacing: "0.5em",
              fontSize: "0.85rem",
              marginBottom: "0.25rem",
            }}>
              P R O T O C O L
            </div>
            <div style={{
              color: "var(--text-dim)",
              fontFamily: "Share Tech Mono, monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              marginBottom: "2.5rem",
            }}>
              — DIE LETZTE SENDUNG — 2031 —
            </div>

            {/* Three character teasers */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "1.5rem",
              marginBottom: "2.5rem",
            }}>
              {[
                { icon: "◈", name: "SIGNAL", color: "#ffd600", label: "Unbekannt" },
                { icon: "▲", name: "HERALD", color: "#ff2255", label: "Die KI" },
                { icon: "◉", name: "Dr. VOID", color: "#00e5ff", label: "Verbündete" },
              ].map(c => (
                <div key={c.name} style={{ textAlign: "center" }}>
                  <div style={{
                    width: 56, height: 56,
                    borderRadius: 8,
                    border: `2px solid ${c.color}`,
                    background: `${c.color}15`,
                    boxShadow: `0 0 20px ${c.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.8rem",
                    color: c.color,
                    margin: "0 auto 0.4rem",
                  }}>
                    {c.icon}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: c.color, fontFamily: "Share Tech Mono, monospace", letterSpacing: "0.08em" }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: "0.6rem", color: "var(--text-dim)" }}>{c.label}</div>
                </div>
              ))}
            </div>

            <button className="btn btn-primary" onClick={startDialogue} style={{ maxWidth: 300, margin: "0 auto" }}>
              ▶ Nachricht öffnen
            </button>
            <p style={{ color: "var(--text-dim)", fontSize: "0.7rem", marginTop: "0.75rem", fontFamily: "Share Tech Mono, monospace" }}>
              Tippen zum Überspringen
            </p>
          </div>
        )}

        {/* ── PHASE: Dialogue ── */}
        {phase === "dialogue" && (
          <div style={{ paddingTop: "1rem" }}>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <span className="badge badge-red">LIVE-ÜBERTRAGUNG</span>
            </div>
            <CharacterDialogue scenes={STORY_SCENES} onDone={handleDialogueDone} />
          </div>
        )}

        {/* ── PHASE: Countdown ── */}
        {phase === "countdown" && (
          <div style={{ textAlign: "center" }} className="fade-up">
            <div style={{
              fontFamily: "Orbitron, monospace",
              fontSize: "6rem",
              fontWeight: 900,
              color: "var(--red)",
              textShadow: "var(--glow-red)",
              lineHeight: 1,
              marginBottom: "1rem",
              animation: "glitch 0.5s infinite",
            }}>
              {count}
            </div>
            <p style={{ color: "var(--cyan)", fontFamily: "Share Tech Mono, monospace", letterSpacing: "0.2em" }}>
              MISSION STARTET
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
