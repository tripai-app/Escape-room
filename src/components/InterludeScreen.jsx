import { useState, useEffect } from "react";
import { CHARACTERS, INTERLUDE_MESSAGES } from "../data/characters";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function InterludeScreen({ puzzleIndex, players, myId, pointsEarned, wasCorrect, onNext, isHost }) {
  const [typed, setTyped] = useState("");
  const [ready, setReady] = useState(false);

  const msg   = INTERLUDE_MESSAGES[puzzleIndex] || INTERLUDE_MESSAGES[0];
  const char  = CHARACTERS[msg.character];
  const text  = wasCorrect ? msg.correct : msg.wrong;
  const sorted = [...players].sort((a, b) => b.score - a.score);

  useEffect(() => {
    setTyped("");
    setReady(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTyped(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setReady(true); }
    }, 30);
    return () => clearInterval(iv);
  }, [puzzleIndex]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 90,
      background: "var(--bg)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "flex-start",
      padding: "1.5rem",
      overflowY: "auto",
    }}>
      <div style={{ maxWidth: 480, width: "100%" }}>

        {/* Badge */}
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <span className="badge badge-yellow">
            ZWISCHENSTAND — RÄTSEL {puzzleIndex + 1} ABGESCHLOSSEN
          </span>
        </div>

        {/* Mein Ergebnis (nur für Spieler) */}
        {!isHost && (
          <div style={{
            background: wasCorrect ? "rgba(0,255,136,0.07)" : "rgba(255,34,85,0.07)",
            border: `1px solid ${wasCorrect ? "rgba(0,255,136,0.3)" : "rgba(255,34,85,0.3)"}`,
            borderRadius: 8,
            padding: "1rem",
            textAlign: "center",
            marginBottom: "1rem",
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
              {wasCorrect ? "✅" : "❌"}
            </div>
            <div style={{
              fontFamily: "Orbitron, monospace",
              fontSize: "1.6rem",
              fontWeight: 700,
              color: wasCorrect ? "var(--green)" : "var(--red)",
              marginBottom: "0.15rem",
            }}>
              {wasCorrect ? `+${pointsEarned}` : `+${pointsEarned}`}
            </div>
            <div style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>
              {wasCorrect ? "Richtig!" : "Nicht ganz — beim nächsten besser!"}
            </div>
          </div>
        )}

        {/* Charakter-Kommentar */}
        <div style={{
          background: char.bg,
          border: `1px solid ${char.color}30`,
          borderRadius: 8,
          padding: "1rem",
          marginBottom: "1.25rem",
          display: "flex",
          gap: "0.9rem",
          alignItems: "flex-start",
        }}>
          <div style={{
            width: 48, height: 48,
            borderRadius: 10,
            border: `2px solid ${char.color}`,
            background: char.bg,
            boxShadow: `0 0 16px ${char.color}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.6rem",
            flexShrink: 0,
          }}>
            {char.emoji}
          </div>
          <div>
            <div style={{ fontSize: "0.65rem", color: char.color, fontFamily: "Share Tech Mono, monospace", marginBottom: "0.3rem", letterSpacing: "0.08em" }}>
              {char.name}
            </div>
            <p style={{
              color: "var(--text)",
              fontSize: char.id === "herald" ? "0.85rem" : "0.95rem",
              fontFamily: char.id === "herald" ? "Share Tech Mono, monospace" : "Rajdhani, sans-serif",
              lineHeight: 1.6,
              fontWeight: 600,
            }}>
              {typed}<span className="blink" style={{ opacity: ready ? 0 : 1 }}>▌</span>
            </p>
          </div>
        </div>

        {/* Leaderboard */}
        <div style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "1rem",
          marginBottom: "1.25rem",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: "linear-gradient(90deg, transparent, var(--yellow), transparent)",
          }} />
          <p style={{ fontSize: "0.7rem", color: "var(--text-dim)", fontFamily: "Share Tech Mono, monospace", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>
            RANGLISTE
          </p>
          {sorted.map((p, i) => (
            <div key={p.id || p.name} style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.55rem 0.75rem",
              background: p.id === myId ? "rgba(0,229,255,0.06)" : "var(--bg2)",
              border: `1px solid ${p.id === myId ? "rgba(0,229,255,0.25)" : "var(--border)"}`,
              borderRadius: 6,
              marginBottom: "0.35rem",
              animation: `fadeUp 0.3s ease ${i * 0.08}s both`,
            }}>
              <span style={{
                fontSize: "1.1rem",
                width: 28, textAlign: "center", flexShrink: 0,
              }}>
                {i < 3 ? MEDALS[i] : `${i + 1}.`}
              </span>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--red), var(--cyan))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.7rem", fontWeight: 700, color: "#fff", flexShrink: 0,
              }}>
                {p.name[0].toUpperCase()}
              </div>
              <span style={{ flex: 1, fontWeight: p.id === myId ? 700 : 600 }}>
                {p.name}
                {p.id === myId && <span style={{ color: "var(--cyan)", fontSize: "0.72rem", marginLeft: "0.4rem" }}>(du)</span>}
              </span>
              <span style={{
                fontFamily: "Orbitron, monospace",
                color: "var(--yellow)",
                fontSize: "1rem",
                fontWeight: 700,
              }}>
                {p.score}
              </span>
            </div>
          ))}
        </div>

        {/* Weiter-Button (nur Host) */}
        {isHost && (
          <button
            className="btn btn-primary"
            onClick={onNext}
            disabled={!ready}
            style={{ fontSize: "1rem" }}
          >
            {ready ? "▶  Nächstes Rätsel" : "Lade..."}
          </button>
        )}
        {!isHost && (
          <div style={{
            textAlign: "center", padding: "0.75rem",
            border: "1px solid var(--border)", borderRadius: 6,
            color: "var(--text-dim)", fontSize: "0.82rem",
            fontFamily: "Share Tech Mono, monospace",
          }}>
            <span className="blink">_</span>&nbsp; Lehrer startet nächstes Rätsel
          </div>
        )}
      </div>
    </div>
  );
}
